import { NextFunction, Response } from 'express';
import { getConfigValue, showFeature } from '../../configuration';
import { FEATURE_JRD_E_LINKS_V2_ENABLED, SERVICES_PRD_JUDICIAL_API } from '../../configuration/references';
import { http } from '../../lib/http';
import { EnhancedRequest } from '../../lib/models';
import { setHeaders } from '../../lib/proxy';
import {
  JudicialUserModel,
  RawJudicialUserModel,
  transformToJudicialUserModel
} from './models/judicialUser.model';

const HEADER_ACCEPT_V1 = 'application/json';
const HEADER_ACCEPT_V2 = 'application/vnd.jrd.api+json;Version=2.0';
const prdUrl: string = getConfigValue(SERVICES_PRD_JUDICIAL_API);

/**
 * @overview searchJudicialUserByPersonalCodes from personalCodes, i.e. ['p1000000','p1000001']
 * @description API sample: POST /api/prd/judicial/searchJudicialUserByPersonalCodes
 * @example with body {personal_code: ['p1000000','p1000001']}
 */
export async function searchJudicialUserByPersonalCodes(req: EnhancedRequest, res: Response, next: NextFunction) {
  const reqBody = req.body;
  const markupPath: string = `${prdUrl}/refdata/judicial/users`;
  try {
    // Judicial User search API version to be used depends upon the config entry FEATURE_JRD_E_LINKS_V2_ENABLED's value
    req.headers.accept = showFeature(FEATURE_JRD_E_LINKS_V2_ENABLED)
      ? HEADER_ACCEPT_V2
      : HEADER_ACCEPT_V1;
    const headers = setHeaders(req);
    const { status, data }: { status: number, data: RawJudicialUserModel[] } = await http.post(markupPath, reqBody, { headers });
    const result = data.map(transformToJudicialUserModel);
    res.status(status).send(result);
  } catch (error) {
    next(error);
  }
}

export async function searchJudicialUserByIdamId(req: EnhancedRequest, res: Response, next: NextFunction) {
  const reqBody = req.body;
  const markupPath: string = `${prdUrl}/refdata/judicial/users`;
  try {
    // Judicial User search API version to be used depends upon the config entry FEATURE_JRD_E_LINKS_V2_ENABLED's value
    req.headers.accept = HEADER_ACCEPT_V2;
    const headers = setHeaders(req);
    const { status, data }: { status: number, data: RawJudicialUserModel[] } = await http.post(markupPath, reqBody, { headers });
    const result = data.map(transformToJudicialUserModel);
    res.status(status).send(result);
  } catch (error) {
    next(error);
  }
}

/**
 * @overview getJudicialUsersSearch from searchString, i.e. jam
 * @description API sample: POST /api/prd/judicial/users/search
 * @example with body {searchString: jam}
 */
export async function getJudicialUsersSearch(req: EnhancedRequest, res: Response, next: NextFunction) {
  const reqBody = req.body;
  const markupPath: string = `${prdUrl}/refdata/judicial/users/search`;
  try {
    // Judicial User search API version to be used depends upon the config entry FEATURE_JRD_E_LINKS_V2_ENABLED's value
    req.headers.accept = showFeature(FEATURE_JRD_E_LINKS_V2_ENABLED)
      ? HEADER_ACCEPT_V2
      : HEADER_ACCEPT_V1;
    const headers = setHeaders(req);
    const { status, data }: { status: number, data: JudicialUserModel[] } = await http.post(markupPath, reqBody, { headers });
    res.status(status).send(data);
  } catch (error) {
    next(error);
  }
}
