import { NextFunction, Response } from 'express';
import { sendGet, sendPost } from '../common/crudService';
import { getConfigValue } from '../configuration';
import { HEARINGS_SUPPORTED_JURISDICTIONS } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { EnhancedRequest, JUILogger } from '../lib/models';
import { DEFAULT_SCREEN_FLOW } from './data/defaultScreenFlow.data';
import { hmcHearingsUrl } from './hmc.index';
import { HearingListMainModel } from './models/hearingListMain.model';
import { hearingStatusMappings } from './models/hearingStatusMappings';
import { EXUIDisplayStatusEnum } from './models/hearings.enum';
import {
  ServiceLinkedCasesModel
} from './models/linkHearings.model';
import { ServiceHearingValuesModel } from './models/serviceHearingValues.model';

const logger: JUILogger = log4jui.getLogger('hearing-service-api');

/**
 * loadServiceHearingValues - get details required to populate the hearing request/amend journey
 */
export async function loadServiceHearingValues(req: EnhancedRequest, res: Response, next: NextFunction) {
  const jurisdictionId = req.query.jurisdictionId;
  const reqBody = req.body;
  const servicePath: string = getServicePath(jurisdictionId);
  const markupPath: string = `${servicePath}/serviceHearingValues`;
  try {
    const { status, data }: { status: number, data: ServiceHearingValuesModel } = await sendPost(markupPath, reqBody, req);
    let dataByDefault = mapDataByDefault(data);
    // If service don't supply the screenFlow pre-set the default screen flow from ExUI
    if (!data.screenFlow) {
      dataByDefault = {
        ...data,
        screenFlow: DEFAULT_SCREEN_FLOW
      };
    }
    res.status(status).send(dataByDefault);
  } catch (error) {
    next(error);
  }
}

export function mapDataByDefault(data: ServiceHearingValuesModel): ServiceHearingValuesModel {
  // There is an inconsistency with the PartyFlagsModel data provided by the services
  // i.e., PrL provides partyId and CIVIL provides partyID
  // Resolving this to copy over partyID into partyId
  if (data?.caseFlags?.flags?.length > 0) {
    return {
      ...data,
      caseFlags: {
        ...data.caseFlags,
        flags: data.caseFlags.flags.map((flag) => (
          {
            ...flag,
            partyId: flag.partyID ? flag.partyID : flag.partyId
          }
        ))
      }
    };
  }
  return data;
}

/**
 * loadServiceLinkedCases - get linked cases from service
 */
export async function loadServiceLinkedCases(req: EnhancedRequest, res: Response, next: NextFunction) {
  const jurisdictionId = req.query.jurisdictionId;
  const reqBody = req.body;
  const servicePath: string = getServicePath(jurisdictionId);
  const markupPath: string = `${servicePath}/serviceLinkedCases`;
  try {
    const { status, data }: { status: number, data: ServiceLinkedCasesModel[] } = await sendPost(markupPath, reqBody, req);
    res.status(status).send(data);
  } catch (error) {
    next(error);
  }
}

export async function getHearings(caseId: string, req: EnhancedRequest) {
  const markupPath: string = `${hmcHearingsUrl}/hearings/${caseId}`;
  try {
    const { data }: {data: HearingListMainModel } = await sendGet(markupPath, req);
    data.caseHearings.forEach((hearing) =>
      hearingStatusMappings.filter((mapping) => mapping.hmcStatus === hearing.hmcStatus).map((hearingStatusMapping) => {
        hearing.exuiSectionStatus = hearingStatusMapping.exuiSectionStatus;
        hearing.exuiDisplayStatus = hearingStatusMapping.exuiDisplayStatus;
      }));
    return data;
  } catch (error) {
    logger.error(error.status, error.statusText, JSON.stringify(error.data));
    throw error;
  }
}

/**
 * loadLinkedCasesWithHearings - get linked cases from service then get hearings from case
 * step 1 - get linked case from service
 * step 2 - after step 1 asynchronously call and get hearings from get /hearings api
 * step 3 - aggregate and return the linkedCasesWithHearings
 */
export async function loadLinkedCasesWithHearings(req: EnhancedRequest, res: Response, next: NextFunction) {
  const jurisdictionId = req.query.jurisdictionId;
  const reqBody = req.body;
  const servicePath: string = getServicePath(jurisdictionId);
  const markupPath: string = `${servicePath}/serviceLinkedCases`;
  try {
    const { status, data }: { status: number, data: ServiceLinkedCasesModel[] } = await sendPost(markupPath, reqBody, req);
    const currentCase: ServiceLinkedCasesModel = {
      caseReference: reqBody.caseReference,
      caseName: reqBody.caseName,
      reasonsForLink: []
    };
    const linkedCaseIds = data.map((linkedCase) => linkedCase.caseReference);

    if (linkedCaseIds && linkedCaseIds.length) {
      const promises = [];
      const allCaseId = [currentCase.caseReference, ...linkedCaseIds];
      const allData = [currentCase, ...data];
      allCaseId.forEach((caseId) => {
        const promise = getHearings(caseId, req);
        promises.push(promise);
      });
      // @ts-ignore
      const allResults = await Promise.allSettled(promises);
      const result = aggregateAllResults(allData, allResults);
      res.status(status).send(result);
    } else {
      res.status(status).send([]);
    }
  } catch (error) {
    next(error);
  }
}

function aggregateAllResults(data: ServiceLinkedCasesModel[], allResults: any): any {
  const aggregateResult = [];
  allResults.forEach((result) => {
    const { status, value }: {status: string, value: any} = result;
    if (status === 'fulfilled') {
      const caseDetails = data.find((d) => d.caseReference === value.caseRef);
      const caseHearings = value.caseHearings.filter((hearing) =>
        hearing.exuiDisplayStatus === EXUIDisplayStatusEnum.AWAITING_LISTING
        || hearing.exuiDisplayStatus === EXUIDisplayStatusEnum.UPDATE_REQUESTED
        || hearing.exuiDisplayStatus === EXUIDisplayStatusEnum.LISTED);
      const caseWithHearing = {
        ...value,
        caseHearings,
        caseName: caseDetails.caseName,
        reasonsForLink: caseDetails.reasonsForLink
      };
      aggregateResult.push(caseWithHearing);
    }
  });
  return aggregateResult;
}

function getServicePath(jurisdictionId): string {
  if (isJurisdictionSupported(jurisdictionId)) {
    const configPath = `services.hearings.${jurisdictionId.toLowerCase()}.serviceApi`;
    return getConfigValue(configPath);
  }
  logger.error(`Hearings not configured for this jurisdiction: ${jurisdictionId}`);
  return '';
}

function isJurisdictionSupported(jurisdictionId): boolean {
  const supportedJurisdictions = getConfigValue(HEARINGS_SUPPORTED_JURISDICTIONS);
  return supportedJurisdictions.includes(jurisdictionId);
}
