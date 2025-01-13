import { of } from 'rxjs';
import { HearingRequestMainModel } from '../../models/hearingRequestMain.model';
import { ACTION } from '../../models/hearings.enum';
import { HearingsService } from '../../services/hearings.service';
import * as fromHearingStore from '../../store';
import { RequestHearingPageFlow } from './request-hearing.page.flow';

class RequestHearingPageFlowSpec extends RequestHearingPageFlow {
  public executeAction(action: ACTION): void {
    super.navigateAction(action);
  }
}

describe('RequestHearingPageFlow', () => {
  const hearingState = {
    hearingList: {
      hearingListMainModel: [
        {
          hmctsServiceID: 'BBA3'
        }
      ]
    },
    hearingValues: {
      serviceHearingValuesModel: {
        hmctsServiceID: 'BBA3',
        autoListFlag: false,
        hearingType: 'Final',
        lastError: null
      },
      lastError: null
    },
    hearingRequest: {
      hearingRequestMainModel: {
        requestDetails: null,
        hearingDetails: {
          duration: 1,
          hearingType: '',
          hearingLocations: [],
          hearingWindow: null,
          panelRequirements: null,
          autolistFlag: false,
          hearingPriorityType: '',
          hearingInWelshFlag: true,
          amendReasonCodes: null,
          hearingChannels: [],
          listingAutoChangeReasonCode: null
        },
        partyDetails: []
      }
    },
    hearingRequestToCompare: {
      hearingRequestMainModel: {
        requestDetails: null,
        hearingDetails: {
          duration: 1,
          hearingType: '',
          hearingLocations: [],
          hearingWindow: null,
          panelRequirements: null,
          autolistFlag: false,
          hearingPriorityType: '',
          hearingInWelshFlag: true,
          amendReasonCodes: null,
          hearingChannels: [],
          listingAutoChangeReasonCode: null
        },
        partyDetails: []
      }
    },
    hearingConditions: null
  };
  let requestHearingPageFlow;
  const mockStore = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);

  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['isEnabled']);

  beforeEach(() => {
    mockStore.pipe.and.returnValue(of(hearingState));
    requestHearingPageFlow = new RequestHearingPageFlowSpec(mockStore, hearingsService, mockFeatureToggleService);
  });

  it('should navigate continue', () => {
    requestHearingPageFlow.navigateAction(ACTION.CONTINUE);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromHearingStore.UpdateHearingRequest(hearingState.hearingRequest.hearingRequestMainModel, hearingState.hearingConditions));
  });

  it('should navigate continue', () => {
    requestHearingPageFlow.navigateAction(ACTION.BACK);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromHearingStore.NavigateBackHearingRequest());
  });

  it('should navigate submit', () => {
    requestHearingPageFlow.navigateAction(ACTION.SUBMIT);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromHearingStore.SubmitHearingRequest(hearingState.hearingRequest.hearingRequestMainModel as HearingRequestMainModel));
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingRequest()));
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingValues()));
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingConditions()));
    expect(hearingsService.propertiesUpdatedAutomatically).toEqual({ pageless: {}, withinPage: {} });
    expect(hearingsService.propertiesUpdatedOnPageVisit).toBeNull();
  });

  it('should navigate to view edit reason page', () => {
    requestHearingPageFlow.navigateAction(ACTION.VIEW_EDIT_REASON);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromHearingStore.ViewEditSubmitHearingReason(hearingState.hearingRequest.hearingRequestMainModel as HearingRequestMainModel));
  });

  it('should navigate to view edit submit page', () => {
    requestHearingPageFlow.navigateAction(ACTION.VIEW_EDIT_SUBMIT);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromHearingStore.ViewEditSubmitHearingRequest(hearingState.hearingRequest.hearingRequestMainModel as HearingRequestMainModel));
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingRequest()));
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingValues()));
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingConditions()));
    expect(hearingsService.propertiesUpdatedAutomatically).toEqual({ pageless: {}, withinPage: {} });
    expect(hearingsService.propertiesUpdatedOnPageVisit).toBeNull();
  });

  afterEach(() => {
    requestHearingPageFlow = null;
  });
});
