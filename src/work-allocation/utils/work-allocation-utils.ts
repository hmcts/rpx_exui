import { NavigationExtras } from '@angular/router';
import { PersonRole } from '@hmcts/rpx-xui-common-lib';
import { UserInfo, UserRole } from '../../app/models';
import { RoleCategory } from '../../role-access/models';
import { OptionsModel } from '../../role-access/models/options-model';
import { ISessionStorageService } from '../interfaces/common';
import { Caseworker, CaseworkersByService, LocationsByRegion, LocationsByService } from '../models/dtos';
import { TaskPermission, TaskRole } from '../models/tasks';

interface Navigator {
  url: string;
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean>;
}

export interface FatalRedirect {
  status: number;
  redirectTo: string;
}

export enum REDIRECTS {
  NotAuthorised = '/not-authorised',
  ServiceDown = '/service-down'
}

export const WILDCARD_SERVICE_DOWN: FatalRedirect[] = [
  { status: 0, redirectTo: REDIRECTS.ServiceDown }
];

export const treatAsFatal = (status: number, navigator: Navigator, fatals: FatalRedirect[]): number => {
  if (fatals && fatals.length > 0) {
    const fatal = fatals.find((f) => f.status === status);
    if (fatal) {
      navigator.navigate([fatal.redirectTo]);
      return 0;
    }

    const wildcardFatal = fatals.find((f) => f.status === 0);
    if (wildcardFatal) {
      navigator.navigate([wildcardFatal.redirectTo]);
      return 0;
    }
  }
  return status;
};

export const handleFatalErrors = (status: number, navigator: Navigator, fatals?: FatalRedirect[]): number => {
  switch (status) {
    case 401:
    case 403:
      navigator.navigate([REDIRECTS.NotAuthorised]);
      return 0; // 0 indicates it has been handled.
    case 500:
    case 503:
      navigator.navigate([REDIRECTS.ServiceDown]);
      return 0; // 0 indicates it has been handled.
    case 400:
      navigator.navigate([REDIRECTS.ServiceDown]);
      return 400;
    default:
      // If it's anything other than a 400, 401, 403, 500, or 503, we should not
      // send the User to an error page. This should be handled within
      // the component so just return the status.

      // However, if they've specified that other errors should be treated
      // as fatal, we should handle that.
      return treatAsFatal(status, navigator, fatals);
  }
};

export const handleTasksFatalErrors = (status: number, navigator: Navigator, fatals?: FatalRedirect[], returnUrl?: string): number => {
  switch (status) {
    case 401:
    case 403:
      if (returnUrl) {
        // For certain conditions, we have to navigate to a different error page
        // if the selected person is not authorised to perform the task
        const destinationUrl = getDestinationUrl(navigator.url);
        navigator.navigate([destinationUrl], { state: { returnUrl } });
      } else {
        navigator.navigate([REDIRECTS.NotAuthorised]);
      }
      return 0; // 0 indicates it has been handled.
    case 500:
    case 503:
      navigator.navigate([REDIRECTS.ServiceDown]);
      return 0; // 0 indicates it has been handled.
    case 400:
      return 400;
    default:
      // If it's anything other than a 400, 401, 403, 500, or 503, we should not
      // send the User to an error page. This should be handled within
      // the component so just return the status.

      // However, if they've specified that other errors should be treated
      // as fatal, we should handle that.
      return treatAsFatal(status, navigator, fatals);
  }
};

export const getAllCaseworkersFromServices = (caseworkersByService: CaseworkersByService[]): Caseworker[] => {
  let allCaseworkers: Caseworker[] = [];
  caseworkersByService.forEach((caseworkerListByService) => {
    allCaseworkers = allCaseworkers.concat(caseworkerListByService.caseworkers);
  });
  return allCaseworkers;
};

export const getCaseworkerSessionStorageKeyForServiceId = (serviceId: string): string => {
  return `${serviceId}-caseworkers`;
};

export const getCaseworkers = (serviceId: string, sessionStorageService: ISessionStorageService): Caseworker[] => {
  const sessionKey = getCaseworkerSessionStorageKeyForServiceId(serviceId);
  const value = sessionStorageService.getItem(sessionKey);
  if (value) {
    return JSON.parse(value) as Caseworker[];
  }
};

export const setCaseworkers = (serviceId: string, caseworkers: Caseworker[], sessionStorageService: ISessionStorageService): void => {
  const sessionKey = getCaseworkerSessionStorageKeyForServiceId(serviceId);
  sessionStorageService.setItem(sessionKey, JSON.stringify(caseworkers));
};

export const getAssigneeName = (caseworkers: any[], assignee: string): string => {
  if (assignee && caseworkers && caseworkers.some((cw) => cw.idamId === assignee)) {
    const assignedCW = caseworkers.filter((cw) => cw.idamId === assignee)[0];
    return `${assignedCW.firstName} ${assignedCW.lastName}`;
  }
  return null;
};

export const servicesMap: { [key: string]: string } = {
  IA: 'Immigration and Asylum',
  SSCS: 'Social security and child support',
  CIVIL: 'Civil',
  PRIVATELAW: 'Private Law',
  PUBLICLAW: 'Public Law',
  EMPLOYMENT: 'Employment'
};

export function getOptions(taskRoles: TaskRole[], sessionStorageService: ISessionStorageService): OptionsModel[] {
  const options = new Array<OptionsModel>();
  // Consider role categories only with either OWN or EXECUTE permissions
  const roleCategories = taskRoles.filter((role) => role.role_category
    && (roleIncludes(role.permissions, TaskPermission.OWN) || roleIncludes(role.permissions, TaskPermission.EXECUTE))).
    map((taskRole) => taskRole.role_category as RoleCategory);

  // Decide the category to be selected by default
  const roleCategoryToSelectByDefault = getRoleCategoryToBeSelectedByDefault(taskRoles, sessionStorageService);
  roleCategories.forEach((roleCategory) => {
    if (!options.find((option) => option.optionId === roleCategory)) {
      let label;
      try {
        label = getLabel(roleCategory);
        // eslint-disable-next-line no-empty
      } catch (error) { }
      const option: OptionsModel = {
        optionId: roleCategory,
        optionValue: roleCategory,
        label
      };
      if (roleCategory === roleCategoryToSelectByDefault) {
        option.checked = 'checked';
      }
      if (label) {
        options.push(option);
      }
    }
  });
  return options;
}

export function getRoleCategoryToBeSelectedByDefault(taskRoles: TaskRole[], sessionStorageService: ISessionStorageService): RoleCategory {
  // Consider only role categories with OWN permission for radio button default selection
  const uniqueRoleCategoriesWithOwnPermissions = taskRoles.filter((role) => role.role_category
    && (roleIncludes(role.permissions, TaskPermission.OWN))).
    map((taskRole) => taskRole.role_category as RoleCategory).
    filter((role, index, taskRolesToFilter) => {
      return taskRolesToFilter.indexOf(role) === index;
    });

  // If more than one role category with OWN permission then use current user's role category
  return uniqueRoleCategoriesWithOwnPermissions.length === 1
    ? uniqueRoleCategoriesWithOwnPermissions[0] : getCurrentUserRoleCategory(sessionStorageService);
}

export function getLabel(roleCategory: RoleCategory): PersonRole {
  switch (roleCategory) {
    case RoleCategory.ADMIN:
      return PersonRole.ADMIN;
    case RoleCategory.JUDICIAL:
      return PersonRole.JUDICIAL;
    case RoleCategory.LEGAL_OPERATIONS:
      return PersonRole.CASEWORKER;
    case RoleCategory.CTSC:
      return PersonRole.CTSC;
    default:
      throw new Error(`Invalid roleCategory ${roleCategory}`);
  }
}

export function getRoleCategory(role: string): RoleCategory {
  if (role === PersonRole.JUDICIAL) {
    return RoleCategory.JUDICIAL;
  } else if (role === PersonRole.CASEWORKER) {
    return RoleCategory.LEGAL_OPERATIONS;
  } else if (role === PersonRole.ADMIN) {
    return RoleCategory.ADMIN;
  } else if (role === PersonRole.CTSC) {
    return RoleCategory.CTSC;
  }
  return null;
}

export function getRoleCategoryFromUserRole(role: string): RoleCategory {
  if (role === UserRole.Judicial) {
    return RoleCategory.JUDICIAL;
  } else if (role === UserRole.LegalOps) {
    return RoleCategory.LEGAL_OPERATIONS;
  } else if (role === UserRole.Admin) {
    return RoleCategory.ADMIN;
  } else if (role === UserRole.Ctsc) {
    return RoleCategory.CTSC;
  }
  return null;
}

export function roleIncludes(roles: string[], permission: string): boolean {
  let includesRole = false;
  if (roles && permission) {
    roles.forEach((role) => {
      if (role.toLocaleLowerCase() === permission.toLocaleLowerCase()) {
        includesRole = true;
      }
    });
  }
  return includesRole;
}

export function getDestinationUrl(url: string): string {
  if (url.includes('/assign/confirm')) {
    return url.replace('/assign/confirm', '/person-not-authorised');
  }

  if (url.includes('/reassign/confirm')) {
    return url.replace('/reassign/confirm', '/person-not-authorised');
  }

  return REDIRECTS.NotAuthorised;
}

export function getCurrentUserRoleCategory(sessionStorageService: ISessionStorageService): RoleCategory {
  const userInfoStr = sessionStorageService.getItem('userDetails');
  if (userInfoStr) {
    const userInfo: UserInfo = JSON.parse(userInfoStr);
    return userInfo.roleCategory as RoleCategory;
  }
  return null;
}

export function addLocationToLocationsByService(locationsByServices: LocationsByService[], location: any, service: string, allLocationServices: string[]): LocationsByService[] {
  if (allLocationServices.includes(service)) {
    // if we know that all location services includes the current service we need to ensure this is present
    return locationsByServices;
  }
  let locationsByService = locationsByServices.find((serviceLocations) => serviceLocations.service === service);
  if (!locationsByService) {
    // check to ensure that if service present with null location (i.e. a base location not within region), we register this
    !location.id && !location.regionId ? locationsByServices.push({ service, locations: [] }) : locationsByServices.push({ service, locations: [location] });
  } else {
    const finalDataWithoutService = locationsByServices.filter((serviceLocations) => serviceLocations.service !== service);
    // Need this to keep bookable attribute as true even if there is a non-bookable role on the same service
    locationsByService = { service, locations: locationsByService.locations.concat([location]) };
    locationsByServices = finalDataWithoutService.concat([locationsByService]);
  }
  return locationsByServices;
}

export function locationWithinRegion(regionLocations: LocationsByRegion[], region: string, location: string): boolean {
  let withinRegion = false;
  regionLocations.forEach((regionLocation) => {
    if (regionLocation.regionId === region) {
      if (regionLocation.locations.includes(location)) {
        withinRegion = true;
        return withinRegion;
      }
    }
  });
  return withinRegion;
}
