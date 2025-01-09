import { HearingValuesStateData } from '../../models/hearingValuesStateData';
import * as fromActions from '../actions';

export const initialHearingValuesState: HearingValuesStateData = {
  serviceHearingValuesModel: null,
  lastError: null
};

export function hearingValuesReducer(currentState = initialHearingValuesState,
  action: fromActions.HearingValuesAction): HearingValuesStateData {
  switch (action.type) {
    case fromActions.RESET_HEARING_VALUES: {
      return {
        ...initialHearingValuesState
      };
    }
    case fromActions.LOAD_HEARING_VALUES_SUCCESS: {
      return {
        ...currentState,
        serviceHearingValuesModel: action.payload,
        lastError: null
      };
    }
    case fromActions.LOAD_HEARING_VALUES_FAILURE: {
      return {
        ...initialHearingValuesState,
        lastError: action.payload
      };
    }
    case fromActions.RESET_HEARING_VAUES_LAST_ERROR: {
      return {
        ...currentState,
        lastError: null
      };
    }
    default: {
      return {
        ...currentState
      };
    }
  }
}

export const hearingValuesModel = (hearingValuesState) => hearingValuesState.serviceHearingValuesModel;
