import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../hearing.test.data';
import { ACTION, PartyType } from '../../models/hearings.enum';
import { HearingsService } from '../../services/hearings.service';
import * as fromHearingStore from '../../store';
import { AbstractPageFlow } from '../../utils/abstract-page-flow';
import { RequestHearingComponent } from './request-hearing.component';
import { ServiceHearingValuesModel } from 'src/hearings/models/serviceHearingValues.model';
import { HearingRequestMainModel } from 'src/hearings/models/hearingRequestMain.model';

describe('RequestHearingComponent', () => {
  let component: RequestHearingComponent;
  let fixture: ComponentFixture<RequestHearingComponent>;
  let mockStore: any;
  const mockPageFlow = jasmine.createSpyObj('PageFlow', ['getCurrentPage']);
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RequestHearingComponent, MockRpxTranslatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AbstractPageFlow, useValue: mockPageFlow },
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService }
      ]
    })
      .compileComponents();
    mockStore = TestBed.inject(Store);
    fixture = TestBed.createComponent(RequestHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check back method', () => {
    spyOn(hearingsService, 'navigateAction');
    component.onBack();
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.BACK);
  });

  it('should check continue method', () => {
    spyOn(hearingsService, 'navigateAction');
    component.onContinue();
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.CONTINUE);
  });

  it('should check submit method', () => {
    spyOn(hearingsService, 'navigateAction');
    component.submitRequest(ACTION.SUBMIT);
    expect(hearingsService.hearingRequestForSubmitValid).toEqual(true);
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.SUBMIT);
  });

  it('should check submit method and not be able to click submit change request button again', () => {
    spyOn(hearingsService, 'navigateAction');
    component.submitRequest(ACTION.VIEW_EDIT_SUBMIT);
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.VIEW_EDIT_SUBMIT);
  });

  it('should check submitUpdatedRequestClicked set to true for view edit reason', () => {
    spyOn(hearingsService, 'navigateAction');
    component.submitRequest(ACTION.VIEW_EDIT_REASON);
    expect(hearingsService.submitUpdatedRequestClicked).toBe(true);
  });

  it('should check buttonDisabled returns a false for a submit with failed validation', () => {
    spyOn(hearingsService, 'navigateAction');
    hearingsService.hearingRequestForSubmitValid = false;
    component.submitRequest(ACTION.VIEW_EDIT_SUBMIT);
    const buttonDisabled = component.buttonDisabled(ACTION.VIEW_EDIT_SUBMIT);
    expect(buttonDisabled).toEqual(false);
  });

  it('should check buttonDisabled returns a true for a VIEW_EDIT_SUBMIT with successful validation', () => {
    spyOn(hearingsService, 'navigateAction');
    hearingsService.hearingRequestForSubmitValid = true;
    const buttonDisabled = component.buttonDisabled(ACTION.VIEW_EDIT_SUBMIT);
    expect(buttonDisabled).toEqual(true);
  });

  it('should check buttonDisabled returns a false for a submit with successful validation', () => {
    spyOn(hearingsService, 'navigateAction');
    hearingsService.hearingRequestForSubmitValid = true;
    const buttonDisabled = component.buttonDisabled(ACTION.SUBMIT);
    expect(buttonDisabled).toEqual(true);
  });

  it('should check is answer page', () => {
    spyOn(hearingsService, 'navigateAction');
    mockPageFlow.getCurrentPage.and.returnValue('hearing-create-edit-summary');
    expect(component.isCreateEditSummary).toBeTruthy();
  });

  it('should check is confirmation page', () => {
    spyOn(hearingsService, 'navigateAction');
    mockPageFlow.getCurrentPage.and.returnValue('hearing-confirmation');
    expect(component.isConfirmationPage).toBeTruthy();
  });

  it('should check is child page', () => {
    spyOn(hearingsService, 'navigateAction');
    mockPageFlow.getCurrentPage.and.returnValue('hearing-requirements');
    expect(component.isChildPage).toBeTruthy();
  });

  it('should purge data in store and clear hearings service manual amendment properties if page is destroyed', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingRequest()));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingValues()));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingConditions()));
    expect(hearingsService.propertiesUpdatedAutomatically).toEqual({ pageless: {}, withinPage: {} });
    expect(hearingsService.propertiesUpdatedOnPageVisit).toBeNull();
  });

  it('should check for mismatched Party IDs on submission', () => {
    const hearingRequestMainModel: HearingRequestMainModel = {
      hearingDetails: {
        duration: 45,
        hearingType: 'Final',
        hearingChannels: [],
        hearingLocations: [],
        hearingIsLinkedFlag: false,
        hearingWindow: {},
        privateHearingRequiredFlag: false,
        panelRequirements: {},
        autolistFlag: false,
        hearingPriorityType: 'standard',
        numberOfPhysicalAttendees: 2,
        hearingInWelshFlag: false,
        facilitiesRequired: [],
        listingComments: '',
        hearingRequester: '',
        leadJudgeContractType: '',
        amendReasonCodes: null,
        listingAutoChangeReasonCode: null
      },
      caseDetails: {
        hmctsServiceCode: 'BBA3',
        caseRef: '1111222233334444',
        requestTimeStamp: null,
        hearingID: null,
        caseDeepLink: 'https://manage-case.demo.platform.hmcts.net/',
        hmctsInternalCaseName: 'Jane vs DWP',
        publicCaseName: 'Jane vs DWP',
        caseAdditionalSecurityFlag: false,
        caseInterpreterRequiredFlag: false,
        caseCategories: [],
        caseManagementLocationCode: '196538',
        caserestrictedFlag: false,
        caseSLAStartDate: '2021-05-05T09:00:00.000Z',
        externalCaseReference: ''
      },
      partyDetails: [{
        partyID: 'P1',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Smith',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: [
            'RA0042',
            'RA0053',
            'RA0013',
            'RA0016',
            'RA0042'],
          interpreterLanguage: 'POR'
        },
        unavailabilityRanges: []
      }, {
        partyID: 'P2',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        partyName: 'DWP',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: ['RA0005'],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityRanges: []
      }]
    };
    const serviceHearingValuesModel: ServiceHearingValuesModel = {
      hmctsServiceID: 'BBA3',
      hmctsInternalCaseName: 'Jane vs DWP',
      publicCaseName: 'Jane vs DWP',
      autoListFlag: false,
      hearingType: 'Final',
      hearingChannels: [],
      caseCategories: [],
      caseDeepLink: 'https://manage-case.demo.platform.hmcts.net/',
      caserestrictedFlag: false,
      externalCaseReference: '',
      caseManagementLocationCode: '196538',
      caseSLAStartDate: '2021-05-05T09:00:00.000Z',
      hearingWindow: {},
      duration: 45,
      hearingPriorityType: 'standard',
      numberOfPhysicalAttendees: 2,
      hearingInWelshFlag: false,
      hearingLocations: [],
      caseAdditionalSecurityFlag: false,
      facilitiesRequired: [],
      listingComments: '',
      hearingRequester: '',
      privateHearingRequiredFlag: false,
      caseInterpreterRequiredFlag: false,
      leadJudgeContractType: '',
      judiciary: {
        roleType: [],
        authorisationTypes: [],
        authorisationSubType: [],
        panelComposition: [{ memberType: '', count: 1 }],
        judiciaryPreferences: [],
        judiciarySpecialisms: []
      },
      hearingIsLinkedFlag: false,
      panelRequirements: {
        roleType: [''],
        panelPreferences: [],
        panelSpecialisms: []
      },
      parties: [
        {
          partyID: 'diff-party-id-1',
          partyType: PartyType.IND,
          partyRole: 'appellant',
          partyName: 'Jane Smith',
          individualDetails: {
            title: 'Mrs',
            firstName: 'Jane',
            lastName: 'Smith',
            preferredHearingChannel: 'inPerson',
            interpreterLanguage: 'POR',
            reasonableAdjustments: [
              'RA0042',
              'RA0053',
              'RA0013',
              'RA0016',
              'RA0042',
              'PF0015'
            ]
          },
          unavailabilityRanges: []
        },
        {
          partyID: 'P2',
          partyType: PartyType.ORG,
          partyRole: 'claimant',
          partyName: 'DWP',
          individualDetails: {
            title: null,
            firstName: 'DWP',
            lastName: null,
            preferredHearingChannel: 'inPerson',
            interpreterLanguage: null,
            reasonableAdjustments: [
              'RA0005'
            ]
          },
          organisationDetails: {
            name: 'DWP',
            organisationType: 'GOV',
            cftOrganisationID: 'O100000'
          },
          unavailabilityRanges: []
        }],
      caseFlags: {
        flags: [],
        flagAmendURL: ''
      },
      screenFlow: [
        {
          screenName: 'hearing-requirements',
          navigation: [
            {
              resultValue: 'hearing-facilities'
            }
          ]
        },
        {
          screenName: 'hearing-facilities',
          navigation: [
            {
              resultValue: 'hearing-stage'
            }
          ]
        },
        {
          screenName: 'hearing-stage',
          navigation: [
            {
              resultValue: 'hearing-attendance'
            }
          ]
        },
        {
          screenName: 'hearing-attendance',
          navigation: [
            {
              resultValue: 'hearing-venue'
            }
          ]
        },
        {
          screenName: 'hearing-venue',
          conditionKey: 'regionId',
          navigation: [
            {
              conditionOperator: 'INCLUDE',
              conditionValue: '7',
              resultValue: 'hearing-welsh'
            },
            {
              conditionOperator: 'NOT INCLUDE',
              conditionValue: '7',
              resultValue: 'hearing-judge'
            }
          ]
        },
        {
          screenName: 'hearing-welsh',
          navigation: [
            {
              resultValue: 'hearing-judge'
            }
          ]
        },
        {
          screenName: 'hearing-judge',
          navigation: [
            {
              resultValue: 'hearing-panel'
            }
          ]
        },
        {
          screenName: 'hearing-panel',
          navigation: [
            {
              resultValue: 'hearing-timing'
            }
          ]
        },
        {
          screenName: 'hearing-timing',
          navigation: [
            {
              resultValue: 'hearing-additional-instructions'
            }
          ]
        },
        {
          screenName: 'hearing-additional-instructions',
          navigation: [
            {
              resultValue: 'hearing-create-edit-summary'
            }
          ]
        }
      ],
      vocabulary: [
        {
          word1: ''
        }
      ]
    };
    component.hearingRequestMainModel = hearingRequestMainModel;
    component.serviceHearingValuesModel = serviceHearingValuesModel;
    spyOn(hearingsService, 'navigateAction');
    component.submitRequest(ACTION.SUBMIT);
    expect(component.showMismatchErrorMessage).toBeTruthy();
    expect(component.validationErrors).toEqual({ id: 'reload-error-message', message: 'The Party IDs for this request appear mismatched, please reload and start the request again.' });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
