import { getUserSessionTimeout, RoleGroupSessionTimeout } from '@hmcts/rpx-xui-node-lib';
import { AxiosResponse } from 'axios';
import { NextFunction, Response } from 'express';
import { UserInfo } from '../auth/interfaces/UserInfo';
import { getConfigValue } from '../configuration';
import { CASE_SHARE_PERMISSIONS, SERVICES_ROLE_ASSIGNMENT_API_PATH, SESSION_TIMEOUTS } from '../configuration/references';
import { http } from '../lib/http';
import { setHeaders } from '../lib/proxy';
import { exists } from '../lib/util';
import { LocationInfo, RoleAssignment } from './interfaces/roleAssignment';
import {
  getOrganisationRoles, getRoleCategoryFromRoleAssignments,
  getUserRoleCategory, isCurrentUserCaseAllocator
} from './utils';
import { trackTrace } from '../lib/appInsights';

export async function getUserDetails(req, res: Response, next: NextFunction): Promise<Response> {
  if (!exists(req, 'session.passport.user')) {
    return res.send({}).status(200);
  }
  try {
    const { roles } = req.session.passport.user.userinfo;
    const permissions = CASE_SHARE_PERMISSIONS.split(',');
    const canShareCases = roles.some((role) => permissions.includes(role));
    const sessionTimeouts = getConfigValue(SESSION_TIMEOUTS) as RoleGroupSessionTimeout[];
    const sessionTimeout = getUserSessionTimeout(roles, sessionTimeouts);
    const roleAssignmentInfo = await getUserRoleAssignments(req.session.passport.user.userinfo, req);
    const userInfo = { ...req.session.passport.user.userinfo, token: `Bearer ${req.session.passport.user.tokenset.accessToken}` };
    const syntheticRoles = getSyntheticRoles(roleAssignmentInfo);
    const allRoles = [...new Set([...userInfo.roles, ...syntheticRoles])];
    userInfo.roles = allRoles;
    res.send({
      canShareCases,
      roleAssignmentInfo,
      sessionTimeout,
      userInfo
    });
  } catch (error) {
    next(error);
  }
}
export function getSyntheticRoles(roleAssignments: RoleAssignment[]): string [] {
  let syntheticRoles = [];
  const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, new Date());
  activeRoleAssignments.forEach((roleAssignment) => {
    if (roleAssignment.substantive === 'Y'
        &&
        roleAssignment.jurisdiction
        &&
        roleAssignment.roleName
        &&
        roleAssignment.roleType
        &&
        roleAssignment.roleType.toUpperCase() === 'ORGANISATION') {
      syntheticRoles = [...syntheticRoles, getSyntheticRole(roleAssignment.jurisdiction, roleAssignment.roleName)];
    }
  });
  syntheticRoles = [...new Set(syntheticRoles)];
  return syntheticRoles;
}

export function getSyntheticRole(jurisdiction: string, roleName: string): string {
  return jurisdiction && roleName ? `${jurisdiction.toLocaleLowerCase()}-${roleName.toLocaleLowerCase()}` : '';
}

export async function refreshRoleAssignmentForUser(userInfo: UserInfo, req: any): Promise<any[]> {
  let userRoleAssignments = [];
  if (userInfo) {
    const baseUrl = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
    const id = userInfo.id ? userInfo.id : userInfo.uid;
    const path = `${baseUrl}/am/role-assignments/actors/${id}`;
    const headers = setHeaders(req);
    if (req.session.roleRequestEtag) {
      // add the last etag (note: could re-use more etags but requires storing of more data)
      headers['If-None-Match'] = req.session.roleRequestEtag;
    }
    delete headers.accept;
    try {
      const response: AxiosResponse = await http.get(path, { headers });
      const activeRoleAssignments = getActiveRoleAssignments(response.data.roleAssignmentResponse, new Date());
      userRoleAssignments = getRoleAssignmentInfo(activeRoleAssignments);
      const idamRoles = getOrganisationRoles(activeRoleAssignments);
      userInfo.roles = userInfo.roles.concat(idamRoles);
      const roleAssignments: string[] = userRoleAssignments.filter((role) => role && !!role.roleCategory).length > 0 ?
        userRoleAssignments.map((roles) => roles.roleCategory) : [];
      // We check for the roleAssignments to determine the roleCategory. If not we try IDAM roles
      userInfo.roleCategory = getRoleCategoryFromRoleAssignments(roleAssignments) || getUserRoleCategory(userInfo.roles);
      req.session.roleAssignmentResponse = activeRoleAssignments;
      req.session.roleRequestEtag = response.headers.etag;
      req.session.userRoleAssignments = userRoleAssignments;
    } catch (error) {
      if (error.status === 304) {
        // as user role assignments are not returned use session to send expected results
        return req.session.userRoleAssignments;
      }
      let err = error;
      if (typeof error === 'object' && error !== null) {
        err = JSON.stringify(error);
      }
      trackTrace(err, { functionCall: 'refreshRoleAssignmentForUser' });
    }
  } else {
    trackTrace('userInfo is null', { functionCall: 'refreshRoleAssignmentForUser' });
  }
  return userRoleAssignments;
}

export function getActiveRoleAssignments(roleAssignments: RoleAssignment[], filterDate: Date): RoleAssignment[] {
  const activeRoleAssignments = roleAssignments.filter((rm) => {
    return rm.endTime ? filterDate <= new Date(rm.endTime) : true;
  });
  return activeRoleAssignments;
}

export function getRoleAssignmentInfo(roleAssignmentResponse: RoleAssignment[]): LocationInfo[] {
  const roleAssignmentInfo = [];
  roleAssignmentResponse.forEach((roleAssignment) => {
    const isCaseAllocator = isCurrentUserCaseAllocator(roleAssignment);
    const attributes = { ...roleAssignment.attributes };
    attributes.isCaseAllocator = isCaseAllocator;
    attributes.roleType = roleAssignment.roleType;
    attributes.roleName = roleAssignment.roleName;
    attributes.roleCategory = roleAssignment.roleCategory;
    attributes.beginTime = roleAssignment.beginTime;
    attributes.endTime = roleAssignment.endTime;
    roleAssignmentInfo.push(attributes);
  });
  return roleAssignmentInfo;
}

export async function getUserRoleAssignments(userInfo: UserInfo, req): Promise<any[]> {
  const refreshRoleAssignments = req.query && req.query.refreshRoleAssignments
    ? req.query.refreshRoleAssignments === 'true' : false;
  const roleAssignmentInfo =
    req.session.roleAssignmentResponse && !refreshRoleAssignments ? getRoleAssignmentInfo(req.session.roleAssignmentResponse)
      : await refreshRoleAssignmentForUser(userInfo, req);
  return roleAssignmentInfo;
}
