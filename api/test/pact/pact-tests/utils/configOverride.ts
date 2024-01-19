const defaultConfig = {
  log4JConfig: {
    'appenders': {
      'out': {
        'layout': {
          'pattern': '%[%d | %p |%X{catFormatted}|%] %m%n',
          'type': 'pattern'
        },
        'type': 'stdout'
      }
    },
    'categories': {
      'default': { 'appenders': ['out'], 'level': 'info' }
    }
  },
  'maxLogLine': 80
};
export function getSearchTaskOverrides(waTaskAPiUrl) {
  return {
    'services.work_allocation.taskApi': waTaskAPiUrl,
    'waSupportedJurisdictions': 'IA',
    ...defaultConfig
  };
}

export function getWorkAllocationAPIOverrides(waTaskAPiUrl) {
  return {
    'services.work_allocation.taskApi': waTaskAPiUrl,
    ...defaultConfig
  };
}

export function getCaseworkerRefDataAPIOverrides(cwRefApiUrl) {
  return {
    'services.case.caseworkerApi': cwRefApiUrl,
    ...defaultConfig
  };
}

export function getLocationsRefDataAPIOverrides(locationRefApiUrl) {
  return {
    'services.location_api': locationRefApiUrl,
    ...defaultConfig
  };
}

export function getPrdLocationsRefDataAPIOverrides(prdLocationRefApiUrl) {
  return {
    'services.prd.locationApi': prdLocationRefApiUrl,
    ...defaultConfig
  };
}

export function getAccessManagementServiceAPIOverrides(accessManagementAPI) {
  return {
    'services.role_assignment.roleApi': accessManagementAPI,
    ...defaultConfig
  };
}

export function getJudicialRefDataAPIOverrides(judicialRefApiUrl) {
  return {
    'services.prd.judicialApi': judicialRefApiUrl,
    ...defaultConfig
  };
}

export function getCcdDataAPIOverrides(ccdDataApiUrl) {
  return {
    'services.ccd.dataApi': ccdDataApiUrl,
    ...defaultConfig
  };
}

export function getNocAPIOverrides(nocAPiUrl) {
  return {
    'services.ccd.caseAssignmentApi': nocAPiUrl,
    'waSupportedJurisdictions': 'IA',
    ...defaultConfig
  };
}

export function getHearingsAPIOverrides(hearingsRefApiUrl: string) {
  return {
    'services.hearings.hmcApi': hearingsRefApiUrl,
    ...defaultConfig
  };
}

export function getRdCommonDataAPIOverrides(rdCommonDataApiUrl) {
  return {
    'services.prd.commondataApi': rdCommonDataApiUrl,
    ...defaultConfig
  };
}

export function getAccessManagementRoleMappingServiceAPIOverrides(accessManagementRoleMappingAPI) {
  return {
    'services.role_assignment.roleMappingApi': accessManagementRoleMappingAPI,
    ...defaultConfig
  };
}

export function getJudicialBookingAPIOverrides(judicialBookingApiUrl) {
  return {
    'services.judicialBookingApi': judicialBookingApiUrl,
    ...defaultConfig
  };
}
