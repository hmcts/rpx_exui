import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';
import { HearingsUtils } from '../../../utils/hearings.utils';
import { caseFlagsRefData, initialState } from '../../../hearing.test.data';
import { EditHearingChangeConfig } from '../../../models/editHearingChangeConfig.model';
import { HearingConditions } from '../../../models/hearingConditions';
import { ACTION, CategoryType, DOW, DOWUnavailabilityType, Mode, PartyType, UnavailabilityType, HearingChannelEnum } from '../../../models/hearings.enum';
import { PropertiesUpdatedOnPageVisit } from '../../../models/hearingsUpdateMode.enum';
import { LocationByEPIMMSModel } from '../../../models/location.model';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { HearingsFeatureService } from '../../../services/hearings-feature.service';
import { HearingsService } from '../../../services/hearings.service';
import { LocationsDataService } from '../../../services/locations-data.service';
import * as fromHearingStore from '../../../store';
import { HearingEditSummaryComponent } from './hearing-edit-summary.component';
import { ServiceHearingValuesModel } from '../../../models/serviceHearingValues.model';
import { HearingRequestMainModel } from '../../../models/hearingRequestMain.model';

describe('HearingEditSummaryComponent', () => {
  let component: HearingEditSummaryComponent;
  let fixture: ComponentFixture<HearingEditSummaryComponent>;
  let store: any;

  const routeMock = {
    snapshot: {
      data: {
        caseFlags: caseFlagsRefData
      }
    },
    fragment: of('point-to-me')
  };
  const routerMock = jasmine.createSpyObj('Router', [
    'navigate',
    'navigateByUrl'
  ]);
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const locationsDataService = new LocationsDataService(mockedHttpClient);
  const hearingsService = new HearingsService(mockedHttpClient);
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['isEnabled']);
  const hearingsFeatureServiceMock = jasmine.createSpyObj('FeatureServiceMock', ['isFeatureEnabled']);

  const locations: LocationByEPIMMSModel[] = [{
    epimms_id: '196538',
    site_name: 'Liverpool Social Security and Child Support Tribunal',
    court_name: 'LIVERPOOL SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL',
    open_for_public: 'YES',
    region_id: '5',
    region: 'North West',
    cluster_id: '3',
    cluster_name: 'Cheshire and Merseyside',
    court_status: 'Open',
    court_open_date: null,
    closed_date: null,
    postcode: 'L2 5UZ',
    court_address: 'PRUDENTIAL BUILDING, 36 DALE STREET, LIVERPOOL',
    phone_number: '',
    court_location_code: '',
    dx_address: '',
    welsh_site_name: '',
    welsh_court_address: '',
    venue_name: 'Liverpool',
    is_case_management_location: 'Y',
    is_hearing_location: 'Y'
  }];

  const categories = [
    {
      categoryType: CategoryType.CaseType,
      categoryValue: 'BBA3-003'
    }, {
      categoryType: CategoryType.CaseSubType,
      categoryValue: 'BBA3-002CC',
      categoryParent: 'BBA3-003'
    }, {
      categoryType: CategoryType.CaseSubType,
      categoryValue: 'BBA3-002GC',
      categoryParent: 'BBA3-003'
    }, {
      categoryType: CategoryType.CaseSubType,
      categoryValue: 'BBA3-002RC',
      categoryParent: 'BBA3-003'
    }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        HearingEditSummaryComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState }),
        LoadingService,
        {
          provide: HearingsService,
          useValue: hearingsService
        },
        {
          provide: LocationsDataService,
          useValue: locationsDataService
        },
        {
          provide: FeatureToggleService,
          useValue: mockFeatureToggleService
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: ActivatedRoute,
          useValue: routeMock
        },
        {
          provide: HearingsFeatureService,
          useValue: hearingsFeatureServiceMock
        }
      ]
    })
      .compileComponents();

    store = TestBed.inject(Store);
    mockFeatureToggleService.isEnabled.and.returnValue(of(true));
    hearingsFeatureServiceMock.isFeatureEnabled.and.returnValue(of(true));
    spyOn(locationsDataService, 'getLocationById').and.returnValue(of(locations));
    fixture = TestBed.createComponent(HearingEditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe', () => {
    component.hearingStateSub = of().subscribe();
    component.hearingValuesSubscription = of().subscribe();
    component.featureToggleServiceSubscription = of().subscribe();
    spyOn(component.hearingStateSub, 'unsubscribe').and.callThrough();
    spyOn(component.hearingValuesSubscription, 'unsubscribe').and.callThrough();
    spyOn(component.featureToggleServiceSubscription, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.hearingStateSub.unsubscribe).toHaveBeenCalled();
    expect(component.hearingValuesSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.featureToggleServiceSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should focus on the element', () => {
    spyOn(component, 'fragmentFocus');
    component.ngAfterViewInit();
    expect(component.fragmentFocus).toHaveBeenCalled();
  });

  it('should save hearing condition and navigate to change link', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    const hearingCondition: HearingConditions = {
      fragmentId: 'point-to-me',
      mode: Mode.VIEW_EDIT,
      isHearingAmendmentsEnabled: true
    };
    const editHearingChangeConfig: EditHearingChangeConfig = {
      fragmentId: 'point-to-me',
      changeLink: 'hearing/request/venue'
    };
    component.onChange(editHearingChangeConfig);
    expect(storeDispatchSpy).toHaveBeenCalledWith(new fromHearingStore.SaveHearingConditions(hearingCondition));
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('hearing/request/venue');
  });

  it('should set propertiesUpdatedOnPageVisit', () => {
    spyOn(store, 'select').and.returnValue(of(initialState.hearings.hearingValues));
    component.serviceHearingValuesModel = initialState.hearings.hearingValues.serviceHearingValuesModel;
    component.ngOnInit();
    const expectedResult: PropertiesUpdatedOnPageVisit = {
      hearingId: '1000000',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: true,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    expect(hearingsService.propertiesUpdatedOnPageVisit).toEqual(expectedResult);
  });

  it('should set hearingRequestForSubmitValid to false on initialising page.', () => {
    component.ngOnInit();
    expect(hearingsService.hearingRequestForSubmitValid).toEqual(false);
  });

  it('should return reasonableAdjustmentChangesRequired and partyDetailsChangesRequired as true if interpreter language changed', () => {
    const partiesSHV: PartyDetailsModel[] = [
      {
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
            'RA0042'
          ],
          interpreterLanguage: 'spa'
        },
        unavailabilityRanges: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ];
    const partiesHMC: PartyDetailsModel[] = [
      {
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
            'RA0042'
          ]
        },
        unavailabilityRanges: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ];
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };
    component.ngOnInit();
    const expectedResult: PropertiesUpdatedOnPageVisit = {
      hearingId: '1000000',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: true,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    expect(hearingsService.propertiesUpdatedOnPageVisit).toEqual(expectedResult);
  });

  it('should set the pagesToDispaly', () => {
    const sectionsToDisplay = [
      'hearing-requirements',
      'hearing-facilities',
      'hearing-stage',
      'hearing-attendance',
      'hearing-venue',
      'hearing-welsh',
      'hearing-judge',
      'hearing-panel',
      'hearing-timing',
      'hearing-link',
      'hearing-additional-instructions'
    ];
    component.ngOnInit();
    expect(component.sectionsToDisplay).toEqual(sectionsToDisplay);
  });

  it('should set reasonableAdjustmentChangesRequired to false if hearing requirements is not present in the screen flow', () => {
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      screenFlow: [
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
          screenName: 'hearing-additional-instructions',
          navigation: [
            {
              resultValue: 'hearing-create-edit-summary'
            }
          ]
        }
      ]
    };
    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesRequired).toEqual(false);
  });

  it('should set hearingWindowChangesRequired to false if hearingWindowChangesConfirmed', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesConfirmed: false,
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesConfirmed: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false,
        hearingWindowChangesConfirmed: true
      }
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingWindowChangesRequired).toEqual(false);
  });

  it('should set hearingWindowChangesRequired to false if no hearing window', () => {
    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.hearingRequestMainModel.hearingDetails.hearingWindow = null;
    component.serviceHearingValuesModel.hearingWindow = null;
    component.hearingRequestMainModel.hearingDetails.duration = null;
    component.serviceHearingValuesModel.duration = null;
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingWindowChangesRequired).toEqual(false);
  });

  it('should set partyDetailsChangesRequired to false if partyDetailsChangesConfirmed', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesConfirmed: false,
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesConfirmed: false,
        partyDetailsChangesRequired: false,
        partyDetailsChangesConfirmed: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false,
        hearingWindowChangesConfirmed: false
      }
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesRequired).toEqual(false);
  });

  it('should set reasonableAdjustmentChangesRequired to false if reasonable adjustments changes confirmed', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesConfirmed: true,
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesConfirmed: true,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: true
      }
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesRequired).toEqual(false);
  });

  it('should set nonReasonableAdjustmentChangesRequired to false if hearing facilities is not present in the screen flow', () => {
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      screenFlow: [
        {
          screenName: 'hearing-stage',
          navigation: [
            {
              resultValue: 'hearing-attendance'
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
      ]
    };
    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.nonReasonableAdjustmentChangesRequired).toEqual(false);
  });

  it('should pageVisitNonReasonableAdjustmentChangeExists return false if non-reasonable adjustment changes already confirmed', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesConfirmed: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.nonReasonableAdjustmentChangesRequired).toEqual(false);
  });

  it('should set the hearingWindowChangesRequired to true', () => {
    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.hearingRequestMainModel.hearingDetails.hearingWindow = {
      firstDateTimeMustBe: '2024-02-01T10:00:00'
    };
    component.serviceHearingValuesModel.parties[0].unavailabilityRanges = [{
      unavailableFromDate: '2024-05-01T10:00:00',
      unavailableToDate: '2024-05-14T10:00:00',
      unavailabilityType: UnavailabilityType.ALL_DAY
    }];
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingWindowChangesRequired).toEqual(true);
  });

  it('should remove nulls and order unavailability ranges to consistent order, values differ', () => {
    component.hearingRequestToCompareMainModel = _.cloneDeep(initialState.hearings.hearingRequestToCompare.hearingRequestMainModel);
    component.serviceHearingValuesModel = _.cloneDeep(initialState.hearings.hearingValues.serviceHearingValuesModel);
    component.serviceHearingValuesModel.parties = [
      {
        partyID: 'P1',
        partyName: 'Jane Smith',
        partyType: PartyType.IND,
        partyRole: 'New appellant',
        individualDetails: {
          title: 'Miss',
          firstName: 'Jane',
          lastName: 'Smith',
          reasonableAdjustments: null,
          interpreterLanguage: 'PF0015',
          preferredHearingChannel: 'byVideo',
          relatedParties: null,
          custodyStatus: 'New custody status',
          vulnerableFlag: true,
          vulnerabilityDetails: 'New vulnerability details',
          hearingChannelEmail: ['New email'],
          hearingChannelPhone: ['New Phone']
        },
        unavailabilityDOW: null,
        unavailabilityRanges: [{
          unavailableFromDate: '2024-01-01T10:00:00',
          unavailableToDate: '2024-01-14T10:00:00',
          unavailabilityType: UnavailabilityType.ALL_DAY
        },
        {
          unavailableFromDate: '2024-03-01T10:00:00',
          unavailableToDate: '2024-03-14T10:00:00',
          unavailabilityType: UnavailabilityType.ALL_DAY
        },
        {
          unavailableFromDate: '2024-03-01T10:00:00',
          unavailableToDate: '2024-03-12T10:00:00',
          unavailabilityType: UnavailabilityType.ALL_DAY
        },
        {
          unavailableFromDate: '2024-02-01T10:00:00',
          unavailableToDate: '2024-02-14T10:00:00',
          unavailabilityType: UnavailabilityType.ALL_DAY
        }]
      }];
    component.hearingRequestToCompareMainModel.partyDetails[0].unavailabilityRanges = [{
      unavailableFromDate: '2024-02-01T10:00:00',
      unavailableToDate: '2024-02-14T10:00:00',
      unavailabilityType: UnavailabilityType.ALL_DAY
    },
    {
      unavailableFromDate: '2024-03-01T10:00:00',
      unavailableToDate: '2024-03-14T10:00:00',
      unavailabilityType: UnavailabilityType.ALL_DAY
    }, null,
    {
      unavailableFromDate: '2024-01-01T10:00:00',
      unavailableToDate: '2024-01-14T10:00:00',
      unavailabilityType: UnavailabilityType.ALL_DAY
    }];
    component.ngOnInit();
    expect(component.hasHearingRequestPartiesUnavailableDatesChanged()).toEqual(true);
  });

  it('should remove nulls and order unavailability ranges to consistent order, values the same', () => {
    component.hearingRequestToCompareMainModel = _.cloneDeep(initialState.hearings.hearingRequestToCompare.hearingRequestMainModel);
    component.serviceHearingValuesModel = _.cloneDeep(initialState.hearings.hearingValues.serviceHearingValuesModel);
    component.serviceHearingValuesModel.parties = [
      {
        partyID: 'P1',
        partyName: 'Jane Smith',
        partyType: PartyType.IND,
        partyRole: 'New appellant',
        individualDetails: {
          title: 'Miss',
          firstName: 'Jane',
          lastName: 'Smith',
          reasonableAdjustments: null,
          interpreterLanguage: 'PF0015',
          preferredHearingChannel: 'byVideo',
          relatedParties: null,
          custodyStatus: 'New custody status',
          vulnerableFlag: true,
          vulnerabilityDetails: 'New vulnerability details',
          hearingChannelEmail: ['New email'],
          hearingChannelPhone: ['New Phone']
        },
        unavailabilityDOW: null,
        unavailabilityRanges: [{
          unavailableFromDate: '2024-01-01T10:00:00.000Z',
          unavailableToDate: '2024-01-14T10:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        },
        {
          unavailableFromDate: '2024-03-01T10:00:00.000Z',
          unavailableToDate: '2024-03-14T10:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        },
        {
          unavailableFromDate: '2024-03-01T10:00:00.000Z',
          unavailableToDate: '2024-03-12T10:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        },
        {
          unavailableFromDate: '2024-02-01T10:00:00.000Z',
          unavailableToDate: '2024-02-14T10:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        },
        {
          unavailableFromDate: '2021-12-20T09:00:00.000Z',
          unavailableToDate: '2021-12-31T09:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        }]
      }
    ];
    component.hearingRequestToCompareMainModel.partyDetails[0].unavailabilityRanges = [{
      unavailableFromDate: '2024-02-01T10:00:00.000Z',
      unavailableToDate: '2024-02-14T10:00:00.000Z',
      unavailabilityType: UnavailabilityType.ALL_DAY
    },
    {
      unavailableFromDate: '2024-03-01T10:00:00.000Z',
      unavailableToDate: '2024-03-14T10:00:00.000Z',
      unavailabilityType: UnavailabilityType.ALL_DAY
    }, null,
    {
      unavailableFromDate: '2024-01-01T10:00:00.000Z',
      unavailableToDate: '2024-01-14T10:00:00.000Z',
      unavailabilityType: UnavailabilityType.ALL_DAY
    }, undefined,
    {
      unavailableFromDate: '2024-03-01T10:00:00.000Z',
      unavailableToDate: '2024-03-12T10:00:00.000Z',
      unavailabilityType: UnavailabilityType.ALL_DAY
    }];
    component.ngOnInit();
    expect(component.hasHearingRequestPartiesUnavailableDatesChanged()).toEqual(false);
  });

  it('should set the hearingWindowChangesRequired to false', () => {
    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.hearingRequestMainModel.hearingDetails.hearingWindow = component.serviceHearingValuesModel.hearingWindow;
    component.serviceHearingValuesModel.parties = initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.partyDetails;
    component.serviceHearingValuesModel.duration = 60;
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingWindowChangesRequired).toEqual(false);
  });

  it('should update the case details properties automatically setPropertiesUpdatedAutomatically', () => {
    component.serviceHearingValuesModel.hmctsInternalCaseName = 'New hmcts case name from service hearings';
    component.serviceHearingValuesModel.publicCaseName = 'New public case name from service hearings';
    component.serviceHearingValuesModel.caseManagementLocationCode = 'New location code';
    component.serviceHearingValuesModel.caseInterpreterRequiredFlag = true;
    component.serviceHearingValuesModel.caserestrictedFlag = true;
    component.serviceHearingValuesModel.caseCategories = categories;
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    const expectedResult = { ...component.hearingRequestMainModel.caseDetails };
    expectedResult.hmctsInternalCaseName = 'New hmcts case name from service hearings';
    expectedResult.publicCaseName = 'New public case name from service hearings';
    expectedResult.caseManagementLocationCode = 'New location code';
    expectedResult.caseInterpreterRequiredFlag = true;
    expectedResult.caserestrictedFlag = true;
    expectedResult.caseCategories = [...categories];
    expect(component.hearingRequestMainModel.caseDetails).toEqual(expectedResult);
    expect(storeDispatchSpy).toHaveBeenCalledWith(new fromHearingStore.UpdateHearingRequest(component.hearingRequestMainModel, component.hearingCondition));
    storeDispatchSpy.calls.reset();
  });

  it('should update the hearing details properties automatically setPropertiesUpdatedAutomatically', () => {
    component.serviceHearingValuesModel.privateHearingRequiredFlag = true;
    component.serviceHearingValuesModel.hearingInWelshFlag = true;
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    const expectedResult = { ...component.hearingRequestMainModel.hearingDetails };
    expectedResult.privateHearingRequiredFlag = true;
    expectedResult.hearingInWelshFlag = true;
    expect(component.hearingRequestMainModel.hearingDetails).toEqual(expectedResult);
    expect(storeDispatchSpy).toHaveBeenCalledWith(new fromHearingStore.UpdateHearingRequest(component.hearingRequestMainModel, component.hearingCondition));
    storeDispatchSpy.calls.reset();
  });

  it('should update the party details properties automatically setPropertiesUpdatedAutomatically', () => {
    component.serviceHearingValuesModel = _.cloneDeep(initialState.hearings.hearingValues.serviceHearingValuesModel);
    component.serviceHearingValuesModel.parties = [
      {
        partyID: 'P1',
        partyName: 'Jane Smith',
        partyType: PartyType.IND,
        partyRole: 'New appellant',
        individualDetails: {
          title: 'Miss',
          firstName: 'Jane',
          lastName: 'Smith',
          reasonableAdjustments: [
            'RA0042',
            'RA0053',
            'RA0013',
            'RA0016',
            'RA0042',
            'RA0009'
          ],
          interpreterLanguage: 'PF0015',
          preferredHearingChannel: 'byVideo',
          relatedParties: [{
            relatedPartyID: 'New party Id',
            relationshipType: 'new releationship type'
          }],
          custodyStatus: 'New custody status',
          vulnerableFlag: true,
          vulnerabilityDetails: 'New vulnerability details',
          hearingChannelEmail: ['New email'],
          hearingChannelPhone: ['New Phone']
        },
        unavailabilityDOW: null,
        unavailabilityRanges: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ];
    component.serviceHearingValuesModel.hearingInWelshFlag = true;
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    const expectedResult = [
      {
        partyID: 'P1',
        partyType: PartyType.IND,
        partyRole: 'New appellant',
        individualDetails: {
          title: 'Miss',
          firstName: 'Jane',
          lastName: 'Smith',
          reasonableAdjustments: [
            'RA0042',
            'RA0053',
            'RA0013',
            'RA0016',
            'RA0042'
          ],
          interpreterLanguage: 'spa',
          preferredHearingChannel: 'inPerson',
          relatedParties: [{
            relatedPartyID: 'New party Id',
            relationshipType: 'new releationship type'
          }],
          custodyStatus: 'New custody status',
          vulnerableFlag: true,
          vulnerabilityDetails: 'New vulnerability details',
          hearingChannelEmail: ['New email'],
          hearingChannelPhone: ['New Phone']
        },
        unavailabilityDOW: null,
        unavailabilityRanges: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ];
    expect(component.hearingRequestMainModel.partyDetails).toEqual(expectedResult);
    expect(storeDispatchSpy).toHaveBeenCalledWith(new fromHearingStore.UpdateHearingRequest(component.hearingRequestMainModel, component.hearingCondition));
    storeDispatchSpy.calls.reset();
  });

  it('should set auto updated properties withing page to true', () => {
    component.serviceHearingValuesModel.hmctsInternalCaseName = 'New hmcts case name from service hearings';
    component.serviceHearingValuesModel.publicCaseName = 'New public case name from service hearings';
    component.serviceHearingValuesModel.privateHearingRequiredFlag = true;
    component.serviceHearingValuesModel.caserestrictedFlag = true;

    component.ngOnInit();
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.hmctsInternalCaseName).toEqual(true);
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.publicCaseName).toEqual(true);
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.privateHearingRequiredFlag).toEqual(true);
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.caserestrictedFlag).toEqual(true);
  });

  it('should set auto updated pageless properties to true', () => {
    component.serviceHearingValuesModel.caseManagementLocationCode = 'New case management code';
    component.serviceHearingValuesModel.parties[0].partyRole = 'New party role';
    component.serviceHearingValuesModel.parties[0].individualDetails.relatedParties = [];
    component.ngOnInit();
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.pageless.caseManagementLocationCode).toEqual(true);
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.pageless.parties).toEqual(true);
  });

  it('should set auto updated case type id in array, if new case type is added', () => {
    component.serviceHearingValuesModel.caseCategories = categories;
    component.ngOnInit();
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.caseCategories).toEqual(['BBA3-003', 'BBA3-002']);
  });

  it('should set auto updated case type id in array, if existing case type is changed', () => {
    categories[0].categoryValue = 'BBA3-002';
    component.serviceHearingValuesModel.caseCategories = categories;
    component.ngOnInit();
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.caseCategories).toEqual(['BBA3-002']);
  });

  it('should set auto updated pageless properties to true', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h1234',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    // @ts-ignore
    expect(component.pageVisitPartiesChangeExists()).toEqual(false);
  });

  it('should partyDetailsChangesRequired return true', () => {
    spyOn(store, 'select').and.returnValue(of(initialState.hearings.hearingValues));
    const parties = [
      {
        partyID: 'P1',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Smith',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane updated',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: [
            'RA0042'
          ]
        },
        unavailabilityRanges: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        partyName: 'DWP',
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityRanges: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ];
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: parties
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesRequired).toEqual(true);
  });

  it('should partyDetailsChangesRequired return true if party type changed', () => {
    component.serviceHearingValuesModel = _.cloneDeep(initialState.hearings.hearingValues.serviceHearingValuesModel);

    const parties = [...initialState.hearings.hearingRequest.hearingRequestMainModel.partyDetails];
    parties[0].partyType = PartyType.ORG;
    component.serviceHearingValuesModel = {
      ...component.serviceHearingValuesModel,
      parties: parties
    };

    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h1234',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesRequired).toEqual(true);
  });

  it('should pageVisitPartiesChangeExists call hasPartyNameChanged', () => {
    spyOn(HearingsUtils, 'hasPartyNameChanged').and.returnValue(true);
    const parties = _.cloneDeep(component.hearingRequestMainModel.partyDetails);
    const party: PartyDetailsModel = parties.find((party) => party.individualDetails);
    party.individualDetails.firstName = 'Will';

    component.serviceHearingValuesModel = _.cloneDeep(initialState.hearings.hearingValues.serviceHearingValuesModel);
    component.serviceHearingValuesModel = {
      ...component.serviceHearingValuesModel,
      parties: parties
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h1234',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(HearingsUtils.hasPartyNameChanged).toHaveBeenCalled();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesRequired).toEqual(true);
  });

  it('should pageVisitPartiesChangeExists when party not present in HMC', () => {
    const parties = _.cloneDeep(component.hearingRequestMainModel.partyDetails);
    const party: PartyDetailsModel = parties.find((party) => party.individualDetails);
    party.partyID = 'newAdded';

    component.serviceHearingValuesModel = _.cloneDeep(initialState.hearings.hearingValues.serviceHearingValuesModel);
    component.serviceHearingValuesModel = {
      ...component.serviceHearingValuesModel,
      parties: parties
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h1234',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesRequired).toEqual(true);
  });

  it('should pageVisitPartiesChangeExists when hearing channel not set', () => {
    const parties = _.cloneDeep(component.hearingRequestMainModel.partyDetails);
    const party: PartyDetailsModel = parties.find((party) => party.individualDetails);
    party.individualDetails.preferredHearingChannel = null;

    component.hearingRequestMainModel = {
      ...component.hearingRequestMainModel,
      partyDetails: parties
    };

    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h1234',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        partyDetailsChangesConfirmed: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesRequired).toEqual(true);
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesConfirmed).toEqual(undefined);
  });

  it('should pageVisitHearingFacilitiesChanged return true if hearing facilties changed', () => {
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      hearingDetails: {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
        facilitiesRequired: ['11', '22']
      }
    };
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      facilitiesRequired: ['12', '23']
    };
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingFacilitiesChangesRequired).toEqual(true);
  });

  describe('Display of warning and error message', () => {
    it('should display banner message', () => {
      component.serviceHearingValuesModel.caseManagementLocationCode = 'New Management location code';
      component.serviceHearingValuesModel.privateHearingRequiredFlag = true;
      component.serviceHearingValuesModel.hearingInWelshFlag = true;
      component.ngOnInit();
      expect(component.isPagelessAttributeChanged).toEqual(true);
      expect(component.isWithinPageAttributeChanged).toEqual(true);
    });

    it('should display banner message', () => {
      component.serviceHearingValuesModel.caseFlags = { flags: [], flagAmendURL: '/' };
      component.serviceHearingValuesModel.parties = [];
      component.hearingRequestMainModel.partyDetails = [];
      component.hearingRequestMainModel.hearingDetails.hearingWindow = {};
      component.serviceHearingValuesModel.hearingWindow = {};
      component.serviceHearingValuesModel.privateHearingRequiredFlag = true;
      component.serviceHearingValuesModel.hearingInWelshFlag = true;
      const storeDispatchSpy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(component.isPagelessAttributeChanged).toEqual(true);
      expect(component.isWithinPageAttributeChanged).toEqual(true);
      storeDispatchSpy.calls.reset();
    });
  });

  it('should set auto updated properties withing page to true', () => {
    component.serviceHearingValuesModel.hmctsInternalCaseName = 'New hmcts case name from service hearings';
    component.serviceHearingValuesModel.publicCaseName = 'New public case name from service hearings';
    component.serviceHearingValuesModel.privateHearingRequiredFlag = true;
    component.serviceHearingValuesModel.caserestrictedFlag = true;
    component.serviceHearingValuesModel.parties[0].unavailabilityDOW = [{
      DOW: DOW.Friday,
      DOWUnavailabilityType: DOWUnavailabilityType.AM
    }];

    component.ngOnInit();
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.hmctsInternalCaseName).toEqual(true);
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.publicCaseName).toEqual(true);
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.privateHearingRequiredFlag).toEqual(true);
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.withinPage.caserestrictedFlag).toEqual(true);
  });

  it('should set auto updated pageless properties to true', () => {
    component.serviceHearingValuesModel.caseManagementLocationCode = 'New case management code';
    component.serviceHearingValuesModel.parties[0].partyRole = 'New party role';
    component.serviceHearingValuesModel.parties[0].individualDetails.relatedParties = [];
    component.ngOnInit();
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.pageless.caseManagementLocationCode).toEqual(true);
    // @ts-ignore
    expect(component.hearingsService.propertiesUpdatedAutomatically.pageless.parties).toEqual(true);
  });

  it('should not have validation error if changes exists', () => {
    component.executeAction(ACTION.VIEW_EDIT_REASON);
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should have validation error if there is no change', () => {
    component.hearingRequestMainModel = Object.assign({ hearingDetails: { hearingChannels: [HearingChannelEnum.ONPPR] } });
    component.hearingRequestToCompareMainModel = Object.assign({ hearingDetails: { hearingChannels: [HearingChannelEnum.ONPPR] } });
    component.executeAction(ACTION.VIEW_EDIT_REASON);
    expect(component.validationErrors.length).toEqual(1);
    expect(hearingsService.displayValidationError).toEqual(false);
  });

  it('should navigate to hearing view summary page', () => {
    component.executeAction(ACTION.BACK);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'hearings', 'request', 'hearing-view-summary']);
  });

  it('should have validation error if individualDetails party contains default null values and order of parties has changed', () => {
    const partyDetails: PartyDetailsModel[] = [
      {
        partyID: 'P2',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRanges: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P1',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Rogers',
        individualDetails: {
          title: 'Miss',
          firstName: 'Jane',
          lastName: 'Rogers',
          reasonableAdjustments: [
            'RA0042',
            'RA0053',
            'RA0013',
            'RA0016',
            'RA0042',
            'RA0009'
          ],
          interpreterLanguage: 'spa',
          preferredHearingChannel: 'byVideo',
          custodyStatus: null,
          vulnerabilityDetails: null
        },
        unavailabilityDOW: null,
        unavailabilityRanges: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ];

    component.hearingRequestMainModel = {
      ...component.hearingRequestToCompareMainModel,
      partyDetails: partyDetails
    };

    component.executeAction(ACTION.VIEW_EDIT_REASON);
    expect(component.validationErrors.length).toEqual(1);
    expect(hearingsService.displayValidationError).toEqual(false);
  });

  it('should nonReasonableAdjustmentChangesRequired be set to true', () => {
    component.ngOnInit();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.nonReasonableAdjustmentChangesRequired).toEqual(true);
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should set propertiesUpdatedOnPageVisit when case flags not present', () => {
    const parties = initialState.hearings.hearingValues.serviceHearingValuesModel.parties;
    parties[0].individualDetails.interpreterLanguage = 'spa';

    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: [...parties],
      caseFlags: undefined
    };

    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.ngOnInit();
    const expectedResult: PropertiesUpdatedOnPageVisit = {
      hearingId: '1000000',
      caseFlags: undefined,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: true,
        partyDetailsAnyChangesRequired: true,
        hearingUnavailabilityDatesChanged: true
      }
    };
    expect(hearingsService.propertiesUpdatedOnPageVisit).toEqual(expectedResult);
  });

  it('Welsh language flag should not display', () => {
    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.ngOnInit();

    const result$ = component.showLanguageRequirementsSection$;
    const toShow = false;
    const expected = cold('(b|)', { b: toShow });
    expect(result$).toBeObservable(expected);
  });

  it('Welsh language flag should display', () => {
    locations[0].region_id = '7';

    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.ngOnInit();

    const result$ = component.showLanguageRequirementsSection$;
    const toShow = true;
    const expected = cold('(b|)', { b: toShow });
    expect(result$).toBeObservable(expected);
  });

  it('should return false as no difference in reasonable adjustment', () => {
    setAfterPageVisitValues();
    const partiesSHV = createSHVEntry();
    const partiesHMC = createHMCEntry();

    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(false);
  });

  it('should return true as reasonable adjustment required but not confirmed.', () => {
    setAfterPageVisitValues();
    hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesRequired = true;

    const partiesSHV = createSHVEntry();
    const partiesHMC = createHMCEntry();

    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(true);
  });

  it('should return false as reasonable adjustment required and confirmed.', () => {
    setAfterPageVisitValues();
    hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesRequired = true;
    hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesConfirmed = true;
    const partiesSHV = createSHVEntry();
    const partiesHMC = createHMCEntry();

    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(false);
  });

  it('should return true as there is a difference in reasonable adjustment', () => {
    setAfterPageVisitValues();
    hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesRequired = true;
    const partiesSHV = createSHVEntry();
    const partiesHMC = createHMCEntry();
    partiesHMC[1].individualDetails.reasonableAdjustments = ['RA0041', 'RA0044', 'RA0042'];

    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(true);
  });

  it('should return false as removed party had no reasonable adjustments', () => {
    setAfterPageVisitValues();
    const partiesSHV: PartyDetailsModel[] = createSHVEntry();

    const partiesHMC: PartyDetailsModel[] = createHMCEntry();
    partiesHMC.push(
      {
        partyID: 'P3',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Doe',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Doe',
          preferredHearingChannel: 'inPerson'
        }
      }
    );
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(false);
  });

  it('should return false as removed party had no reasonable adjustments test 2', () => {
    setAfterPageVisitValues();
    const partiesSHV: PartyDetailsModel[] = createSHVEntry();

    const partiesHMC: PartyDetailsModel[] = createHMCEntry();
    partiesHMC.push(
      {
        partyID: 'P3',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Doe',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Doe',
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: []
        }
      }
    );
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(false);
  });

  it('should return false as added party had no reasonable adjustments', () => {
    setAfterPageVisitValues();
    const partiesSHV: PartyDetailsModel[] = createSHVEntry();

    const partiesHMC: PartyDetailsModel[] = createHMCEntry();
    partiesSHV.push(
      {
        partyID: 'P3',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Doe',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Doe',
          preferredHearingChannel: 'inPerson'
        }
      }
    );
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(false);
  });

  it('should return true as party removed from original hmc with reasonable adjustment', () => {
    setAfterPageVisitValues();
    hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesRequired = true;
    const partiesSHV = createSHVEntry();
    const partiesHMC = createHMCEntry();

    partiesHMC.push(
      {
        partyID: 'P3',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Smith',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: [
            'RA0045',
            'RA0046',
            'RA0047'
          ]
        }
      });
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(true);
  });

  it('should return true as party to original shv with reasonable adjustment', () => {
    setAfterPageVisitValues();
    hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesRequired = true;
    const partiesSHV = createSHVEntry();
    const partiesHMC = createHMCEntry();

    partiesSHV.push(
      {
        partyID: 'P3',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Smith',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: [
            'RA0045',
            'RA0046',
            'RA0047'
          ]
        }
      });
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partiesSHV
    };
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partiesHMC
    };

    const isDifference = component.pageVisitReasonableAdjustmentChangeExists();

    expect(isDifference).toEqual(true);
  });

  it('should return true as as priority in SHV has been updated', () => {
    setAfterPageVisitValues();
    hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingWindowChangesConfirmed = false;
    const shvModel: ServiceHearingValuesModel = JSON.parse(JSON.stringify(initialState.hearings.hearingValues.serviceHearingValuesModel));
    const hmcModel: HearingRequestMainModel = JSON.parse(JSON.stringify(initialState.hearings.hearingRequest.hearingRequestMainModel));
    shvModel.hearingPriorityType = 'urgent';
    hmcModel.hearingDetails.hearingPriorityType = 'standard';

    component.serviceHearingValuesModel = shvModel;
    component.hearingRequestMainModel = hmcModel;
    component.ngOnInit();
    const isDifference = hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingWindowChangesRequired;

    expect(isDifference).toEqual(true);
  });

  function createSHVEntry() {
    const partiesSHV: PartyDetailsModel[] = [
      {
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
            'RA0043',
            'RA0041'
          ]
        }
      },
      {
        partyID: 'P2',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Doe',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Doe',
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: [
            'RA0032',
            'RA0033',
            'RA0031',
            'H00002'
          ]
        }
      }
    ];
    return partiesSHV;
  }

  function createHMCEntry() {
    const partiesHMC: PartyDetailsModel[] = [
      {
        partyID: 'P2',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Doe',
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Doe',
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: [
            'RA0031',
            'RA0033',
            'RA0032',
            'GA0001'
          ]
        }
      },
      {
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
            'RA0041',
            'RA0043',
            'RA0042'
          ]
        }
      }
    ];
    return partiesHMC;
  }
  function setAfterPageVisitValues() {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesConfirmed: false,
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesConfirmed: false,
        partyDetailsChangesRequired: false,
        partyDetailsChangesConfirmed: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        partyDetailsAnyChangesRequired: false,
        hearingUnavailabilityDatesChanged: false,
        hearingWindowChangesConfirmed: false
      }
    };
  }
});
