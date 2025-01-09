import { RoleCategory } from '@hmcts/rpx-xui-common-lib';
import { initialMockState } from '../role-access/testing/app-initial-state.mock';
import { AppUtils } from './app-utils';
import { AppConstants, LEGAL_OPS_ROLE_LIST } from './app.constants';
import { Theme } from './models/theme.model';
import { NavigationItem } from './models/theming.model';
import { UserDetails, UserRole } from './models/user-details.model';

describe('getEnvironment', () => {
  it('should return the prod environment for a blank url.', () => {
    expect(AppUtils.getEnvironment('')).toEqual(AppConstants.ENVIRONMENT_NAMES.prod);
  });

  it('should return the aat environment for a aat url.', () => {
    expect(AppUtils.getEnvironment('https://xui-webapp-aat.service.core-compute-aat.internal')).toEqual(
      AppConstants.ENVIRONMENT_NAMES.aat);
  });

  it('should return the aat environment for a localhost url.', () => {
    expect(AppUtils.getEnvironment('https://localhost:3000')).toEqual(
      AppConstants.ENVIRONMENT_NAMES.aat);
  });

  it('should return the aat environment for a PR url.', () => {
    expect(AppUtils.getEnvironment('https://xui-mo-webapp-pr-84.preview.platform.hmcts.net')).toEqual(
      AppConstants.ENVIRONMENT_NAMES.aat);
  });

  it('should return the demo environment for a demo url.', () => {
    expect(AppUtils.getEnvironment('https://xui-mo-webapp-demo.service.core-compute-demo.internal')).toEqual(
      AppConstants.ENVIRONMENT_NAMES.demo);
  });

  it('should return the ithc environment for a ithc url.', () => {
    expect(AppUtils.getEnvironment('ithc')).toEqual(
      AppConstants.ENVIRONMENT_NAMES.ithc);
  });

  it('should return the perftest environment for a perftest url.', () => {
    expect(AppUtils.getEnvironment('perftest')).toEqual(
      AppConstants.ENVIRONMENT_NAMES.perftest);
  });
});

describe('showNavItems', () => {
  it('should show only appropriate navigation items', () => {
    expect(AppUtils.showNavItems('SomeItems')).toEqual(true);
    expect(AppUtils.showNavItems('accept-terms-and-conditions')).toEqual(false);
  });
});

describe('removeJsonPrefix', () => {
  it('should take in the User Roles string from cookie and return the string without the j: prefix.', () => {
    const userRolesString = 'j:["pui-organisation-manager","caseworker-publiclaw",' +
      '"caseworker-divorce-financialremedy-solicitor","caseworker"]';

    const expectedUserRolesString = userRolesString.replace('j:', '');

    expect(AppUtils.removeJsonPrefix(userRolesString)).toEqual(expectedUserRolesString);
  });
});

describe('getCookieRolesAsArray', () => {
  it('should take in the User Roles string (which comes from the cookie), and return an Array of User Roles.', () => {
    const userRoles = '["pui-organisation-manager","caseworker-publiclaw",' +
      '"caseworker-divorce-financialremedy-solicitor","caseworker"]';

    expect(AppUtils.getCookieRolesAsArray(userRoles)).toEqual([
      'pui-organisation-manager',
      'caseworker-publiclaw',
      'caseworker-divorce-financialremedy-solicitor',
      'caseworker'
    ]);
  });
});

describe('setActiveLink', () => {
  it('should correctly flag an item as being active', () => {
    const ITEMS: NavigationItem[] = [
      { href: '/a', active: false, text: 'A' },
      { href: '/b', active: false, text: 'B' },
      { href: '/c', active: false, text: 'C' }
    ];
    const CURRENT_URL: string = '/a';
    const result = AppUtils.setActiveLink(ITEMS, CURRENT_URL);
    expect(result.length).toEqual(ITEMS.length);
    expect(result[0].active).toEqual(true);
    expect(result[1].active).toEqual(false);
    expect(result[2].active).toEqual(false);

    // Also check that it hasn't impacted our original ITEMS.
    expect(ITEMS[0].active).toEqual(false);
  });

  it('should correctly deactivate a previously active item', () => {
    const ITEMS: NavigationItem[] = [
      { href: '/a', active: true, text: 'A' },
      { href: '/b', active: false, text: 'B' },
      { href: '/c', active: false, text: 'C' }
    ];
    const CURRENT_URL: string = '/b';
    const result = AppUtils.setActiveLink(ITEMS, CURRENT_URL);
    expect(result.length).toEqual(ITEMS.length);
    expect(result[0].active).toEqual(false);
    expect(result[1].active).toEqual(true);
    expect(result[2].active).toEqual(false);

    // Also check that it hasn't impacted our original ITEMS.
    expect(ITEMS[0].active).toEqual(true);
    expect(ITEMS[1].active).toEqual(false);
  });

  it('should correctly deactivate all items when the URL matches none of them', () => {
    const ITEMS: NavigationItem[] = [
      { href: '/a', active: true, text: 'A' },
      { href: '/b', active: false, text: 'B' },
      { href: '/c', active: false, text: 'C' }
    ];
    const CURRENT_URL: string = '/d';
    const result = AppUtils.setActiveLink(ITEMS, CURRENT_URL);
    expect(result.length).toEqual(ITEMS.length);
    expect(result[0].active).toEqual(false);
    expect(result[1].active).toEqual(false);
    expect(result[2].active).toEqual(false);

    // Also check that it hasn't impacted our original ITEMS.
    expect(ITEMS[0].active).toEqual(true);
  });

  it('add padding', () => {
    expect(AppUtils.pad('1')).toEqual('01');
    expect(AppUtils.pad('1', 3)).toEqual('001');
  });

  const mockItems: NavigationItem[] = [
    // fill with actual mock data
    { href: '/tasks', active: false, text: 'A' },
    { href: '/tasks/task-manager', active: false, text: 'B' },
    { href: '/cases', active: false, text: 'C' },
    { href: '/cases/case-filter', active: false, text: 'D' }
  ];

  it('should check the tabs correctly', () => {
    // verify matching url returns true
    expect(AppUtils.checkTabs(mockItems, '/tasks/task-manager')).toEqual([true, '']);
    // verify matching url given as longest matching href
    expect(AppUtils.checkTabs(mockItems, '/tasks/task-manager/random-parameter')).toEqual([false, '/tasks/task-manager']);
    // verify case-search returns true
    expect(AppUtils.checkTabs(mockItems, '/cases/case-search')).toEqual([true, '']);
    // verify tasks matches (should this ever be the case)
    expect(AppUtils.checkTabs(mockItems, '/tasks')).toEqual([true, '']);
    // verify the internal task lists set the tab correctly
    expect(AppUtils.checkTabs(mockItems, '/tasks/list')).toEqual([false, '/tasks']);
    expect(AppUtils.checkTabs(mockItems, '/tasks/available')).toEqual([false, '/tasks']);
    // verify tab not set for action page within tasks and any additional url snippet for cases
    expect(AppUtils.checkTabs(mockItems, '/tasks/assign')).toEqual([false, '']);
    expect(AppUtils.checkTabs(mockItems, '/cases/random-parameter')).toEqual([false, '']);
  });

  it('should correctly set the fullUrl value', () => {
    // note: mockItems[0].href = '/tasks'
    expect(AppUtils.isFullUrl(mockItems[0].href, '/tasks')).toBeTruthy();
    expect(AppUtils.isFullUrl(mockItems[0].href, '/tasks/task-manager')).toBeFalsy();
    expect(AppUtils.isFullUrl(mockItems[0].href, '/cases/case-search')).toBeTruthy();
    expect(AppUtils.isFullUrl(mockItems[0].href, '/task')).toBeFalsy();
  });
});

describe('getFeatureToggledUrl', () => {
  it('url when feature is off', () => {
    const url = AppUtils.getFeatureToggledUrl(false, 'someUrl');
    expect(url).toBeNull();
  });

  it('url when feature is on', () => {
    const url = AppUtils.getFeatureToggledUrl(true, 'someUrl');
    expect(url).toEqual('someUrl');
  });
});

describe('getUserRole', () => {
  it('should return legal ops role if user has any legal ops role', () => {
    const roleCategory = AppUtils.getUserRole(['caseworker-ia-caseofficer']);
    expect(roleCategory).toBe(UserRole.LegalOps);
  });

  it('should return Judicial', () => {
    const roleCategory = AppUtils.getUserRole(['caseworker',
      'caseworker-civil',
      'caseworker-civil-judge',
      'caseworker-cmc',
      'caseworker-cmc-judge',
      'caseworker-divorce',
      'caseworker-divorce-financialremedy',
      'caseworker-divorce-financialremedy-judiciary',
      'caseworker-publiclaw',
      'caseworker-publiclaw-judiciary',
      'judiciary']);
    expect(roleCategory).toBe(UserRole.Judicial);
  });

  it('should return judicial role if user has any judicial role', () => {
    const roleCategory = AppUtils.getUserRole(['caseworker-ia-iacjudge']);
    expect(roleCategory).toBe(UserRole.Judicial);
  });

  it('should return null if user has no judicial or legal ops role', () => {
    const roleCategory = AppUtils.getUserRole(['caseworker']);
    expect(roleCategory).toBeNull();
  });

  it('should return legal ops role if user is an task supervisor', () => {
    const roleCategory = AppUtils.getUserRole(['task-supervisor']);
    expect(roleCategory).toBe('legalops');
  });

  it('should return legal ops role if user is an caseworker-ia', () => {
    const roleCategory = AppUtils.getUserRole(['caseworker-ia']);
    expect(roleCategory).toBe('legalops');
  });

  it('should return legal ops role if user is an caseworker-ia-admofficer', () => {
    const roleCategory = AppUtils.getUserRole(['caseworker-ia-admofficer']);
    expect(roleCategory).toBe('legalops');
  });

  it('should return the judicial domain from the user list', () => {
    const role = AppUtils.convertDomainToLabel(UserRole.Judicial);
    expect(role).toBe('Judicial');
  });

  it('should return the legal ops domain from the user list', () => {
    const role = AppUtils.convertDomainToLabel(UserRole.LegalOps);
    expect(role).toBe('Legal Ops');
  });

  it('should return the admin domain from the user list', () => {
    const role = AppUtils.convertDomainToLabel(UserRole.Admin);
    expect(role).toBe('Admin');
  });

  it('should return the CTSC domain from the user list', () => {
    const role = AppUtils.convertDomainToLabel(UserRole.Ctsc);
    expect(role).toBe('CTSC');
  });
});

describe('setThemeBasedOnUserType', () => {
  it('Judicial User', () => {
    const theme = { appTitle: {} } as Theme;
    AppUtils.setThemeBasedOnUserType('Judicial', theme);
    expect(theme.appTitle.name).toEqual('Judicial Case Manager');
    expect(theme.backgroundColor).toEqual('#8d0f0e');
    expect(theme.logo).toEqual('judicial');
  });

  it('LegalOps User', () => {
    const theme = { appTitle: {} } as Theme;
    AppUtils.setThemeBasedOnUserType('LegalOps', theme);
    expect(theme.appTitle.name).toEqual('Manage cases');
    expect(theme.backgroundColor).toEqual('#202020');
    expect(theme.logo).toEqual('');
  });

  it('Solicitor User', () => {
    const theme = { appTitle: {} } as Theme;
    AppUtils.setThemeBasedOnUserType('Solicitor', theme);
    expect(theme.appTitle.name).toEqual('Manage cases');
    expect(theme.backgroundColor).toEqual('#202020');
    expect(theme.logo).toEqual('myhmcts');
  });
});

describe('getUserType', () => {
  it('Solicitor', () => {
    const userRole = { solicitor: ['role1'] };
    const userType = AppUtils.getUserType(['role1', 'role3'], userRole);
    expect(userType).toEqual('Solicitor');
  });

  it('Judicial', () => {
    const userRole = { judicial: ['role1'] };
    const userType = AppUtils.getUserType(['role1', 'role3'], userRole);
    expect(userType).toEqual('Judicial');
  });

  it('LegalOps', () => {
    const userRole = { legalOps: ['role1'] };
    const userType = AppUtils.getUserType(['role1', 'role3'], userRole);
    expect(userType).toEqual('LegalOps');
  });
});

describe('getFilterPersistenceByRoleType', () => {
  it('should return local persistence if user is a judicial user', () => {
    const persistence = AppUtils.getFilterPersistenceByRoleType(initialMockState.appConfig.userDetails);
    expect(persistence).toEqual('local');
  });

  it('should return local persistence if user is a legalOps user', () => {
    const userDetails = initialMockState.appConfig.userDetails;
    userDetails.userInfo.roles = LEGAL_OPS_ROLE_LIST;
    const persistence = AppUtils.getFilterPersistenceByRoleType(userDetails);
    expect(persistence).toEqual('session');
  });

  describe('isBookableAndJudicialRole', () => {
    it('should set true/false base on the user details', () => {
      const USER_2: UserDetails = {
        canShareCases: true,
        roleAssignmentInfo: [{
          bookable: true,
          baseLocation: 'Glasgow',
          jurisdiction: 'IA',
          isCaseAllocator: true
        }],
        sessionTimeout: {
          idleModalDisplayTime: 10,
          totalIdleTime: 50
        },
        userInfo: {
          id: '41a90c39-d756-4eba-8e85-5b5bf56b31f5',
          forename: 'Luke',
          surname: 'Wilson',
          email: 'lukesuperuserxui@mailnesia.com',
          roleCategory: RoleCategory.JUDICIAL,
          active: true,
          roles: [
            'caseworker',
            'caseworker-sscs-judge',
            'fee-paid-judge'
          ]
        }
      };

      expect(AppUtils.isBookableAndJudicialRole(USER_2)).toBe(true);
      USER_2.roleAssignmentInfo[0].bookable = 'true';
      expect(AppUtils.isBookableAndJudicialRole(USER_2)).toBe(true);
      USER_2.roleAssignmentInfo[0].bookable = false;
      expect(AppUtils.isBookableAndJudicialRole(USER_2)).toBe(false);
      USER_2.userInfo.roleCategory = RoleCategory.CASEWORKER;
      expect(AppUtils.isBookableAndJudicialRole(USER_2)).toBe(false);
    });
  });

  describe('Date Checks', () => {
    it('isPriorityDateTimePast works', () => {
      let result = AppUtils.isPriorityDateTimePast(new Date(2023, 1, 1, 1, 1, 1), new Date(2023, 3, 10));
      expect(result).toBeTruthy();
      result = AppUtils.isPriorityDateTimePast(new Date(2023, 1, 1, 1, 1, 0), new Date(2023, 1, 1));
      expect(result).toBeFalsy();
    });
    it('isPriorityDateTimeInNext24Hours works', () => {
      const dateTime = new Date(2023, 1, 1, 12, 0, 0);
      const currentTime = new Date(2023, 1, 1, 10, 0, 0);
      const result = AppUtils.isPriorityDateTimeInNext24Hours(dateTime, currentTime);
      expect(result).toBeTruthy();
    });
    it('isPriorityDateTimeInNext24Hours returns true', () => {
      const dateTime = new Date(2023, 1, 1, 16, 0, 0);
      const currentTime = new Date(2023, 1, 1, 12, 0, 0);
      const result = AppUtils.isPriorityDateTimeInNext24Hours(dateTime, currentTime);
      expect(result).toBeTruthy();
    });
    it('isPriorityDateTimeInNext24Hours returns false', () => {
      const dateTime = new Date(2023, 1, 1, 12, 0, 0);
      const currentTime = new Date(2023, 1, 2, 11, 0, 59);
      const result = AppUtils.isPriorityDateTimeInNext24Hours(dateTime, currentTime);
      expect(result).toBeFalsy();
    });
  });
});
