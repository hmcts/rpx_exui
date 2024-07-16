import { BadgeColour, ContactDetailsDataModel } from '@hmcts/rpx-xui-common-lib';
import { ApplicationThemeLogo } from './enums';
import { ApplicationTheme, NavigationItem } from './models/theming.model';

const featureNames = {
  waServiceConfig: 'wa-service-config',
  waLandingPageRoles: 'wa-landing-page-roles',
  waAccess: 'wa-access',
  currentWAFeature: 'mc-work-allocation-active-feature',
  workAllocation: 'MC_Work_Allocation',
  noticeOfChange: 'MC_Notice_of_Change',
  waMvpPaginationFeature: 'mc-mvp-wa-pagination',
  userTypeRoles: 'mc-user-type-roles',
  booking: 'mc-booking-active',
  mcHearingsFeature: 'mc-hearings-jurisdictions',
  excludedRolesForCaseTabs: 'mc-excluded-roles-case-tabs',

  enableCaseFileViewVersion1_1: 'enable-case-file-view-version-1-1',
  enableHearingAmendments: 'mc-enable-hearings-amendments-service',
  enableRestrictedCaseAccess: 'enable-restricted-case-access'

};

const footerDataNavigation = {
  items: [
    { text: 'Accessibility', href: '/accessibility', target: '_blank' },
    { text: 'Terms and conditions', href: '/terms-and-conditions', target: '_blank' },
    { text: 'Cookies', href: '/cookies', target: '_blank' },
    { text: 'Privacy policy', href: '/privacy-policy', target: '_blank' },
    { text: 'Get help', href: '/get-help', target: '_blank' }
  ]
};

const defaultUserTheme: ApplicationTheme = {
  appTitle: {
    name: 'Manage Cases',
    url: '/'
  },
  backgroundColor: '#202020',
  logo: ApplicationThemeLogo.NONE
};

const defaultMenuItems: NavigationItem[] = [
  {
    active: false,
    href: '/cases',
    text: 'Case list'
  },
  {
    active: false,
    href: '/cases/case-filter',
    text: 'Create case'
  },
  {
    active: false,
    align: 'right',
    href: '/cases/case-search',
    ngClass: 'hmcts-search-toggle__button',
    text: 'Find case'
  }
];

const helpContactDetails: ContactDetailsDataModel[] = [
  {
    title: 'Probate',
    badgeColour: BadgeColour.BADGE_BLUE,
    email: 'contactprobate@justice.gov.uk',
    phone: '0300 303 0648',
    openingTimes: 'Monday to Friday, 9am to 1pm (Closed on bank holidays)'
  },
  {
    title: 'Divorce',
    badgeColour: BadgeColour.BADGE_BLUE,
    email: 'divorcecase@justice.gov.uk',
    phone: '0300 303 0642',
    openingTimes: 'Monday to Friday, 9:30am to 5pm (excluding public holidays)'
  },
  {
    title: 'Financial Remedy',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'contactfinancialremedy@justice.gov.uk',
    phone: '0300 303 0642',
    openingTimes: 'Monday to Friday, 9:30am to 5pm (excluding public holidays)'
  },
  {
    title: 'Immigration and Asylum',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'contactia@justice.gov.uk',
    phone: '0300 123 1711',
    openingTimes: 'Monday to Friday, 8:30am to 5pm (excluding public holidays)'
  },
  {
    title: 'Family Public Law',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'contactfpl@justice.gov.uk',
    phone: '0330 808 4424',
    openingTimes: 'Monday to Friday, 9am to 5pm (excluding public holidays)'
  },
  {
    title: 'Employment Tribunal',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'etreform@justice.gov.uk',
    phone: 'England and Wales: 0300 123 1024, Scotland: 0300 790 6234',
    openingTimes: 'Monday to Friday, 9am to 5pm (excluding public holidays)'
  },
  {
    title: 'SSCS (England and Wales)',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'contactsscs@justice.gov.uk',
    phone: '0300 123 1142',
    openingTimes: 'Monday to Friday, 8am to 5pm'
  },
  {
    title: 'SSCS (Scotland)',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'SSCSA-Glasgow@justice.gov.uk',
    phone: '0300 790 6234',
    openingTimes: 'Monday to Friday, 8:30am to 5pm'
  },
  {
    title: 'For damages general enquires is:',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'DamagesClaims@justice.gov.uk',
    phone: '0300 123 1372',
    openingTimes: 'Monday to Friday, 8:30am to 5pm'
  },
  {
    title: 'For damages tech support:',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'DCPTechSupport@justice.gov.uk'
  },
  {
    title: 'OCMC',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'contactocmc@justice.gov.uk',
    phone: '0300 123 7050',
    openingTimes: 'Monday to Friday, 8:30am to 5pm'
  }
];

const environmentNames = {
  aat: 'aat',
  localhost: 'localhost',
  pr: 'pr-',
  demo: 'demo',
  ithc: 'ithc',
  perftest: 'perftest',
  prod: 'prod'
};

const redirectUrl = {
  aat: 'https://idam-web-public.aat.platform.hmcts.net',
  demo: 'https://idam-web-public.demo.platform.hmcts.net',
  ithc: 'https://idam-web-public-aks.ithc.platform.hmcts.net',
  prod: 'https://hmcts-access.service.gov.uk',
  perftest: 'https://idam-web-public.perftest.platform.hmcts.net',
  localhost: 'https://idam-web-public.aat.platform.hmcts.net'
};

const appHeaderTitle = { name: 'Manage cases', url: '/' };

// Making the base URL for case details a constant.
const caseDetailsUrl: string = '/cases/case-details/';

const accessViewUrl: string = '/access-view/';

const serviceMessagesFeatureToggleKey: string = 'mc-service-messages';
const serviceMessageCookie: string = 'service_messages';

const caseAllocatorRole: string = 'case-allocator-role';

export class AppConstants {
  public static FOOTER_DATA = null;
  public static FOOTER_DATA_NAVIGATION = footerDataNavigation;
  public static APP_HEADER_TITLE = appHeaderTitle;
  public static ENVIRONMENT_NAMES = environmentNames;
  public static REDIRECT_URL = redirectUrl;
  public static HELP_CONTACT_DETAILS = helpContactDetails;
  public static DEFAULT_USER_THEME = defaultUserTheme;
  public static FEATURE_NAMES = featureNames;
  public static CASE_DETAILS_URL = caseDetailsUrl;
  public static ACCESS_VIEW_URL = accessViewUrl;
  public static SERVICE_MESSAGES_FEATURE_TOGGLE_KEY = serviceMessagesFeatureToggleKey;
  public static SERVICE_MESSAGE_COOKIE = serviceMessageCookie;
  public static CASE_ALLOCATOR_ROLE = caseAllocatorRole;
  public static DEFAULT_MENU_ITEMS = defaultMenuItems;
}

export const LD_FLAG_REMOVE_USER_FROM_CASE_MC: string = 'remove-user-from-case-mc';
export const LD_FLAG_MC_APPLICATION_THEMES: string = 'mc-application-themes';
export const LEGAL_OPS_ROLE_LIST: string[] = ['caseworker-ia-caseofficer', 'caseworker-ia', 'caseworker-ia-admofficer', 'task-supervisor', 'caseworker-civil', 'caseworker-privatelaw', 'hmcts-legal-operations'];
export const JUDICIAL_ROLE_LIST: string[] = ['caseworker-ia-iacjudge', 'caseworker-privatelaw-judge', 'judge', 'hmcts-judiciary', 'judiciary', 'panelmember'];
export const ADMIN_ROLE_LIST: string[] = ['hmcts-admin'];
export const CTSC_ROLE_LIST: string[] = ['hmcts-ctsc'];
export const SERVICE_OPTIONS_LIST = [{ key: 'IA', label: 'Immigration and Asylum' }, { key: 'SSCS', label: 'Social security and child support' }];
export const PUI_CASE_MANAGER = 'pui-case-manager';
