import { HearingConditions } from '../../models/hearingConditions';
import { HearingRequestMainModel } from '../../models/hearingRequestMain.model';
import { HearingRequestStateData } from '../../models/hearingRequestStateData.model';
import { Mode } from '../../models/hearings.enum';
import * as fromActions from '../actions';
import { PartyDetailsModel } from '../../models/partyDetails.model';

export const initialHearingRequestState: HearingRequestStateData = {
  hearingRequestMainModel: {
    requestDetails: {
      timestamp: null,
      versionNumber: 0
    },
    hearingDetails: {
      duration: null,
      hearingType: null,
      hearingLocations: [],
      hearingIsLinkedFlag: false,
      hearingWindow: null,
      privateHearingRequiredFlag: false,
      panelRequirements: null,
      autolistFlag: false,
      nonStandardHearingDurationReasons: [],
      hearingPriorityType: null,
      numberOfPhysicalAttendees: null,
      hearingInWelshFlag: false,
      facilitiesRequired: [],
      listingComments: null,
      hearingRequester: null,
      leadJudgeContractType: null,
      amendReasonCodes: null,
      hearingChannels: [],
      listingAutoChangeReasonCode: null,
      isAPanelFlag: false
    },
    caseDetails: {
      hmctsServiceCode: null,
      caseRef: null,
      requestTimeStamp: null,
      hearingID: null,
      externalCaseReference: null,
      caseDeepLink: null,
      hmctsInternalCaseName: null,
      publicCaseName: null,
      caseAdditionalSecurityFlag: null,
      caseInterpreterRequiredFlag: false,
      caseCategories: [],
      caseManagementLocationCode: null,
      caserestrictedFlag: false,
      caseSLAStartDate: null
    },
    partyDetails: []
  },
  lastError: null,
  getJudicialUsersError: null
};

export function hearingRequestReducer(currentState = initialHearingRequestState,
  action: fromActions.HearingRequestAction): HearingRequestStateData {
  switch (action.type) {
    case fromActions.RESET_HEARING_REQUEST: {
      return {
        ...initialHearingRequestState
      };
    }
    case fromActions.INITIALIZE_HEARING_REQUEST: {
      const hearingRequestMainModel = action.payload;
      const updatedPartyDetails: PartyDetailsModel[] = [];
      hearingRequestMainModel.partyDetails.forEach((party) => {
        let updateParty = party;
        if (party.partyName === undefined && party?.individualDetails?.firstName !== undefined) {
          updateParty = {
            ...party,
            partyName: `${party?.individualDetails?.firstName} ${party?.individualDetails?.lastName}`
          };
        }
        updatedPartyDetails.push(updateParty);
      });
      return {
        ...currentState,
        hearingRequestMainModel: {
          ...action.payload,
          partyDetails: updatedPartyDetails
        }
      };
    }
    case fromActions.UPDATE_HEARING_REQUEST: {
      let mode;
      let hasWalesLocation;
      const hearingConditions: HearingConditions = action.hearingCondition;
      if (hearingConditions.hasOwnProperty('mode')) {
        mode = hearingConditions.mode;
      }
      if (hearingConditions.hasOwnProperty('regionId')) {
        const regionId = hearingConditions.regionId;
        hasWalesLocation = regionId.includes('7');
      }
      let updatedHearingRequestMainModel: HearingRequestMainModel = action.hearingRequestMainModel;
      if (mode === Mode.VIEW_EDIT) {
        updatedHearingRequestMainModel = {
          ...action.hearingRequestMainModel
        };
      } else {
        // On create or create-edit mode if no Wales location is selected, it needs to set hearingInWelshFlag as false
        if (!hasWalesLocation) {
          updatedHearingRequestMainModel = {
            ...action.hearingRequestMainModel,
            hearingDetails: {
              ...action.hearingRequestMainModel.hearingDetails,
              hearingInWelshFlag: false
            }
          };
        }
      }
      return {
        ...currentState,
        hearingRequestMainModel: updatedHearingRequestMainModel,
        lastError: null
      };
    }
    case fromActions.SUBMIT_HEARING_REQUEST_FAILURE:
    case fromActions.UPDATE_HEARING_REQUEST_FAILURE: {
      return {
        ...currentState,
        lastError: action.payload
      };
    }
    case fromActions.GET_JUDICIAL_USER_FAILURE: {
      return {
        ...currentState,
        getJudicialUsersError: action.payload
      };
    }
    case fromActions.RESET_HEARING_REQUEST_LAST_ERROR: {
      return {
        ...currentState,
        lastError: null
      };
    }
    default: {
      return {
        ...currentState,
        lastError: null
      };
    }
  }
}

export const hearingRequestLastError = (hearingRequestState) => hearingRequestState.lastError;
