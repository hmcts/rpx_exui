import logger from '@pact-foundation/pact-node/src/logger';
import { AxiosResponse } from 'axios';
import { NextFunction, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { deleteSpecificAccessRoles, restoreDeletedRole } from '../accessManagement';
import { sendDelete } from '../common/crudService';
import { getConfigValue } from '../configuration';
import { SERVICES_ROLE_ASSIGNMENT_API_PATH, SERVICES_WA_WORKFLOW_API_URL } from '../configuration/references';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { setHeaders } from '../lib/proxy';
import { createSpecificAccessDenyRole, deleteSpecificAccessRequestedRole } from '../roleAccess';
import { refreshRoleAssignmentForUser } from '../user';
import { RoleAssignment } from '../user/interfaces/roleAssignment';
import { postTaskCompletionForAccess } from '../workAllocation';
import { logAccessRequest } from '../services/lau';

export async function orchestrationSpecificAccessRequest(req: EnhancedRequest, res, next: NextFunction): Promise<any> {
  let createAmRoleResponse: AxiosResponse;
  let status;
  let data;
  try {
    createAmRoleResponse = await specificAccessRequestCreateAmRole(req, res);
    status = createAmRoleResponse.status;
    data = createAmRoleResponse.data;
    if (!createAmRoleResponse || createAmRoleResponse.status !== 201) {
      return res.status(createAmRoleResponse.status).send(createAmRoleResponse);
    }
    if (createAmRoleResponse && data.roleAssignmentResponse
      && data.roleAssignmentResponse.requestedRoles
      && data.roleAssignmentResponse.requestedRoles[0].attributes) {
      const attributes = data.roleAssignmentResponse.requestedRoles[0].attributes;
      const roleAssignmentId = data.roleAssignmentResponse.requestedRoles[0].id;
      const roleCategory = data.roleAssignmentResponse.requestedRoles[0].roleCategory;
      const caseId = attributes.caseId;
      const jurisdiction = attributes.jurisdiction;
      const caseType = attributes.caseType;
      const taskType = getTaskType(roleCategory);
      const dueDateWork = new Date();
      dueDateWork.setMonth(dueDateWork.getMonth() + 1);
      const dueDate = dueDateWork.toISOString();
      const taskName = 'Review Specific Access Request';
      const taskResponse = await postCreateTask(req, next,
        { caseId, jurisdiction, caseType, taskType, dueDate, name: taskName, roleAssignmentId });
      if (!taskResponse || taskResponse.status !== 204) {
        const assignmentId = data.roleAssignmentResponse.roleRequest.id;
        const baseRoleAccessUrl = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
        const basePath = `${baseRoleAccessUrl}/am/role-assignments`;
        const deleteBody = { assignmentId };
        const deleteResponse = await sendDelete(`${basePath}/${assignmentId}`, deleteBody, req);
        if (!deleteResponse || deleteResponse.status !== 204) {
          return res.status(deleteResponse.status).send(deleteResponse);
        }
        return res.status(taskResponse.status).send(taskResponse);
      }
      if (req && req.session && req.session.passport && req.session.passport.user.userinfo) {
        await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);
      }
      //do not await. This is a fire and forget call
      logAccessRequest(req, true);
      return res.status(status).send(data);
    }
  } catch (error) {
    next(error);
    return error;
  }
}

export async function specificAccessRequestCreateAmRole(req, res): Promise<AxiosResponse> {
  try {
    const basePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
    const fullPath = `${basePath}/am/role-assignments`;
    const headers = setHeaders(req);
    delete headers.accept;
    return await http.post(fullPath, req.body, { headers });
  } catch (error) {
    logger.info(error);
    return res.status(error.status).send(error);
  }
}

export async function postCreateTask(req: EnhancedRequest, next: NextFunction, createTask: { caseId, jurisdiction, caseType, taskType, dueDate, name, roleAssignmentId }): Promise<any> {
  try {
    const waWorkFlowApi = getConfigValue(SERVICES_WA_WORKFLOW_API_URL);
    const id = uuidv4();
    const url = `${waWorkFlowApi}/workflow/message`;
    const body = {
      messageName: 'createTaskMessage',
      processVariables: {
        idempotencyKey: {
          value: id,
          type: 'String'
        },
        dueDate: {
          value: createTask.dueDate,
          type: 'String'
        },
        jurisdiction: {
          value: createTask.jurisdiction,
          type: 'String'
        },
        caseId: {
          value: createTask.caseId,
          type: 'String'
        },
        name: {
          value: createTask.name,
          type: 'String'
        },
        taskType: {
          value: createTask.taskType,
          type: 'String'
        },
        caseType: {
          value: createTask.caseType,
          type: 'String'
        },
        roleAssignmentId: {
          value: createTask.roleAssignmentId,
          type: 'String'
        }
      },
      correlationKeys: null,
      all: false
    };

    const headers = setHeaders(req);
    const response = await http.post(url, body, { headers });

    return response;
  } catch (error) {
    next(error);
    return error;
  }
}

export async function orchestrationRequestMoreInformation(req: EnhancedRequest, res, next: NextFunction): Promise<Response> {
  try {
    const creationOfDenyRoleResponse: AxiosResponse = await createSpecificAccessDenyRole(req, res, next);
    if (!creationOfDenyRoleResponse || creationOfDenyRoleResponse.status !== 201) {
      return creationOfDenyRoleResponse && creationOfDenyRoleResponse.status
        ? res.status(creationOfDenyRoleResponse.status) : res.status(400);
    }
    const deletionResponse = await deleteSpecificAccessRequestedRole(req, res, next);
    const rolesToDelete: RoleAssignment[] = creationOfDenyRoleResponse.data.roleAssignmentResponse.requestedRoles;
    if (!deletionResponse || deletionResponse.status !== 204) {
      return deleteSpecificAccessRoles(req, res, next, deletionResponse, rolesToDelete);
    }
    const taskResponse: AxiosResponse = await postTaskCompletionForAccess(req, res, next);
    if (!taskResponse || taskResponse.status !== 204) {
      return restoreDeletedRole(req, res, next, taskResponse, rolesToDelete);
    }

    //do not await. This is a fire and forget call
    logAccessRequest(req, false);

    return res.send(taskResponse.data).status(taskResponse.status);
  } catch (e) {
    logger.error(e.status, e.statusText, JSON.stringify(e.data));
    throw e;
  }
}

export function getTaskType(roleCategory: string): string {
  switch (roleCategory) {
    case 'JUDICIAL': {
      return 'reviewSpecificAccessRequestJudiciary';
    }
    case 'LEGAL_OPERATIONS': {
      return 'reviewSpecificAccessRequestLegalOps';
    }
    case 'ADMIN': {
      return 'reviewSpecificAccessRequestAdmin';
    }
    case 'CTSC': {
      return 'reviewSpecificAccessRequestCTSC';
    }
  }
}

export async function specificAccessRequestUpdateAttributes(req: EnhancedRequest, resp, next) {
  const basePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
  const queryPath = `${basePath}/am/role-assignments/query`;
  const updatePath = `${basePath}/am/role-assignments`;

  const headers = setHeaders(req);
  delete headers.accept;
  try {
    const userInfo = req.session.passport.user.userinfo;
    const actorId = userInfo.id ? userInfo.id : userInfo.uid;
    const caseId = req.body.caseId;

    const roleAssignmentQueryResponse = await http.post(queryPath, {
      actorId: [actorId],
      attributes: {
        caseId: [caseId]
      }
    }, { headers });

    const singleRoleAssignment = roleAssignmentQueryResponse.data.roleAssignmentResponse
      .find((role) => role.roleName === 'specific-access-granted' || role.roleName === 'specific-access-denied');

    //Delete secondary role assignment
    if (singleRoleAssignment.roleName === 'specific-access-granted') {
      await http.delete(`${updatePath}/${singleRoleAssignment.id}`, { headers });
    }

    //Create new role assignment
    if (singleRoleAssignment.roleName === 'specific-access-denied') {
      singleRoleAssignment.notes = [{
        userId: actorId,
        time: new Date(),
        comment: JSON.stringify(singleRoleAssignment.attributes.specificAccessReason)
      }];

      singleRoleAssignment.attributes.isNew = req.body.attributesToUpdate.isNew;

      const roleAssignmentUpdate = {
        roleRequest: {
          assignerId: actorId,
          process: 'specific-access',
          reference: `${caseId}/${singleRoleAssignment.attributes.requestedRole}/${actorId}`,
          replaceExisting: true
        },
        requestedRoles: [singleRoleAssignment]
      };

      delete roleAssignmentUpdate.requestedRoles[0].id;

      await http.post(updatePath, { ...roleAssignmentUpdate }, { headers });
    }

    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);

    return resp.status(200).send([]);
  } catch (error) {
    next(error);
  }
}
