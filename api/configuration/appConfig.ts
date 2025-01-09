import { getConfigValue, showFeature } from './index';
import {
  COOKIES_SESSION_ID,
  COOKIES_TOKEN,
  FEATURE_ACCESS_MANAGEMENT_ENABLED,
  FEATURE_APP_INSIGHTS_ENABLED,
  FEATURE_HELMET_ENABLED,
  FEATURE_JRD_E_LINKS_V2_ENABLED,
  FEATURE_OIDC_ENABLED,
  FEATURE_PROXY_ENABLED,
  FEATURE_REDIS_ENABLED,
  FEATURE_SECURE_COOKIE_ENABLED,
  FEATURE_TERMS_AND_CONDITIONS_ENABLED,
  FEATURE_WORKALLOCATION_ENABLED,
  FEATURE_LAU_SPECIFIC_CHALLENGED_ENABLED,
  HEALTH, LOGGING, MAX_LOG_LINE,
  PROTOCOL,
  SERVICES_CASE_CASEWORKER_REF_PATH,
  SERVICES_CASE_JUDICIAL_REF_PATH,
  SERVICES_CCD_CASE_ASSIGNMENT_API_PATH,
  SERVICES_CCD_COMPONENT_API_PATH,
  SERVICES_CCD_DATA_STORE_API_PATH,
  SERVICES_DOCUMENTS_API_PATH,
  SERVICES_DOCUMENTS_API_PATH_V2,
  SERVICES_EM_HRS_API_PATH,
  SERVICES_IDAM_API_URL,
  SERVICES_IDAM_CLIENT_ID,
  SERVICES_IDAM_LOGIN_URL,
  SERVICES_IDAM_OAUTH_CALLBACK_URL,
  SERVICES_JUDICIAL_BOOKING_API_PATH,
  SERVICES_LOCATION_REF_API_URL,
  SERVICES_PAYMENTS_URL,
  SERVICES_PRD_API_URL,
  SERVICES_PRD_COMMONDATA_API,
  SERVICES_PRD_JUDICIAL_API,
  SERVICES_PRD_LOCATION_API,
  SERVICES_ROLE_ASSIGNMENT_API_PATH,
  SERVICES_ROLE_ASSIGNMENT_MAPPING_API_PATH,
  SERVICES_TERMS_AND_CONDITIONS_URL, SERVICES_WORK_ALLOCATION_TASK_API_PATH,
  SERVICE_S2S_PATH,
  SERVICES_LAU_SPECIFIC_CHALLENGED_ACCESS_API_PATH
} from './references';

/**
 * Application Configuration
 *
 * Details the applications configuration.
 *
 * Note that we do not include the secrets within this object.
 *
 * @returns
 */
export const applicationConfiguration = () => {
  return {
    caseworkerRefPath: getConfigValue(SERVICES_CASE_CASEWORKER_REF_PATH),
    clientId: getConfigValue(SERVICES_IDAM_CLIENT_ID),
    cookieSessionId: getConfigValue(COOKIES_SESSION_ID),
    cookieToken: getConfigValue(COOKIES_TOKEN),
    featureAccessManagementEnabled: showFeature(FEATURE_ACCESS_MANAGEMENT_ENABLED),
    featureAppInsightsEnabled: showFeature(FEATURE_APP_INSIGHTS_ENABLED),
    featureHelmetEnabled: showFeature(FEATURE_HELMET_ENABLED),
    featureOidcEnabled: showFeature(FEATURE_OIDC_ENABLED),
    featureProxyEnabled: showFeature(FEATURE_PROXY_ENABLED),
    featureRedisEnabled: showFeature(FEATURE_REDIS_ENABLED),
    featureSecureCookieEnabled: showFeature(FEATURE_SECURE_COOKIE_ENABLED),
    featureTermsAndConditionsEnabled: showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED),
    featureWorkAllocationEnabled: showFeature(FEATURE_WORKALLOCATION_ENABLED),
    featureJrdELinksV2Enabled: showFeature(FEATURE_JRD_E_LINKS_V2_ENABLED),
    featureSpecificChallengedAccessEnabled: showFeature(FEATURE_LAU_SPECIFIC_CHALLENGED_ENABLED),
    health: getConfigValue(HEALTH),
    idamApiUrl: getConfigValue(SERVICES_IDAM_API_URL),
    idamWeb: getConfigValue(SERVICES_IDAM_LOGIN_URL),
    logging: getConfigValue(LOGGING),
    maxLogLine: getConfigValue(MAX_LOG_LINE),
    oAuthCallback: getConfigValue(SERVICES_IDAM_OAUTH_CALLBACK_URL),
    payments: getConfigValue(SERVICES_PAYMENTS_URL),
    protocol: getConfigValue(PROTOCOL),
    roleAssignmentPath: getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH),
    roleAssignmentMappingPath: getConfigValue(SERVICES_ROLE_ASSIGNMENT_MAPPING_API_PATH),
    servicesCcdCaseAssignmentPath: getConfigValue(SERVICES_CCD_CASE_ASSIGNMENT_API_PATH),
    servicesCcdComponentPath: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH),
    servicesCcdDataStorePath: getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH),
    servicesDocumentApiPath: getConfigValue(SERVICES_DOCUMENTS_API_PATH),
    servicesDocumentApiV2Path: getConfigValue(SERVICES_DOCUMENTS_API_PATH_V2),
    servicesEmHrsApiPath: getConfigValue(SERVICES_EM_HRS_API_PATH),
    servicesLocationRefApiPath: getConfigValue(SERVICES_LOCATION_REF_API_URL),
    servicesJudicialBookingApiPath: getConfigValue(SERVICES_JUDICIAL_BOOKING_API_PATH),
    servicesPrdApiPath: getConfigValue(SERVICES_PRD_API_URL),
    servicesPrdLocationApiPath: getConfigValue(SERVICES_PRD_LOCATION_API),
    servicesPrdJudicialApiPath: getConfigValue(SERVICES_PRD_JUDICIAL_API),
    servicesPrdCommondataApiPath: getConfigValue(SERVICES_PRD_COMMONDATA_API),
    servicesS2sPath: getConfigValue(SERVICE_S2S_PATH),
    servicesTermsAndConditionsPath: getConfigValue(SERVICES_TERMS_AND_CONDITIONS_URL),
    servicesSpecificChallengedAccessPath: getConfigValue(SERVICES_LAU_SPECIFIC_CHALLENGED_ACCESS_API_PATH),
    workAllocationTaskPath: getConfigValue(SERVICES_WORK_ALLOCATION_TASK_API_PATH),
    judicialApiPath: getConfigValue(SERVICES_CASE_JUDICIAL_REF_PATH)
  };
};
