import * as express from 'express';
import { getConfigValue, showFeature } from './index';
import { setupMenuConfig } from './menuConfigs/configs';
import {
  FEATURE_ACCESS_MANAGEMENT_ENABLED,
  FEATURE_OIDC_ENABLED,
  FEATURE_SUBSTANTIVE_ROLE_ENABLED,
  LAUNCH_DARKLY_CLIENT_ID,
  PROTOCOL,
  SERVICES_CCD_COMPONENT_API_PATH,
  SERVICES_IDAM_CLIENT_ID,
  SERVICES_IDAM_LOGIN_URL,
  SERVICES_IDAM_OAUTH_CALLBACK_URL,
  SERVICES_JUDICIAL_BOOKING_API_PATH,
  SERVICES_PAYMENT_RETURN_URL,
  SERVICES_WA_WORKFLOW_API_URL
} from './references';

export const router = express.Router({ mergeParams: true });

router.get('/', uiConfigurationRouter);

// as this value will only ever change from a server restart cache it so we dont have to run all the logic
// to build the config everytime a user does something to call this endpoint
let menuConfigCache;
function getHeaderConfig() {
  if (menuConfigCache){
    return menuConfigCache;
  }
  const previewID = process.env.PREVIEW_DEPLOYMENT_ID;
  const envUrl = getConfigValue(SERVICES_IDAM_LOGIN_URL);
  const aatConfigEnvs = ['.aat.', '.demo.', '.perftest.', '.ithc.'];
  const environment = previewID ? 'preview' :
    aatConfigEnvs.some((substring) => envUrl.includes(substring)) ? 'aat' : 'prod';
  const menuConfig = setupMenuConfig(environment);
  menuConfigCache = menuConfig;
  return menuConfig;
}

/**
 * UI Configuration Route
 *
 * The following environmental variables are passed to the UI.
 *
 * Note that we do not pass the whole appConfiguration to the UI,
 * we only pass what's needed to be precise.
 */
async function uiConfigurationRouter(req, res) {
  res.status(200).send({
    accessManagementEnabled: showFeature(FEATURE_ACCESS_MANAGEMENT_ENABLED),
    ccdGatewayUrl: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH),
    clientId: getConfigValue(SERVICES_IDAM_CLIENT_ID),
    idamWeb: getConfigValue(SERVICES_IDAM_LOGIN_URL),
    launchDarklyClientId: getConfigValue(LAUNCH_DARKLY_CLIENT_ID),
    oAuthCallback: getConfigValue(SERVICES_IDAM_OAUTH_CALLBACK_URL),
    oidcEnabled: showFeature(FEATURE_OIDC_ENABLED),
    protocol: getConfigValue(PROTOCOL),
    substantiveEnabled: showFeature(FEATURE_SUBSTANTIVE_ROLE_ENABLED),
    paymentReturnUrl: getConfigValue(SERVICES_PAYMENT_RETURN_URL),
    waWorkflowApi: getConfigValue(SERVICES_WA_WORKFLOW_API_URL),
    judicialBookingApi: getConfigValue(SERVICES_JUDICIAL_BOOKING_API_PATH),
    headerConfig: getHeaderConfig()
  });
}

export default router;
