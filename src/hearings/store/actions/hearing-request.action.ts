import { Action } from '@ngrx/store';
import { HttpError } from '../../../models/httpError.model';
import { HearingConditions } from '../../models/hearingConditions';
import { HearingRequestMainModel } from '../../models/hearingRequestMain.model';
import { HearingResponseError } from '../../models/hearingResponseError.model';

export const RESET_HEARING_REQUEST = '[HEARING REQUEST] Reset Hearing Request';
export const NAVIGATE_BACK_HEARING_REQUEST = '[HEARING REQUEST] Navigate Back Hearing Request';
export const UPDATE_HEARING_REQUEST = '[HEARING REQUEST] Update Hearing Request';
export const UPDATE_HEARING_REQUEST_FAILURE = '[HEARING REQUEST] Update Hearing Request Failure';
export const INITIALIZE_HEARING_REQUEST = '[HEARING REQUEST] Initialize Hearing Request';
export const LOAD_HEARING_REQUEST = '[HEARING REQUEST] Load Hearing Request';
export const SUBMIT_HEARING_REQUEST = '[HEARING REQUEST] Submit Hearing Request';
export const SUBMIT_HEARING_REQUEST_FAILURE = '[HEARING REQUEST] Submit Hearing Request Failure';
export const VIEW_EDIT_SUBMIT_HEARING_REASON = '[HEARING REQUEST AMEND] View Edit Submit Hearing Reason';
export const VIEW_EDIT_SUBMIT_HEARING_REQUEST = '[HEARING REQUEST AMEND] View Edit Submit Hearing Request';
export const RESET_HEARING_REQUEST_LAST_ERROR = '[HEARING REQUEST] Reset Hearing Request Last Error';
export const GET_JUDICIAL_USER_FAILURE = '[HEARING REQUEST] Get Judicial User Failure';

export class ResetHearingRequest implements Action {
  public readonly type = RESET_HEARING_REQUEST;
}

export class NavigateBackHearingRequest implements Action {
  public readonly type = NAVIGATE_BACK_HEARING_REQUEST;
}

export class InitializeHearingRequest implements Action {
  public readonly type = INITIALIZE_HEARING_REQUEST;

  constructor(public payload: HearingRequestMainModel) {}
}

export class LoadHearingRequest implements Action {
  public readonly type = LOAD_HEARING_REQUEST;

  constructor(public payload: { hearingID: string, targetURL: string }) {}
}

export class UpdateHearingRequest implements Action {
  public readonly type = UPDATE_HEARING_REQUEST;

  constructor(public hearingRequestMainModel: HearingRequestMainModel,
              public hearingCondition: HearingConditions) {}
}

export class UpdateHearingRequestFailure implements Action {
  public readonly type = UPDATE_HEARING_REQUEST_FAILURE;

  constructor(public payload: HttpError) {}
}

export class SubmitHearingRequest implements Action {
  public readonly type = SUBMIT_HEARING_REQUEST;

  constructor(public payload: HearingRequestMainModel) {}
}

export class SubmitHearingRequestFailure implements Action {
  public readonly type = SUBMIT_HEARING_REQUEST_FAILURE;

  constructor(public payload: HttpError) {}
}

export class ViewEditSubmitHearingReason implements Action {
  public readonly type = VIEW_EDIT_SUBMIT_HEARING_REASON;

  constructor(public payload: HearingRequestMainModel) {}
}

export class ViewEditSubmitHearingRequest implements Action {
  public readonly type = VIEW_EDIT_SUBMIT_HEARING_REQUEST;

  constructor(public payload: HearingRequestMainModel) {}
}

export class ResetHearingRequestLastError implements Action {
  public readonly type = RESET_HEARING_REQUEST_LAST_ERROR;
}

export class GetHearingJudicialUsersFailure implements Action {
  public readonly type = GET_JUDICIAL_USER_FAILURE;
  constructor(public payload: HearingResponseError) {}
}

export type HearingRequestAction =
  | ResetHearingRequest
  | NavigateBackHearingRequest
  | InitializeHearingRequest
  | LoadHearingRequest
  | UpdateHearingRequest
  | UpdateHearingRequestFailure
  | SubmitHearingRequest
  | SubmitHearingRequestFailure
  | ViewEditSubmitHearingReason
  | ViewEditSubmitHearingRequest
  | ResetHearingRequestLastError
  | GetHearingJudicialUsersFailure;
