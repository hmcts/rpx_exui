import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initialState } from '../../../../hearing.test.data';
import { LovRefDataModel } from '../../../../models/lovRefData.model';
import { HearingsService } from '../../../../services/hearings.service';
import { HearingTimingSectionComponent } from './hearing-timing-section.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HMCLocationType } from '../../../../models/hearings.enum';

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
    component.hearingDetails = initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify component data', () => {
    component.hearingDetails = {
      duration: 60,
      hearingType: 'final',
      hearingChannels: ['byPhone'],
      hearingLocations: [
        {
          locationId: '196538',
          locationType: HMCLocationType.COURT
        },
        {
          locationId: '234850',
          locationType: HMCLocationType.COURT
        }
      ],
      hearingIsLinkedFlag: false,
      hearingWindow: {
        dateRangeStart: '2022-12-12T09:00:00.000Z',
        dateRangeEnd: '2022-12-12T09:00:00.000Z',
        firstDateTimeMustBe: ''
      },
      privateHearingRequiredFlag: false,
      panelRequirements: null,
      autolistFlag: false,
      nonStandardHearingDurationReasons: [],
      hearingPriorityType: 'standard',
      numberOfPhysicalAttendees: 3,
      hearingInWelshFlag: false,
      facilitiesRequired: [
        'immigrationDetentionCentre',
        'inCameraCourt'
      ],
      listingComments: 'blah blah blah',
      hearingRequester: null,
      leadJudgeContractType: null,
      amendReasonCodes: null,
      listingAutoChangeReasonCode: null
    };
    component.ngOnInit();
    expect(component.hearingLength).toEqual('1 Hour');
    expect(component.specificDate).toEqual('Choose a date range<br>Earliest start date: 12 December 2022<br>Latest end date: 12 December 2022');
    expect(component.hearingPriority).toEqual('Standard');
  });

  it('should display action needed label', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: true
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
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: true,
        hearingWindowChangesConfirmed: true
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
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: false
      }
    };
    component.ngOnInit();
    expect(component.hearingWindowChangesRequired).toEqual(false);
    expect(nativeElement.querySelector('#hearing-window-action-needed-label')).toBeNull();
    expect(nativeElement.querySelector('#hearing-window-amended-label')).toBeDefined();
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('hearingLength');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'hearingLength', changeLink: '/hearings/request/hearing-timing#durationdays'
    });
    component.onChange('hearingSpecificDate');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'hearingSpecificDate', changeLink: '/hearings/request/hearing-timing#noSpecificDate'
    });
    component.onChange('hearingPriority');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'hearingPriority', changeLink: '/hearings/request/hearing-timing#urgent'
    });
  });
});
