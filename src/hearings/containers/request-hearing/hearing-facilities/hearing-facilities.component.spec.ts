import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { caseFlagsRefData, initialState } from '../../../hearing.test.data';
import { ACTION, PartyType, HearingFacilitiesEnum } from '../../../models/hearings.enum';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { PartyFlagsModel } from '../../../models/partyFlags.model';
import { HearingsService } from '../../../services/hearings.service';
import { HearingFacilitiesComponent } from './hearing-facilities.component';

describe('HearingFacilitiesComponent', () => {
  let component: HearingFacilitiesComponent;
  let fixture: ComponentFixture<HearingFacilitiesComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);
  const ADDITIONAL_FACILITIES_OPTIONS = [
    {
      key: 'immigrationDetentionCentre',
      value_en: 'immigration detention centre',
      value_cy: '',
      hintText_EN: 'Immigration detention centre',
      hintTextCY: '',
      order: 1,
      parentKey: null
    },
    {
      key: 'inCameraCourt',
      value_en: 'in camera court',
      value_cy: '',
      hintText_EN: 'In camera court',
      hintTextCY: '',
      order: 2,
      parentKey: null
    },
    {
      key: 'sameSexCourtroom',
      value_en: 'same sex courtroom',
      value_cy: '',
      hintText_EN: 'Same sex courtroom',
      hintTextCY: '',
      order: 3,
      parentKey: null
    },
    {
      key: 'secureDock',
      value_en: 'secure dock',
      value_cy: '',
      hintText_EN: 'Secure Dock',
      hintTextCY: '',
      order: 4,
      parentKey: null
    },
    {
      key: 'witnessScreen',
      value_en: 'witness screen',
      value_cy: '',
      hintText_EN: 'Witness Screen',
      hintTextCY: '',
      order: 4,
      parentKey: null
    },
    {
      key: 'witnessRoom',
      value_en: 'witness room',
      value_cy: '',
      hintText_EN: 'Witness Room',
      hintTextCY: '',
      order: 5,
      parentKey: null
    },
    {
      key: 'videoConferencing',
      value_en: 'video conferencing',
      value_cy: '',
      hintText_EN: 'Video Conferencing',
      hintTextCY: '',
      order: 5,
      parentKey: null
    },
    {
      key: 'VideoFacility',
      value_en: 'videoFacility',
      value_cy: '',
      hintText_EN: 'Video Facility',
      hintTextCY: '',
      order: 5,
      parentKey: null
    },
    {
      key: 'prisonVideoLink',
      value_en: 'prison video link',
      value_cy: '',
      hintText_EN: 'Prison Video Link',
      hintTextCY: '',
      order: 5,
      parentKey: null
    }
  ];

  const caseFlagsFromLatestSHV: PartyFlagsModel[] = [
    {
      partyId: '1234-uytr-7654-asdf-0001',
      partyName: 'Jane Smith',
      flagParentId: 'RA0008',
      flagId: 'RA0042',
      flagDescription: 'Sign language interpreter required',
      flagStatus: 'ACTIVE'
    },
    {
      partyId: '1234-uytr-7654-asdf-0001',
      partyName: 'Jane Smith vs DWP',
      flagParentId: 'CF0001',
      flagId: 'CF0006',
      flagDescription: 'Potential fraud',
      flagStatus: 'ACTIVE'
    },
    {
      partyId: '1234-uytr-7654-asdf-0002',
      partyName: 'Jane Smith vs DWP',
      flagParentId: 'CF0001',
      flagId: 'CF0007',
      flagDescription: 'Urgent flag',
      flagStatus: 'ACTIVE'
    }
  ];

  const partiesInSHV: PartyDetailsModel[] = [
    {
      partyID: '1234-uytr-7654-asdf-0001',
      partyType: PartyType.IND,
      partyName: 'Party1 name',
      partyRole: 'APPL',
      individualDetails: {
        firstName: 'Party1 name FN',
        lastName: 'Party1 name LN',
        interpreterLanguage: '',
        reasonableAdjustments: [
          'RA001'
        ]
      }
    },
    {
      partyID: '1234-uytr-7654-asdf-0002',
      partyType: PartyType.IND,
      partyName: 'Party2 name',
      partyRole: 'APPL',
      individualDetails: {
        firstName: 'Party2 name FN',
        lastName: 'Party2 name LN',
        interpreterLanguage: '',
        reasonableAdjustments: [
          'RA001'
        ]
      }
    }
  ];

  const partiesInHMC: PartyDetailsModel[] = [
    {
      partyID: '1234-uytr-7654-asdf-0001',
      partyType: PartyType.IND,
      partyName: 'Party1 name',
      partyRole: 'APPL',
      individualDetails: {
        firstName: 'Party1 name FN',
        lastName: 'Party1 name LN',
        interpreterLanguage: '',
        reasonableAdjustments: [
          'RA001'
        ]
      }
    },
    {
      partyID: '1234-uytr-7654-asdf-0002',
      partyType: PartyType.IND,
      partyName: 'Party2 name',
      partyRole: 'APPL',
      individualDetails: {
        firstName: 'Party2 name FN',
        lastName: 'Party2 name LN',
        interpreterLanguage: '',
        reasonableAdjustments: [
          'RA001'
        ]
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HearingFacilitiesComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                caseFlags: caseFlagsRefData,
                additionFacilitiesOptions: ADDITIONAL_FACILITIES_OPTIONS
              }
            },
            fragment: of('point-to-me')
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingFacilitiesComponent);
    component = fixture.componentInstance;
    spyOn(component, 'prepareHearingRequestData').and.callThrough();
    spyOn(component, 'isFormValid').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.hearingFactilitiesForm).toBeTruthy();
  });

  it('should call getHearingFacilitiesFormArray method', () => {
    expect(component.getHearingFacilitiesFormArray).toBeTruthy();
  });

  it('should get enum from interface', () => {
    expect(component.hearingFacilitiesEnum).toEqual(HearingFacilitiesEnum);
  });

  it('should call prepareHearingRequestData when executeAction is called with a valid form', () => {
    component.hearingFactilitiesForm.controls['addition-security-required'].setValue('Yes');
    component.hearingFactilitiesForm.controls['addition-security-required'].markAsPristine();
    component.executeAction(ACTION.CONTINUE);
    expect(component.hearingFactilitiesForm.controls['addition-security-required'].dirty).toEqual(true);
    expect(component.prepareHearingRequestData).toHaveBeenCalled();
  });

  it('should executeAction not call prepareHearingRequestData', () => {
    component.executeAction(ACTION.BACK);
    expect(component.prepareHearingRequestData).not.toHaveBeenCalled();
  });

  it('should prepareHearingRequestData set hearingFacilitiesChangesConfirmed to true', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: true,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.prepareHearingRequestData();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingFacilitiesChangesConfirmed).toEqual(true);
  });

  it('should be true when calling isFormValid when security is selected', () => {
    component.hearingFactilitiesForm.controls['addition-security-required'].setValue('Yes');
    const formValid = component.isFormValid();
    expect(formValid).toEqual(true);
  });

  it('should false when calling isFormValid when security required not selected', () => {
    component.hearingFactilitiesForm.controls['addition-security-required'].setValue(undefined);
    const formValid = component.isFormValid();
    expect(formValid).toEqual(false);
  });

  it('should filter selection from previous values', () => {
    component.hearingRequestMainModel.caseDetails.caseAdditionalSecurityFlag = true;

    const swapValue = component.hearingRequestMainModel.hearingDetails.facilitiesRequired;
    component.hearingRequestMainModel.hearingDetails.facilitiesRequired = ['secureDock', 'witnessScreen'];
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.hearingFactilitiesForm.controls['addition-security-required'].value).toEqual('Yes');
    component.hearingRequestMainModel.hearingDetails.facilitiesRequired = swapValue;
  });

  it('should not consider the case flags from in-memory object for create new hearing request journey', () => {
    component.hearingCondition = {
      mode: 'create'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.nonReasonableAdjustmentFlags.length).toEqual(3);
  });

  it('should set the case flags from in-memory object when viewing or editing existing hearing request', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.hearingRequestMainModel = {
      ...component.hearingRequestMainModel,
      partyDetails: partiesInHMC
    };
    component.serviceHearingValuesModel = {
      ...component.serviceHearingValuesModel,
      parties: partiesInSHV
    };
    component.ngOnInit();
    expect(component.nonReasonableAdjustmentFlags.length).toEqual(2);
  });

  it('should prepareHearingRequestData set nonReasonableAdjustmentChangesConfirmed property to true', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.prepareHearingRequestData();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.nonReasonableAdjustmentChangesConfirmed).toEqual(true);
  });

  it('should prepareHearingRequestData not set nonReasonableAdjustmentChangesConfirmed property to true', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.prepareHearingRequestData();
    expect(hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.nonReasonableAdjustmentChangesConfirmed).toBeUndefined();
  });

  it('should prepareHearingRequestData', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: true,
        hearingFacilitiesChangesConfirmed: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.serviceHearingValuesModel = {
      ...component.serviceHearingValuesModel,
      facilitiesRequired: ['facility']
    };
    component.ngOnInit();
    expect(component.additionalFacilities[0].showAmendedLabel).toBe(true);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
