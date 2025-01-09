import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initialState } from '../../../../hearing.test.data';
import { LovRefDataModel } from '../../../../models/lovRefData.model';
import { HearingsService } from '../../../../services/hearings.service';
import { HearingTimingSectionComponent } from './hearing-timing-section.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnavailabilityType } from '../../../../models/hearings.enum';

describe('HearingTimingSectionComponent', () => {
  let component: HearingTimingSectionComponent;
  let fixture: ComponentFixture<HearingTimingSectionComponent>;
  let nativeElement: any;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  const hearingsService = new HearingsService(mockedHttpClient);

  const hearingPrioritiesRefData: LovRefDataModel[] = [
    {
      key: 'urgent',
      value_en: 'Urgent',
      value_cy: '',
      hint_text_en: 'Urgent',
      hint_text_cy: '',
      lov_order: 1,
      parent_key: null,
      parent_category: null,
      category_key: null,
      active_flag: 'Y'
    },
    {
      key: 'standard',
      value_en: 'Standard',
      value_cy: '',
      hint_text_en: 'Standard',
      hint_text_cy: '',
      lov_order: 2,
      parent_key: null,
      parent_category: null,
      category_key: null,
      active_flag: 'Y'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        HearingTimingSectionComponent
      ],
      providers: [
        { provide: HearingsService, useValue: hearingsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingTimingSectionComponent);
    component = fixture.componentInstance;
    component.hearingPrioritiesRefData = hearingPrioritiesRefData;
    nativeElement = fixture.debugElement.nativeElement;
    component.hearingRequestMainModel = initialState.hearings.hearingRequest.hearingRequestMainModel;
    component.hearingRequestToCompareMainModel = initialState.hearings.hearingRequestToCompare.hearingRequestMainModel;
    component.serviceHearingValuesModel = initialState.hearings.hearingValues.serviceHearingValuesModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify component data', () => {
    component.hearingRequestMainModel.hearingDetails.duration = 60;
    component.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-12-12T09:00:00.000Z',
      dateRangeEnd: '2022-12-12T09:00:00.000Z',
      firstDateTimeMustBe: ''
    };
    component.hearingRequestMainModel.hearingDetails.hearingPriorityType = 'standard';
    component.ngOnInit();
    expect(component.hearingLength).toEqual('1 Hour');
    expect(component.specificDate).toEqual('Choose a date range<br>Earliest start date: 12 December 2022<br>Latest end date: 12 December 2022');
    expect(component.hearingPriority).toEqual('Standard');
  });

  it('should display action needed label where window changed', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.hearingWindowChangesRequired).toEqual(true);
    expect(component.hearingWindowChangesConfirmed).toBeUndefined();
    expect(nativeElement.querySelector('#hearing-window-action-needed-label')).toBeDefined();
    expect(nativeElement.querySelector('#hearing-window-amended-label')).toBeNull();
  });

  it('should display amended label', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: true,
        hearingWindowChangesConfirmed: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false,
        hearingUnavailabilityDatesConfirmed: true
      }
    };
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hearingWindowChangesRequired).toEqual(true);
    expect(component.hearingWindowChangesConfirmed).toEqual(true);
    expect(nativeElement.querySelector('#hearing-window-action-needed-label')).toBeNull();
    expect(nativeElement.querySelector('#hearing-window-amended-label')).toBeDefined();
  });

  it('should not display label', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.hearingWindowChangesRequired).toEqual(false);
    expect(nativeElement.querySelector('#hearing-window-action-needed-label')).toBeNull();
    expect(nativeElement.querySelector('#hearing-window-amended-label')).toBeDefined();
  });

  it('should display amended label for unavailability dates changed', () => {
    component.hearingRequestMainModel.partyDetails[0].unavailabilityRanges = [{
      unavailableFromDate: '2024-12-10T09:00:00.000Z',
      unavailableToDate: '2024-12-12T09:00:00.000Z',
      unavailabilityType: UnavailabilityType.ALL_DAY
    }];
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingWindowChangesConfirmed: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: true,
        hearingUnavailabilityDatesConfirmed: true
      }
    };
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hearingUnavailabilityDatesChanged).toEqual(true);
    expect(component.hearingUnavailabilityDatesConfirmed).toEqual(true);
    expect(nativeElement.querySelector('#hearing-window-action-needed-label')).toBeNull();
    expect(nativeElement.querySelector('#hearing-window-amended-label')).toBeDefined();
  });

  it('should display action label for unavailability dates changed', () => {
    component.serviceHearingValuesModel.parties[0].unavailabilityRanges = [{
      unavailableFromDate: '2024-12-10T09:00:00.000Z',
      unavailableToDate: '2024-12-12T09:00:00.000Z',
      unavailabilityType: UnavailabilityType.ALL_DAY
    }];
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingWindowChangesConfirmed: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: true,
        hearingUnavailabilityDatesConfirmed: false
      }
    };
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hearingUnavailabilityDatesChanged).toEqual(true);
    expect(component.hearingUnavailabilityDatesConfirmed).toEqual(false);
    expect(nativeElement.querySelector('#hearing-window-action-needed-label')).toBeDefined();
    expect(nativeElement.querySelector('#hearing-window-amended-label')).toBeNull();
  });

  it('should set the hearing length', () => {
    component.hearingRequestMainModel.hearingDetails.duration = 1365;
    component.ngOnInit();
    expect(component.hearingLength).toEqual('3 Days 4 Hours 45 Minutes');
  });

  it('should return the hearing length as empty string', () => {
    component.hearingRequestMainModel.hearingDetails.duration = null;
    component.ngOnInit();
    expect(component.hearingLength).toEqual('');
  });

  it('should return Yes as date selection', () => {
    component.hearingRequestMainModel.hearingDetails.hearingWindow = {
      firstDateTimeMustBe: '2022-12-01T09:00:00.000Z'
    };
    component.ngOnInit();
    expect(component.specificDateSelection).toEqual('Yes');
  });

  it('should return No as date selection', () => {
    component.hearingRequestMainModel.hearingDetails.hearingWindow = null;
    component.ngOnInit();
    expect(component.specificDateSelection).toEqual('No');
  });

  it('should return Choose a date range as date selection', () => {
    component.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-11-23T09:00:00.000Z',
      dateRangeEnd: '2022-11-30T09:00:00.000Z'
    };
    component.ngOnInit();
    expect(component.specificDateSelection).toEqual('Choose a date range');
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('hearingLength');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'hearingLength', changeLink: '/hearings/request/hearing-timing#durationdays'
    });
    component.onChange('hearingSpecificDate');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'hearingSpecificDate', changeLink: '/hearings/request/hearing-timing#hearingDateRange'
    });
    component.onChange('hearingPriority');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'hearingPriority', changeLink: '/hearings/request/hearing-timing#urgent'
    });
  });

  describe('hearingDateChanged', () => {
    it('should return true if date range changed', () => {
      component.hearingRequestMainModel = {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
          hearingWindow: {
            dateRangeStart: '2024-03-22T09:00:00.000Z',
            dateRangeEnd: '2024-03-26T09:00:00.000Z'
          }
        }
      };
      component.hearingRequestToCompareMainModel = {
        ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
          hearingWindow: {
            dateRangeStart: '2024-03-23T09:00:00.000Z',
            dateRangeEnd: '2024-03-27T09:00:00.000Z'
          }
        }
      };
      component.ngOnInit();
      expect(component.dateRangeStartChanged).toEqual(true);
      expect(component.dateRangeEndChanged).toEqual(true);
      expect(component.firstDateTimeMustBeChanged).toEqual(false);
      expect(component.hearingDateChanged).toEqual(true);
    });

    it('should return false if date range did not change', () => {
      component.hearingRequestMainModel = {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
          hearingWindow: {
            dateRangeStart: '2024-03-22T09:00:00.000Z',
            dateRangeEnd: '2024-03-26T09:00:00.000Z'
          }
        }
      };
      component.hearingRequestToCompareMainModel = {
        ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
          hearingWindow: {
            dateRangeStart: '2024-03-22T09:00:00.000Z',
            dateRangeEnd: '2024-03-26T09:00:00.000Z'
          }
        }
      };

      component.ngOnInit();
      expect(component.dateRangeStartChanged).toEqual(false);
      expect(component.dateRangeEndChanged).toEqual(false);
      expect(component.firstDateTimeMustBeChanged).toEqual(false);
      expect(component.hearingDateChanged).toEqual(false);
    });

    it('should return true if "firstDateTimeMustBe" changed', () => {
      component.hearingRequestMainModel = {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
          hearingWindow: {
            firstDateTimeMustBe: '2024-03-22T09:00:00.000Z'
          }
        }
      };
      component.hearingRequestToCompareMainModel = {
        ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
          hearingWindow: {
            firstDateTimeMustBe: '2024-03-23T09:00:00.000Z'
          }
        }
      };
      component.ngOnInit();
      expect(component.dateRangeStartChanged).toEqual(false);
      expect(component.dateRangeEndChanged).toEqual(false);
      expect(component.firstDateTimeMustBeChanged).toEqual(true);
      expect(component.hearingDateChanged).toEqual(true);
    });

    it('should return false if "firstDateTimeMustBe" did not change', () => {
      component.hearingRequestMainModel = {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
          hearingWindow: {
            firstDateTimeMustBe: '2024-03-22T09:00:00.000Z'
          }
        }
      };
      component.hearingRequestToCompareMainModel = {
        ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
          hearingWindow: {
            firstDateTimeMustBe: '2024-03-22T09:00:00.000Z'
          }
        }
      };
      component.ngOnInit();
      expect(component.dateRangeStartChanged).toEqual(false);
      expect(component.dateRangeEndChanged).toEqual(false);
      expect(component.firstDateTimeMustBeChanged).toEqual(false);
      expect(component.hearingDateChanged).toEqual(false);
    });

    it('should return false if no hearing window', () => {
      component.hearingRequestToCompareMainModel = {
        ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
          hearingWindow: null
        }
      };
      component.hearingRequestMainModel = {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
          hearingWindow: null
        }
      };

      component.ngOnInit();
      expect(component.hearingDateChanged).toEqual(false);
    });
  });

  it('should return true if firstDateTimeMustBe is removed', () => {
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      hearingDetails: {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
        hearingWindow: {
          firstDateTimeMustBe: undefined
        }
      }
    };

    component.hearingRequestToCompareMainModel = {
      ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
      hearingDetails: {
        ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
        hearingWindow: {
          firstDateTimeMustBe: '2024-03-23T09:00:00.000Z'
        }
      }
    };
    component.ngOnInit();
    expect(component.hearingDateChanged).toEqual(true);
  });

  describe('testing the creation of the change url', () => {
    it('should return the correct URL fragment when earliestHearingDate or latestHearingDate is set', () => {
      component.earliestHearingDate = '2023-10-01';
      component.latestHearingDate = '2023-10-10';
      // eslint-disable-next-line dot-notation
      const result = component['setDateSectionForChange']();

      expect(result).toBe('/hearings/request/hearing-timing#hearingDateRange');
    });

    it('should return the correct URL fragment when firstHearingDate is set', () => {
      component.earliestHearingDate = '';
      component.latestHearingDate = '';
      component.firstHearingDate = '2023-10-01';
      // eslint-disable-next-line dot-notation
      const result = component['setDateSectionForChange']();

      expect(result).toBe('/hearings/request/hearing-timing#hearingSingleDate');
    });

    it('should return the default URL fragment when no dates are set', () => {
      component.earliestHearingDate = '';
      component.latestHearingDate = '';
      component.firstHearingDate = '';
      // eslint-disable-next-line dot-notation
      const result = component['setDateSectionForChange']();

      expect(result).toBe('/hearings/request/hearing-timing#noSpecificDate');
    });
  });
});
