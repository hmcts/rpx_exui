import { TCDocument } from '@hmcts/rpx-xui-common-lib';
import { Action } from '@ngrx/store';

export const APP_LOAD_CONFIG = '[App] Load Config';
export const APP_LOAD_CONFIG_SUCCESS = '[App] Load Config Success';
export const APP_LOAD_CONFIG_FAIL = '[App] Load Config Fail';

export const START_APP_INITIALIZER = '[App] Start App initializer';
export const FINISH_APP_INITIALIZER = '[App] Finish Start App initializer';

export const LOGOUT = '[App] Logout';
export const IDLE_USER_LOGOUT = '[App] Idle User Logout';

export const LOAD_HAS_ACCEPTED_TC = '[T&C] Lad Has Accepted';
export const LOAD_HAS_ACCEPTED_TC_SUCCESS = '[T&C] Lad Has Accepted Success';
export const LOAD_HAS_ACCEPTED_TC_FAIL = '[T&C] Lad Has Accepted Fail';

export const ACCEPT_T_AND_C = '[T&C] Accept T&C';
export const ACCEPT_T_AND_C_SUCCESS = '[T&C] Accept T&C Success';
export const ACCEPT_T_AND_C_FAIL = '[T&C] Accept T&C Fail';

export const LOAD_TERMS_CONDITIONS = '[TC] Load Terms Conditions';
export const LOAD_TERMS_CONDITIONS_SUCCESS = '[TC] Load Terms Conditions Success';
export const LOAD_TERMS_CONDITIONS_FAIL = '[TC] Load Terms Conditions Fail';

export const LOAD_FEATURE_TOGGLE_CONFIG = '[App] Load Feature Toggle Config';
export const LOAD_FEATURE_TOGGLE_CONFIG_SUCCESS = '[App] Load Feature Toggle Config Success';
export const LOAD_FEATURE_TOGGLE_CONFIG_FAIL = '[App] Load Feature Toggle Config Fail';

export const LOAD_USER_DETAILS = '[App] Load User Details';
export const LOAD_USER_DETAILS_SUCCESS = '[App] Load User Details Success';
export const LOAD_USER_DETAILS_FAIL = '[App] Load User Details Success';

export const START_IDLE_SESSION_TIMEOUT = '[App] Start Idle Session Timeout';
export const STOP_IDLE_SESSION_TIMEOUT = '[App] Stop Idle Session Timeout';

export const DECORATE_16_DIGIT_CASE_REFERENCE_SEARCH_BOX_IN_HEADER = '[App] Decorate 16 Digit Case Reference Search Box In Header';

export class LoadConfig implements Action {
  public readonly type = APP_LOAD_CONFIG;
}

export class LoadFeatureToggleConfig implements Action {
  public readonly type = LOAD_FEATURE_TOGGLE_CONFIG;
}

export class LoadFeatureToggleConfigSuccess implements Action {
  public readonly type = LOAD_FEATURE_TOGGLE_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadFeatureToggleConfigFail implements Action {
  public readonly type = LOAD_FEATURE_TOGGLE_CONFIG_FAIL;
  constructor(public payload: any) {}
}

export class LoadConfigSuccess implements Action {
  public readonly type = APP_LOAD_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadConfigFail implements Action {
  public readonly type = APP_LOAD_CONFIG_FAIL;
  constructor(public payload: any) {}
}

export class StartAppInitilizer implements Action {
  public readonly type = START_APP_INITIALIZER;
}

export class FinishAppInitilizer implements Action {
  public readonly type = FINISH_APP_INITIALIZER;
}

export class Logout implements Action {
  public readonly type = LOGOUT;
}

export class IdleUserLogOut implements Action {
  public readonly type = IDLE_USER_LOGOUT;
}

export class LoadHasAcceptedTC implements Action {
  constructor(public payload: string) {}
  public readonly type = LOAD_HAS_ACCEPTED_TC;
}

export class LoadHasAcceptedTCSuccess implements Action {
  public readonly type = LOAD_HAS_ACCEPTED_TC_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadHasAcceptedTCFail implements Action {
  public readonly type = LOAD_HAS_ACCEPTED_TC_FAIL;
  constructor(public payload: boolean) {}
}

export class AcceptTandC implements Action {
  public readonly type = ACCEPT_T_AND_C;
  constructor(public payload: string) {}
}

export class AcceptTandCSuccess implements Action {
  public readonly type = ACCEPT_T_AND_C_SUCCESS;
  constructor(public payload: boolean) {}
}

export class AcceptTandCFail implements Action {
  public readonly type = ACCEPT_T_AND_C_FAIL;
  constructor(public payload: boolean) {}
}

export class LoadTermsConditions implements Action {
  public readonly type = LOAD_TERMS_CONDITIONS;
}

export class LoadTermsConditionsSuccess implements Action {
  public readonly type = LOAD_TERMS_CONDITIONS_SUCCESS;
  constructor(public payload: TCDocument) {}
}

export class LoadTermsConditionsFail implements Action {
  public readonly type = LOAD_TERMS_CONDITIONS_FAIL;
  constructor(public payload: any) {}
}

export class LoadUserDetails implements Action {
  public readonly type = LOAD_USER_DETAILS;
  constructor(public payload?: boolean) {}
}

// TODO: strong type the payload
export class LoadUserDetailsSuccess implements Action {
  public readonly type = LOAD_USER_DETAILS_SUCCESS;
  constructor(public payload) {}
}

export class LoadUserDetailsFail implements Action {
  public readonly type = LOAD_USER_DETAILS_FAIL;
  constructor(public payload: any) {}
}

export class StartIdleSessionTimeout implements Action {
  public readonly type = START_IDLE_SESSION_TIMEOUT;
}

export class StopIdleSessionTimeout implements Action {
  public readonly type = STOP_IDLE_SESSION_TIMEOUT;
}

export class Decorate16DigitCaseReferenceSearchBoxInHeader implements Action {
  public readonly type = DECORATE_16_DIGIT_CASE_REFERENCE_SEARCH_BOX_IN_HEADER;
  constructor(public payload: boolean) {}
}

export type AppActions =
  | LoadConfig
  | LoadConfigSuccess
  | LoadConfigFail
  | StartAppInitilizer
  | FinishAppInitilizer
  | Logout
  | LoadHasAcceptedTC
  | LoadHasAcceptedTCSuccess
  | LoadHasAcceptedTCFail
  | AcceptTandC
  | AcceptTandCFail
  | AcceptTandCSuccess
  | LoadTermsConditions
  | LoadTermsConditionsFail
  | LoadTermsConditionsSuccess
  | LoadFeatureToggleConfig
  | LoadFeatureToggleConfigSuccess
  | LoadFeatureToggleConfigFail
  | LoadUserDetails
  | LoadUserDetailsSuccess
  | LoadUserDetailsFail
  | StartIdleSessionTimeout
  | StopIdleSessionTimeout
  | Decorate16DigitCaseReferenceSearchBoxInHeader;
