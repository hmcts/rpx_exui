import { Action } from '@ngrx/store';
import { StaffUserResponseError } from '../../models/staff-user-response-error.model';

export const SET_STAFF_SELECT_ERROR = '[Staff Select] Set Select Staff Error';
export const RESET_STAFF_SELECT_ERROR = '[Staff Select] Reset Staff Select Error';

export class SetError implements Action {
  public readonly type = SET_STAFF_SELECT_ERROR;
  constructor(public payload: StaffUserResponseError) { }
}

export class ResetStaffSelect implements Action {
  public readonly type = RESET_STAFF_SELECT_ERROR;
}

export type StaffSelectAction =
    | SetError
    | ResetStaffSelect;
