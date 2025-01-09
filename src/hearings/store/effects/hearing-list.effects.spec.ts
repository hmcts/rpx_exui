import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import * as fromHearingStore from '../../../hearings/store';
import { HttpError } from '../../../models/httpError.model';
import { HearingDayScheduleModel } from '../../models/hearingDaySchedule.model';
import { HearingListModel } from '../../models/hearingList.model';
import { HearingListMainModel } from '../../models/hearingListMain.model';
import { EXUISectionStatusEnum, HearingListingStatusEnum } from '../../models/hearings.enum';
import { HearingsService } from '../../services/hearings.service';
import * as hearingListActions from '../actions/hearing-list.action';
import { HearingListEffects } from './hearing-list.effects';

describe('Hearing List Effects', () => {
  let actions$;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<fromHearingStore.State>;

  let effects: HearingListEffects;
  const hearingsServiceMock = jasmine.createSpyObj('HearingsService', [
    'getAllHearings'
  ]);

  const initialState = {
    hearings: {
      hearingList: {
        hearingListMainModel: {}
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        {
          provide: HearingsService,
          useValue: hearingsServiceMock
        },
        HearingListEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(HearingListEffects);
    store = TestBed.inject(Store) as Store<fromHearingStore.State>;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('loadHearingList$', () => {
    it('should return a response with hearings list', () => {
      const HEARING_DAY_SCHEDULE_1: HearingDayScheduleModel = {
        hearingStartDateTime: '2021-05-01T16:00:00.000Z',
        hearingEndDateTime: '2021-05-04T16:00:00.000Z',
        listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7ba5',
        hearingVenueId: 'venue 1',
        hearingRoomId: 'room 1',
        hearingJudgeId: 'hearingJudgeId1',
        panelMemberIds: ['hearingJudgeId1'],
        attendees: []
      };
      const CASE_HEARING_1: HearingListModel = {
        hearingID: 'h111111',
        hearingRequestDateTime: '2021-05-05T16:00:00.000Z',
        hearingType: 'hearing type 1',
        lastResponseReceivedDateTime: '',
        hmcStatus: 'pending',
        responseVersion: 'rv1',
        hearingListingStatus: HearingListingStatusEnum.AWAITING_LISTING,
        listAssistCaseStatus: 'pending',
        exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
        hearingIsLinkedFlag: true,
        hearingGroupRequestId: null,
        hearingDaySchedule: [HEARING_DAY_SCHEDULE_1]
      };
      const HEARINGS_LIST: HearingListMainModel = {
        hmctsServiceID: 'BBA3',
        caseRef: '1568642646198441',
        caseHearings: [CASE_HEARING_1]
      };
      hearingsServiceMock.getAllHearings.and.returnValue(of(HEARINGS_LIST));
      const action = new hearingListActions.LoadAllHearings('1111222233334444');
      const completion = new hearingListActions.LoadAllHearingsSuccess(HEARINGS_LIST);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadHearingList$).toBeObservable(expected);
    });
  });

  describe('handleError', () => {
    it('should error when loading all hearings request failure', () => {
      const errorResponse: HttpError = {
        status: 500,
        message: 'Internal server error'
      };
      hearingsServiceMock.getAllHearings.and.returnValue(throwError(errorResponse));
      const action = new hearingListActions.LoadAllHearings('h1000000');
      const completion = new hearingListActions.LoadAllHearingsFailure(errorResponse);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadHearingList$).toBeObservable(expected);
    });
  });
});
