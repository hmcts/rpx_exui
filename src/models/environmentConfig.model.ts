import { InjectionToken } from '@angular/core';
import { WAFeatureConfig } from '../work-allocation/models/common/service-config.model';

export const ENVIRONMENT_CONFIG = new InjectionToken<EnvironmentConfig>('environment.config');

export interface EnvironmentConfig {
  idamWeb: string;
  ccdGatewayUrl?: string;
  clientId: string;
  oAuthCallback: string;
  protocol: string;
  oidcEnabled: string;
  launchDarklyClientId?: string;
  accessManagementEnabled?: boolean;
  paymentReturnUrl: string;
  waSupportedServices?: WAFeatureConfig;
  headerConfig: object;
}
