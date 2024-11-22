/**
 * The setHeaders method now also adds the authorization headers when applicable
 * for better security.
 * When moving to a different proxy middleware, it is important to refactor this as well.
 */
// TODO: remove this entire file in favour of middleware/proxy.ts
import * as express from 'express';
import * as striptags from 'striptags';
import { getConfigValue } from '../configuration';
import {
  SERVICES_CCD_COMPONENT_API_PATH, SERVICES_HEARINGS_ENABLE_PREVIEW_CCD
} from '../configuration/references';

import { http } from './http';
import { EnhancedRequest } from './models';
import { exists } from './util';

const hearingsPreviewCcdEnabled = getConfigValue(SERVICES_HEARINGS_ENABLE_PREVIEW_CCD) === 'true';

export function setHeaders(req: express.Request, contentType?: string) {
  const headers: any = {};

  if (req.headers) {
    if (contentType) {
      headers['content-type'] = contentType;
    } else if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'];
    }

    if (req.headers.accept) {
      headers.accept = req.headers.accept;
    }

    if (exists(req, 'headers.experimental')) {
      headers.experimental = req.headers.experimental;
    }

    if (exists(req, 'headers.Authorization')) {
      headers.Authorization = req.headers.Authorization;
    }

    if (req.headers['user-roles'] && req.headers['user-roles'].length) {
      headers['user-roles'] = req.headers['user-roles'];
    }

    if (exists(req, 'headers.ServiceAuthorization')) {
      headers.ServiceAuthorization = req.headers.ServiceAuthorization;
    }

    if (hearingsPreviewCcdEnabled && exists(req, 'headers.CCD_URL')) {
      headers.CCD_URL = req.headers.CCD_URL;
    }

    if (hearingsPreviewCcdEnabled && exists(req, 'headers.RAS_URL')) {
      headers.RAS_URL = req.headers.RAS_URL;
    }
  }

  return headers;
}

export async function get(req: express.Request, res: express.Response, next: express.NextFunction) {
  let url = striptags(req.url);
  url = req.baseUrl + url;
  const headers: any = setHeaders(req);

  try {
    const response = await http.get(`${getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)}${url}`, { headers });

    res.status(200);
    res.send(response.data);
  } catch (e) {
    next(e);
  }
}

export async function put(req: EnhancedRequest, res: express.Response, next: express.NextFunction) {
  let url = striptags(req.url);
  url = req.baseUrl + url;

  const headers: any = setHeaders(req);

  try {
    const response = await http.put(`${getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)}${url}`, req.body, { headers });
    res.status(200);
    res.send(response.data);
  } catch (e) {
    next(e);
  }
}

export async function post(req: EnhancedRequest, res: express.Response, next: express.NextFunction) {
  let url = striptags(req.url);
  url = req.baseUrl + url;

  const headers: any = setHeaders(req);

  try {
    const response = await http.post(`${getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)}${url}`, req.body, { headers });
    res.status(200);
    res.send(response.data);
  } catch (e) {
    next(e);
  }
}
