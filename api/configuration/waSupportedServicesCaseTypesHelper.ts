import { getConfigValue } from '../configuration';
import * as log4jui from '../lib/log4jui';
import { JUILogger } from '../lib/models';
const logger: JUILogger = log4jui.getLogger('workallocation');

export interface ServiceConfig {
  serviceName: string;
  caseTypes: string[];
  releaseVersion: string;
}

export interface WAFeatureConfig {
  configurations?: ServiceConfig[];
}

export function getFormattedSupportedServicesCaseTypes(waSupportedServices: string): WAFeatureConfig {
  try {
    if (waSupportedServices) {
      const formattedWAFeatureConfig: WAFeatureConfig = { configurations: [] };
      waSupportedServices.split(',').forEach((service) => {
        const caseTypes = getConfigValue(`waSupportedServiceandCaseTypes.${service}.caseTypes`);
        const releaseVersion = getConfigValue(`waSupportedServiceandCaseTypes.${service}.releaseVersion`);
        const serviceConfig: ServiceConfig = {
          caseTypes: caseTypes.split(','),
          releaseVersion,
          serviceName: service
        };
        serviceConfig.caseTypes = caseTypes.split(',');
        serviceConfig.releaseVersion = releaseVersion;
        serviceConfig.serviceName = service;
        formattedWAFeatureConfig.configurations.push(serviceConfig);
      });
      return formattedWAFeatureConfig;
    }
    return null;
  } catch (error) {
    logger.error('Error in formatting the supported service and case types - ', error);
    return null;
  }
}
