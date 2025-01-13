import { NextFunction, Response } from 'express';
import { handlePost } from '../common/crudService';
import { getConfigValue } from '../configuration';
import {
  GLOBAL_SEARCH_SERVICES,
  SERVICES_CCD_DATA_STORE_API_PATH,
  SERVICES_LOCATION_REF_API_URL
} from '../configuration/references';
import { DetailedService } from '../interfaces/detailedService';
import { EnhancedRequest } from '../lib/models';
import { RefDataHMCTSService } from '../ref-data/models/ref-data-hmcts-service.model';
import { http } from '../lib/http';
import { setHeaders } from '../lib/proxy';
import { toTitleCase } from '../utils';

/**
 * Get global search services
 * api/globalsearch/services
 */

const baseLocationRefUrl = getConfigValue(SERVICES_LOCATION_REF_API_URL);

export async function getServices(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  const apiPath = `${baseLocationRefUrl}/refdata/location/orgServices`;
  try {
    // Return global search services from session if available
    if (req.session.globalSearchServices && req.session.globalSearchServices.length !== 0) {
      return res.json(req.session.globalSearchServices);
    }

    const response = await http.get(`${apiPath}`, { headers: setHeaders(req) });

    const services: any = generateServices(response.data);

    // Store generated global search services to session
    req.session.globalSearchServices = services;

    // Return json response of generated global search services
    return res.json(services);
  } catch (error) {
    next(error);
  }
}

/**
 * Get global search results
 * api/globalsearch/results
 */
export async function getSearchResults(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const path = `${getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH)}/globalSearch`;
    const response = await handlePost(path, req.body, req, next);
    return res.status(response.status).send(response.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Generate global search services from jurisdictions and global search service ids
 * @param jurisdictions
 * @returns
 */
export function generateServices(refDataHMCTS: RefDataHMCTSService[]): DetailedService[] {
  // Retrieve global search services id from config
  const globalSearchServiceIds = getConfigValue(GLOBAL_SEARCH_SERVICES);
  const globalSearchServiceIdsArray = globalSearchServiceIds.split(',');

  // Generate global search services
  const globalSearchServices: DetailedService[] = [];
  globalSearchServiceIdsArray.forEach((serviceId) => {
    // search for the service name based on the globalSearchServiceId
    const jurisdiction = refDataHMCTS?.length > 0 ? refDataHMCTS.filter((x) => x.ccd_service_name?.toLowerCase() === serviceId.toLowerCase()) : null;
    if (jurisdiction) {
      // handle Civil service which has different service_short_description
      if (jurisdiction.length > 1) {
        globalSearchServices.push({ serviceId: jurisdiction[0].ccd_service_name, serviceName: toTitleCase(jurisdiction[0].ccd_service_name) });
      } else {
        globalSearchServices.push({ serviceId: jurisdiction[0].ccd_service_name, serviceName: jurisdiction[0].service_short_description });
      }
    } else {
      globalSearchServices.push({ serviceId, serviceName: serviceId });
    }
  });

  // Return generated global search services
  return globalSearchServices;
}
