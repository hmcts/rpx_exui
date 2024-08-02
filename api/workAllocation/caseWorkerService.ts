import { AxiosResponse } from 'axios';
import { http } from '../lib/http';
import * as log4jui from '../lib/log4jui';
import { EnhancedRequest, JUILogger } from '../lib/models';
import { setHeaders } from '../lib/proxy';
import { CaseworkerPayload, ServiceCaseworkerData } from './interfaces/caseworkerPayload';

const logger: JUILogger = log4jui.getLogger('caseworker-service');
const MAX_RECORDS: number = 100000;

export async function handleUsersGet(path: string, req: EnhancedRequest): Promise<any> {
  logger.info('getting users for', path);
  const headers = setHeaders(req);
  const response: AxiosResponse = await http.get(path, { headers });
  return response.data;
}

export async function handleNewUsersGet(path: string, headers: any): Promise<any> {
  logger.info('getting users for', path);
  const response: AxiosResponse = await http.get(path, { headers });
  return response.data;
}

export async function handleCaseWorkerGetAll(path: string, req: EnhancedRequest): Promise<any> {
  logger.info('getting all caseworkers for', path);
  const headers = setHeaders(req);
  const response: AxiosResponse = await http.get(path, { headers });
  return response.data;
}

export async function handleCaseWorkerForLocation(path: string, req: EnhancedRequest): Promise<any> {
  logger.info('get caseworkers for Location', path);
  const headers = setHeaders(req);
  const response: AxiosResponse = await http.get(path, { headers });
  return response.data;
}

export async function handleCaseWorkerForService(path: string, req: EnhancedRequest): Promise<any> {
  logger.info('get caseworkers for Service', path);
  const headers = setHeaders(req);
  const response: AxiosResponse = await http.get(path, { headers });
  return response.data;
}

export async function handleCaseWorkerForLocationAndService(path: string, req: EnhancedRequest): Promise<any> {
  logger.info('get caseworkers for Location and Service', path);
  const headers = setHeaders(req);
  const response: AxiosResponse = await http.get(path, { headers });
  return response.data;
}

export async function handleCaseWorkerDetails(path: string, req: EnhancedRequest): Promise<any> {
  logger.info('get caseworkers Details', path);
  const headers = setHeaders(req);
  const response: AxiosResponse = await http.get(path, { headers });
  return response.data;
}

export async function handlePostSearch(path: string, payload: string | any, req: EnhancedRequest): Promise<any> {
  logger.info('post search', payload);
  const headers = setHeaders(req);
  return await http.post(path, payload, { headers });
}

export async function handlePostRoleAssignments(path: string, payload: any, req: EnhancedRequest): Promise<any> {
  const headers = setHeaders(req);
  headers.pageNumber = 0;
  headers.size = MAX_RECORDS;
  // sort
  // direction
  const response: AxiosResponse = await http.post(path, payload, { headers });
  if (response.data.roleAssignmentResponse.length >= MAX_RECORDS) {
    logger.warn('Case workers now returning MAX_RECORDS', response.data.roleAssignmentResponse.length);
  }
  return response;
}

export async function handlePostRoleAssignmentsWithNewUsers(path: string, payload: any, headers: any): Promise<any> {
  // sort
  // direction
  const response: AxiosResponse = await http.post(path, payload, { headers });
  if (response.data.roleAssignmentResponse.length >= MAX_RECORDS) {
    logger.warn('Case workers now returning MAX_RECORDS', response.data.roleAssignmentResponse.length);
  }
  return response;
}

export async function handleCaseWorkersForServicesPost(path: string, payloads: CaseworkerPayload [], req: EnhancedRequest):
 Promise<ServiceCaseworkerData[]> {
  const headers = setHeaders(req);
  headers.pageNumber = 0;
  headers.size = MAX_RECORDS;
  const data = new Array<ServiceCaseworkerData>();
  // sort
  // direction
  for (const payload of payloads) {
    const response: AxiosResponse = await http.post(path, payload, { headers });
    if (response.data.roleAssignmentResponse.length >= MAX_RECORDS) {
      logger.warn('Case workers now returning MAX_RECORDS', response.data.roleAssignmentResponse.length);
    }
    const caseworkerService = { jurisdiction: payload.attributes.jurisdiction[0], data: response.data };
    data.push(caseworkerService);
  }
  return data;
}

export async function handlePostCaseWorkersRefData(path: string, userIdsByJurisdiction: any, req: EnhancedRequest): Promise<any> {
  const data = new Array<any>();
  for (const userIdList of userIdsByJurisdiction) {
    if (userIdList.userIds && userIdList.userIds.length > 0) {
      const payload = {
        userIds: userIdList.userIds
      };
      const headers = setHeaders(req);
      const response: AxiosResponse = await http.post(path, payload, { headers });
      const userListByService = { jurisdiction: userIdList.jurisdiction, data: response.data };
      data.push(userListByService);
    } else {
      console.warn('Jurisdiction ' + userIdList.jurisdiction + ' user list is empty');
    }
  }
  return data;
}

export async function handlePostJudicialWorkersRefData(path: string, userIds: any, req: EnhancedRequest): Promise<any> {
  const payload = {
    userIds
  };
  const headers = setHeaders(req);
  return await http.post(path, payload, { headers });
}

export function getUserIdsFromRoleApiResponse(response: any): string [] {
  let userIds = new Array<string>();
  if (response && response.roleAssignmentResponse) {
    response.roleAssignmentResponse.forEach((roleAssignment) => {
      userIds = [...userIds, roleAssignment.actorId];
    });
  }
  return userIds;
}

export function getUserIdsFromJurisdictionRoleResponse(response: any): any [] {
  let userIdsByJurisdiction = [];
  response.forEach((jurisdictionRoleResponse) => {
    let userIds = [];
    jurisdictionRoleResponse.data.roleAssignmentResponse.forEach((roleAssignment) => {
      userIds = [...userIds, roleAssignment.actorId];
    });
    userIdsByJurisdiction = userIdsByJurisdiction.concat({ jurisdiction: jurisdictionRoleResponse.jurisdiction, userIds });
  });
  return userIdsByJurisdiction;
}
