export enum Actions {
  CREATE,
  READ,
  UPDATE,
  DELETE,
}

export enum HMCStatus {
  HEARING_REQUESTED = 'HEARING_REQUESTED',
  AWAITING_LISTING = 'AWAITING_LISTING',
  LISTED = 'LISTED',
  UPDATE_REQUESTED = 'UPDATE_REQUESTED',
  UPDATE_SUBMITTED = 'UPDATE_SUBMITTED',
  EXCEPTION = 'EXCEPTION',
  CANCELLATION_REQUESTED = 'CANCELLATION_REQUESTED',
  CANCELLATION_SUBMITTED = 'CANCELLATION_SUBMITTED',
  CANCELLED = 'CANCELLED',
  VACATED = 'VACATED',
  AWAITING_ACTUALS = 'AWAITING_ACTUALS',
  COMPLETED = 'COMPLETED',
  ADJOURNED = 'ADJOURNED',
}

export enum HearingListingStatusEnum {
  AWAITING_LISTING = 'AWAITING LISTING',
  UPDATE_REQUESTED = 'UPDATE REQUESTED',
  UPDATE_SUBMITTED = 'UPDATE SUBMITTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  LISTED = 'LISTED',
  EXCEPTION = 'EXCEPTION',
  CANCELLATION_REQUESTED = 'CANCELLATION REQUESTED',
  VACATED = 'VACATED',
  AWAITING_ACTUALS = 'AWAITING ACTUALS',
  ADJOURNED = 'ADJOURNED',
}

export enum ListingStatus {
  DRAFT = 'Draft',
  PROVISIONAL = 'Provisional',
  FIXED = 'Fixed',
}

export enum LaCaseStatus {
  LISTED = 'LISTED',
  PENDING_RELISTING = 'PENDING_RELISTING',
  CLOSED = 'CLOSED',
  EXCEPTION = 'EXCEPTION',
}

export enum EXUISectionStatusEnum {
  UPCOMING = 'Current and upcoming',
  PAST_OR_CANCELLED = 'Past or cancelled',
}

export enum EXUIDisplayStatusEnum {
  AWAITING_LISTING = 'WAITING TO BE LISTED',
  UPDATE_REQUESTED = 'UPDATE REQUESTED',
  UPDATE_SUBMITTED = 'UPDATE SUBMITTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  LISTED = 'LISTED',
  FAILURE = 'REQUEST FAILURE',
  CANCELLATION_REQUESTED = 'CANCELLATION REQUESTED',
  CANCELLATION_SUBMITTED = 'CANCELLATION REQUESTED',
  VACATED = 'VACATED',
  AWAITING_ACTUALS = 'AWAITING HEARING DETAILS',
  ADJOURNED = 'ADJOURNED',
}

export enum HMCLocationType {
  COURT = 'court',
  CLUSTER = 'cluster',
  REGION = 'regionId',
}

export enum UnavailabilityType {
  AM = 'AM',
  PM = 'PM',
  ALL_DAY = 'All Day',
}

export enum RequirementType {
  MUSTINC = 'MUSTINC',
  OPTINC = 'OPTINC',
  EXCLUDE = 'EXCLUDE',
}

export enum CategoryType {
  CaseType = 'caseType',
  CaseSubType = 'caseSubType',
}

export enum MemberType {
  JUDGE = 'JUDGE',
  PANEL_MEMBER = 'PANEL_MEMBER',
}

export enum PartyType {
  IND = 'IND',
  ORG = 'ORG',
}

export enum RadioOptions {
  YES = 'Yes',
  NO = 'No',
  CHOOSE_DATE_RANGE = 'Choose a date range'
}

export enum RadioOptionType {
  YES = 'yes',
  NO = 'no',
}

export enum DOW {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum DOWUnavailabilityType {
  AM = 'AM',
  PM = 'PM',
  ALL_DAY = 'All Day'
}

export enum HearingCategory {
  HearingPriority = 'HearingPriority',
  HearingChannel = 'HearingChannel',
  HearingSubChannel = 'HearingSubChannel',
  HearingType = 'HearingType',
  CaseType = 'caseType',
  Facilities = 'Facilities',
  PanelMemberType = 'PanelMemberType',
  PanelMemberSpecialism = 'PanelMemberSpecialism',
  NonStdDurationReasonCodes = 'NonStdDurationReasonCodes',
  JudgeType = 'JudgeType',
  CancelHearingReason = 'CaseManagementCancellationReasons',
  EntityRoleCode = 'EntityRoleCode',
  ActualPartHeardReasonCodes = 'ActualPartHeardReasonCodes',
  ActualCancellationReasonCodes = 'ActualCancellationReasonCodes',
  HearingChangeReasons = 'ChangeReasons',
  LinkedHearings = 'LinkedHearings',
}

export enum HearingChannelEnum {
  ONPPR = 'ONPPRS',
  NotAttending = 'NA',
}

export enum HearingDateEnum {
  DisplayTime = 'HH:mm',
  DisplayMonth = 'DD MMMM YYYY',
  DefaultFormat = 'DD-MM-YYYY',
  RequestFailedDateAndTime = 'DD MMMM YYYY HH:mm:ss',
  DateAndTimeInZoneZ = 'YYYY-MM-DDTHH:mm:ssZ',
  InvalidDate = 'Invalid date'
}

export enum HearingStageEnum {
  SelectHearingStageError = 'Select a hearing stage',
}

export enum HearingPanelSelectionEnum {
  SelectionError = 'Enter panel members or roles',
  PanelRowChildError = 'Select a specialism for the panel member(s).'
}

export enum HearingInstructionsEnum {
  InstructionLength = 2000
}

export enum HearingFacilitiesEnum {
  additionSecurityError = 'Select an option for additional security.',
}

export enum HearingJudgeSelectionEnum {
  ValidNameError = 'Enter a valid name',
  SelectOneJudgeError = 'Select at least one judge type',
  SelectionError = 'Select the option that applies',
  ExcludeJudge = 'Exclude judge before continue',
  ExcludeFullNameJudge = 'Enter a full name for a specific judge, or delete the name to stop the judge being included',
  SameJudgeInIncludeExcludeList = 'You cannot select same judge name in include and exclude list'
}

export enum HearingLinkedSelectionEnum {
  ValidSelectionError = 'You need to select at least one hearing',
  HearingSelection = 'Which hearings should be linked?',
  NoHearingSelection = 'There are no hearings available to link to',
  NoLinkedCases = 'No linked Cases',
  NoHearingsAvailable = 'To make a hearing available for linking, you need to edit the hearing listing.'
}

export enum HearingDatePriorityEnum {
  LengthError = 'Enter a valid hearing length',
  LengthHoursError = 'The hours entered must be between 0 of 6',
  LengthMinutesError = 'The minutes entered must be a multiple of 5',
  TotalLengthError = 'Enter a valid length of hearing, it must be between 5 minutes and 6 hours each day',
  PriorityError = 'Select the priority level of the hearing',
  PriorityDateError = 'Select if the hearing needs to take place on a specific date',
  DateRangeError = 'Enter a valid date range for the hearing to take place on',
  EitherDateRangeError = 'Enter either earliest hearing date or latest hearing date',
  WeekendError = 'Hearing date cannot be on the weekend',
  InValidHearingDateError = 'Enter a valid hearing date',
  DatePastError = 'The hearing dates cannot be in the past',
  WeekDayError = 'Date range must include a weekday',
  EarliestHearingDateError = 'The earliest start date must be before the latest end date',
  NotEnoughDaysInDateRangeError = 'There are not enough days in the date range for the hearing'
}

export enum HearingStageResultEnum {
  HearingResultError = 'Select a hearing result',
  HearingResultReasonError = 'Select a reason for the hearing result'
}

export enum HearingErrorMessage {
  ENTER_A_VALID_LOCATION = 'Enter a valid location',
  ENTER_A_LOCATION = 'Enter a location',
  ADD_A_LOCATION = 'Add a location',
}

export enum HearingDatePriorityConstEnum {
  MinDays = 0,
  MinHours = 0,
  MaxHours = 6,
  TotalMinMinutes = 5,
  TotalMaxMinutes = 55,
  TotalMinutes = 360,
  MinutesMuliplier = 5,
}

export enum HearingSummaryEnum {
  BackendError = 'There was a system error and your request could not be processed. Please try again.',
  RequestFailedError = 'Something went wrong and your request could not be processed. A support ticket has been automatically raised. For updates on issue resolution, contact your service desk quoting all the error details on this screen.'
}

export enum ACTION {
  BACK = 'BACK',
  CONTINUE = 'CONTINUE',
  SUBMIT = 'SUBMIT',
  CANCEL = 'CANCEL',
  VIEW_EDIT_REASON = 'VIEW EDIT REASON',
  VIEW_EDIT_SUBMIT = 'VIEW EDIT SUBMIT'
}

export enum ConditionOperator {
  INCLUDE = 'INCLUDE',
  NOT_INCLUDE = 'NOT INCLUDE',
}

export enum CaseFlagType {
  PARTY_FLAGS = 'Party',
  CASE_FLAG = 'Case',
  REASONABLE_ADJUSTMENT = 'Reasonable adjustment',
  NON_REASONABLE_ADJUSTMENT = 'Non reasonable adjustment',
}

export enum CancelHearingMessages {
  NOT_SELECTED_A_REASON = 'You have not selected a reason for cancelling the hearing',
  SELECT_AT_LEAST_ONE_REASON = 'Select at least one valid reason',
}

export enum HearingChangeReasonMessages {
  NOT_SELECTED_A_REASON = 'You have not selected a reason for changing the hearing',
  SELECT_AT_LEAST_ONE_REASON = 'Select at least one valid reason',
}

export enum HearingLinkMessages {
  SELECT_HEARING_LINK_OPTION = 'Please make a selection'
}

export enum AnswerSource {
  CASE_NAME,
  CASE_NUMBER,
  Type,
  TYPE_FROM_REQUEST,
  STATUS,
  ERROR_TIME_STAMP,
  DATE_REQUEST_SUBMITTED,
  DATE_RESPONSE_SUBMITTED_TIME,
  DATE_RESPONSE_SUBMITTED,
  DATE_RESPONSE_SUBMITTED_MULTI_DAY,
  DATE_RESPONSE_RECEIVED,
  CASE_FLAGS,
  ROOM_ID,
  ADDITIONAL_SECURITY_REQUIRED,
  ADDITIONAL_FACILITIES_REQUIRED,
  STAGE,
  HEARING_RESPONSE_STATUS,
  HOW_ATTENDANT,
  HOW_PARTICIPANTS_ATTEND,
  IS_PAPER_HEARING,
  PARTICIPANT_ATTENDENCE,
  ATTENDANT_PERSON_AMOUNT,
  VENUE,
  COURT_LOCATION,
  NEED_WELSH,
  NEED_JUDGE,
  JUDGE_NAME,
  JUDICIAL_MEMBERS,
  JUDGE_TYPES,
  JUDGE_EXCLUSION,
  HEARING_PANEL,
  PANEL_INCLUSION,
  PANEL_EXCLUSION,
  PANEL_MEMBERS,
  PANEL_ROLES,
  HEARING_LENGTH,
  HEARING_RESPONSE_LENGTH,
  HEARING_SPECIFIC_DATE,
  HEARING_PRIORITY,
  ADDITIONAL_INSTRUCTION,
  REASON_FOR_ACTUAL_CANCELLATION,
  REASON_FOR_REQUEST_CANCELLATION,
  LINKED_HEARINGS,
  REASONABLE_ADJUSTMENTS,
  PRIVATE_HEARING_REQUIRED,
  CASE_RESTRICTION,
  PUBLIC_CASE_NAME
}

export enum IsHiddenSource {
  WELSH_LOCATION,
  JUDGE_EXCLUSION,
  PANEL_INCLUSION,
  PANEL_EXCLUSION,
  PANEL_DETAILS_EXCLUSION,
  PANEL_ROLES,
  PAPER_HEARING,
  JUDGE_TYPES,
  JUDGE_NAME,
  LISTED,
  LISTED_HEARING_VIEWER,
  NOT_LISTED
}

export enum Mode {
  CREATE = 'create',
  CREATE_EDIT = 'create-edit',
  VIEW = 'view',
  VIEW_EDIT = 'view-edit',
  LINK_HEARINGS = 'link-hearings',
  MANAGE_HEARINGS = 'manage-hearings',
}

export enum HearingRequestPageRouteNames {
  HEARING_CREATE_EDIT_SUMMARY = 'hearing-create-edit-summary',
  HEARING_VIEW_EDIT_SUMMARY = 'hearing-view-edit-summary',
  HEARING_EDIT_SUMMARY = 'hearing-edit-summary',
  HEARING_CHANGE_REASON = 'hearing-change-reason',
  HEARING_CONFIRMATION = 'hearing-confirmation'
}

export enum ControlTypeEnum {
  TEXT_BOX,
  SELECT,
  RADIO_BUTTON,
  CHECK_BOX,
  TEXT_AREA
}

export enum HearingResult {
  COMPLETED = 'COMPLETED',
  ADJOURNED = 'ADJOURNED',
  CANCELLED = 'CANCELLED',
}

export enum HearingActualAddEditSummaryEnum {
  HearingResultError = 'Enter a hearing result',
  ConfirmUpdateError = 'Confirm or update before continue',
  AllDaysCoveredError = 'Hearing details cannot be submitted until all required hearing days have taken place'
}

export enum HearingTemplate {
  LISTING_INFORMATION = 'Listing information summary',
  PARTIES_TEMPLATE = 'Parties Template'
}

export enum GroupLinkType {
  ORDERED = 'Ordered',
  SAME_SLOT = 'Same Slot',
}

export enum HearingActualsTimingErrorMessages {
  VALID_TIME = 'Enter a valid time.',
  START_TIME_BEFORE_FINISH_TIME = 'Start time must be before finish time',
  PAUSE_TIME_BEFORE_RESUME_TIME = 'Pause time must be before resume time',
  PAUSE_TIME_BETWEEN_START_TIME_AND_FINISH_TIMES = 'Pause time must be between the hearing start and finish times',
  RESUME_TIME_BETWEEN_START_TIME_AND_FINISH_TIMES = 'Resume time must be between the hearing start and finish times',
}
