import { baseCaseWorkerRefUrl, baseRoleAssignmentUrl } from './index';
import { ServiceUserDetailList, StaffUserDetails } from './interfaces/staffUserDetails';
import { EnhancedRequest } from '../lib/models';
import { getStaffSupportedJurisdictionsList } from '../staffSupportedJurisdictions';
import { mapUsersToCaseworkers, prepareGetUsersUrl, prepareRoleApiRequest, prepareRoleApiUrl } from './util';
import { handlePostRoleAssignments, handleUsersGet } from './caseWorkerService';
import { NextFunction } from 'express';
import { Caseworker } from './interfaces/common';
import { FullUserDetailCache } from './fullUserDetailCache';

// 10 minutes
const TTL = 600;

let timestamp: Date;
let refreshRoles: boolean;

let cachedUsers: ServiceUserDetailList[];
let cachedUsersWithRoles: Caseworker[];

export async function fetchUserData(req: EnhancedRequest, next: NextFunction): Promise<StaffUserDetails[]> {
  try {
    if (hasTTLExpired() || !cachedUsers) {
      // hasTTLExpired to determine whether roles require refreshing
      // cachedUsers to ensure rerun if user restarts request early
      refreshRoles = true;
      const jurisdictions = getStaffSupportedJurisdictionsList();
      cachedUsers = [];
      for (const jurisdiction of jurisdictions) {
        const getUsersPath: string = prepareGetUsersUrl(baseCaseWorkerRefUrl, jurisdiction);
        const userResponse = await handleUsersGet(getUsersPath, req);
        // TODO: Response will be cached eventually via API so caching below should be removed eventually
        cachedUsers.push({ service: jurisdiction, staffUserList: userResponse });
      }
    } else {
      refreshRoles = false;
    }
    return getCachedDataForServices();
  } catch (error) {
    if (cachedUsers) {
      return getCachedDataForServices();
    }
    next(error);
  }
}

export async function fetchRoleAssignments(cachedUserData: StaffUserDetails[], req: EnhancedRequest, next: NextFunction): Promise<any> {
  // note: this has been done to cache role categories
  // it is separate from the above as above caching will be done by backend
  const fullUserDetailCache = FullUserDetailCache.getInstance();
  try {
    if (refreshRoles || !cachedUsersWithRoles) {
      // refreshRoles to determine whether roles require refreshing
      // cachedUsersWithRoles to ensure rerun if user restarts request early
      const roleApiPath: string = prepareRoleApiUrl(baseRoleAssignmentUrl);
      const jurisdictions = getStaffSupportedJurisdictionsList();
      const payload = prepareRoleApiRequest(jurisdictions);
      const { data } = await handlePostRoleAssignments(roleApiPath, payload, req);
      const roleAssignments = data.roleAssignmentResponse;
      cachedUsersWithRoles = mapUsersToCaseworkers(cachedUserData, roleAssignments);
      fullUserDetailCache.setUserDetails(cachedUsersWithRoles);
    }
    return fullUserDetailCache.getAllUserDetails();
  } catch (error) {
    if (fullUserDetailCache.getAllUserDetails()) {
      return fullUserDetailCache.getAllUserDetails();
    }
    next(error);
  }
}

export function hasTTLExpired(): boolean {
  if (!timestamp) {
    // started caching
    timestamp = new Date();
    return true;
  } else if (Date.now() < timestamp.getTime() + (TTL * 1000)) {
    // use cache if the time is not more than the TTL
    return false;
  }
  // if timestamp has expired then refresh cache
  timestamp = new Date();
  return true;
}

export function timestampExists(): boolean {
  return !!timestamp;
}

export function getCachedDataForServices(): StaffUserDetails[] {
  let staffDetailsList = [];
  for (const cachedServiceData of cachedUsers) {
    staffDetailsList = [...staffDetailsList, ...cachedServiceData.staffUserList];
  }
  return staffDetailsList;
}
