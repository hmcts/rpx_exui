import { AxiosResponse } from 'axios';
import { NextFunction, Response } from 'express';
import { handlePost } from '../common/crudService';
import { getConfigValue } from '../configuration';
import {
  SERVICES_JUDICIAL_BOOKING_API_PATH,
  SERVICES_ROLE_ASSIGNMENT_MAPPING_API_PATH
} from '../configuration/references';
import { http } from '../lib/http';
import { setHeaders } from '../lib/proxy';
import { createSpecificAccessApprovalRole, deleteRoleByAssignmentId, restoreSpecificAccessRequestRole } from '../roleAccess';
import { RoleAssignment } from '../user/interfaces/roleAssignment';
import { postTaskCompletionForAccess } from '../workAllocation';
import { getFullLocationsForServices } from '../workAllocation/locationService';
import { logAccessRequest } from '../services/lau';

export async function getBookings(req, resp: Response, next: NextFunction) {
  if (req.body.bookableServices && req.body.bookableServices.length === 0) {
    return resp.status(200).send([]);
  }
  const basePath = getConfigValue(SERVICES_JUDICIAL_BOOKING_API_PATH);
  const fullPath = `${basePath}/am/bookings/query`;
  const headers = setHeaders(req);
  delete headers.accept;

  try {
    const bookings = await http.post(fullPath, { 'queryRequest': { 'userIds': [req.body.userId] } }, { headers });
    const fullLocations = await getFullLocationsForServices(req);
    const bookingAndLocationName = bookings.data.bookings.map((booking) => {
      const location = fullLocations.filter((thisLocation) =>
        booking.locationId === thisLocation.epimms_id);
      const locationName = location && location.length !== 0 ? location[0].site_name : null;
      return {
        ...booking,
        locationName
      };
    });
    return resp.status(bookings.status).send(bookingAndLocationName);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req, resp: Response, next: NextFunction): Promise<Response> {
  const basePath = getConfigValue(SERVICES_JUDICIAL_BOOKING_API_PATH);
  const fullPath = `${basePath}/am/bookings`;
  const headers = setHeaders(req);
  delete headers.accept;

  try {
    const response = await http.post(fullPath, { 'bookingRequest': req.body }, { headers });
    return resp.status(response.status).send(response.data);
  } catch (error) {
    next(error);
  }
}

export async function refreshRoleAssignments(req, res: Response, next: NextFunction): Promise<Response> {
  const basePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_MAPPING_API_PATH);
  const fullPath = `${basePath}/am/role-mapping/judicial/refresh`;

  try {
    const response = await handlePost(fullPath, { 'refreshRequest': { 'userIds': [req.body.userId] } }, req, next);
    return res.status(response.status).send(response.data);
  } catch (error) {
    next(error);
  }
}

// node layer logic for approving specific access request
export async function approveSpecificAccessRequest(req, res: Response, next: NextFunction): Promise<Response> {
  try {
    // create the specific access approval role
    const firstRoleResponse: AxiosResponse = await createSpecificAccessApprovalRole(req, res, next);
    // 201
    if (!firstRoleResponse || firstRoleResponse.status !== 201) {
      return firstRoleResponse && firstRoleResponse.status
        ? res.status(firstRoleResponse.status) : res.status(400);
    }
    const deletionResponse = await deleteRoleByAssignmentId(req, res, next, req.body.specificAccessStateData.requestId);
    const rolesToDelete: RoleAssignment[] = firstRoleResponse.data.roleAssignmentResponse.requestedRoles;
    if (!deletionResponse || deletionResponse.status !== 204) {
      // delete the roles created previously
      return deleteSpecificAccessRoles(req, res, next, deletionResponse, rolesToDelete);
    }
    // 204
    const taskResponse: AxiosResponse = await postTaskCompletionForAccess(req, res, next);
    if (!taskResponse || taskResponse.status !== 204) {
      // restore specific access requested role and delete two created roles
      return restoreDeletedRole(req, res, next, taskResponse, rolesToDelete);
    }

    //do not await. This is a fire and forget call
    logAccessRequest(req, false);

    // if everything has worked send the last response back to the user
    return res.send(taskResponse.data).status(taskResponse.status);
  } catch (error) {
    next(error);
    return res.status(error.status).send(error);
  }
}

// attempts to delete
export async function deleteSpecificAccessRoles(req, res: Response, next: NextFunction, previousResponse: AxiosResponse<any>, rolesToDelete: RoleAssignment[]): Promise<Response> {
  try {
    const specificAccessDeletionResponse = await deleteRoleByAssignmentId(req, res, next, rolesToDelete[1].id);
    if (!specificAccessDeletionResponse || specificAccessDeletionResponse.status !== 204) {
      // TODO: retry x 3
      return previousResponse && previousResponse.status
        ? res.status(previousResponse.status) : res.status(400);
    }
    // Note - the functionality is present but this does not currently work due to AM team restrictions - gives 422 error
    const grantedDeletionResponse = await deleteRoleByAssignmentId(req, res, next, rolesToDelete[0].id);
    if (!grantedDeletionResponse || grantedDeletionResponse.status !== 204) {
      // TODO: retry x 3
      return previousResponse && previousResponse.status
        ? res.status(previousResponse.status) : res.status(400);
    }
    return previousResponse && previousResponse.status
      ? res.status(previousResponse.status) : res.status(400);
  } catch (error) {
    next(error);
    return res.status(error.status).send(error);
  }
}

// attempts to restore the deleted specific access requested role on task completion failure
export async function restoreDeletedRole(req, res: Response, next: NextFunction, previousResponse: AxiosResponse<any>, rolesToDelete: RoleAssignment[]): Promise<Response> {
  try {
    const restoreResponse = await restoreSpecificAccessRequestRole(req, res, next);
    if (!restoreResponse || restoreResponse.status !== 201) {
      // TODO: retry x 3
      return previousResponse && previousResponse.status
        ? res.status(previousResponse.status) : res.status(400);
    }
    return deleteSpecificAccessRoles(req, res, next, previousResponse, rolesToDelete);
  } catch (error) {
    next(error);
    return res.status(error.status).send(error);
  }
}

/**
 * Manually creating Elastic search query
 */
export function removeAcceptHeader(proxyReq) {
  proxyReq.removeHeader('accept');
}
