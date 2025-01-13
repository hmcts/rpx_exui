import { AxiosResponse } from 'axios';
import * as express from 'express';
import { getConfigValue } from '../configuration';
import { CASEWORKER_PAGE_SIZE, SERVICES_CCD_DATA_STORE_API_PATH, SERVICES_ROLE_ASSIGNMENT_API_PATH } from '../configuration/references';

import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { setHeaders } from '../lib/proxy';
import { RoleCategory } from '../roleAccess/models/allocate-role.enum';
import { release2ContentType } from '../roleAccess/models/release2ContentType';
import { Role } from '../roleAccess/models/roleType';
import { ElasticSearchQuery } from '../searchCases/interfaces/ElasticSearchQuery';
import { CASE_ALLOCATOR_ROLE } from '../user/constants';
import { RoleAssignment } from '../user/interfaces/roleAssignment';

import { exists, reflect } from '../lib/util';
import {
  TaskPermission,
  VIEW_PERMISSIONS_ACTIONS_MATRIX,
  VIEW_PERMISSIONS_ACTIONS_MATRIX_REFINED,
  ViewType
} from './constants/actions';
import { getCaseListPromises } from './index';
import { Case, CaseList } from './interfaces/case';
import { CaseworkerPayload, ServiceCaseworkerData } from './interfaces/caseworkerPayload';
import {
  Action,
  CachedCaseworker,
  CaseDataType,
  Caseworker,
  CaseworkerApi,
  CaseworkersByService,
  Location,
  LocationApi
} from './interfaces/common';
import { Person, PersonRole } from './interfaces/person';
import { RoleCaseData } from './interfaces/roleCaseData';
import { SearchTaskParameter } from './interfaces/taskSearchParameter';
import { StaffProfile, StaffUserDetails } from './interfaces/staffUserDetails';

export function prepareGetTaskUrl(baseUrl: string, taskId: string): string {
  return `${baseUrl}/task/${taskId}`;
}

export function preparePostTaskUrlAction(baseUrl: string, taskId: string, action: string, mode: string): string {
  if (action === 'complete') {
    return `${baseUrl}/task/${taskId}/${action}?completion_process=${mode}`;
  }
  return `${baseUrl}/task/${taskId}/${action}`;
}

export function prepareSearchCaseUrl(baseUrl: string, subPath?: string) {
  if (subPath) {
    return `${baseUrl}/${subPath}`;
  }
  return `${baseUrl}/case`;
}

export function prepareSearchTaskUrl(baseUrl: string, subPath?: string) {
  if (subPath) {
    return `${baseUrl}/${subPath}`;
  }
  return `${baseUrl}/task`;
}

export function prepareGetLocationByIdUrl(baseUrl: string, locationId: string): string {
  return `${baseUrl}/location/${locationId}`;
}

export function prepareGetLocationsUrl(baseUrl: string, serviceCode: string = 'BFA1'): string {
  return `${baseUrl}/refdata/location/court-venues/services?service_code=${serviceCode}`;
}

// note: this function was created in order to get specific eppims id but spans services so not useful
// however could still be used for another process
export function prepareGetSpecificLocationUrl(baseUrl: string, epimmsId: string): string {
  return `${baseUrl}/refdata/location/court-venues?epimms_id=${epimmsId}`;
}

export function prepareGetUsersUrl(baseUrl: string, service: string): string {
  const pageSize = parseInt(getConfigValue(CASEWORKER_PAGE_SIZE));
  return `${baseUrl}/refdata/internal/staff/usersByServiceName?ccd_service_names=${service}&page_size=${pageSize}`;
}

export function prepareRoleApiUrl(baseUrl: string) {
  return `${baseUrl}/am/role-assignments/query`;
}

export function prepareCaseWorkerSearchUrl(baseUrl: string) {
  return `${baseUrl}/caseworker/search`;
}

export function prepareTaskSearchForCompletable(baseUrl: string) {
  return `${baseUrl}/task/search-for-completable`;
}

export function prepareCaseWorkerForLocation(baseUrl: string, locationId: string) {
  return `${baseUrl}/caseworker/location/${locationId}`;
}

export function prepareCaseWorkerForService(baseUrl: string, serviceId: string) {
  return `${baseUrl}/caseworker/service/${serviceId}`;
}

export function prepareCaseWorkerForLocationAndService(baseUrl: string, locationId: string, serviceId: string) {
  return `${baseUrl}/caseworker/location/${locationId}/service/${serviceId}`;
}

export function preparePaginationUrl(req: EnhancedRequest, postPath: string): string {
  // Assign actions to the tasks on the data from the API.
  if (req.body && req.body.searchRequest && req.body.searchRequest.pagination_parameters) {
    const paginationConfig = req.body.searchRequest.pagination_parameters;
    const pageSize = paginationConfig.page_size;
    const pageNumber = (paginationConfig.page_number - 1) * pageSize;
    return `${postPath}?first_result=${pageNumber}&max_results=${pageSize}`;
  }
  return postPath;
}

function getLoweredStringList(values: string[]): string[] {
  if (values && values.length > 0) {
    const newValues = values.map((value) => value.toLocaleLowerCase());
    return newValues;
  }
  return [];
}

/**
 * The below sets up actions on the tasks, though it's expected this will change
 * in the future - it should do fine for the MVP, though.
 * @param tasks The tasks to set up the actions for.
 * @param view This dictates which set of actions we should use.
 * @param currentUser
 */
export function assignActionsToUpdatedTasks(tasks: any[], view: any, currentUser: string): any[] {
  const allWorkView = ViewType.ALL_WORK;
  const activeTasksView = ViewType.ACTIVE_TASKS;
  const tasksWithActions: any[] = [];
  tasks.forEach((task) => {
    if (task && task.permissions && task.permissions.values) {
      task.permissions.values = getLoweredStringList(task.permissions.values);
    }
  });

  if (tasks) {
    for (const task of tasks) {
      task.dueDate = task.due_date;
      let thisView = view;
      if (view === allWorkView) {
        thisView = ViewType.ALL_WORK_UNASSIGNED;
        if (task.assignee) {
          thisView = currentUser === task.assignee ?
            ViewType.ALL_WORK_ASSIGNED_CURRENT : ViewType.ALL_WORK_ASSIGNED_OTHER;
        }
      }
      if (view === activeTasksView) {
        thisView = ViewType.ACTIVE_TASKS_UNASSIGNED;
        if (task.assignee) {
          thisView = currentUser === task.assignee ?
            ViewType.ACTIVE_TASKS_ASSIGNED_CURRENT : ViewType.ACTIVE_TASKS_ASSIGNED_OTHER;
        }
      }
      const permissions = task.permissions && task.permissions.values && Array.isArray(task.permissions.values)
        ? task.permissions.values : task.permissions;
      let actions: Action[] = getActionsByRefinedPermissions(thisView, permissions);
      // EUI-5549 - to do with cases
      if (task.assignee && currentUser !== task.assignee && view === ViewType.ACTIVE_TASKS) {
        actions = actions.filter((action) => action.id !== 'claim');
      }
      const taskWithAction = { ...task, actions };
      tasksWithActions.push(taskWithAction);
    }
  }
  return tasksWithActions;
}

/**
 * The below sets up actions on the tasks, though it's expected this will change
 * in the future - it should do fine for the MVP, though.
 * @param tasks The tasks to set up the actions for.
 * @param view This dictates which set of actions we should use.
 */
export function assignActionsToTasks(tasks: any[], view: any, currentUser: string): any[] {
  const allWorkView = ViewType.ALL_WORK;
  const activeTasksView = ViewType.ACTIVE_TASKS;
  const tasksWithActions: any[] = [];
  if (tasks) {
    for (const task of tasks) {
      task.dueDate = task.due_date;
      let thisView = view;
      if (view === allWorkView) {
        thisView = task.assignee ? ViewType.ALL_WORK_ASSIGNED : ViewType.ALL_WORK_UNASSIGNED;
      }
      if (view === activeTasksView) {
        thisView = ViewType.ACTIVE_TASKS_UNASSIGNED;
        if (task.assignee) {
          thisView = currentUser === task.assignee ?
            ViewType.ACTIVE_TASKS_ASSIGNED_CURRENT : ViewType.ACTIVE_TASKS_ASSIGNED_OTHER;
        }
      }
      const permissions = task.permissions && task.permissions.values && Array.isArray(task.permissions.values)
        ? task.permissions.values : task.permissions;
      let actions: Action[] = getActionsByPermissions(thisView, permissions);
      // EUI-5549
      if (task.assignee && currentUser !== task.assignee && view === ViewType.ACTIVE_TASKS) {
        actions = actions.filter((action) => action.id !== 'claim');
      }
      const taskWithAction = { ...task, actions };
      tasksWithActions.push(taskWithAction);
    }
  }
  return tasksWithActions;
}

/**
 * NOTE: These comments are copied from the assignActionsToTasks method
 * The below sets up actions on the cases, though it's expected this will change
 * in the future - it should do fine for the MVP, though.
 * @param cases The cases to set up the actions for.
 * @param view This dictates which set of actions we should use.
 * @param isAllocator User is caseAllocator
 */
export function assignActionsToCases(cases: any[], isAllocator: boolean): any[] {
  const casesWithActions: any[] = [];
  if (cases) {
    for (const item of cases) {
      const actions: Action[] = getActionsFromAllocatorRole(isAllocator);
      const caseWithAction = { ...item, actions };
      casesWithActions.push(caseWithAction);
    }
  }
  return casesWithActions;
}

export function getSessionCaseworkerInfo(serviceIds: string[], caseworkersByServices: CaseworkersByService[]):
  [string[], CaseworkersByService[]] {
  const caseworkersInSession: CaseworkersByService[] = [];
  const servicesNotInSession: string[] = [];
  serviceIds.forEach((thisService) => {
    const currentCaseworkers = caseworkersByServices.find((caseworkerServiceList) => caseworkerServiceList.service === thisService);
    if (currentCaseworkers && currentCaseworkers.caseworkers) {
      caseworkersInSession.push(currentCaseworkers);
    } else {
      servicesNotInSession.push(thisService);
    }
  });
  return [servicesNotInSession, caseworkersInSession];
}

export function getCaseworkerDataForServices(caseWorkerData: CaseworkerApi[], roleAssignmentByService: ServiceCaseworkerData):
  CaseworkersByService {
  const roleAssignmentResponse = roleAssignmentByService.data.roleAssignmentResponse;
  const caseworkersByCurrentService: CaseworkersByService = { service: roleAssignmentByService.jurisdiction, caseworkers: [] };
  if (roleAssignmentResponse && roleAssignmentResponse.length > 0) {
    const caseworkers = mapCaseworkerData(caseWorkerData, roleAssignmentResponse, roleAssignmentByService.jurisdiction);
    caseworkersByCurrentService.caseworkers = caseworkers;
  }
  return caseworkersByCurrentService;
}

export function mapCaseworkerData(caseWorkerData: CaseworkerApi[], roleAssignments: RoleAssignment[], jurisdiction?: string): Caseworker[] {
  const caseworkers: Caseworker[] = [];
  if (caseWorkerData) {
    caseWorkerData.forEach((caseWorkerApi: CaseworkerApi) => {
      const thisCaseWorker: Caseworker = {
        email: caseWorkerApi.email_id,
        firstName: caseWorkerApi.first_name,
        idamId: caseWorkerApi.id,
        lastName: caseWorkerApi.last_name,
        location: mapCaseworkerLocation(caseWorkerApi.base_location),
        roleCategory: getRoleCategory(roleAssignments, caseWorkerApi),
        service: jurisdiction ? jurisdiction : null
      };
      caseworkers.push(thisCaseWorker);
    });
  }
  return caseworkers;
}

export function mapUsersToCachedCaseworkers(users: StaffUserDetails[], roleAssignments: RoleAssignment[]): CachedCaseworker[] {
  const caseworkers: CachedCaseworker[] = [];
  if (users) {
    users.forEach((staffUser: StaffUserDetails) => {
      const thisCaseWorker: CachedCaseworker = {
        email: staffUser.staff_profile.email_id,
        firstName: staffUser.staff_profile.first_name,
        idamId: staffUser.staff_profile.id,
        lastName: staffUser.staff_profile.last_name,
        locations: mapCachedCaseworkerLocation(staffUser.staff_profile.base_location),
        roleCategory: getUserRoleCategory(roleAssignments, staffUser.staff_profile, staffUser.ccd_service_names),
        services: staffUser.ccd_service_names
      };
      caseworkers.push(thisCaseWorker);
    });
  }
  return caseworkers;
}

export function getRoleCategory(roleAssignments: RoleAssignment[], caseWorkerApi: CaseworkerApi): string {
  const roleAssignment = roleAssignments.find((roleAssign) => roleAssign.actorId === caseWorkerApi.id);
  return roleAssignment ? roleAssignment.roleCategory : null;
}

export function getUserRoleCategory(roleAssignments: RoleAssignment[], user: StaffProfile, services: string[]): string {
  // TODO: Will need to be updated
  const roleAssignment = roleAssignments.find((roleAssign) =>
    roleAssign.actorId === user.id && roleAssign.roleCategory &&
    // added line below to stop irrelevant role setting role category
    // note - we know services are already capitalised
    (!roleAssign.attributes?.jurisdiction || services.includes(roleAssign.attributes.jurisdiction.toUpperCase()))
  );
  return roleAssignment ? roleAssignment.roleCategory : null;
}

export function mapCaseworkerLocation(baseLocation: LocationApi[]): Location {
  let thisBaseLocation: Location = null;
  if (baseLocation) {
    baseLocation.forEach((location: LocationApi) => {
      if (location.is_primary) {
        thisBaseLocation = {
          id: location.location_id,
          locationName: location.location,
          services: location.services
        };
      }
    });
  }
  return thisBaseLocation;
}

export function mapCachedCaseworkerLocation(baseLocation: LocationApi[]): Location[] {
  const locations = [];
  if (baseLocation) {
    baseLocation.forEach((location: LocationApi) => {
      const thisBaseLocation = {
        id: location.location_id,
        locationName: location.location,
        services: location.services
      };
      if (location.is_primary) {
        locations.push(thisBaseLocation);
      }
    });
  }
  return locations;
}

export function mapUserLocation(baseLocation: LocationApi[]): Location {
  let thisBaseLocation: Location = null;
  if (baseLocation) {
    baseLocation.forEach((location: LocationApi) => {
      if (location.is_primary) {
        thisBaseLocation = {
          id: location.location_id,
          locationName: location.location,
          services: location.services
        };
      }
    });
  }
  return thisBaseLocation;
}

export function prepareRoleApiRequest(jurisdictions: string[], locationId?: number, allRoles?: boolean): any {
  let attributes: any = {};
  if (!allRoles) {
    attributes = {
      jurisdiction: jurisdictions
    };
  }

  const payload = {
    attributes,
    // TODO: This should not be hard-coded list
    roleName: ['hearing-centre-admin', 'case-manager', 'ctsc', 'tribunal-caseworker',
      'hmcts-legal-operations', 'task-supervisor', 'hmcts-admin',
      'national-business-centre', 'senior-tribunal-caseworker', 'case-allocator',
      'regional-centre-admin'],
    roleType: ['ORGANISATION'],
    validAt: Date.UTC
  };
  if (locationId) {
    // TODO: Not sure whether this is even being used
    payload.attributes.baseLocation = [locationId];
  }
  return payload;
}

export function prepareServiceRoleApiRequest(jurisdictions: string[], roles: Role[], locationId?: number): CaseworkerPayload[] {
  // note that this could be moved to index method if required
  const roleIds = getRoleIdsFromRoles(roles);
  const payloads: CaseworkerPayload[] = [];
  jurisdictions.forEach((jurisdiction) => {
    const attributes: any = {
      jurisdiction: [jurisdiction]
    };
    if (locationId) {
      // TODO: Again does not seem to be being used
      attributes.baseLocation = [locationId];
    }
    const payload = {
      attributes,
      roleName: roleIds,
      roleType: ['ORGANISATION'],
      validAt: Date.UTC
    };
    payloads.push(payload);
  });
  return payloads;
}

export function getRoleIdsFromRoles(roles: Role[]): string[] {
  const roleIds = [];
  roles.forEach((role) => roleIds.push(role.name));
  return roleIds;
}

/**
 * Aggregate permissions from the View Permissions Actions Matrix defined by business.
 * @param view This dictates which set of actions we should use.
 * @param permissions The list of permissions the user holds.
 * @return actionList:Action[] the list of total actions user holds.
 */
export function getActionsByRefinedPermissions(view, permissions: TaskPermission[]): Action[] {
  let actionList: Action[] = [];
  actionList = getActionsFromRefinedMatrix(view, TaskPermission.DEFAULT, actionList);
  permissions.forEach((permission) => {
    switch (permission) {
      case TaskPermission.UNCLAIM:
        // unassign from self
        actionList = getActionsFromRefinedMatrix(view, permission, actionList);
        if (permissions.includes(TaskPermission.ASSIGN)) {
          // reassign task assigned to me
          actionList = getActionsFromRefinedMatrix(view, TaskPermission.UNCLAIMASSIGN, actionList);
        }
        if (view.includes(ViewType.ACTIVE_TASKS_ASSIGNED_CURRENT) || view.includes(ViewType.ALL_WORK_ASSIGNED_CURRENT)) {
          // unassign from self
          actionList = getActionsFromRefinedMatrix(view, TaskPermission.UNASSIGN, actionList);
        }
        break;
      case TaskPermission.CLAIM:
        if ((permissions.includes(TaskPermission.OWN) || permissions.includes(TaskPermission.EXECUTE))
          && !view.includes('Other')) {
          // assign to me
          actionList = getActionsFromRefinedMatrix(view, permission, actionList);
        }
        break;
      case TaskPermission.ASSIGN:
        if (permissions.includes(TaskPermission.OWN) || permissions.includes(TaskPermission.EXECUTE)) {
          // assign to me
          actionList = getActionsFromRefinedMatrix(view, TaskPermission.CLAIM, actionList);
        }
        if (view.includes(ViewType.ACTIVE_TASKS_UNASSIGNED) || view.includes(ViewType.ALL_WORK_UNASSIGNED)) {
          // assign to someone else
          actionList = getActionsFromRefinedMatrix(view, permission, actionList);
        }
        break;
      case TaskPermission.UNASSIGN:
        if (permissions.includes(TaskPermission.ASSIGN)) {
          // reassign to someone else
          actionList = getActionsFromRefinedMatrix(view, TaskPermission.ASSIGN, actionList);
        }
        if ((permissions.includes(TaskPermission.ASSIGN) || permissions.includes(TaskPermission.CLAIM))
          && (permissions.includes(TaskPermission.OWN) || permissions.includes(TaskPermission.EXECUTE))) {
          // assign to me (previously assigned to someone else)
          actionList = getActionsFromRefinedMatrix(view, TaskPermission.CLAIM, actionList);
        }
        // unassign task
        actionList = getActionsFromRefinedMatrix(view, permission, actionList);
        break;
      case TaskPermission.CANCEL:
      case TaskPermission.CANCELOWN:
      case TaskPermission.COMPLETE:
      case TaskPermission.COMPLETEOWN:
      case TaskPermission.UNCLAIMASSIGN:
        // Completing or cancelling (or unclaiming and assigning) simply uses matrix direct actions
        // as does not depend on other permissions
        actionList = getActionsFromRefinedMatrix(view, permission, actionList);
        break;
      case TaskPermission.UNASSIGNASSIGN:
        // reassign task
        actionList = getActionsFromRefinedMatrix(view, permission, actionList);
        if (permissions.includes(TaskPermission.EXECUTE) || permissions.includes(TaskPermission.OWN)) {
          // assign task to me
          actionList = getActionsFromRefinedMatrix(view, TaskPermission.CLAIM, actionList);
        }
        break;
      case TaskPermission.UNASSIGNCLAIM:
        if (permissions.includes(TaskPermission.EXECUTE) || permissions.includes(TaskPermission.OWN)) {
          // assign task to me
          actionList = getActionsFromRefinedMatrix(view, TaskPermission.CLAIM, actionList);
        }
        break;
      case TaskPermission.EXECUTE:
      case TaskPermission.OWN:
        // Available task action permissions
        if (permissions.includes(TaskPermission.ASSIGN) || permissions.includes(TaskPermission.CLAIM)) {
          // claim task
          actionList = getActionsFromRefinedMatrix(view, TaskPermission.EXECUTE, actionList);
        }
        break;
      default:
        break;
    }
  });
  // Note sorting is implemented to order all possible action lists the same
  // Currently sorting by id but can be changed
  actionList = Array.from(new Set(actionList));
  return actionList.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Aggregate permissions from the View Permissions Actions Matrix defined by business.
 * @param view This dictates which set of actions we should use.
 * @param permissions The list of permissions the user holds.
 * @return actionList:Action[] the list of total actions user holds.
 */
export function getActionsByPermissions(view, permissions: TaskPermission[]): Action[] {
  let actionList: Action[] = [];
  permissions = permissions.map((permission) => permission = permission.toString().toLowerCase() as TaskPermission);
  permissions.forEach((permission) => {
    switch (permission) {
      case TaskPermission.MANAGE:
        actionList = getActionsFromMatrix(view, permission, actionList);
        break;
      case TaskPermission.EXECUTE:
      case TaskPermission.OWN:
        // if on active tasks and there is a manage permission add own actions
        if (view.includes(ViewType.ACTIVE_TASKS) && permissions.includes(TaskPermission.MANAGE)) {
          actionList = getActionsFromMatrix(view, TaskPermission.OWN, actionList);
          break;
        }
        actionList = getActionsFromMatrix(view, TaskPermission.EXECUTE, actionList);
        break;
      case TaskPermission.CANCEL:
        actionList = getActionsFromMatrix(view, permission, actionList);
        break;
      default:
        break;
    }
  });
  // Note sorting is implemented to order all possible action lists the same
  // Currently sorting by id but can be changed
  actionList = Array.from(new Set(actionList));
  return actionList.sort((a, b) => a.id.localeCompare(b.id));
}

export function getActionsFromMatrix(view, permission: TaskPermission, currentActionList: Action[]): Action[] {
  const newActionList = currentActionList.concat(VIEW_PERMISSIONS_ACTIONS_MATRIX[view][permission]);
  currentActionList = !newActionList.includes(undefined) ? newActionList : currentActionList;
  return currentActionList;
}

export function getActionsFromRefinedMatrix(view, permission: TaskPermission, currentActionList: Action[]): Action[] {
  const newActionList = currentActionList.concat(VIEW_PERMISSIONS_ACTIONS_MATRIX_REFINED[view][permission]);
  currentActionList = !newActionList.includes(undefined) ? newActionList : currentActionList;
  return currentActionList;
}

export function getActionsFromAllocatorRole(isAllocator: boolean): Action[] {
  let actionList: Action[] = [];
  if (isAllocator) {
    actionList = (VIEW_PERMISSIONS_ACTIONS_MATRIX.AllCases.manage);
  }
  return actionList;
}

export function applySearchFilter(person: Person, domain: string, searchTerm: any): boolean {
  if (domain === PersonRole.ALL) {
    return person && person.name.toLowerCase().includes(searchTerm.toLowerCase());
  }
  return person && person.domain === domain && person.name.toLowerCase().includes(searchTerm.toLowerCase());
}

export async function handlePost(path: string, payload: any, req: EnhancedRequest): Promise<any> {
  const headers = setHeaders(req);
  const response: AxiosResponse = await http.post(path, payload, { headers });
  // Return the whole response, not just the data, so we can
  // see what the status of the response is.
  return response;
}

export async function getCaseIdListFromRoles(roleAssignmentList: RoleAssignment[], req: EnhancedRequest): Promise<Case[]> {
  if (!roleAssignmentList) {
    return Promise.resolve([]);
  }
  const data: CaseDataType = getCaseDataFromRoleAssignments(roleAssignmentList);

  const casePromises: Promise<CaseList>[] = getCaseListPromises(data, req);

  const response = await Promise.all(casePromises.map(reflect));
  const caseResults = response.filter((x) => x.status === 'fulfilled' && x.value).map((x) => x.value);
  let cases = [];
  caseResults.forEach((caseResult) => cases = [...cases, ...caseResult.cases]);

  return cases;
}

export function filterMyAccessRoleAssignments(roleAssignmentList: RoleAssignment[]) {
  return roleAssignmentList.filter((roleAssignment) =>
    (
      roleAssignment.grantType === 'SPECIFIC' ||
      roleAssignment.roleName === 'specific-access-requested' ||
      roleAssignment.roleName === 'specific-access-denied'
    ) &&
    (!roleAssignment.attributes || roleAssignment.attributes.substantive !== 'Y')
  );
}

export async function getMyAccessMappedCaseList(roleAssignmentList: RoleAssignment[], req: EnhancedRequest)
  : Promise<RoleCaseData[]> {
  const newRoleAssignment = getAccessGrantedRoleAssignments(roleAssignmentList);

  const specificRoleAssignments = filterMyAccessRoleAssignments(roleAssignmentList);

  const cases = await getCaseIdListFromRoles(specificRoleAssignments, req);
  return mapCasesFromData(cases, specificRoleAssignments, newRoleAssignment);
}

export function getAccessGrantedRoleAssignments(roleAssignmentList: RoleAssignment[]): RoleAssignment[] {
  return roleAssignmentList.filter((role) => role.roleName === 'specific-access-granted');
}

export function constructElasticSearchQuery(caseIds: any[], page: number, size: number): ElasticSearchQuery[] {
  const elasticQueries = new Array<ElasticSearchQuery>();
  const chunkSize = 200;
  for (let i = 0; i < caseIds.length; i += chunkSize) {
    const chunk = caseIds.slice(i, i + chunkSize);
    const elasticQuery = {
      native_es_query: {
        query: {
          terms: {
            reference: chunk
          }
        },
        sort: [
          // does not seem to allow sorting by case name (attempted both pre and post v6.8 syntax)
          // this is either because case name not present for all cases or because nested data cannot be sorted in this instance
          //{ "case_data.caseName": {mode: "max", order: "asc", nested_path: "case_data"}},
          { id: { order: 'asc' } }
        ],
        size
      },
      supplementary_data: ['*']
    };
    elasticQueries.push(elasticQuery);
  }
  return elasticQueries;
}

export async function getRoleAssignmentsByQuery(query: any, req: express.Request): Promise<any> {
  const url = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
  const path = `${url}/am/role-assignments/query`;
  const headers = setHeaders(req, release2ContentType);
  headers.size = 10000;
  try {
    const result = await http.post(path, query, { headers });
    return result.data;
  } catch (e) {
    console.error(e);
  }
  return null;
}

export async function searchCasesById(queryParams: string, query: any, req: express.Request): Promise<CaseList> {
  const url = getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH);
  const path = `${url}/searchCases`;
  const headers = setHeaders(req);
  try {
    const result = await http.post(path, query, { headers, params: { ctid: queryParams } });
    return result.data;
  } catch (e) {
    console.error(e);
  }
  return null;
}

// Only called in test function - why is it here?
export function getCaseAllocatorLocations(roleAssignments: RoleAssignment[]): string[] {
  return roleAssignments.filter((roleAssignment) => roleAssignment.attributes && roleAssignment.attributes.baseLocation
    && roleAssignment.roleName === CASE_ALLOCATOR_ROLE)
    .map((roleAssignment) => roleAssignment.attributes.baseLocation)
    .reduce((acc, locationId) => acc.includes(locationId) ? acc : `${acc}${locationId},`, '')
    .split(',')
    .filter((location) => location.length);
}

export function constructRoleAssignmentQuery(
  searchTaskParameters: SearchTaskParameter[]
): any {
  searchTaskParameters = [...searchTaskParameters,
    { key: 'roleType', values: 'CASE', operator: '' }
  ];
  return {
    queryRequests: [searchTaskParameters
      .map((param: SearchTaskParameter) => {
        if (param.key === 'location_id') {
          param.key = 'baseLocation';
          const values = param.values as string;
          param.values = [values]
            .filter((location) => location.length);
          return param;
        }
        if (param.key === 'role') {
          param.key = 'roleCategory';
          param.values = mapRoleType(param.values as string);
        }

        return {
          ...param, values: param.values.length ? [param.values] : []
        };
      })
      .filter((param: SearchTaskParameter) => param.values && param.values.length)
      .reduce((acc: any, param: SearchTaskParameter) => {
        if (param.key === 'jurisdiction') {
          const attributes = acc.attributes || {};
          return {
            ...acc, attributes: {
              ...attributes,
              [param.key]: param.values
            }
          };
        }
        return { ...acc, [param.key]: param.values };
      }, {})]
  };
}

export function constructRoleAssignmentCaseAllocatorQuery(searchTaskParameters: SearchTaskParameter[], req: any): any {
  const currentUser = req.session.passport.user.userinfo;
  const userId = currentUser.id ? currentUser.id : currentUser.uid;
  let newSearchTaskParameters = JSON.parse(JSON.stringify(searchTaskParameters)) as SearchTaskParameter[];
  newSearchTaskParameters = [...newSearchTaskParameters,
    { key: 'role', values: 'case-allocator', operator: '' },
    { key: 'roleType', values: 'ORGANISATION', operator: '' }];
  return {
    queryRequests: [newSearchTaskParameters
      .filter((param: SearchTaskParameter) => param.key === 'actorId' || param.values && param.values.length)
      .map((param: SearchTaskParameter) => {
        if (param.key === 'location_id') {
          param.key = 'baseLocation';
        }
        if (param.key === 'roleCategory') {
          param.values = mapRoleType(param.values as string);
        }

        return param;
      })
      .reduce((acc: any, param: SearchTaskParameter) => {
        if (param.key === 'actorId') {
          param.values = userId;
        }
        if (param.key === 'jurisdiction' || param.key === 'baseLocation') {
          const attributes = acc.attributes || {};
          return {
            ...acc, attributes: {
              ...attributes,
              [param.key]: [param.values]
            }
          };
        }
        return { ...acc, [param.key]: [param.values] };
      }, {})]
  };
}

export function mapRoleType(roleType: string): string {
  if (roleType === PersonRole.JUDICIAL) {
    return RoleCategory.JUDICIAL;
  }

  if (roleType === PersonRole.CASEWORKER) {
    return RoleCategory.LEGAL_OPERATIONS;
  }

  if (roleType === PersonRole.ADMIN) {
    return RoleCategory.ADMIN;
  }

  return '';
}

export function filterByLocationId(cases: Case[], locations: string[]): Case[] {
  return locations.length === 0 ? cases : cases.filter((caseDetail: Case) =>
    caseDetail.case_data.caseManagementLocation &&
    caseDetail.case_data.caseManagementLocation.baseLocation &&
    locations.includes(caseDetail.case_data.caseManagementLocation.baseLocation));
}

export function mapCasesFromData(
  caseDetails: Case[],
  roleAssignmentList: RoleAssignment[],
  newRoleAssignmentList: RoleAssignment[] = []
): RoleCaseData[] {
  if (!caseDetails) {
    return [];
  }
  const roleCaseList = [];
  caseDetails.forEach((caseDetail) => {
    const rolesForCaseId = roleAssignmentList.filter(
      (role) => role.attributes && caseDetail.id.toString() === role.attributes.caseId
    );
    rolesForCaseId.forEach((roleAssignment) => {
      const roleCase = mapRoleCaseData(roleAssignment, caseDetail, newRoleAssignmentList);
      roleCaseList.push(roleCase);
    });
  });
  // sorting case list by case name - no longer necessary as sorting by case id through elastic search
  //const sortedCaseList = roleCaseList.sort((a, b) => a.case_name.toString().localeCompare(b.case_name));
  return roleCaseList;
}

export function mapRoleCaseData(roleAssignment: RoleAssignment, caseDetail: Case,
  newRoleAssignmentList: RoleAssignment[]): RoleCaseData {
  return {
    assignee: roleAssignment.actorId,
    // hmctsCaseCategory will be available only if an event has been triggered
    case_category: getCaseCategory(caseDetail),
    case_type: caseDetail.case_type_id,
    case_id: caseDetail.id,
    case_name: getCaseName(caseDetail),
    case_role: roleAssignment.roleName,
    role: roleAssignment.roleName,
    endDate: getEndDate(roleAssignment),
    id: roleAssignment.id,
    jurisdiction: caseDetail.jurisdiction,
    jurisdictionId: caseDetail.jurisdiction,
    role_category: roleAssignment.roleCategory,
    location_id: caseDetail.case_data &&
      caseDetail.case_data.caseManagementLocation &&
      caseDetail.case_data.caseManagementLocation.baseLocation ?
      caseDetail.case_data.caseManagementLocation.baseLocation : null,
    startDate: getStartDate(roleAssignment),
    access: getGrantType(roleAssignment),
    dateSubmitted: roleAssignment.created,
    isNew: checkIsNew(roleAssignment, newRoleAssignmentList),
    hasAccess: getAccessStatus(roleAssignment),
    infoRequired: roleAssignment.attributes.infoRequired,
    infoRequiredComment: roleAssignment.attributes.infoRequiredComment,
    reviewer: roleAssignment.attributes.reviewer,
    specificAccessReason: roleAssignment.attributes.specificAccessReason,
    requestDate: roleAssignment.attributes.requestDate,
    reviewerRoleCategory: roleAssignment.attributes.reviewerRoleCategory,
    next_hearing_date: caseDetail.case_data && caseDetail.case_data.nextHearingDetails &&
      caseDetail.case_data.nextHearingDetails.hearingDateTime ? caseDetail.case_data.nextHearingDetails.hearingDateTime : null
  };
}

export function getCaseCategory(caseDetail: Case): string {
  if (caseDetail.case_data?.caseManagementCategory?.value?.label) {
    return caseDetail.case_data.caseManagementCategory.value.label;
  }
  return caseDetail.case_data && caseDetail.case_data.hmctsCaseCategory ? caseDetail.case_data.hmctsCaseCategory : '';
}

export function checkIsNew(roleAssignment: RoleAssignment, newRoleAssignmentList: RoleAssignment[]): boolean {
  if (getStartDate(roleAssignment) === 'Pending') {
    // EUI-7018 Pending returns true
    return true;
  } else if (roleAssignment.roleName === 'specific-access-denied') {
    return roleAssignment.attributes.isNew;
  }
  // Check if specific-access-granted matchs to role assignment
  return newRoleAssignmentList.some((r) => r.attributes.caseId === roleAssignment.attributes.caseId
    && r.attributes.requestedRole === roleAssignment.roleName);
}

export function getGrantType(roleAssignment: RoleAssignment) {
  if (roleAssignment.grantType === 'SPECIFIC'
    ||
    roleAssignment.roleName === 'specific-access-requested'
    ||
    roleAssignment.roleName === 'specific-access-denied') {
    return 'Specific';
  } else if (roleAssignment.grantType) {
    return roleAssignment.grantType.replace(/(\w)(\w*)/g, (g0, second, third) => {
      return second.toUpperCase() + third.toLowerCase();
    });
  }

  return roleAssignment.grantType;
}

export function getStartDate(roleAssignment: RoleAssignment): Date | string {
  if (roleAssignment.roleName === 'specific-access-requested') {
    return 'Pending';
  } else if (roleAssignment.roleName === 'specific-access-denied') {
    return 'Not authorised';
  } else if ((roleAssignment.grantType === 'SPECIFIC' || roleAssignment.grantType === 'CHALLENGED') && roleAssignment.beginTime) {
    return formatDate(new Date(roleAssignment.beginTime));
  }
  return roleAssignment.beginTime;
}

export function getEndDate(roleAssignment: RoleAssignment): Date | string {
  if (roleAssignment.roleName === 'specific-access-requested') {
    return '';
  } else if ((roleAssignment.grantType === 'SPECIFIC' || roleAssignment.grantType === 'CHALLENGED'
    || roleAssignment.roleName === 'specific-access-denied') && roleAssignment.endTime) {
    //EUI-7802: For Specific access denied the enddate is required to be displayed in the message
    return formatDate(new Date(roleAssignment.endTime));
  }
  return roleAssignment.endTime;
}

export function getAccessStatus(roleAssignment: RoleAssignment): boolean {
  // give default access because we need to block only on condition
  let accessGiven = true;
  const today = new Date();
  if (roleAssignment.roleName === 'specific-access-requested' || roleAssignment.roleName === 'specific-access-denied') {
    return false;
  } else if (roleAssignment.beginTime) {
    accessGiven = new Date(roleAssignment.beginTime) <= today;
    if (accessGiven && roleAssignment.endTime) {
      accessGiven = new Date(roleAssignment.endTime) >= today;
    }
  }
  return accessGiven;
}

export function formatDate(date: Date) {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const day = date.toLocaleString('default', { day: '2-digit' });
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.toLocaleString('default', { year: 'numeric' });
  return `${day} ${month} ${year}`;
}

export function getAccessType(roleAssignment: RoleAssignment) {
  return roleAssignment.grantType ?
    roleAssignment.grantType.replace(/\w+/g, (replacableString) => {
      return replacableString[0].toUpperCase() + replacableString.slice(1).toLowerCase();
    })
    :
    undefined;
}

export function getCaseName(caseDetail: Case): string {
  let caseName: string = '';
  if (caseDetail.case_data && caseDetail.case_data.hmctsCaseNameInternal) {
    caseName = caseDetail.case_data.hmctsCaseNameInternal;
  } else if (caseDetail.case_data && caseDetail.case_data.caseNameHmctsInternal) {
    caseName = caseDetail.case_data.caseNameHmctsInternal;
  } else {
    caseName = caseDetail.id;
  }
  return caseName;
}

export function getCaseDataFromRoleAssignments(roleAssignments: RoleAssignment[]): CaseDataType {
  const result: CaseDataType = {};
  const roleAssignmentsFiltered = roleAssignments.filter((roleAssignment) =>
    exists(roleAssignment, 'attributes.jurisdiction') &&
    exists(roleAssignment, 'attributes.caseType') &&
    exists(roleAssignment, 'attributes.caseId')
  );

  roleAssignmentsFiltered.forEach((roleAssignment) => {
    const { jurisdiction, caseType, caseId } = roleAssignment.attributes;
    if (!result[jurisdiction]) {
      result[jurisdiction] = {};
    }
    if (!result[jurisdiction][caseType]) {
      result[jurisdiction][caseType] = new Set();
    }
    result[jurisdiction][caseType].add(caseId);
  });
  return result;
}

export function getSubstantiveRoles(roleAssignments: RoleAssignment[]): RoleAssignment[] {
  return roleAssignments
    .filter((roleAssignment: RoleAssignment) => roleAssignment.attributes && roleAssignment.attributes.substantive === 'Y');
}

// Note: array type may need to be changed depending on where pagination called
export function paginate<T>(array: T[], pageNumber: number, pageSize: number): T[] {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export function removeEmptyValues(searchRequests: SearchTaskParameter[]): SearchTaskParameter[] {
  return searchRequests.filter((searchRequest: SearchTaskParameter) => searchRequest.values && searchRequest.values.length > 0);
}

export async function getTypesOfWorkByUserId(path, req: express.Request): Promise<any> {
  const headers = setHeaders(req);
  try {
    const result = await http.get(path, { headers });
    return result.data;
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function getUniqueCasesCount(caseData: RoleCaseData[]): number {
  const caseIds = caseData ? caseData.map((caseResult) => caseResult.case_id) : [];
  return new Set(caseIds).size;
}

// get service that match the searched services for the caseworker
export function getAppropriateService(searchedServices: string[], caseworkerServices: string[]): string {
  if (searchedServices?.length > 0) {
    return caseworkerServices.find((service) => searchedServices.includes(service));
  }
  return caseworkerServices[0];
}

// get location that matches the services or that has no service information
export function getAppropriateLocation(services: string[], locations: Location[]): Location {
  if (services?.length > 0) {
    services.forEach((service) => {
      return locations.find((location) => !location.services || location.services.includes(service));
    });
  }
  return locations[0];
}

export function searchAndReturnRefinedUsers(services: string[], term: string, users: CachedCaseworker[]): Caseworker[] {
  if (services) {
    // filter out the caseworkers who are of the services required
    users = users.filter((user) => services.some((service) => user.services?.includes(service)));
  }
  let filteredCaseworkers: Caseworker[] = [];
  // convert 'cached caseworkers' to caseworkers
  users.forEach((cachedCaseworker: CachedCaseworker) => {
    const thisCaseWorker: Caseworker = {
      email: cachedCaseworker.email,
      firstName: cachedCaseworker.firstName,
      idamId: cachedCaseworker.idamId,
      lastName: cachedCaseworker.lastName,
      location: getAppropriateLocation(services, cachedCaseworker.locations),
      roleCategory: cachedCaseworker.roleCategory,
      service: getAppropriateService(services, cachedCaseworker.services)
    };
    filteredCaseworkers.push(thisCaseWorker);
  });
  if (term) {
    filteredCaseworkers = filteredCaseworkers.filter((user) => {
      const name = user.firstName + ' ' + user.lastName;
      return name.toUpperCase().includes(term.toUpperCase());
    });
  }
  return filteredCaseworkers;
}
