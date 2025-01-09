import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initialState, partySubChannelsRefData } from '../../../../hearing.test.data';
import { AmendmentLabelStatus } from '../../../../models/hearingsUpdateMode.enum';
import { LovRefDataModel } from '../../../../models/lovRefData.model';
import { HearingsService } from '../../../../services/hearings.service';
import { ParticipantAttendanceSectionComponent } from './participant-attendance-section.component';

describe('ParticipantAttendanceSectionComponent', () => {
  let component: ParticipantAttendanceSectionComponent;
  let fixture: ComponentFixture<ParticipantAttendanceSectionComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  const hearingsService = new HearingsService(mockedHttpClient);

  const partyChannels: LovRefDataModel[] = [
    {
      key: 'inPerson',
      value_en: 'In person',
      value_cy: '',
      hint_text_en: 'in person',
      hint_text_cy: '',
      lov_order: 1,
      parent_key: null,
      category_key: 'HearingChannel',
      active_flag: 'Y',
      parent_category: null
    },
    {
      key: 'byPhone',
      value_en: 'By phone',
      value_cy: '',
      hint_text_en: 'By Phone',
      hint_text_cy: '',
      lov_order: 2,
      parent_key: null,
      category_key: 'HearingChannel',
      active_flag: 'Y',
      parent_category: null
    },
    {
      key: 'byVideo',
      value_en: 'By video',
      value_cy: '',
      hint_text_en: 'By video',
      hint_text_cy: '',
      lov_order: 4,
      parent_key: null,
      category_key: 'HearingChannel',
      active_flag: 'Y',
      parent_category: null
    },
    {
      key: 'notAttending',
      value_en: 'Not attending',
      value_cy: '',
      hint_text_en: 'not attending',
      hint_text_cy: '',
      lov_order: 5,
      parent_key: null,
      category_key: 'HearingChannel',
      active_flag: 'Y',
      parent_category: null
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        ParticipantAttendanceSectionComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: HearingsService, useValue: hearingsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantAttendanceSectionComponent);
    component = fixture.componentInstance;
    component.partyChannelsRefData = partyChannels;
    component.partySubChannelsRefData = partySubChannelsRefData;
    component.hearingRequestMainModel = initialState.hearings.hearingRequest.hearingRequestMainModel;
    component.hearingRequestToCompareMainModel = initialState.hearings.hearingRequestToCompare.hearingRequestMainModel;
    component.serviceHearingValuesModel = initialState.hearings.hearingValues.serviceHearingValuesModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set participant attendance details', () => {
    expect(component.isPaperHearing).toEqual('No');
    expect(component.participantChannels).toEqual(['By phone']);
    expect(component.participantAttendanceModes).toEqual(
      [{ partyName: 'Jane Smith', channel: ' - By video', partyNameChanged: true, partyChannelChanged: true }]
    );
    expect(component.numberOfPhysicalAttendees).toEqual(3);
  });

  it('should display action needed label', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.partyDetailsChangesRequired).toEqual(true);
    expect(component.partyDetailsChangesConfirmed).toBeUndefined();
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
        partyDetailsChangesRequired: true,
        partyDetailsChangesConfirmed: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.partyDetailsChangesRequired).toEqual(true);
    expect(component.partyDetailsChangesConfirmed).toEqual(true);
  });

  it('should not display label', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.partyDetailsChangesRequired).toEqual(false);
    expect(component.partyDetailsChangesConfirmed).toBeUndefined();
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('paperHearing');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'paperHearing', changeLink: '/hearings/request/hearing-attendance#paperHearingYes'
    });
    component.onChange('howParticipantsAttendant');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'howParticipantsAttendant', changeLink: '/hearings/request/hearing-attendance#hearingLevelChannelList'
    });
    component.onChange('howAttendant');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'howAttendant', changeLink: '/hearings/request/hearing-attendance#partyChannel0'
    });
    component.onChange('attendantPersonAmount');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'attendantPersonAmount', changeLink: '/hearings/request/hearing-attendance#attendance-number'
    });
  });

  describe('pageTitleDisplayLabel', () => {
    it('should set pageTitleDisplayLabel to amended if hearing channel value is manually amended by user', () => {
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
          hearingFacilitiesChangesRequired: false,
          hearingUnavailabilityDatesChanged: false
        }
      };
      component.hearingRequestMainModel = {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
          hearingChannels: ['ONPPRS']
        }
      };
      component.ngOnInit();
      expect(component.pageTitleDisplayLabel).toEqual(AmendmentLabelStatus.AMENDED);
    });

    it('should set pageTitleDisplayLabel to amended if number of physical attendees manually amended by user', () => {
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
          hearingFacilitiesChangesRequired: false,
          hearingUnavailabilityDatesChanged: false
        }
      };
      component.hearingRequestMainModel = {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
          numberOfPhysicalAttendees: 10
        }
      };
      component.ngOnInit();
      expect(component.pageTitleDisplayLabel).toEqual(AmendmentLabelStatus.AMENDED);
    });

    it('should set pageTitleDisplayLabel to amended if participant channels manually amended by user', () => {
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
          hearingFacilitiesChangesRequired: false,
          hearingUnavailabilityDatesChanged: false
        }
      };
      component.hearingRequestMainModel = {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel,
        hearingDetails: {
          ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
          hearingChannels: []
        }
      };
      component.ngOnInit();
      expect(component.pageTitleDisplayLabel).toEqual(AmendmentLabelStatus.AMENDED);
    });

    it('should set pageTitleDisplayLabel to action needed if manual amendment changes exists and not confirmed', () => {
      hearingsService.propertiesUpdatedOnPageVisit = {
        hearingId: 'h000001',
        caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
        parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
        hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
        afterPageVisit: {
          reasonableAdjustmentChangesRequired: false,
          nonReasonableAdjustmentChangesRequired: false,
          nonReasonableAdjustmentChangesConfirmed: false,
          partyDetailsChangesRequired: true,
          partyDetailsChangesConfirmed: false,
          hearingWindowChangesRequired: false,
          hearingFacilitiesChangesRequired: false,
          hearingUnavailabilityDatesChanged: false
        }
      };
      component.ngOnInit();
      expect(component.pageTitleDisplayLabel).toEqual(AmendmentLabelStatus.ACTION_NEEDED);
    });

    it('should set pageTitleDisplayLabel to amended if manual amendment changes exists and confirmed', () => {
      hearingsService.propertiesUpdatedOnPageVisit = {
        hearingId: 'h000001',
        caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
        parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
        hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
        afterPageVisit: {
          reasonableAdjustmentChangesRequired: false,
          nonReasonableAdjustmentChangesRequired: false,
          nonReasonableAdjustmentChangesConfirmed: false,
          partyDetailsChangesRequired: true,
          partyDetailsChangesConfirmed: true,
          hearingWindowChangesRequired: false,
          hearingFacilitiesChangesRequired: false,
          hearingUnavailabilityDatesChanged: false
        }
      };
      component.ngOnInit();
      expect(component.pageTitleDisplayLabel).toEqual(AmendmentLabelStatus.AMENDED);
    });
  });
});
