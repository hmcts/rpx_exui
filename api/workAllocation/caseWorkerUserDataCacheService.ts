import { NextFunction } from 'express';
import { authenticator } from 'otplib';

import { baseCaseWorkerRefUrl, baseRoleAssignmentUrl } from './index';
import { StaffUserDetails } from './interfaces/staffUserDetails';
import { getConfigValue } from '../configuration';
import { IDAM_SECRET, MICROSERVICE, S2S_SECRET, SERVICES_IDAM_API_URL, SERVICES_IDAM_CLIENT_ID, SERVICE_S2S_PATH, STAFF_SUPPORTED_JURISDICTIONS, SYSTEM_USER_NAME, SYSTEM_USER_PASSWORD } from '../configuration/references';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { getStaffSupportedJurisdictionsList } from '../staffSupportedJurisdictions';
import { mapUsersToCaseworkers, prepareGetUsersUrl, prepareRoleApiRequest, prepareRoleApiUrl } from './util';
import { handleNewUsersGet, handlePostRoleAssignments, handlePostRoleAssignmentsWithNewUsers, handleUsersGet } from './caseWorkerService';
import { Caseworker } from './interfaces/common';
import { FullUserDetailCache } from './fullUserDetailCache';

// 10 minutes
const TTL = 600;

let timestamp: Date;
let refreshRoles: boolean;
let initialServiceAuthToken: string;
let initialAuthToken: string;

let cachedUsers: StaffUserDetails[];
let cachedUsersWithRoles: Caseworker[];

export async function fetchUserData(req: EnhancedRequest, next: NextFunction): Promise<StaffUserDetails[]> {
  try {
    if (hasTTLExpired() || (!cachedUsers || cachedUsers.length === 0)) {
      // hasTTLExpired to determine whether roles require refreshing
      // cachedUsers to ensure rerun if user restarts request early
      refreshRoles = true;
      cachedUsers = [];
      const jurisdictions = getConfigValue(STAFF_SUPPORTED_JURISDICTIONS);
      const getUsersPath: string = prepareGetUsersUrl(baseCaseWorkerRefUrl, jurisdictions);
      const userResponse = await handleUsersGet(getUsersPath, req);
      // TODO: Response will be cached eventually via API so caching below should be removed eventually
      cachedUsers = userResponse;
    } else {
      refreshRoles = false;
    }
    return cachedUsers;
  } catch (error) {
    if (cachedUsers) {
      return cachedUsers;
    }
    next(error);
  }
}

// Note: May not be needed once API caching is in effect
export async function fetchNewUserData(): Promise<StaffUserDetails[]> {
  try {
    // first ensure that there is no immediate re-caching
    timestamp = new Date();
    refreshRoles = true;
    await getAuthTokens();
    // add the tokens to the request headers
    const caseworkerHeaders = getRequestHeaders();
    const jurisdictions = getConfigValue(STAFF_SUPPORTED_JURISDICTIONS);
    cachedUsers = [];
    const getUsersPath: string = prepareGetUsersUrl(baseCaseWorkerRefUrl, jurisdictions);
    const userResponse = await handleNewUsersGet(getUsersPath, caseworkerHeaders);
    cachedUsers = userResponse;
    return cachedUsers;
  } catch (error) {
    if (cachedUsers) {
      return cachedUsers;
    }
    // in case of error, reset the cache on application start up
    timestamp = null;
    refreshRoles = false;
  }
}

export async function fetchRoleAssignments(cachedUserData: StaffUserDetails[], req: EnhancedRequest, next: NextFunction): Promise<Caseworker[]> {
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

export async function fetchRoleAssignmentsForNewUsers(cachedUserData: StaffUserDetails[]): Promise<Caseworker[]> {
  // note: this has been done to cache role categories
  // it is separate from the above as above caching will be done by backend
  const fullUserDetailCache = FullUserDetailCache.getInstance();
  try {
    if (refreshRoles && !cachedUsersWithRoles) {
      // refreshRoles to determine whether roles require refreshing
      // cachedUsersWithRoles to ensure rerun if user restarts request early
      const roleApiPath: string = prepareRoleApiUrl(baseRoleAssignmentUrl);
      const jurisdictions = getStaffSupportedJurisdictionsList();
      const payload = prepareRoleApiRequest(jurisdictions);
      const roleAssignmentHeaders = {
        ...getRequestHeaders(),
        pageNumber: 0,
        size: 10000
      };
      const { data } = await handlePostRoleAssignmentsWithNewUsers(roleApiPath, payload, roleAssignmentHeaders);
      const roleAssignments = data.roleAssignmentResponse;
      cachedUsersWithRoles = mapUsersToCaseworkers(cachedUserData, roleAssignments);
      fullUserDetailCache.setUserDetails(cachedUsersWithRoles);
    }
    return fullUserDetailCache.getAllUserDetails();
  } catch (error) {
    if (fullUserDetailCache.getAllUserDetails()) {
      return fullUserDetailCache.getAllUserDetails();
    }
  }
}

export async function getAuthTokens(): Promise<void> {
  try {
    // get config values for getting auth tokens
    const microservice = getConfigValue(MICROSERVICE);
    const s2sEndpointUrl = `${getConfigValue(SERVICE_S2S_PATH)}/lease`;
    const s2sSecret = getConfigValue(S2S_SECRET).trim();
    const oneTimePassword = authenticator.generate(s2sSecret);
    const idamPath = getConfigValue(SERVICES_IDAM_API_URL);
    const authURL = `${idamPath}/o/token`;
    const axiosConfig = {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    };
    const authBody = getRequestBody();
    // get auth token to use for pre-sign-in API calls
    const serviceAuthResponse = await http.post(`${s2sEndpointUrl}`, {
      microservice,
      oneTimePassword
    });
    initialServiceAuthToken = serviceAuthResponse.data;
    const authResponse = await http.post(authURL, authBody, axiosConfig);
    initialAuthToken = authResponse.data.access_token;
  } catch (error) {
    console.log('Cannot get auth tokens');
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

export function getRequestHeaders(): any {
  return {
    'content-type': 'application/json',
    'serviceAuthorization': `Bearer ${initialServiceAuthToken}`,
    'authorization': `Bearer ${initialAuthToken}`
  };
}

// get the request information from config - similarly in node-lib
export const getRequestBody = (): string => {
  const userName = getConfigValue(SYSTEM_USER_NAME);
  const userPassword = encodeURIComponent(getConfigValue(SYSTEM_USER_PASSWORD));
  const scope = 'openid profile roles manage-user create-user search-user';
  const clientSecret = getConfigValue(IDAM_SECRET);
  const idamClient = getConfigValue(SERVICES_IDAM_CLIENT_ID);
  return `grant_type=password&password=${userPassword}&username=${userName}&scope=${scope}&client_id=${idamClient}&client_secret=${clientSecret}`;
};
