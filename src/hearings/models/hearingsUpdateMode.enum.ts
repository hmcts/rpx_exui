import { HearingWindowModel } from './hearingWindow.model';
import { PartyDetailsModel } from './partyDetails.model';
import { PartyFlagsModel } from './partyFlags.model';

export enum HearingUpdateMode {
  UPDATED_AUTOMATICALLY,
  UPDATED_ON_PAGE_VISIT
}

export enum AutoUpdateMode {
  NO_UPDATE,
  PARTY,
  PAGELESS,
  WITHIN_PAGE,
  AFTER_PAGE_VISIT
}

export enum PagelessPropertiesEnum {
  CASE_MANAGEMENT_LOCATIONCODE = 'caseManagementLocationCode',
  CASE_INTERPRETER_REQUIRED_FLAG = 'caseInterpreterRequiredFlag',
  HEARING_IN_WELSH_FLAG = 'hearingInWelshFlag',
  PARTIES = 'parties'
}

export enum WithinPagePropertiesEnum {
  HMCTS_INTERNAL_CASENAME = 'hmctsInternalCaseName',
  PUBLIC_CASE_NAME = 'publicCaseName',
  CASE_CATEGORIES = 'caseCategories',
  CASE_RESTRICTED_FLAG = 'caserestrictedFlag',
  PRIVATE_HEARING_REQUIRED_FLAG = 'privateHearingRequiredFlag',
  PARTIES = 'parties',
  HEARING_IN_WELSH_FLAG = 'hearingInWelshFlag'
}

export enum AfterPageVisitPropertiesEnum {
  REASONABLE_ADJUSTMENTS = 'reasonableAdjustments',
  NON_REASONABLE_ADJUSTMENTS = 'nonReasonableAdjustments',
  PARTIES = 'parties'
}

export interface PagelessProperties {
  caseManagementLocationCode?: boolean;
  parties?: boolean;
}

export interface WithinPageProperties {
  hmctsInternalCaseName?: boolean;
  publicCaseName?: boolean;
  caseCategories?: string[];
  caserestrictedFlag?: boolean;
  privateHearingRequiredFlag?: boolean;
  parties?: boolean;
}

export interface AfterPageVisitProperties {
  reasonableAdjustmentChangesRequired: boolean;
  reasonableAdjustmentChangesConfirmed?: boolean;
  nonReasonableAdjustmentChangesRequired: boolean;
  nonReasonableAdjustmentChangesConfirmed?: boolean;
  partyDetailsChangesRequired: boolean;
  partyDetailsChangesConfirmed?: boolean;
  partyDetailsAnyChangesRequired?: boolean;
  hearingWindowChangesRequired: boolean;
  hearingWindowChangesConfirmed?: boolean;
  hearingFacilitiesChangesRequired: boolean;
  hearingFacilitiesChangesConfirmed?: boolean;
  hearingUnavailabilityDatesChanged: boolean;
  hearingUnavailabilityDatesConfirmed?: boolean;
}

export interface PropertiesUpdatedAutomatically {
  pageless?: PagelessProperties;
  withinPage?: WithinPageProperties;
}

export interface PropertiesUpdatedOnPageVisit {
  hearingId: string,
  caseFlags: {
    flags: PartyFlagsModel[],
    flagAmendURL: string,
  };
  parties: PartyDetailsModel[];
  hearingWindow: HearingWindowModel;
  afterPageVisit: AfterPageVisitProperties;
}

export enum AmendmentLabelStatus {
  ACTION_NEEDED = 'ACTION NEEDED',
  AMENDED = 'AMENDED',
  WARNING = 'WARNING',
  NONE = 'NONE'
}

export interface ParticipantAttendanceMode {
  partyName: string;
  channel: string;
  partyNameChanged: boolean;
  partyChannelChanged: boolean;
}
