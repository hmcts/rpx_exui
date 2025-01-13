import { NextFunction, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_LOCATION_REF_API_URL, WA_SUPPORTED_JURISDICTIONS } from '../configuration/references';
import { DetailedService } from '../interfaces/detailedService';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { setHeaders } from '../lib/proxy';
import { RefDataHMCTSService } from '../ref-data/models/ref-data-hmcts-service.model';
import { toTitleCase } from '../utils';

const baseLocationRefUrl = getConfigValue(SERVICES_LOCATION_REF_API_URL);

// Used for all work - could be used for all in future?
export async function getDetailedWASupportedJurisdictions(req: EnhancedRequest, res: Response, next: NextFunction): Promise<any> {
  const apiPath = `${baseLocationRefUrl}/refdata/location/orgServices`;
  try {
    const response = await http.get(`${apiPath}`, { headers: setHeaders(req) });

    const services: any = generateServices(response.data);
    res.send(services).status(200);
  } catch (error) {
    next(error);
  }
}

// used for angular layer (just list of services per config)
export async function getWASupportedJurisdictions(req: EnhancedRequest, res: Response, next: NextFunction): Promise<any> {
  try {
    const jurisdictions = getConfigValue(WA_SUPPORTED_JURISDICTIONS);
    const jurisdictionsArray = jurisdictions.split(',');
    res.send(jurisdictionsArray).status(200);
  } catch (error) {
    next(error);
  }
}

// Only used within node layer
export function getWASupportedJurisdictionsList(): any {
  try {
    const jurisdictions = getConfigValue(WA_SUPPORTED_JURISDICTIONS);
    const jurisdictionsArray = jurisdictions.split(',');
    return jurisdictionsArray;
  } catch (error) {
    console.log(error);
  }
}

// Note: separate from global search services currently
// This is to allow more customisation - general generate services within utils
export function generateServices(refDataHMCTS: RefDataHMCTSService[]): DetailedService[] {
  const jurisdictions = getConfigValue(WA_SUPPORTED_JURISDICTIONS);
  const jurisdictionsArray = jurisdictions.split(',');
  const waSupportedServices: DetailedService[] = [];
  jurisdictionsArray.forEach((serviceId) => {
    // search for the service name based on the supported jursdiction
    const jurisdiction = refDataHMCTS?.length > 0 ? refDataHMCTS.filter((x) => x.ccd_service_name?.toLowerCase() === serviceId.toLowerCase()) : null;
    if (jurisdiction) {
      // handle Civil service which has different service_short_description
      if (jurisdiction.length > 1) {
        waSupportedServices.push({ serviceId: jurisdiction[0].ccd_service_name, serviceName: toTitleCase(jurisdiction[0].ccd_service_name) });
      } else {
        waSupportedServices.push({ serviceId: jurisdiction[0].ccd_service_name, serviceName: jurisdiction[0].service_short_description });
      }
    } else {
      waSupportedServices.push({ serviceId, serviceName: serviceId });
    }
  });

  return waSupportedServices;
}

export const router = Router({ mergeParams: true });

router.get('/detail', getDetailedWASupportedJurisdictions);
router.get('/get', getWASupportedJurisdictions);

export default router;
