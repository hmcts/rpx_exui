import { AxiosResponse } from 'axios';
import { NextFunction, Response } from 'express';
import { sendDelete, sendPost } from '../common/crudService';
import { getConfigValue } from '../configuration';
import { SERVICES_ROLE_ASSIGNMENT_API_PATH } from '../configuration/references';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { setHeaders } from '../lib/proxy';
import { getServiceRefDataMappingList } from '../ref-data/ref-data-utils';
import { refreshRoleAssignmentForUser } from '../user';
import { RoleAssignment } from '../user/interfaces/roleAssignment';
import { CaseRole } from '../workAllocation/interfaces/caseRole';
import { getMyAccessMappedCaseList } from '../workAllocation/util';
import {
  toDenySADletionRequestedRoleBody,
  toDenySARoleAssignmentBody,
  toRoleAssignmentBody,
  toSARequestRoleAssignmentBody,
  toSARoleAssignmentBody
} from './dtos/to-role-assignment-dto';
import { getEmail, getJudicialUsersFromApi, getUserName, mapRoleCategory } from './exclusionService';
import { CaseRoleRequestPayload } from './models/caseRoleRequestPayload';
import { release2ContentType } from './models/release2ContentType';
import { Role } from './models/roleType';
import { getAllRoles, getSubstantiveRoles } from './roleAssignmentService';

const baseRoleAccessUrl = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
const SUPPORTED_ROLE_CATEGORIES = ['LEGAL_OPERATIONS', 'JUDICIAL', 'CTSC', 'ADMIN'];

export async function getRolesByCaseId(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  const requestPayload = getRoleCategoryRequestPayload(req.body.caseId, req.body.jurisdiction, req.body.caseType);
  const basePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
  const fullPath = `${basePath}/am/role-assignments/query`;
  const headers = setHeaders(req, release2ContentType);
  try {
    const response: AxiosResponse = await http.post(fullPath, requestPayload, { headers });
    const judicialAndLegalOps: CaseRole[] = mapResponseToCaseRoles(
      response.data.roleAssignmentResponse,
      req.body.exclusionId,
      req
    );
    const substantiveRoles = await getSubstantiveRoles(req);
    const finalRoles = [];
    judicialAndLegalOps.forEach((unknownRole) => {
      const substantiveRole = substantiveRoles.find((role) => role.roleId === unknownRole.roleName);
      if (substantiveRole) {
        const currentRoleId = unknownRole.roleName;
        unknownRole.roleName = substantiveRole.roleName;
        unknownRole.roleId = currentRoleId;
        finalRoles.push(unknownRole);
      }
    });
    return res.status(response.status).send(finalRoles);
  } catch (error) {
    next(error);
  }
}

export async function getAccessRoles(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  const requestPayload = getAccessRolesRequestPayload(req.body.caseId, req.body.jurisdiction, req.body.caseType);
  const basePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
  const fullPath = `${basePath}/am/role-assignments/query`;
  const headers = setHeaders(req, release2ContentType);
  try {
    const response: AxiosResponse = await http.post(fullPath, requestPayload, { headers });
    const finalRoles: CaseRole[] = mapResponseToCaseRoles(
      response.data.roleAssignmentResponse,
      req.body.assignmentId,
      req
    );
    return res.status(response.status).send(finalRoles);
  } catch (error) {
    next(error);
  }
}

export async function getAccessRolesByCaseId(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  const requestPayload = getAccessRolesRequestPayloadForCaseId(req.body.caseId);
  const basePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
  const fullPath = `${basePath}/am/role-assignments/query`;
  const headers = setHeaders(req, release2ContentType);
  try {
    const response: AxiosResponse = await http.post(fullPath, requestPayload, { headers });
    const finalRoles: CaseRole[] = mapResponseToCaseRoles(
      response.data.roleAssignmentResponse,
      req.body.assignmentId,
      req
    );
    if (finalRoles) {
      const rolesResponse = await getAllRoles(req);
      const roles = (rolesResponse.data as Role[]);
      finalRoles?.forEach((finalRole) => {
        const role = roles?.find((role) => role.name === finalRole.roleName);
        if (role) {
          finalRole.roleName = role.label;
        }
      });
    }
    return res.status(response.status).send(finalRoles);
  } catch (error) {
    next(error);
  }
}

export async function getJudicialUsers(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  const userIds = req.body.userIds;
  // Ensures there are no errors when no userIds are provided
  if (!userIds || userIds.length === 0) {
    return res.status(200).send([]);
  }
  const services = req.body.services ? req.body.services : userIds;
  let serviceCodes: string[] = [];
  const serviceRefDataMapping = getServiceRefDataMappingList();
  // add the service refernces in order to search by service
  serviceRefDataMapping.forEach((serviceRef) => {
    if (services.includes(serviceRef.service)) {
      serviceCodes = [...serviceCodes, ...serviceRef.serviceCodes];
    }
  });
  let searchResult: any[] = [];
  try {
    for (const serviceCode of serviceCodes) {
      const response = await getJudicialUsersFromApi(req, userIds, serviceCode);
      searchResult = response.data ? [...response.data, ...searchResult] : searchResult;
    }
    return res.status(200).send(searchResult);
  } catch (error) {
    if (error && error.status === 404) {
      return res.status(200).send(searchResult);
    }
    next(error);
  }
}

export async function getMyAccessNewCount(req, resp, next) {
  try {
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
    const roleAssignments = req.session.roleAssignmentResponse as RoleAssignment[];
    const cases = await getMyAccessMappedCaseList(roleAssignments, req);
    const newAssignments = cases.filter((item) => item.isNew);

    return resp.status(200).send({ count: newAssignments.length });
  } catch (error) {
    next(error);
  }
}

export async function manageLabellingRoleAssignment(req: EnhancedRequest, resp: Response, next: NextFunction) {
  try {
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
    const currentUserAssignments = (req.session.roleAssignmentResponse as RoleAssignment[]);
    const challengedAccessRequest = currentUserAssignments.find((roleAssignment) => roleAssignment.attributes
      && roleAssignment.attributes.caseId === req.params.caseId
      && roleAssignment.attributes.isNew);

    if (!challengedAccessRequest) {
      return resp.status(204).send();
    }
    challengedAccessRequest.attributes.isNew = false;
    return resp.status(200).send({ id: challengedAccessRequest.id });
  } catch (error) {
    next(error);
  }
}

export function mapResponseToCaseRoles(
  roleAssignments: RoleAssignment[],
  assignmentId: string,
  req: EnhancedRequest
): CaseRole[] {
  if (assignmentId) {
    roleAssignments = roleAssignments.filter((roleAssignment) => roleAssignment.id === assignmentId);
  }
  return roleAssignments.map((roleAssignment) => ({
    actions: [
      { 'id': 'reallocate', 'title': 'Reallocate' },
      { 'id': 'remove', 'title': 'Remove Allocation' }
    ],
    actorId: roleAssignment.actorId,
    email: roleAssignment.actorId ? getEmail(roleAssignment.actorId, req) : null,
    end: roleAssignment.endTime ? roleAssignment.endTime.toString() : null,
    id: roleAssignment.id,
    roleId: null,
    location: null,
    name: roleAssignment.actorId ? getUserName(roleAssignment.actorId, req) : null,
    roleCategory: mapRoleCategory(roleAssignment.roleCategory),
    roleName: roleAssignment.roleName,
    start: roleAssignment.beginTime ? roleAssignment.beginTime.toString() : null,
    created: roleAssignment.created ? roleAssignment.created : null,
    notes: roleAssignment.attributes && roleAssignment.attributes.specificAccessReason ?
      getSpecificReason(roleAssignment.attributes.specificAccessReason) : 'No reason for case access given',
    requestedRole: roleAssignment.attributes && roleAssignment.attributes.requestedRole ?
      roleAssignment.attributes.requestedRole : null
  }));
}

export async function confirmAllocateRole(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const body = req.body;
    const currentUser = req.session.passport.user.userinfo;
    const currentUserId = currentUser.id ? currentUser.id : currentUser.uid;
    const roleAssignmentsBody = toRoleAssignmentBody(currentUserId, body);
    const basePath = `${baseRoleAccessUrl}/am/role-assignments`;
    const response: AxiosResponse = await sendPost(basePath, roleAssignmentsBody, req);
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
    const { status, data } = response;
    return res.status(status).send(data);
  } catch (error) {
    next(error);
  }
}

// this creates the two specific access approved roles
export async function createSpecificAccessApprovalRole(req: EnhancedRequest, res: Response, next: NextFunction): Promise<AxiosResponse> {
  try {
    const body = req.body;
    const currentUser = req.session.passport.user.userinfo;
    const currentUserId = currentUser.id ? currentUser.id : currentUser.uid;
    const roleAssignmentsBody = toSARoleAssignmentBody(currentUserId, body, {}, { isNew: true });
    const basePath = `${baseRoleAccessUrl}/am/role-assignments`;
    const response: AxiosResponse = await sendPost(basePath, roleAssignmentsBody, req);
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
    return response;
  } catch (error) {
    next(error);
    return error;
  }
}

export async function createSpecificAccessDenyRole(req: EnhancedRequest, res: Response, next: NextFunction): Promise<AxiosResponse> {
  try {
    const currentUser = req.session.passport.user.userinfo;
    const roleAssignmentsBody = toDenySARoleAssignmentBody(currentUser, req.body, { isNew: true });
    const basePath = `${baseRoleAccessUrl}/am/role-assignments`;
    return await sendPost(basePath, roleAssignmentsBody, req);
  } catch (error) {
    next(error);
    return error;
  }
}

export async function deleteSpecificAccessRequestedRole(req: EnhancedRequest, res: Response, next: NextFunction): Promise<AxiosResponse> {
  try {
    const basePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
    const requestId = req.body.requestId;
    const queryString = `?process=staff-organisational-role-mapping&reference=${requestId}`;
    const fullPath = `${basePath}/am/role-assignments${queryString}`;
    const headers = setHeaders(req);
    const body = toDenySADletionRequestedRoleBody(requestId);
    delete headers.accept;
    return await http.delete(fullPath, {
      data: body,
      headers
    });
  } catch (error) {
    next(error);
  }
}

// this restores the specific access request role if task completion goes wrong
export async function restoreSpecificAccessRequestRole(req: EnhancedRequest, res: Response, next: NextFunction): Promise<AxiosResponse> {
  try {
    const body = req.body;
    const roleAssignmentsBody = toSARequestRoleAssignmentBody(body);
    const basePath = `${baseRoleAccessUrl}/am/role-assignments`;
    const response: AxiosResponse = await sendPost(basePath, roleAssignmentsBody, req);
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
    return response;
  } catch (error) {
    next(error);
    return error;
  }
}

export async function reallocateRole(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const body = req.body;
    const assigmentId = req.body.assignmentId;
    const basePath = `${baseRoleAccessUrl}/am/role-assignments`;
    const deletePath = `${basePath}/${assigmentId}`;
    const deleteResponse: AxiosResponse = await sendDelete(deletePath, body, req);
    const { status, data } = deleteResponse;
    if (status >= 200 && status <= 204) {
      const currentUser = req.session.passport.user.userinfo;
      const currentUserId = currentUser.id ? currentUser.id : currentUser.uid;
      const roleAssignmentsBody = toRoleAssignmentBody(currentUserId, body);
      const postResponse: AxiosResponse = await sendPost(basePath, roleAssignmentsBody, req);
      await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
      return res.status(postResponse.status).send(postResponse.data);
    }

    return res.status(status).send(data);
  } catch (error) {
    next(error);
  }
}

export async function deleteRoleByCaseAndRoleId(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  const basePath = `${baseRoleAccessUrl}/am/role-assignments`;
  const body = req.body;
  const assigmentId = req.body.assigmentId;
  try {
    const { status } = await sendDelete(`${basePath}/${assigmentId}`, body, req);
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
    return res.send().status(status);
  } catch (e) {
    next(e);
  }
}

// Same as above but for node layer use
export async function deleteRoleByAssignmentId(req: EnhancedRequest, res: Response, next: NextFunction, assignmentId: string): Promise<AxiosResponse> {
  const basePath = `${baseRoleAccessUrl}/am/role-assignments`;
  const body = req.body;
  try {
    const response = await sendDelete(`${basePath}/${assignmentId}`, body, req);
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
    return response;
  } catch (e) {
    next(e);
    return e;
  }
}

export function getRoleCategoryRequestPayload(caseId: string, jurisdiction: string, caseType: string): CaseRoleRequestPayload {
  return {
    queryRequests: [
      {
        attributes: {
          caseId: [caseId],
          caseType: [caseType],
          jurisdiction: [jurisdiction]
        },
        roleCategory: SUPPORTED_ROLE_CATEGORIES
      }
    ]
  };
}

export function getAccessRolesRequestPayload(caseId: string,
  jurisdiction: string,
  caseType: string): CaseRoleRequestPayload {
  return {
    queryRequests: [
      {
        attributes: {
          caseId: [caseId],
          caseType: [caseType],
          jurisdiction: [jurisdiction]
        },
        roleName: ['specific-access-requested']
      }
    ]
  };
}

export function getAccessRolesRequestPayloadForCaseId(caseId: string): CaseRoleRequestPayload {
  return {
    queryRequests: [
      {
        attributes: {
          caseId: [caseId]
        }
      }
    ]
  };
}

// instances of specific reason appearing as JSON from toolkit versions - this enables both possibilities
export function getSpecificReason(note: string): string {
  if (note.charAt(0) !== '{') {
    return note;
  }
  const noteObject = JSON.parse(note);
  return noteObject ? noteObject.specificReason : null;
}
