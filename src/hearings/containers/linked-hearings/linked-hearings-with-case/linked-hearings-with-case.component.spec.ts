import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import {
  ACTION,
  EXUIDisplayStatusEnum,
  EXUISectionStatusEnum,
  HearingListingStatusEnum,
  HMCStatus,
  Mode
} from '../../../models/hearings.enum';
import { ServiceLinkedCasesWithHearingsModel } from '../../../models/linkHearings.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsPipesModule } from '../../../pipes/hearings.pipes.module';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { LinkedHearingsWithCaseComponent } from './linked-hearings-with-case.component';

describe('LinkedHearingsWithCaseComponent', () => {
  let component: LinkedHearingsWithCaseComponent;
  let fixture: ComponentFixture<LinkedHearingsWithCaseComponent>;
  let store: any;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockHearingService: any;
  const caseId = '1111-2222-3333-4444';
  const hearingId = 'h100002';
  const hearingGroupRequestId = 'g1000000';
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
  const linkedCases: ServiceLinkedCasesWithHearingsModel[] = [
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
      reasonsForLink: ['Familial', 'Guardian', 'Linked for a hearing']
    }
  ];
  const linkedCasesWithHearings: ServiceLinkedCasesWithHearingsModel[] = [
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedHearingsWithCaseComponent, MockRpxTranslatePipe],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([
        { path: 'hearings/link/4652724902696211/h000001/group-selection', redirectTo: '' }
      ]),
      HearingsPipesModule,
      RouterModule,
      RouterTestingModule.withRoutes([])],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of(),
            snapshot: {
              data: {
                mode: Mode.LINK_HEARINGS,
                hearingStageOptions: HEARING_STAGE_OPTIONS
              },
              params: { caseId: '4652724902696211', hearingId: 'h000001' }
            },
            fragment: of('point-to-me')
          }
        },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedHearingsWithCaseComponent);
    mockHearingService = TestBed.inject(HearingsService);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check on submit error', () => {
    component.initForm();
    component.getHearingsAvailable();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.linkHearingForm.valid).toBeTruthy();
    expect(component.linkedHearingSelectionError).toBeNull();
  });

  it('should check on submit success', () => {
    component.onSubmit();
    expect(component.linkHearingForm.valid).toBe(true);
  });

  it('should navigate to previous page', () => {
    component.caseId = '8254902572336147';
    component.hearingId = 'h1000002';
    component.hearingGroupRequestId = 'g000101';
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'cases', 'case-details', '8254902572336147', 'hearings']);

    component.isManageLink = true;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'manage-links', '8254902572336147', 'g000101', 'h1000002']);
  });

  it('should navigate to hearings tab', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'cases', 'case-details', '8254902572336147', 'hearings']);
  });

  it('should check on submit for manage link', () => {
    component.isManageLink = true;
    component.onSubmit();
    expect(component.linkHearingForm.valid).toBe(true);
  });

  it('should navigate to case hearing page', () => {
    component.navigateToCaseHearing('8254902572336147');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'cases', 'case-details', '8254902572336147', 'hearings']);
  });

  it('should check update linked cases', () => {
    component.updateLinkedCase(0, 0);
    expect(component.getHearingsFormValue(0).controls[0].get('isSelected').value).toBe(true);
  });

  it('should check navigate', () => {
    component.caseId = '8254902572336147';
    component.hearingGroupRequestId = 'g00101';
    component.hearingId = 'h1000002';
    component.mode = component.pageMode.MANAGE_HEARINGS;
    component.navigate();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'manage-links', '8254902572336147', 'g00101', 'h1000002', 'group-selection']);

    component.initForm();
    component.getHearingsAvailable();
    component.mode = component.pageMode.MANAGE_HEARINGS;
    fixture.detectChanges();
    component.navigate();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'manage-links', '8254902572336147', 'g00101', 'h1000002', 'group-selection']);
  });

  it('should dispatch to store on unlink hearings', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.caseId = caseId;
    component.hearingId = hearingId;
    component.hearingGroupRequestId = hearingGroupRequestId;
    component.onUnlinkHearings();
    expect(storeDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ManageLinkedHearingGroup({
      linkedHearingGroup: null, hearingGroupRequestId, caseId, hearingId
    })));
  });

  it('should return true if isManageLink is true and the hearing is linkable', () => {
    component.isManageLink = true;
    component.hearingGroupRequestId = hearingGroupRequestId;
    const result = component.isSelectable(initialState.hearings.hearingLinks.serviceLinkedCasesWithHearings[0].caseHearings[0]);
    expect(result).toBeTruthy();
  });

  it('should return true if isManageLink is true and the hearing is linkable', () => {
    component.isManageLink = true;
    component.hearingGroupRequestId = hearingGroupRequestId;
    const result = component.isSelectable(initialState.hearings.hearingLinks.serviceLinkedCasesWithHearings[2].caseHearings[0]);
    expect(result).toBeTruthy();
  });

  it('should return true if isManageLink is false and the hearing is linkable', () => {
    component.isManageLink = false;
    component.hearingGroupRequestId = hearingGroupRequestId;
    const result = component.isSelectable(initialState.hearings.hearingLinks.serviceLinkedCasesWithHearings[0].caseHearings[0]);
    expect(result).toBeTruthy();
  });

  it('should correctly set isHearingsAvailable', () => {
    component.isHearingsAvailable = false;
    component.caseId = '4652724902696213';
    component.linkedCases = linkedCases;
    component.getHearingsAvailable();
    expect(component.isHearingsAvailable).toEqual(false);

    component.linkedCases = linkedCasesWithHearings;
    component.getHearingsAvailable();
    expect(component.isHearingsAvailable).toEqual(true);
  });

  it('should check update linked cases when hearing position is mentioned', () => {
    component.updateLinkedCase(0, 0);
    expect(component.getHearingsFormValue(0, 0).controls[0].get('isSelected').value).toBe(true);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
