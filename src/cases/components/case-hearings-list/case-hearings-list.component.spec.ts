import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearings/hearing.test.data';
import { HearingListViewModel } from '../../../hearings/models/hearingListView.model';
import { Actions, EXUIDisplayStatusEnum, EXUISectionStatusEnum, PartyType } from '../../../hearings/models/hearings.enum';
import { LovRefDataModel } from '../../../hearings/models/lovRefData.model';
import { HearingsPipesModule } from '../../../hearings/pipes/hearings.pipes.module';
import * as fromHearingStore from '../../../hearings/store';
import { CaseHearingsListComponent } from './case-hearings-list.component';
import { HearingsFeatureService } from '../../../hearings/services/hearings-feature.service';
import { of } from 'rxjs';

const UPCOMING_HEARING_LIST: HearingListViewModel[] = [{
  hearingID: 'h100001',
  hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
  hearingType: 'Case management hearing',
  hmcStatus: 'Hearing requested',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv1',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'UPDATE REQUESTED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: true,
  hearingGroupRequestId: 'g1000000',
  hearingDaySchedule: null,
  exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
  exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING
}, {
  hearingID: 'h100002',
  hearingRequestDateTime: '2021-10-01T16:00:00.000Z',
  hearingType: 'Final hearing',
  hmcStatus: 'Awaiting listing',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv2',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'AWAITING LISTING',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [],
  exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
  exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING
}, {
  hearingID: 'h100003',
  hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
  hearingType: 'Initial hearing',
  hmcStatus: 'Listed',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv3',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'LISTED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: 'g100000',
  hearingDaySchedule: [{
    hearingStartDateTime: '2021-05-04T09:00:00.000Z',
    hearingEndDateTime: '2021-05-04T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7ba5',
    hearingVenueId: 'venue 1',
    hearingRoomId: 'room 1',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }, {
    hearingStartDateTime: '2021-05-05T09:00:00.000Z',
    hearingEndDateTime: '2021-05-05T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7ba4',
    hearingVenueId: 'venue 2',
    hearingRoomId: 'room 2',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }],
  exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
  exuiDisplayStatus: EXUIDisplayStatusEnum.LISTED
}, {
  hearingID: 'h100004',
  hearingRequestDateTime: '2021-10-01T16:00:00.000Z',
  hearingType: 'Case management hearing',
  hmcStatus: 'Update requested',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv4',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'UPDATE REQUESTED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [{
    hearingStartDateTime: '2021-03-12T09:00:00.000Z',
    hearingEndDateTime: '2021-03-12T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7bc4',
    hearingVenueId: 'venue 3',
    hearingRoomId: 'room 3',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }, {
    hearingStartDateTime: '2021-03-13T09:00:00.000Z',
    hearingEndDateTime: '2021-03-13T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7bc5',
    hearingVenueId: 'venue 4',
    hearingRoomId: 'room 4',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }],
  exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
  exuiDisplayStatus: EXUIDisplayStatusEnum.UPDATE_REQUESTED
}, {
  hearingID: 'h100005',
  hearingRequestDateTime: '2021-10-01T16:00:00.000Z',
  hearingType: 'Case management preliminary hearing - open',
  hmcStatus: 'Update submitted',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv5',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'UPDATE SUBMITTED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [{
    hearingStartDateTime: '2021-04-12T09:00:00.000Z',
    hearingEndDateTime: '2021-04-12T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7bc6',
    hearingVenueId: 'venue 5',
    hearingRoomId: 'room 5',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }],
  exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
  exuiDisplayStatus: EXUIDisplayStatusEnum.UPDATE_REQUESTED
}, {
  hearingID: 'h100006',
  hearingRequestDateTime: '2021-09-01T14:00:00.000Z',
  hearingType: 'Directions hearing',
  hmcStatus: 'Exception',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv6',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'EXCEPTION',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [{
    hearingStartDateTime: '2021-05-02T09:00:00.000Z',
    hearingEndDateTime: '2021-05-02T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7b55',
    hearingVenueId: 'venue 1',
    hearingRoomId: 'room 1',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }],
  exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
  exuiDisplayStatus: EXUIDisplayStatusEnum.FAILURE
}, {
  hearingID: 'h100007',
  hearingRequestDateTime: '2021-09-01T14:00:00.000Z',
  hearingType: 'Full hearing',
  hmcStatus: 'Cancellation requested',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv7',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'CANCELLATION REQUESTED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [{
    hearingStartDateTime: '2021-07-12T09:00:00.000Z',
    hearingEndDateTime: '2021-07-12T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7b44',
    hearingVenueId: 'venue 2',
    hearingRoomId: 'room 2',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant'
      }
    ]
  }, {
    hearingStartDateTime: '2021-02-13T09:00:00.000Z',
    hearingEndDateTime: '2021-02-13T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7b34',
    hearingVenueId: 'venue 3',
    hearingRoomId: 'room 3',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }],
  exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
  exuiDisplayStatus: EXUIDisplayStatusEnum.CANCELLATION_REQUESTED
}, {
  hearingID: 'h100009',
  hearingRequestDateTime: '2021-09-01T14:00:00.000Z',
  hearingType: 'Pre-hearing review',
  hmcStatus: 'Awaiting Actuals',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv9',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'AWAITING ACTUALS',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [{
    hearingStartDateTime: '2021-03-12T09:00:00.000Z',
    hearingEndDateTime: '2021-03-12T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7b15',
    hearingVenueId: 'venue 4',
    hearingRoomId: 'room 4',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant'
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }],
  exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
  exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_ACTUALS
}];

const PAST_HEARING_LIST: HearingListViewModel[] = [{
  hearingID: 'h100008',
  hearingRequestDateTime: '2021-09-14T16:00:00.000Z',
  hearingType: 'Directions hearing',
  hmcStatus: 'Vacated',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv8',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'VACATED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [],
  exuiSectionStatus: EXUISectionStatusEnum.PAST_OR_CANCELLED,
  exuiDisplayStatus: EXUIDisplayStatusEnum.CANCELLED
}, {
  hearingID: 'h100010',
  hearingRequestDateTime: '2021-09-01T14:00:00.000Z',
  hearingType: 'Case management preliminary hearing - open',
  hmcStatus: 'Completed',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv10',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'COMPLETED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [{
    hearingStartDateTime: '2021-04-12T09:00:00.000Z',
    hearingEndDateTime: '2021-04-12T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7b66',
    hearingVenueId: 'venue 5',
    hearingRoomId: 'room 5',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }],
  exuiSectionStatus: EXUISectionStatusEnum.PAST_OR_CANCELLED,
  exuiDisplayStatus: EXUIDisplayStatusEnum.COMPLETED
}, {
  hearingID: 'h100011',
  hearingRequestDateTime: '2021-09-14T16:00:00.000Z',
  hearingType: 'Remedy hearing',
  hmcStatus: 'Adjourned',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv11',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'ADJOURNED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [{
    hearingStartDateTime: '2021-09-01T09:00:00.000Z',
    hearingEndDateTime: '2021-09-01T16:00:00.000Z',
    listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7b33',
    hearingVenueId: 'venue 11',
    hearingRoomId: 'room 11',
    hearingJudgeId: 'hearingJudgeId1',
    panelMemberIds: ['hearingJudgeId1'],
    attendees: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        individualDetails: {
          title: null,
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ]
  }],
  exuiSectionStatus: EXUISectionStatusEnum.PAST_OR_CANCELLED,
  exuiDisplayStatus: EXUIDisplayStatusEnum.ADJOURNED
}, {
  hearingID: 'h100012',
  hearingRequestDateTime: '2021-10-14T16:00:00.000Z',
  hearingType: 'Full hearing',
  hmcStatus: 'Vacated',
  lastResponseReceivedDateTime: '',
  responseVersion: 'rv12',
  earliestHearingStartDateTime: '',
  hearingListingStatus: 'VACATED',
  listAssistCaseStatus: '',
  hearingIsLinkedFlag: false,
  hearingGroupRequestId: null,
  hearingDaySchedule: [],
  exuiSectionStatus: EXUISectionStatusEnum.PAST_OR_CANCELLED,
  exuiDisplayStatus: EXUIDisplayStatusEnum.CANCELLED
}];

const HEARING_TYPES_REF_DATA: LovRefDataModel[] = [
  {
    active_flag: 'Y',
    category_key: 'HearingType',
    child_nodes: null,
    hint_text_cy: '',
    hint_text_en: '',
    key: 'BBA3-CHA',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    value_cy: '',
    value_en: 'Chambers Outcome'
  },
  {
    active_flag: 'Y',
    category_key: 'HearingType',
    child_nodes: null,
    hint_text_cy: '',
    hint_text_en: '',
    key: 'BBA3-CHA',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    value_cy: '',
    value_en: 'Substantive'
  },
  {
    active_flag: 'Y',
    category_key: 'HearingType',
    child_nodes: null,
    hint_text_cy: '',
    hint_text_en: '',
    key: 'BBA3-CHA',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    value_cy: '',
    value_en: 'Direction Hearings'
  }
];

describe('CaseHearingsListComponent', () => {
  let component: CaseHearingsListComponent;
  let fixture: ComponentFixture<CaseHearingsListComponent>;
  let mockStore: Store<fromHearingStore.State>;
  const featureToggleServiceMock = jasmine.createSpyObj('FeatureToggleService', ['isEnabled']);
  const hearingsFeatureServiceMock = jasmine.createSpyObj('FeatureServiceMock', ['isFeatureEnabled']);

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        RouterTestingModule.withRoutes([]),
        HearingsPipesModule
      ],
      declarations: [CaseHearingsListComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                cid: '1111222233334444'
              }
            }
          }
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceMock
        },
        {
          provide: HearingsFeatureService,
          useValue: hearingsFeatureServiceMock
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CaseHearingsListComponent);
    mockStore = TestBed.inject(Store);
    component = fixture.componentInstance;
    component.hearingList$ = of(UPCOMING_HEARING_LIST);
    component.hearingStageOptions = HEARING_TYPES_REF_DATA;
    component.actions = [Actions.DELETE];
    featureToggleServiceMock.isEnabled.and.returnValue(of(false));
    hearingsFeatureServiceMock.isFeatureEnabled.and.returnValue(of(false));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should show only past and cancelling', () => {
    component.status = EXUISectionStatusEnum.UPCOMING;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-body-lead'));
    expect(heading.nativeElement.innerHTML).toEqual(EXUISectionStatusEnum.UPCOMING);
  });

  it('should hasReadOnlyAction if status is past or cancelled', () => {
    component.status = EXUISectionStatusEnum.PAST_OR_CANCELLED;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hasReadOnlyAction).toBeTruthy();
  });

  it('should hasUpdateAction if status upcoming', () => {
    component.status = EXUISectionStatusEnum.UPCOMING;
    component.actions = [Actions.UPDATE, Actions.DELETE];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hasUpdateAction).toBeTruthy();
  });

  it('should hasUpdateAction if status upcoming', () => {
    component.status = EXUISectionStatusEnum.UPCOMING;
    component.actions = [Actions.UPDATE, Actions.DELETE];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hasDeleteAction).toBeTruthy();
  });

  it('should hasReadOnlyAction if status upcoming', () => {
    component.status = EXUISectionStatusEnum.UPCOMING;
    component.actions = [Actions.READ];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hasReadOnlyAction).toBeTruthy();
  });

  it('should return true if on awaiting actual state', () => {
    expect(component.isAwaitingActual(EXUIDisplayStatusEnum.AWAITING_ACTUALS)).toBeTruthy();
  });

  it('should return isNonCancellable is true if on CANCELLATION_REQUESTED state', () => {
    expect(component.isNonCancellable(EXUIDisplayStatusEnum.CANCELLATION_REQUESTED)).toBeTruthy();
  });

  it('should return isNonCancellable is true if on FAILURE state', () => {
    expect(component.isNonCancellable(EXUIDisplayStatusEnum.CANCELLATION_REQUESTED)).toBeTruthy();
  });

  it('should return isNonCancellable is false if on other state', () => {
    expect(component.isNonCancellable(EXUIDisplayStatusEnum.UPDATE_REQUESTED)).toBeFalsy();
  });

  it('should show the right action links for UPCOMING section', () => {
    component.status = EXUISectionStatusEnum.UPCOMING;
    component.actions = [Actions.CREATE, Actions.DELETE, Actions.UPDATE, Actions.READ];
    component.ngOnInit();
    fixture.detectChanges();
    const viewOrEdit1 = fixture.debugElement.query(By.css('#link-view-or-edit-h100001')).nativeElement;
    expect(viewOrEdit1.textContent).toBe('View or edit');
    const cancel1 = fixture.debugElement.query(By.css('#link-cancel-h100001')).nativeElement;
    expect(cancel1.textContent).toBe('Cancel');
    const linkHearing1 = fixture.debugElement.query(By.css('#link-hearing-link-h100001'));
    expect(linkHearing1).toBeNull();
    const manageLinks1 = fixture.debugElement.query(By.css('#link-manage-links-h100001')).nativeElement;
    expect(manageLinks1.textContent).toBe('Manage links');
    const viewDetails1 = fixture.debugElement.query(By.css('#link-view-details-h100001'));
    expect(viewDetails1).toBeNull();
    const addOrEdit1 = fixture.debugElement.query(By.css('#link-add-or-edit-h100001'));
    expect(addOrEdit1).toBeNull();

    const viewOrEdit3 = fixture.debugElement.query(By.css('#link-view-or-edit-h100003')).nativeElement;
    expect(viewOrEdit3.textContent).toBe('View or edit');
    const cancel3 = fixture.debugElement.query(By.css('#link-cancel-h100003')).nativeElement;
    expect(cancel3.textContent).toBe('Cancel');
    const linkHearing3 = fixture.debugElement.query(By.css('#link-hearing-link-h100003'));
    expect(linkHearing3).toBeNull();
    const manageLinks3 = fixture.debugElement.query(By.css('#link-manage-links-h100003')).nativeElement;
    expect(manageLinks3.textContent).toBe('Manage links');
    const viewDetails3 = fixture.debugElement.query(By.css('#link-view-details-h100003'));
    expect(viewDetails3).toBeNull();
    const addOrEdit3 = fixture.debugElement.query(By.css('#link-add-or-edit-h100003'));
    expect(addOrEdit3).toBeNull();

    const viewOrEdit4 = fixture.debugElement.query(By.css('#link-view-or-edit-h100004')).nativeElement;
    expect(viewOrEdit4.textContent).toBe('View or edit');
    const cancel4 = fixture.debugElement.query(By.css('#link-cancel-h100004')).nativeElement;
    expect(cancel4.textContent).toBe('Cancel');
    const linkHearing4 = fixture.debugElement.query(By.css('#link-hearing-link-h100004'));
    expect(linkHearing4).toBeNull();
    const manageLinks4 = fixture.debugElement.query(By.css('#link-manage-links-h100004'));
    expect(manageLinks4).toBeNull();
    const viewDetails4 = fixture.debugElement.query(By.css('#link-view-details-h100004'));
    expect(viewDetails4).toBeNull();
    const addOrEdit4 = fixture.debugElement.query(By.css('#link-add-or-edit-h100004'));
    expect(addOrEdit4).toBeNull();

    const viewOrEdit6 = fixture.debugElement.query(By.css('#link-view-or-edit-h100006'));
    expect(viewOrEdit6).toBeNull();
    const cancel6 = fixture.debugElement.query(By.css('#link-cancel-h100006'));
    expect(cancel6).toBeNull();
    const linkHearing6 = fixture.debugElement.query(By.css('#link-hearing-link-h100006'));
    expect(linkHearing6).toBeNull();
    const manageLinks6 = fixture.debugElement.query(By.css('#link-manage-links-h100006'));
    expect(manageLinks6).toBeNull();
    const viewDetails6 = fixture.debugElement.query(By.css('#link-view-details-h100006')).nativeElement;
    expect(viewDetails6.textContent).toBe('View details');
    const addOrEdit6 = fixture.debugElement.query(By.css('#link-add-or-edit-h100006'));
    expect(addOrEdit6).toBeNull();

    const viewOrEdit7 = fixture.debugElement.query(By.css('#link-view-or-edit-h100007'));
    expect(viewOrEdit7).toBeNull();
    const cancel7 = fixture.debugElement.query(By.css('#link-cancel-h100007'));
    expect(cancel7).toBeNull();
    const linkHearing7 = fixture.debugElement.query(By.css('#link-hearing-link-h100007'));
    expect(linkHearing7).toBeNull();
    const manageLinks7 = fixture.debugElement.query(By.css('#link-manage-links-h100007'));
    expect(manageLinks7).toBeNull();
    const viewDetails7 = fixture.debugElement.query(By.css('#link-view-details-h100007')).nativeElement;
    expect(viewDetails7.textContent).toBe('View details');
    const addOrEdit7 = fixture.debugElement.query(By.css('#link-add-or-edit-h100007'));
    expect(addOrEdit7).toBeNull();

    const viewOrEdit9 = fixture.debugElement.query(By.css('#link-view-or-edit-h100009'));
    expect(viewOrEdit9).toBeNull();
    const cancel9 = fixture.debugElement.query(By.css('#link-cancel-h100009'));
    expect(cancel9).toBeNull();
    const linkHearing9 = fixture.debugElement.query(By.css('#link-hearing-link-h100009'));
    expect(linkHearing9).toBeNull();
    const manageLinks9 = fixture.debugElement.query(By.css('#link-manage-links-h100009'));
    expect(manageLinks9).toBeNull();
    const viewDetails9 = fixture.debugElement.query(By.css('#link-view-details-h100009'));
    expect(viewDetails9).toBeNull();
    const addOrEdit9 = fixture.debugElement.query(By.css('#link-add-or-edit-h100009')).nativeElement;
    expect(addOrEdit9.textContent).toBe('Add or edit');
  });

  it('should show the right action links for PAST_OR_CANCELLED section', () => {
    component.hearingList$ = of(PAST_HEARING_LIST);
    component.status = EXUISectionStatusEnum.PAST_OR_CANCELLED;
    component.actions = [Actions.CREATE, Actions.DELETE, Actions.UPDATE, Actions.READ];
    component.ngOnInit();
    fixture.detectChanges();
    const viewOrEdit8 = fixture.debugElement.query(By.css('#link-view-or-edit-h100008'));
    expect(viewOrEdit8).toBeNull();
    const cancel8 = fixture.debugElement.query(By.css('#link-cancel-h100008'));
    expect(cancel8).toBeNull();
    const viewDetails8 = fixture.debugElement.query(By.css('#link-view-details-h100008')).nativeElement;
    expect(viewDetails8.textContent).toBe('View details');
    const addOrEdit8 = fixture.debugElement.query(By.css('#link-add-or-edit-h100008'));
    expect(addOrEdit8).toBeNull();

    const viewOrEdit10 = fixture.debugElement.query(By.css('#link-view-or-edit-h100010'));
    expect(viewOrEdit10).toBeNull();
    const cancel10 = fixture.debugElement.query(By.css('#link-cancel-h100010'));
    expect(cancel10).toBeNull();
    const viewDetails10 = fixture.debugElement.query(By.css('#link-view-details-h100010')).nativeElement;
    expect(viewDetails10.textContent).toBe('View details');
    const addOrEdit10 = fixture.debugElement.query(By.css('#link-add-or-edit-h100010'));
    expect(addOrEdit10).toBeNull();

    const viewOrEdit11 = fixture.debugElement.query(By.css('#link-view-or-edit-h100011'));
    expect(viewOrEdit11).toBeNull();
    const cancel11 = fixture.debugElement.query(By.css('#link-cancel-h100011'));
    expect(cancel11).toBeNull();
    const viewDetails11 = fixture.debugElement.query(By.css('#link-view-details-h100011')).nativeElement;
    expect(viewDetails11.textContent).toBe('View details');
    const addOrEdit11 = fixture.debugElement.query(By.css('#link-add-or-edit-h100011'));
    expect(addOrEdit11).toBeNull();

    const viewOrEdit12 = fixture.debugElement.query(By.css('#link-view-or-edit-h100012'));
    expect(viewOrEdit12).toBeNull();
    const cancel12 = fixture.debugElement.query(By.css('#link-cancel-h100012'));
    expect(cancel12).toBeNull();
    const viewDetails12 = fixture.debugElement.query(By.css('#link-view-details-h100012')).nativeElement;
    expect(viewDetails12.textContent).toBe('View details');
    const addOrEdit12 = fixture.debugElement.query(By.css('#link-add-or-edit-h100012'));
    expect(addOrEdit12).toBeNull();
  });

  it('should show view details actions if feature toggle is on', () => {
    featureToggleServiceMock.isEnabled.and.returnValue(of(true));
    hearingsFeatureServiceMock.isFeatureEnabled.and.returnValue(of(true));
    component.status = EXUISectionStatusEnum.UPCOMING;
    component.actions = [Actions.CREATE, Actions.DELETE, Actions.UPDATE, Actions.READ];
    component.ngOnInit();
    fixture.detectChanges();
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    spyOn(mockStore, 'select').and.returnValue(of(null));
    const loadHearingRequestAndRedirect = spyOn(component, 'loadHearingRequestAndRedirect');
    component.viewAndEdit('h100000');
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.SaveHearingConditions({ mode: 'view-edit', isHearingAmendmentsEnabled: true })));
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100000', '/hearings/view/hearing-view-summary');
  });

  it('should return the right flag depends on hearingGroupRequestId', () => {
    expect(component.isManageLinksEnabled('g1000000')).toBeTruthy();
    expect(component.isManageLinksEnabled(null)).toBeFalsy();
    expect(component.isManageLinksEnabled(undefined)).toBeFalsy();
  });

  it('should viewAndEdit', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    spyOn(mockStore, 'select').and.returnValue(of(null));
    const loadHearingRequestAndRedirect = spyOn(component, 'loadHearingRequestAndRedirect');
    component.status = EXUISectionStatusEnum.UPCOMING;
    component.viewAndEdit('h100000');
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.SaveHearingConditions({ mode: 'view-edit', isHearingAmendmentsEnabled: false })));
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100000', '/hearings/request/hearing-view-edit-summary');
  });

  it('should cancelHearing', () => {
    component.cancelHearing('h100000');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'cancel', 'h100000']);
  });

  /** The below test is not working after Angular 11 upgrade
   *  and had to comment it out due to business priority in releasing
   *  the feature. This test should be looked at later.
   */
  it('should addAndEdit', () => {
    component.addAndEdit('h100000');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'actuals', 'h100000', 'hearing-actual-add-edit-summary']);
  });

  it('should linkHearing', () => {
    component.linkHearing('h100000');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'link', '1111222233334444', 'h100000']);
  });

  it('should manageLinks', () => {
    component.caseId = '1111222233334444';
    component.manageLinks(UPCOMING_HEARING_LIST[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'hearings', 'manage-links', '1111222233334444', 'g1000000', 'h100001']);
  });

  it('should check viewDetails', () => {
    const loadHearingRequestAndRedirect = spyOn(component, 'loadHearingRequestAndRedirect');
    // AWAITING_LISTING
    component.viewDetails(UPCOMING_HEARING_LIST[0]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100001', '/hearings/view/hearing-view-summary');
    // LISTED
    component.viewDetails(UPCOMING_HEARING_LIST[2]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100003', '/hearings/view/hearing-view-summary');
    // UPDATE_REQUESTED
    component.viewDetails(UPCOMING_HEARING_LIST[3]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100004', '/hearings/view/hearing-view-summary');
    // CANCELLATION_REQUESTED
    component.viewDetails(UPCOMING_HEARING_LIST[6]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100007', '/hearings/view/hearing-cancellation-summary');
    // CANCELLED
    component.viewDetails(PAST_HEARING_LIST[0]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100008', '/hearings/view/hearing-cancelled-summary/h100008');
    // COMPLETED
    component.viewDetails(PAST_HEARING_LIST[1]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100010', '/hearings/view/hearing-completed-summary/h100010');
    component.viewDetails(UPCOMING_HEARING_LIST[7]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100009', '/hearings/view/hearing-view-actuals-summary/h100009');
    // ADJOURNED
    component.viewDetails(PAST_HEARING_LIST[2]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100011', '/hearings/view/hearing-adjourned-summary/h100011');
    // FAILURE
    component.viewDetails(UPCOMING_HEARING_LIST[5]);
    fixture.detectChanges();
    expect(loadHearingRequestAndRedirect).toHaveBeenCalledWith('h100006', '/hearings/view/hearing-request-failed-summary/h100006');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
