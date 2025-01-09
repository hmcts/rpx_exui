import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import {
  EXUIDisplayStatusEnum,
  EXUISectionStatusEnum,
  GroupLinkType,
  HMCStatus,
  HearingListingStatusEnum,
  Mode
} from '../../../models/hearings.enum';
import { ServiceLinkedCasesWithHearingsModel } from '../../../models/linkHearings.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsPipesModule } from '../../../pipes/hearings.pipes.module';
import { HearingsService } from '../../../services/hearings.service';
import { HowLinkedHearingsBeHeardComponent } from './linked-hearings-how-to-heard.component';

const mockLinkedHearingGroup = {
  linkedHearingGroup: {
    groupDetails: {
      groupName: 'Group A',
      groupReason: 'Reason 1',
      groupLinkType: GroupLinkType.ORDERED,
      groupComments: 'Comment 1'
    },
    hearingsInGroup: [
      { hearingId: 'h100010', hearingOrder: 1, caseRef: '4652724902696213' },
      { hearingId: 'h1000002', hearingOrder: 2, caseRef: '8254902572336147' }
    ]
  },
  lastError: null
};
const mockLinkedCasesWithHearings: ServiceLinkedCasesWithHearingsModel[] = [
  {
    caseRef: '4652724902696213',
    caseName: 'Smith vs Peterson',
    reasonsForLink: ['Linked for a hearing'],
    caseHearings: [
      {
        hearingID: 'h100010',
        hearingType: 'Direction Hearings',
        hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
        lastResponseReceivedDateTime: '',
        exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
        exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
        hmcStatus: HMCStatus.AWAITING_LISTING,
        responseVersion: 'rv1',
        hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
        listAssistCaseStatus: '',
        hearingIsLinkedFlag: true,
        hearingGroupRequestId: null,
        hearingDaySchedule: [],
        isSelected: true
      }
    ]
  },
  {
    caseRef: '5283819672542864',
    caseName: 'Smith vs Peterson',
    reasonsForLink: ['Linked for a hearing', 'Progressed as part of lead case']
  },
  {
    caseRef: '8254902572336147',
    caseName: 'Smith vs Peterson',
    reasonsForLink: ['Familial', 'Guardian', 'Linked for a hearing'],
    caseHearings: [
      {
        hearingID: 'h1000002',
        hearingType: 'Direction Hearings',
        hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
        lastResponseReceivedDateTime: '',
        exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
        exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
        hmcStatus: HMCStatus.AWAITING_LISTING,
        responseVersion: 'rv1',
        hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
        listAssistCaseStatus: '',
        hearingIsLinkedFlag: true,
        hearingGroupRequestId: null,
        hearingDaySchedule: [],
        isSelected: true
      }, {
        hearingID: 'h1000003',
        hearingType: 'Chambers Outcome',
        hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
        lastResponseReceivedDateTime: '',
        exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
        exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
        hmcStatus: HMCStatus.AWAITING_LISTING,
        responseVersion: 'rv1',
        hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
        listAssistCaseStatus: '',
        hearingIsLinkedFlag: true,
        hearingGroupRequestId: null,
        hearingDaySchedule: [],
        isSelected: true
      }
    ]
  }
];

const HEARING_STAGE_OPTIONS: LovRefDataModel[] = [
  {
    category_key: 'HearingType',
    key: 'BBA3-SUB',
    value_en: 'Substantive',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingType',
    key: 'BBA3-DIR',
    value_en: 'Direction Hearings',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingType',
    key: 'BBA3-CHA',
    value_en: 'Chambers Outcome',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  }
];

const hearingLinksMock = {
  ...mockLinkedHearingGroup,
  ...mockLinkedCasesWithHearings
};

let component: HowLinkedHearingsBeHeardComponent;
let fixture: ComponentFixture<HowLinkedHearingsBeHeardComponent>;
const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
const hearingsService = new HearingsService(mockedHttpClient);
const mockStore = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

describe('Linking - HowLinkedHearingsBeHeardComponent', () => {
  beforeEach(waitForAsync(() => {
    ConfigureTestBedModule(hearingsService, mockRouter, Mode.LINK_HEARINGS);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowLinkedHearingsBeHeardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have validation errors mapped when nothing selected', () => {
    mockStore.pipe.and.returnValue(of(mockLinkedCasesWithHearings));
    component.onSubmit();
    expect(component.validationErrors.length).toBe(1);
  });

  it('should able to submit when form particularOrder radio is selected', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const firstRadioButtonElement =
      nativeElement.querySelector('#particularOrder');
    firstRadioButtonElement.click();
    fixture.detectChanges();
    component.form.patchValue({ hearingGroup: 'particularOrder' });
    component.onOrderChange(0);
    component.onOrderChange(1);
    expect(component.validationErrors.length).toBe(0);
  });

  it('should able to submit when form together radio is selected', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const firstRadioButtonElement =
      nativeElement.querySelector('#heardTogether');
    firstRadioButtonElement.click();
    fixture.detectChanges();
    expect(component.validationErrors.length).toBe(0);
  });

  it('should navigate to previous page', () => {
    component.caseId = '8254902572336147';
    component.hearingId = 'h1000002';
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/',
      'hearings',
      'link',
      '8254902572336147',
      'h1000002'
    ]);
  });

  it('should navigate to hearings tab', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'cases', 'case-details', '8254902572336147', 'hearings']);
  });

  afterEach(() => {
    fixture.destroy();
  });
});

describe('Manage Linking - HowLinkedHearingsBeHeardComponent', () => {
  beforeEach(waitForAsync(() => {
    ConfigureTestBedModule(hearingsService, mockRouter, Mode.MANAGE_HEARINGS);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowLinkedHearingsBeHeardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a same slot group preselected', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    mockLinkedHearingGroup.linkedHearingGroup.groupDetails.groupLinkType = GroupLinkType.SAME_SLOT;
    const firstRadioButtonElement = nativeElement.querySelector('input[name=hearingGroup]:checked');
    expect(firstRadioButtonElement).not.toBeNull();
    mockStore.pipe.and.returnValue(of(hearingLinksMock));
    fixture.detectChanges();
    component.onSubmit();
    expect(component.validationErrors.length).toBe(1);
  });

  it('should have a order group preselected', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    mockLinkedHearingGroup.linkedHearingGroup.groupDetails.groupLinkType = GroupLinkType.ORDERED;
    const firstRadioButtonElement = nativeElement.querySelector('input[name=hearingGroup]:checked');
    expect(firstRadioButtonElement).not.toBeNull();
    mockStore.pipe.and.returnValue(of(hearingLinksMock));
    component.onSubmit();
    expect(component.validationErrors.length).toBe(0);
  });

  afterEach(() => {
    fixture.destroy();
  });
});

function ConfigureTestBedModule(hearingMockService: HearingsService, mockRouterService: any, modeOfLinking: Mode) {
  const STATE = _.cloneDeep(initialState);
  STATE.hearings.hearingLinks.linkedHearingGroup = mockLinkedHearingGroup.linkedHearingGroup;

  TestBed.configureTestingModule({
    declarations: [HowLinkedHearingsBeHeardComponent, MockRpxTranslatePipe],
    imports: [ReactiveFormsModule, RouterTestingModule, HearingsPipesModule],
    providers: [
      provideMockStore({ initialState: STATE }),
      { provide: HearingsService, useValue: hearingMockService },
      { provide: Router, useValue: mockRouterService },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              mode: modeOfLinking,
              hearingStageOptions: HEARING_STAGE_OPTIONS
            },
            params: {
              caseId: '8254902572336147',
              hearingId: 'h1000002'
            }
          },
          fragment: of('point-to-me')
        }
      },
      FormBuilder
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  }).compileComponents();
}

