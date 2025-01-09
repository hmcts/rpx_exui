import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { HearingLinksStateData } from '../../../models/hearingLinksStateData.model';
import {
  EXUIDisplayStatusEnum,
  EXUISectionStatusEnum,
  GroupLinkType,
  HMCStatus,
  HearingListingStatusEnum,
  Mode
} from '../../../models/hearings.enum';
import {
  HearingDetailModel,
  LinkedCaseHearingsResult
} from '../../../models/linkHearings.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { CaseReferencePipe } from '../../../pipes/case-reference.pipe';
import { ConvertToValuePipe } from '../../../pipes/convert-to-value.pipe';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { LinkedHearingsCheckYourAnswersComponent } from './linked-hearings-check-your-answers.component';

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

describe('LinkedHearingsCheckYourAnswersComponent', () => {
  let component: LinkedHearingsCheckYourAnswersComponent;
  let fixture: ComponentFixture<LinkedHearingsCheckYourAnswersComponent>;
  let mockStore: any;
  const mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockHttpClient);
  const caseId = '1111-2222-3333-4444';
  const hearingId = 'h100002';
  const hearingGroupRequestId = 'g1000000';
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  const mockRoute = {
    snapshot: {
      params: {
        caseId: { caseId },
        hearingId: { hearingId }
      },
      data: {
        mode: Mode.MANAGE_HEARINGS,
        hearingStageOptions: HEARING_STAGE_OPTIONS
      }
    }
  };
  const linkedHearingGroup = {
    groupDetails: {
      groupName: 'Group A',
      groupReason: 'Reason 1',
      groupLinkType: GroupLinkType.ORDERED,
      groupComments: 'Comment 1'
    },
    hearingsInGroup: [
      {
        hearingId: 'h1000001',
        hearingOrder: 1
      },
      {
        hearingId: 'h1000003',
        hearingOrder: 2
      },
      {
        hearingId: 'h1000005',
        hearingOrder: 3
      }]
  };

  const linkedCases: LinkedCaseHearingsResult[] = [
    {
      caseRef: '4652724902696213',
      caseName: 'Smith vs Peterson',
      hearingID: 'h100000',
      hearingType: 'Initial',
      position: 1
    },
    {
      caseRef: '5283819672542864',
      caseName: 'Smith vs Peterson',
      hearingID: 'h100000',
      hearingType: 'Init',
      position: 2
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaseReferencePipe, LinkedHearingsCheckYourAnswersComponent, ConvertToValuePipe, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: HearingsService, useValue: hearingsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedHearingsCheckYourAnswersComponent);
    mockStore = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify cancel button text', () => {
    component.isManageLink = true;
    component.isManageJourneyFinalPage = false;
    component.linkedCaseHearingsResults = linkedCases;
    component.setCancelButtonText();
    expect(component.cancelButtonText).toEqual('Return to hearings');
    component.isManageLink = false;
    component.setCancelButtonText();
    expect(component.cancelButtonText).toEqual('Cancel');
  });

  it('should sort display records', () => {
    component.showPositionColumn = true;
    component.linkedCaseHearingsResults = linkedCases;
    component.sortDisplayRecords();
    expect(component.linkedCaseHearingsResults[0].position).toEqual(1);
    expect(component.linkedCaseHearingsResults[1].position).toEqual(2);
  });

  it('should display position column return true', () => {
    component.linkedHearingGroup = linkedHearingGroup;
    expect(component.canDisplayPositionColumn()).toEqual(true);
  });

  it('should display position column return false', () => {
    linkedHearingGroup.groupDetails.groupLinkType = GroupLinkType.SAME_SLOT;
    component.linkedHearingGroup = linkedHearingGroup;
    expect(component.canDisplayPositionColumn()).toEqual(false);
  });

  it('should return valid position', () => {
    const hearing: HearingDetailModel = {
      isSelected: true,
      hearingID: 'h1000001',
      hearingType: 'Case management hearing',
      hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
      lastResponseReceivedDateTime: '',
      exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
      exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
      hmcStatus: HMCStatus.HEARING_REQUESTED,
      responseVersion: 'rv1',
      hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
      listAssistCaseStatus: '',
      hearingIsLinkedFlag: true,
      hearingGroupRequestId: null,
      hearingDaySchedule: []
    };
    component.hearingsInGroup = linkedHearingGroup.hearingsInGroup;
    component.showPositionColumn = true;
    expect(component.getPosition(hearing)).not.toBeNull();
  });

  it('should return position as null', () => {
    const hearing: HearingDetailModel = {
      isSelected: true,
      hearingID: 'h1000001',
      hearingType: 'Case management hearing',
      hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
      lastResponseReceivedDateTime: '',
      exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
      exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
      hmcStatus: HMCStatus.HEARING_REQUESTED,
      responseVersion: 'rv1',
      hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
      listAssistCaseStatus: '',
      hearingIsLinkedFlag: true,
      hearingGroupRequestId: null,
      hearingDaySchedule: []
    };
    component.hearingsInGroup = linkedHearingGroup.hearingsInGroup;
    component.showPositionColumn = true;
    expect(component.getPosition(hearing)).toBe(1);
  });

  it('should change call navigate', () => {
    const storeDispatchSpy = spyOn(mockStore, 'dispatch');
    component.caseId = caseId;
    component.hearingId = hearingId;
    component.onChange();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'link', caseId, hearingId]);
    expect(storeDispatchSpy).toHaveBeenCalled();
  });

  it('should navigate on submit link hearings', () => {
    const storeDispatchSpy = spyOn(mockStore, 'dispatch');
    component.linkedHearingGroup = linkedHearingGroup;
    component.caseId = caseId;
    component.hearingGroupRequestId = 'undefined';
    component.hearingId = hearingId;
    component.isManageLink = false;
    component.onLinkHearings();
    expect(storeDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.SubmitLinkedHearingGroup({
      linkedHearingGroup, caseId, hearingGroupRequestId: 'undefined', hearingId, isManageLink: false
    })));
  });

  it('should navigate to previous page', () => {
    const storeDispatchSpy = spyOn(mockStore, 'dispatch');
    component.caseId = caseId;
    component.hearingId = hearingId;
    component.isManageLink = false;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'link', caseId, hearingId, 'group-selection']);
    expect(storeDispatchSpy).toHaveBeenCalled();
    component.isManageLink = true;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'cases', 'case-details', caseId, 'hearings']);
  });

  it('should navigate to hearings tab', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'cases', 'case-details', caseId, 'hearings']);
  });

  it('should navigate to selected hearings page', () => {
    component.caseId = caseId;
    component.hearingId = hearingId;
    component.hearingGroupRequestId = hearingGroupRequestId;
    component.isManageLink = true;
    component.onEdit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'manage-links', caseId, hearingGroupRequestId, hearingId, 'selected-hearings']);
  });

  it('should dispatch to store on link hearings', () => {
    const storeDispatchSpy = spyOn(mockStore, 'dispatch');
    component.caseId = caseId;
    component.hearingId = hearingId;
    component.isManageLink = false;
    component.linkedHearingGroup = linkedHearingGroup;
    component.hearingGroupRequestId = hearingGroupRequestId;
    component.onLinkHearings();
    expect(storeDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.SubmitLinkedHearingGroup({
      linkedHearingGroup, caseId, hearingGroupRequestId, hearingId, isManageLink: false
    })));
  });

  it('should dispatch to store on manage link hearings', () => {
    const storeDispatchSpy = spyOn(mockStore, 'dispatch');
    component.caseId = caseId;
    component.hearingId = hearingId;
    component.linkedHearingGroup = linkedHearingGroup;
    component.hearingGroupRequestId = hearingGroupRequestId;
    component.onManageLinkHearings();
    expect(storeDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ManageLinkedHearingGroup({
      linkedHearingGroup, hearingGroupRequestId, caseId, hearingId
    })));
  });

  it('should dispatch to store on unlink hearings', () => {
    const storeDispatchSpy = spyOn(mockStore, 'dispatch');
    component.caseId = caseId;
    component.hearingId = hearingId;
    component.hearingGroupRequestId = hearingGroupRequestId;
    component.onUnlinkHearings();
    expect(storeDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ManageLinkedHearingGroup({
      linkedHearingGroup: null, hearingGroupRequestId, caseId, hearingId
    })));
  });

  it('should set Hearing Linked Group', () => {
    const hearingLinksStateData: HearingLinksStateData = {
      serviceLinkedCases: [],
      serviceLinkedCasesWithHearings: [{
        caseRef: '1111222233334445',
        caseName: 'Pete Smith',
        reasonsForLink: ['reason3', 'reason4']
      }],
      linkedHearingGroup
    };
    component.setHearingLinkedGroup(hearingLinksStateData);
    expect(component.linkedHearingGroup).toBe(linkedHearingGroup);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
