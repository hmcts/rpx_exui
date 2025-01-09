import { NextFunction } from 'express';
import { authenticator } from 'otplib';

import { getConfigValue } from '../configuration';
import { IDAM_SECRET, MICROSERVICE, S2S_SECRET, SERVICES_IDAM_API_URL, SERVICES_IDAM_CLIENT_ID, SERVICE_S2S_PATH, STAFF_SUPPORTED_JURISDICTIONS, SYSTEM_USER_NAME, SYSTEM_USER_PASSWORD } from '../configuration/references';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { getStaffSupportedJurisdictionsList } from '../staffSupportedJurisdictions';
import { handleNewUsersGet, handlePostRoleAssignments, handlePostRoleAssignmentsWithNewUsers, handleUsersGet } from './caseWorkerService';
import { FullUserDetailCache } from './fullUserDetailCache';
import { baseCaseWorkerRefUrl, baseRoleAssignmentUrl } from './index';
import { CachedCaseworker, LocationApi } from './interfaces/common';
import { StaffProfile, StaffUserDetails } from './interfaces/staffUserDetails';
import { mapUsersToCachedCaseworkers, prepareGetUsersUrl, prepareRoleApiRequest, prepareRoleApiUrl } from './util';

// 10 minutes
const TTL = 600;

let timestamp: Date;
let refreshRoles: boolean;
let initialServiceAuthToken: string;
let initialAuthToken: string;

let cachedUsers: StaffUserDetails[];
let cachedUsersWithRoles: CachedCaseworker[];

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
      cachedUsers = getUniqueUsersFromResponse(userResponse);
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
    cachedUsers = getUniqueUsersFromResponse(userResponse);
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

export async function fetchRoleAssignments(cachedUserData: StaffUserDetails[], req: EnhancedRequest, next: NextFunction): Promise<CachedCaseworker[]> {
  // note: this has been done to cache role categories
  // it is separate from the above as above caching will be done by backend
  try {
    if (refreshRoles || !cachedUsersWithRoles) {
      // refreshRoles to determine whether roles require refreshing
      // cachedUsersWithRoles to ensure rerun if user restarts request early
      const roleApiPath: string = prepareRoleApiUrl(baseRoleAssignmentUrl);
      const jurisdictions = getStaffSupportedJurisdictionsList();
      const payload = prepareRoleApiRequest(jurisdictions);
      const { data } = await handlePostRoleAssignments(roleApiPath, payload, req);
      const roleAssignments = data.roleAssignmentResponse;
      cachedUsersWithRoles = mapUsersToCachedCaseworkers(cachedUserData, roleAssignments);
      FullUserDetailCache.setUserDetails(cachedUsersWithRoles);
    }
    return FullUserDetailCache.getAllUserDetails();
  } catch (error) {
    if (FullUserDetailCache.getAllUserDetails()) {
      return FullUserDetailCache.getAllUserDetails();
    }
    next(error);
  }
}

export async function fetchRoleAssignmentsForNewUsers(cachedUserData: StaffUserDetails[]): Promise<CachedCaseworker[]> {
  // note: this has been done to cache role categories
  // it is separate from the above as above caching will be done by backend
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
      cachedUsersWithRoles = mapUsersToCachedCaseworkers(cachedUserData, roleAssignments);
      FullUserDetailCache.setUserDetails(cachedUsersWithRoles);
    }
    return FullUserDetailCache.getAllUserDetails();
  } catch (error) {
    if (FullUserDetailCache.getAllUserDetails()) {
      return FullUserDetailCache.getAllUserDetails();
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

// This ensures there are no duplicates
export function getUniqueUsersFromResponse(userResponse: StaffUserDetails[]): StaffUserDetails[] {
  const userIdList = new Set<string>();
  const uniqueUsers: StaffUserDetails[] = [];
  // go through all users
  for (let userIndex = 0; userIndex < userResponse.length; userIndex++) {
    const thisUser = userResponse[userIndex];
    // line below for Civil -> CIVIL to ensure no issues
    thisUser.ccd_service_name = thisUser.ccd_service_name.toUpperCase();
    const memberProfile = thisUser.staff_profile;
    const userServices = [thisUser.ccd_service_name];
    const baseLocationList = [];
    if (!userIdList.has(memberProfile.id)) {
      // if the user is not the same as a previous user, loop through remaining users
      // this should find all duplicates
      for (let matchIndex = userIndex + 1; matchIndex < userResponse.length; matchIndex++) {
        const matchingUser = userResponse[matchIndex];
        const isOfSameUser = matchingUser.staff_profile.id === memberProfile.id &&
          !userServices.includes(matchingUser.ccd_service_name.toUpperCase());
        if (isOfSameUser) {
          // putting this here to avoid checking base location unless absolutely necessary
          // will add a first combined base location of first two differing services (iff the user is the same)
          if (baseLocationList.length === 0 && memberProfile.base_location?.length > 0) {
            const firstBaseLocation = getFirstBaseLocation(memberProfile, thisUser);
            if (firstBaseLocation) {
              baseLocationList.push(firstBaseLocation);
            }
          }
          userServices.push(matchingUser.ccd_service_name);
          // will add more combined base locations
          if (matchingUser.staff_profile.base_location?.length > 0) {
            const newBaseLocation = getNewBaseLocation(baseLocationList, matchingUser);
            if (newBaseLocation) {
              baseLocationList.push(newBaseLocation);
            }
          }
        }
      }
      // user has all related services and combined locations
      // note: non-combined locations have services undefined
      thisUser.ccd_service_names = userServices;
      memberProfile.base_location = baseLocationList?.length > 0 ? baseLocationList : memberProfile.base_location;
      // ensure user is not reused
      uniqueUsers.push(thisUser);
      userIdList.add(thisUser.staff_profile.id);
    }
  }
  return uniqueUsers;
}

export function getFirstBaseLocation(memberProfile: StaffProfile, matchingUser: StaffUserDetails): LocationApi {
  for (const location of memberProfile.base_location) {
    if (location.is_primary) {
      const firstBaseLocation = {
        location_id: location.location_id,
        location: location.location,
        is_primary: true,
        services: [matchingUser.ccd_service_name]
      };
      return firstBaseLocation;
    }
  }
  return null;
}

export function getNewBaseLocation(baseLocationList: LocationApi[], matchingUser: StaffUserDetails) {
  let newBaseLocation;
  // first loop finds primary location for new service
  for (const location of matchingUser.staff_profile.base_location) {
    if (location.is_primary) {
      newBaseLocation = {
        location_id: location.location_id,
        location: location.location,
        is_primary: true,
        services: [matchingUser.ccd_service_name]
      };
      break;
    }
  }
  let matchFound = false;
  // check if location exists with another service
  if (baseLocationList.length > 0 && newBaseLocation) {
    for (let locationIndex = 0; locationIndex < baseLocationList.length; locationIndex++) {
      const currentBaseLocation = baseLocationList[locationIndex];
      if (currentBaseLocation.location_id === newBaseLocation.location_id) {
        currentBaseLocation.services.push(matchingUser.ccd_service_name);
        baseLocationList[locationIndex] = currentBaseLocation;
        matchFound = true;
        break;
      }
    }
  }
  // if location does not already exist in user locations, add it
  if (!matchFound && newBaseLocation) {
    return newBaseLocation;
  }
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
