import { getConfigValue } from '../configuration';
import { SERVICES_ROLE_ASSIGNMENT_API_PATH } from '../configuration/references';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { setHeaders } from '../lib/proxy';
import { refreshRoleAssignmentForUser } from '../user';
import { logAccessRequest } from '../services/lau';

export async function challengedAccessRouter(req: EnhancedRequest, resp, next) {
  const basePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
  const fullPath = `${basePath}/am/role-assignments`;
  const headers = setHeaders(req);
  delete headers.accept;
  try {
    const response = await http.post(fullPath, req.body, { headers });
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);

    //do not await. This is a fire and forget call
    logAccessRequest(req, true);

    return resp.status(response.status).send(response.data);
  } catch (error) {
    next(error);
  }
}

export async function challengedAccessUpdateAttributes(req: EnhancedRequest, resp, next) {
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

    const singleRoleAssignment = roleAssignmentQueryResponse.data.roleAssignmentResponse[0];

    delete singleRoleAssignment.id;
    singleRoleAssignment.attributes = {
      ...singleRoleAssignment.attributes,
      ...req.body.attributesToUpdate
    };

    singleRoleAssignment.notes = [{
      userId: actorId,
      time: new Date(),
      comment: singleRoleAssignment.attributes.accessReason
    }];

    const roleAssignmentUpdate = {
      roleRequest: {
        assignerId: actorId,
        process: 'challenged-access',
        reference: `${caseId}/${singleRoleAssignment.roleName}/${actorId}`,
        replaceExisting: true
      },
      requestedRoles: [singleRoleAssignment]
    };

    const response = await http.post(updatePath, { ...roleAssignmentUpdate }, { headers });
    await refreshRoleAssignmentForUser(req.session.passport.user.userinfo, req);

    return resp.status(response.status).send(response.data);
  } catch (error) {
    next(error);
  }
}
