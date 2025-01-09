/**
 * References to the configuration properties and their values contained with
 * the /config .json files.
 *
 * We store reference on how to extract the value from the .json data structure here.
 *
 * They are reference strings and therefore need to be testable.
 *
 * This file should be representative of the .json files in the root /config folder
 */
export const S2S_SECRET = 'secrets.rpx.mc-s2s-client-secret';
export const REDIS_CLOUD_URL = 'secrets.rpx.webapp-redis-connection-string';
export const APP_INSIGHTS_KEY = 'secrets.rpx.appinsights-instrumentationkey-mc';
export const APP_INSIGHTS_CONNECTION_STRING = 'secrets.rpx.appinsights-connection-string-mc';

export const LAUNCH_DARKLY_CLIENT_ID = 'secrets.rpx.launch-darkly-client-id';

export const COOKIES_TOKEN = 'cookies.token';
export const COOKIES_USER_ID = 'cookies.userId';
export const COOKIES_SESSION_ID = 'cookies.sessionId';
export const COOKIE_ROLES = 'cookies.roles';

export const STUB = 'stub';
export const LOGGING = 'logging';
export const MAX_LOG_LINE = 'maxLogLine';
export const HEALTH = 'health';

export const SERVICES_CCD_COMPONENT_API_PATH = 'services.ccd.componentApi';
export const SERVICES_CCD_ACTIVITY_API_PATH = 'services.ccd.activityApi';
export const SERVICES_CCD_DATA_STORE_API_PATH = 'services.ccd.dataApi';
export const SERVICES_CCD_CASE_ASSIGNMENT_API_PATH = 'services.ccd.caseAssignmentApi';
export const SERVICES_WORK_ALLOCATION_TASK_API_PATH = 'services.work_allocation.taskApi';
export const SERVICES_ROLE_ASSIGNMENT_API_PATH = 'services.role_assignment.roleApi';
export const SERVICES_ROLE_ASSIGNMENT_MAPPING_API_PATH = 'services.role_assignment.roleMappingApi';
export const SERVICES_LAU_SPECIFIC_CHALLENGED_ACCESS_API_PATH = 'services.lau.specificChallengedAccessApi';

export const SERVICES_CASE_CASEWORKER_REF_PATH = 'services.case.caseworkerApi';
export const SERVICES_CASE_JUDICIALWORKER_REF_PATH = 'services.case.judicialworkerApi';
export const SERVICES_CASE_JUDICIAL_REF_PATH = 'services.case.judicialApi';
export const SERVICES_LOCATION_API_PATH = 'services.location_api';

export const SERVICES_JUDICIAL_BOOKING_API_PATH = 'services.judicialBookingApi';

export const SERVICES_HEARINGS_COMPONENT_API = 'services.hearings.serviceApi';
export const SERVICES_HMC_HEARINGS_COMPONENT_API = 'services.hearings.hmcApi';

export const SERVICES_DOCUMENTS_API_PATH = 'services.documents.api';
export const SERVICES_DOCUMENTS_API_PATH_V2 = 'services.documentsv2.api';
export const SERVICES_EM_HRS_API_PATH = 'services.em_hrs_api';
export const SERVICES_EM_ANNO_API_URL = 'services.em_anno_api';
export const SERVICES_WA_WORKFLOW_API_URL = 'services.waWorkflowApi';
export const SERVICES_EM_DOCASSEMBLY_API_URL = 'services.em_docassembly_api';
export const SERVICES_MARKUP_API_URL = 'services.markup_api';
export const SERVICES_ICP_API_URL = 'services.icp_api';

export const SERVICES_IDAM_API_URL = 'services.idam.idamApiUrl';
export const SERVICES_IDAM_CLIENT_ID = 'services.idam.idamClientID';
export const SERVICES_IDAM_LOGIN_URL = 'services.idam.idamLoginUrl';
export const SERVICES_IDAM_ISS_URL = 'services.idam.iss';
export const SERVICES_IDAM_OAUTH_CALLBACK_URL = 'services.idam.oauthCallbackUrl';

export const SERVICE_S2S_PATH = 'services.s2s';
export const SERVICES_TERMS_AND_CONDITIONS_URL = 'services.termsAndConditions';

export const SERVICES_PAYMENTS_URL = 'services.payments';

export const SERVICES_PAYMENT_RETURN_URL = 'services.payment_return_url';

export const GLOBAL_SEARCH_SERVICES = 'globalSearchServices';

export const SERVICES_PRD_API_URL = 'services.prd.api';
export const SERVICES_PRD_LOCATION_API = 'services.prd.locationApi';
export const SERVICES_PRD_JUDICIAL_API = 'services.prd.judicialApi';
export const SERVICES_PRD_COMMONDATA_API = 'services.prd.commondataApi';

export const SERVICES_REFUNDS_API_URL = 'services.refunds';
export const SERVICES_NOTIFICATIONS_API_URL = 'services.notifications';
export const SERVICES_LOCATION_REF_API_URL = 'services.locationref.api';

export const SERVICES_TRANSLATION_API_URL = 'services.translation';

export const PROTOCOL = 'protocol';
export const MICROSERVICE = 'microservice';
export const NOW = 'now';

export const SESSION_SECRET = 'sessionSecret';

export const ENVIRONMENT = 'environment';

export const CASEWORKER_PAGE_SIZE = 'caseworkerPageSize';

export const JURISDICTIONS = 'jurisdictions';

export const WA_SUPPORTED_JURISDICTIONS = 'waSupportedJurisdictions';

export const STAFF_SUPPORTED_JURISDICTIONS = 'staffSupportedJurisdictions';

export const HEARINGS_SUPPORTED_JURISDICTIONS = 'services.hearings.hearingsJurisdictions';

export const SERVICE_REF_DATA_MAPPING = 'serviceRefDataMapping';

export const WILDCARD_SEARCH_FIELDS = 'wildcardSearchFields';

export const WILDCARD_SEARCH_ROLES = 'wildcardSearchRoles';

export const IDAM_SECRET = 'secrets.rpx.mc-idam-client-secret';

export const SYSTEM_USER_NAME = 'secrets.rpx.system-user-name';

export const SYSTEM_USER_PASSWORD = 'secrets.rpx.system-user-password';

export const LOGIN_ROLE_MATCHER = 'loginRoleMatcher';

export const LOG4_J_CONFIG = 'log4JConfig';

export const FEATURE_SECURE_COOKIE_ENABLED = 'secureCookieEnabled';
export const FEATURE_APP_INSIGHTS_ENABLED = 'appInsightsEnabled';
export const FEATURE_PROXY_ENABLED = 'proxyEnabled';
export const FEATURE_TERMS_AND_CONDITIONS_ENABLED = 'termsAndConditionsEnabled';
export const FEATURE_HELMET_ENABLED = 'helmetEnabled';
export const FEATURE_REDIS_ENABLED = 'redisEnabled';
export const FEATURE_OIDC_ENABLED = 'oidcEnabled';
export const FEATURE_SUBSTANTIVE_ROLE_ENABLED = 'substantiveRoleEnabled';
export const FEATURE_ACCESS_MANAGEMENT_ENABLED = 'accessManagementEnabled';
export const FEATURE_COMPRESSION_ENABLED = 'compressionEnabled';

export const FEATURE_WORKALLOCATION_ENABLED = 'workAllocationEnabled';

export const FEATURE_JRD_E_LINKS_V2_ENABLED = 'jrdELinksV2Enabled';

export const FEATURE_LAU_SPECIFIC_CHALLENGED_ENABLED = 'lauSpecificChallengedEnabled';

export const HELMET = 'helmet';

export const REDIS_KEY_PREFIX = 'redis.prefix';
export const REDIS_TTL = 'redis.ttl';

export const USER_TIMEOUT_IN_SECONDS = 'userTimeoutInSeconds';

export const CASE_SHARE_PERMISSIONS = 'pui-case-manager';

export const SESSION_TIMEOUTS = 'sessionTimeouts';

// PACT
export const PACT_BROKER_URL = 'pact.brokerUrl';
export const PACT_BRANCH_NAME = 'pact.branchName';
export const PACT_CONSUMER_VERSION = 'pact.consumerVersion';
export const PACT_BROKER_USERNAME = 'pact.brokerUsername';
export const PACT_BROKER_PASSWORD = 'pact.brokerPassword';
