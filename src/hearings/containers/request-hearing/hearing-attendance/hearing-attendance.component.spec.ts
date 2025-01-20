import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorMessage } from '@hmcts/ccd-case-ui-toolkit';
import { provideMockStore } from '@ngrx/store/testing';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { LovRefDataModel } from '../../../../hearings/models/lovRefData.model';
import { initialState } from '../../../hearing.test.data';
import { ACTION, HearingChannelEnum, PartyType, RadioOptions, UnavailabilityType } from '../../../models/hearings.enum';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { HearingsService } from '../../../services/hearings.service';
import { LovRefDataService } from '../../../services/lov-ref-data.service';
import { HearingsUtils } from '../../../utils/hearings.utils';
import { ValidatorsUtils } from '../../../utils/validators.utils';
import { HearingAttendanceComponent } from './hearing-attendance.component';

const refData: LovRefDataModel[] = [
  {
    key: 'INTER',
    value_en: 'In Person',
    value_cy: '',
    hint_text_en: 'In Person',
    hint_text_cy: '',
    lov_order: 1,
    parent_key: null,
    category_key: 'inPerson',
    parent_category: '',
    active_flag: 'Y',
    child_nodes: null,
    from: 'exui-default'
  },
  {
    key: 'TEL',
    value_en: 'Telephone',
    value_cy: '',
    hint_text_en: 'Telephone',
    hint_text_cy: '',
    lov_order: 2,
    parent_key: null,
    category_key: 'Telephone',
    parent_category: '',
    active_flag: 'Y',
    child_nodes: null,
    from: 'exui-default',
    selected: true
  }
];

const partyDetailsFromLatestSHV: PartyDetailsModel[] = [
  {
    partyID: 'P1',
    partyName: 'Jane and Smiths',
    partyType: PartyType.IND,
    partyRole: 'appellant',
    individualDetails: {
      title: 'Miss',
      firstName: 'Jane',
      lastName: 'Smiths',
      reasonableAdjustments: [
        'RA0042',
        'RA0053',
        'RA0013',
        'RA0016',
        'RA0042',
        'RA0009'
      ],
      interpreterLanguage: 'PF0015',
      preferredHearingChannel: 'byVideo'
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
    partyName: 'DWP Org',
    partyType: PartyType.ORG,
    partyRole: 'claimant',
    organisationDetails: {
      name: 'DWP Org',
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
    partyID: 'P3',
    partyName: 'Mark and Boysons',
    partyType: PartyType.IND,
    partyRole: 'appellant',
    individualDetails: {
      title: 'Mr',
      firstName: 'Mark',
      lastName: 'Boysons',
      reasonableAdjustments: [
        'RA0042',
        'RA0053',
        'RA0013'
      ],
      interpreterLanguage: 'PF0015',
      preferredHearingChannel: 'byVideo'
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

@Component({
  selector: 'exui-hearing-parties-title',
  template: ''
})
class MockHearingPartiesComponent {
  @Input() public error: ErrorMessage;
}

describe('HearingAttendanceComponent', () => {
  let component: HearingAttendanceComponent;
  let fixture: ComponentFixture<HearingAttendanceComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  const lovRefDataService = jasmine.createSpyObj('lovRefDataService', ['getListOfValues']);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HearingAttendanceComponent, MockHearingPartiesComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        { provide: LovRefDataService, useValue: lovRefDataService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hearingChannels: refData
              }
            },
            fragment: of('point-to-me')
          }
        },
        ValidatorsUtils,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingAttendanceComponent);
    component = fixture.componentInstance;
    spyOn(component, 'prepareHearingRequestData').and.callThrough();
    spyOn(component, 'isFormValid').and.callThrough();
    lovRefDataService.getListOfValues.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call prepareHearingRequestData when executeAction is called with a valid form', () => {
    component.attendanceFormGroup.controls.estimation.setValue(1);
    (component.attendanceFormGroup.controls.parties as FormArray).controls.forEach((element) => {
      element.value.individualDetails.preferredHearingChannel = 'inperson';
    });
    (component.attendanceFormGroup.controls.hearingLevelChannels as FormArray).controls
      .forEach((element: AbstractControl) => element.value.selected = true);
    component.executeAction(ACTION.CONTINUE);
    expect(component.prepareHearingRequestData).toHaveBeenCalled();
  });

  it('should NOT call prepareHearingRequestData when executeAction is called as form is invalid', () => {
    component.attendanceFormGroup.controls.estimation.setValue('10 days');
    component.attendanceFormGroup.controls.hearingLevelChannels.setErrors({ incoreect: true });
    component.executeAction(ACTION.CONTINUE);
    expect(component.prepareHearingRequestData).not.toHaveBeenCalled();
  });

  it('should update hearingRequestMainModel when executeAction and forms paperHearing is YES', () => {
    component.attendanceFormGroup.controls.paperHearing.setValue('Yes');
    component.executeAction(ACTION.CONTINUE);
    expect(component.hearingRequestMainModel.hearingDetails.hearingChannels).toEqual([HearingChannelEnum.ONPPR]);
  });

  it('should NOT call prepareHearingRequestData when executeAction action is BACK', () => {
    component.executeAction(ACTION.BACK);
    expect(component.prepareHearingRequestData).not.toHaveBeenCalled();
  });

  it('should set partyDetailsChangesConfirmed when preparing hearing request data for manual amendments', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: partyDetailsFromLatestSHV,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.prepareHearingRequestData();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesConfirmed).toEqual(true);
  });

  it('should get individual parties', () => {
    expect(component.getIndividualParties()[0].partyID).toEqual('P1');
  });

  it('should get organisation parties', () => {
    const organisationDetails = {
      name: 'DWP',
      organisationType: 'GOV',
      cftOrganisationID: 'O100000'
    };
    const organisationParties = component.getOrganisationParties();
    expect(organisationParties[0].organisationDetails).toEqual(organisationDetails);
  });

  it('should get hearing channels', () => {
    component.attendanceFormGroup.controls.paperHearing.setValue('No');
    expect(component.getHearingChannels()).toEqual(['TEL']);
    component.attendanceFormGroup.controls.paperHearing.setValue('Yes');
    expect(component.getHearingChannels()).toEqual(['ONPPRS']);
  });

  describe('The forms paperHearing', () => {
    it('should equal No as hearingChannels has NOT got ONPPRS', () => {
      fixture.detectChanges();
      expect(component.attendanceFormGroup.controls.paperHearing.value).toEqual('No');
    });
  });

  describe('The forms estimation', () => {
    it('should equal 3 as partyDetails is details', () => {
      fixture.detectChanges();
      expect(component.attendanceFormGroup.controls.estimation.value).toEqual(3);
    });
  });

  it('should return true when calling isFormValid for paper hearings', () => {
    component.attendanceFormGroup.controls.paperHearing.setValue(RadioOptions.YES);
    fixture.detectChanges();
    expect(component.isFormValid()).toEqual(true);
  });

  it('should true when calling isFormValid with partyChannel', () => {
    component.attendanceFormGroup.controls.estimation.setValue(1);
    (component.attendanceFormGroup.controls.parties as FormArray).controls.forEach((element: AbstractControl) => {
      element.value.individualDetails.preferredHearingChannel = 'inperson';
    });
    (component.attendanceFormGroup.controls.hearingLevelChannels as FormArray).controls
      .forEach((element: AbstractControl) => element.value.selected = true);
    const formValid = component.isFormValid();
    expect((component.attendanceFormGroup.controls.parties as FormArray).length).toBeGreaterThan(0);
    expect(formValid).toEqual(true);
  });

  it('should false when calling isFormValid without partyChannel', () => {
    component.attendanceFormGroup.controls.estimation.setValue(1);
    (component.attendanceFormGroup.controls.parties as FormArray).controls.forEach((element) => {
      (element as FormGroup).controls.individualDetails.get('preferredHearingChannel').setValue(null);
    });
    const formValid = component.isFormValid();
    expect((component.attendanceFormGroup.controls.parties as FormArray).length).toBeGreaterThan(0);
    expect(formValid).toEqual(false);
  });

  it('should not consider the party details from in-memory object for create new hearing request journey', () => {
    component.hearingCondition = {
      mode: 'create'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: partyDetailsFromLatestSHV,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.attendanceFormGroup.controls.parties.value.length).toEqual(2);
  });

  it('should set the party details from in-memory object when viewing or editing existing hearing request', () => {
    component.attendanceFormGroup.controls.parties = new FormArray([]);
    component.hearingCondition = {
      mode: 'view-edit'
    };
    component.ngOnInit();
    expect(component.attendanceFormGroup.controls.parties.value.length).toEqual(1);
  });

  it('should set the party details from the service values hearing model', () => {
    const newParty: PartyDetailsModel =
    {
      'partyID': 'P5',
      'partyType': PartyType.IND,
      'partyRole': 'appellant',
      'individualDetails': {
        'title': 'Mr',
        'firstName': 'Brian',
        'lastName': 'May',
        'preferredHearingChannel': 'inPerson',
        'reasonableAdjustments': [
          'RA0042',
          'SM0001'
        ]
      },
      'unavailabilityRanges': [
        {
          'unavailableFromDate': '2021-12-10T09:00:00.000Z',
          'unavailableToDate': '2021-12-31T09:00:00.000Z',
          'unavailabilityType': UnavailabilityType.ALL_DAY
        }
      ]
    };
    component.serviceHearingValuesModel.parties.push(newParty);

    component.attendanceFormGroup.controls.parties = new FormArray([]);
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: partyDetailsFromLatestSHV,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        partyDetailsChangesConfirmed: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.attendanceFormGroup.controls.parties.value.length).toEqual(2);
    expect(component.attendanceFormGroup.controls.parties.value[1].partyID).toEqual('P5');
    expect(component.attendanceFormGroup.controls.parties.value[1].partyName).toEqual('Brian May');
    component.serviceHearingValuesModel.parties.pop();
  });

  it('should call initialiseFromHearingValuesForAmendments for manual amendments journey with party changes', () => {
    spyOn(component, 'initialiseFromHearingValuesForAmendments');
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: partyDetailsFromLatestSHV,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.initialiseFromHearingValuesForAmendments).toHaveBeenCalled();
  });

  it('should not call initialiseFromHearingValuesForAmendments for non-manual amendments journey', () => {
    spyOn(component, 'initialiseFromHearingValuesForAmendments');
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = null;
    component.ngOnInit();
    expect(component.initialiseFromHearingValuesForAmendments).not.toHaveBeenCalled();
  });

  it('should not call initialiseFromHearingValuesForAmendments for non-manual amendments journey with party changes', () => {
    spyOn(component, 'initialiseFromHearingValuesForAmendments');
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.initialiseFromHearingValuesForAmendments).not.toHaveBeenCalled();
  });

  it('should return the party details from hearing request main model', () => {
    spyOn(HearingsUtils, 'hasPartyNameChanged').and.returnValue(true);
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
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
    component.initialiseFromHearingValuesForAmendments();
    expect(HearingsUtils.hasPartyNameChanged).toHaveBeenCalled();
    expect(component.attendanceFormGroup.controls.parties.value.length).toEqual(2);
  });

  afterEach(() => {
    fixture.destroy();
  });
});

describe('HearingAttendanceComponent', () => {
  let component: HearingAttendanceComponent;
  let fixture: ComponentFixture<HearingAttendanceComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  const lovRefDataService = jasmine.createSpyObj('lovRefDataService', ['getListOfValues']);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  const updatedInitialState = _.cloneDeep(initialState);

  updatedInitialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails.hearingChannels = ['byPhone', HearingChannelEnum.ONPPR];
  updatedInitialState.hearings.hearingRequest.hearingRequestMainModel.partyDetails = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HearingAttendanceComponent, MockHearingPartiesComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState: updatedInitialState }),
        { provide: HearingsService, useValue: hearingsService },
        { provide: LovRefDataService, useValue: lovRefDataService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hearingChannels: refData
              }
            },
            fragment: of('point-to-me')
          }
        },
        ValidatorsUtils,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingAttendanceComponent);
    component = fixture.componentInstance;
    lovRefDataService.getListOfValues.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('The forms paperHearing', () => {
    it('should equal Yes as hearingChannels has ONPPRS', () => {
      fixture.detectChanges();
      expect(component.attendanceFormGroup.controls.paperHearing.value).toEqual('Yes');
    });
  });

  describe('The forms estimation', () => {
    it('should equal 3 as partyDetails is empty', () => {
      fixture.detectChanges();
      expect(component.attendanceFormGroup.controls.estimation.value).toEqual(3);
    });
  });
  afterEach(() => {
    fixture.destroy();
  });
});
