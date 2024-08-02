import { StaffState } from '../../models/staff-state.model';
import * as ErrorActions from '../actions/staff-select.action';

export const initialState: StaffState = {
  staffGetError: null
};

export function staffSelectReducer(
  currentState = initialState,
  action: ErrorActions.StaffSelectAction
) {
  switch (action.type) {
    case ErrorActions.RESET_STAFF_SELECT_ERROR: {
      return {
        ...initialState
      };
    }
    case ErrorActions.SET_STAFF_SELECT_ERROR: {
      return {
        ...currentState,
        staffGetError: action.payload
      };
    }
    default: {
      return {
        ...currentState
      };
    }
  }
}

