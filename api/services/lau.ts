import { getConfigValue, showFeature } from '../configuration';
import * as log4jui from '../lib/log4jui';
import {
  SERVICES_LAU_SPECIFIC_CHALLENGED_ACCESS_API_PATH,
  FEATURE_LAU_SPECIFIC_CHALLENGED_ENABLED
} from '../configuration/references';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';

export const baseURL = getConfigValue(SERVICES_LAU_SPECIFIC_CHALLENGED_ACCESS_API_PATH);
export let featureSpecificChallengedAccessEnabled = showFeature(FEATURE_LAU_SPECIFIC_CHALLENGED_ENABLED);
export const logger = log4jui.getLogger('lauService');

export const ENDPOINTS = {
  CREATE_ACTION_LOG: '/audit/accessRequest'
};

export const ACTION_TYPE = {
  CREATED: 'CREATED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  AUTO_APPROVED: 'AUTO-APPROVED'
};

export const REQUEST_TYPE = {
  SPECIFIC: 'specific',
  CHALLENGED: 'challenged'
};

const CHALLENGED_REASON = {
  0: 'The cases or parties are linked to the case I am working on',
  1: 'To determine if the case needs to be consolidated',
  2: 'To consider an order for transfer',
  3: 'Other reason'
};

export type AccessLogContainer = {
  accessLog: AccessLog
}

export type AccessLog = {
  requestType: string;
  caseRef: string;
  userId: string;
  action: string;
  timestamp: string;
  reason: string;
  requestEndTimestamp: string;
}

export interface detailObject {
  reason?: number;
  otherReason?: string;
  specificReason?: string;
  caseReference?: string;
}

export function setFeatureSpecificChallengedAccessEnabled(value: boolean) {
  featureSpecificChallengedAccessEnabled = value;
}

export async function logAccessRequest(req: EnhancedRequest, isRequest: boolean) {
  if (featureSpecificChallengedAccessEnabled) {
    if (isRequest) {
      return await createAccessLogFromRequest(req);
    }
    return await createAccessLogFromDecision(req);
  }
}

/**
 * Create access log from request. If it is Challenged access request - it is
 * automatically approved, and we set action to APPROVED. Request itself is in
 * the form of AM role assignment request, e.g:
 * {
 *   roleRequest: {
 *     assignerId: '7a51b87d-36c6-47fa-b9ef-4257af8001c5',
 *     process: 'specific-access',
 *     reference: '1708968484691010/specific-access-judiciary/7a51b87d-36c6-47fa-b9ef-4257af8001c5',
 *     replaceExisting: true
 *   },
 *   requestedRoles: [
 *     {
 *       actorIdType: 'IDAM',
 *       actorId: '7a51b87d-36c6-47fa-b9ef-4257af8001c5',
 *       roleType: 'CASE',
 *       roleName: 'specific-access-requested',
 *       classification: 'PRIVATE',
 *       roleCategory: 'JUDICIAL',
 *       grantType: 'BASIC',
 *       beginTime: null,
 *       endTime: '2024-10-23T13:30:24.196Z',
 *       attributes: {
 *         caseId: '1708968484691010',
 *         isNew: true,
 *         accessReason: '{"specificReason":"my own reason justification"}',
 *         requestedRole: 'specific-access-judiciary',
 *         specificAccessReason: 'I have my own reasons'
 *       },
 *       notes: [
 *         {
 *           userId: '7a51b87d-36c6-47fa-b9ef-4257af8001c5',
 *           time: '2024-09-24T10:09:07.554Z',
 *           comment: '{"specificReason":"I have my own reasons"}'
 *         }
 *       ],
 *       readOnly: true
 *     }
 *   ]
 * }
 * @param req
 */
async function createAccessLogFromRequest(req: EnhancedRequest) {
  const process = req.body.roleRequest.process;
  const requestedRole = req.body.requestedRoles[0];
  let reason = 'N/A';
  try {
    const comment = JSON.parse(requestedRole.notes[0].comment);
    reason = getRequestReason(process, comment);
  } catch (error) {
    logger.error(error);
  }

  try {
    const accessLog: AccessLog = {
      requestType: (process === 'specific-access') ? REQUEST_TYPE.SPECIFIC : REQUEST_TYPE.CHALLENGED,
      caseRef: requestedRole?.attributes?.caseId,
      userId: requestedRole?.actorId,
      action: process === 'specific-access' ? ACTION_TYPE.CREATED : ACTION_TYPE.AUTO_APPROVED,
      timestamp: requestedRole?.notes[0]?.time,
      reason: reason,
      requestEndTimestamp: process ==='specific-access' ? null : requestedRole?.endTime
    };
    return await createAccessLog(req.headers.ServiceAuthorization, accessLog);
  } catch (error) {
    logger.error(error);
  }
  return false;
}

/**
 * Create access log from decision. It is only invoked by Specific Access decision. Challenged
 * Access is auto approved at the request time. In case request is rejected, request looks like
 * this:
 * {                                                                                                                                                                                                                                                                       [0/1897]
 *   accessReason: 'Request more information',
 *   specificAccessReason: 'my own reason justification',
 *   typeOfRole: { id: 'specific-access-denied', name: 'specific-access-denied' },
 *   caseId: '1708968484691010',
 *   requestId: 'c0348297-11b4-4ca7-bba0-51f3d014b406',
 *   taskId: 'c1f43062-79b2-11ef-a6cc-aeac11175fa4',
 *   jurisdiction: 'IA',
 *   assigneeId: '7a51b87d-36c6-47fa-b9ef-4257af8001c5',
 *   caseName: 'Idris Elba',
 *   comment: 'Rejecting asking for reason',
 *   roleCategory: 'JUDICIAL',
 *   requestCreated: '2024-09-23T13:50:12.446947Z',
 *   person: {
 *     id: '7a51b87d-36c6-47fa-b9ef-4257af8001c5',
 *     name: null,
 *     domain: null
 *   }
 * }
 *
 * If it is approved, person who approves can set how long access is valid for, for 7 days,
 * until specific date (midnight) or until case is active (indefinite). Request looks like this:
 * {
 *   specificAccessStateData: {
 *     state: 1,
 *     specificAccessFormData: null,
 *     SpecificAccessMoreInformationFormData: null,
 *     accessReason: 'Approve request',
 *     lastError: null,
 *     caseId: '1708968484691010',
 *     caseName: 'Idris Elba',
 *     taskId: '5553aae7-79b6-11ef-97ee-163d160fe773',
 *     actorId: '7a51b87d-36c6-47fa-b9ef-4257af8001c5',
 *     requestedRole: 'specific-access-judiciary',
 *     requestCreated: '2024-09-23T14:15:46.252103Z',
 *     requestId: '625579b3-0bab-476b-aa78-f32b5194f9a6',
 *     jurisdiction: 'IA',
 *     roleCategory: 'JUDICIAL',
 *     period: { startDate: null, endDate: null },
 *     person: null,
 *     specificAccessReason: 'my own reason justification'
 *   },
 *   period: { startDate: '2024-09-23T01:00:00.000Z', endDate: null }
 * }
 * @param req
 */
async function createAccessLogFromDecision(req: EnhancedRequest) {
  const approval = !!req.body.specificAccessStateData;
  const data = approval? req.body.specificAccessStateData : req.body;

  const userInfo = req.session?.passport?.user?.userinfo;
  const actorId = userInfo?.id ? userInfo.id : userInfo.uid;
  try {
    const accessLog: AccessLog = {
      requestType: REQUEST_TYPE.SPECIFIC,
      caseRef: data?.caseId,
      userId: actorId,
      action: approval ? ACTION_TYPE.APPROVED : ACTION_TYPE.REJECTED,
      timestamp: new Date().toISOString(),
      reason: data?.comment ? `Request more information - ${data.comment}` : data?.comment,
      requestEndTimestamp: req.body.period?.endDate
    };
    return await createAccessLog(req.headers.ServiceAuthorization, accessLog);
  } catch (error) {
    logger.error(error);
  }
  return false;
}

function getRequestReason(process: string, detail:detailObject): string {
  let reason = '';
  if (process === 'specific-access') {
    reason = detail.specificReason;
  } else if (process === 'challenged-access') {
    reason = CHALLENGED_REASON[detail.reason];
    if (detail.reason === 0) {
      reason = `${reason}, case ref - ${detail.caseReference}`;
    } else if (detail.reason === 3) {
      reason = `${reason} - ${detail.otherReason}`;
    }
  }
  return reason;
}

export async function createAccessLog(serviceToken:string, accessLog: AccessLog) {
  const headers: any = {
    'ServiceAuthorization': serviceToken,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  return await http.post(`${baseURL}${ENDPOINTS.CREATE_ACTION_LOG}`, { accessLog } as AccessLogContainer, { headers });
}
