import { NextFunction, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { STAFF_SUPPORTED_JURISDICTIONS } from '../configuration/references';
import { EnhancedRequest } from '../lib/models';

export async function getStaffSupportedJurisdictions(req: EnhancedRequest, res: Response, next: NextFunction): Promise<any> {
  try {
    const jurisdictions = getConfigValue(STAFF_SUPPORTED_JURISDICTIONS);
    const jurisdictionsArray = jurisdictions.split(',');
    res.send(jurisdictionsArray).status(200);
  } catch (error) {
    next(error);
  }
}

export function getStaffSupportedJurisdictionsList(): any {
  try {
    const jurisdictions = getConfigValue(STAFF_SUPPORTED_JURISDICTIONS);
    const jurisdictionsArray = jurisdictions.split(',');
    return jurisdictionsArray;
  } catch (error) {
    console.log(error);
  }
}

export const router = Router({ mergeParams: true });

router.get('/get', getStaffSupportedJurisdictions);

export default router;
