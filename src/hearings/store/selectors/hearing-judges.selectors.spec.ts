import { getHearingJudgeIds } from './hearing-judges.selectors';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, State } from '../reducers';
import { TestBed } from '@angular/core/testing';
import { initialState } from '../../hearing.test.data';
import { HearingListingStatusEnum, HMCStatus, PartyType } from '../../models/hearings.enum';

describe('Hearing Judges selectors', () => {
  let store: Store<State>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearings', reducers)
      ]
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getHearingJudgeIds', () => {
    it('should return hearings judge ids state', () => {
      let result = null;
      store.pipe(select(getHearingJudgeIds)).subscribe((value) => {
        result = value;
      });
      expect(result).toEqual([]);
    });
    it('should return an empty array if state is undefined', () => {
      const state = undefined;
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return an empty array if hearingList is undefined', () => {
      const state = { ...initialState.hearings, hearingList: undefined };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return an empty array if hearingListMainModel is undefined', () => {
      const state = { ...initialState.hearings, hearingList: { hearingListMainModel: undefined } };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return an empty array if caseHearings is undefined', () => {
      const state = {
        ...initialState.hearings,
        hearingList: {
          hearingListMainModel: {
            caseRef: '1111222233334444',
            hmctsServiceID: 'BBA3',
            caseHearings: undefined
          }
        }
      };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return an empty array if caseHearings is empty', () => {
      const state = {
        ...initialState.hearings,
        hearingList: {
          hearingListMainModel: {
            caseRef: '1111222233334444',
            hmctsServiceID: 'BBA3',
            caseHearings: []
          }
        }
      };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return the correct judge ids for each hearing', () => {
      const state = {
        ...initialState.hearings,
        hearingList: {
          hearingListMainModel: {
            caseRef: '1111222233334444',
            hmctsServiceID: 'BBA3',
            caseHearings: [{
              hearingID: 'h00001',
              hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
              hearingType: 'Case management hearing',
              hmcStatus: HMCStatus.HEARING_REQUESTED,
              lastResponseReceivedDateTime: '',
              responseVersion: 'rv1',
              hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
              listAssistCaseStatus: '',
              hearingIsLinkedFlag: true,
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
                    partyRole: 'appellant'
                  },
                  {
                    partyID: 'P2',
                    partyName: 'DWP',
                    partyType: PartyType.ORG,
                    partyRole: 'claimant',
                    individualDetails: {
                      firstName: 'DWP',
                      lastName: null,
                      preferredHearingChannel: 'byVideo'
                    }
                  }
                ]
              },
              {
                hearingStartDateTime: '2021-04-12T09:00:00.000Z',
                hearingEndDateTime: '2021-04-12T16:00:00.000Z',
                listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7bc6',
                hearingVenueId: 'venue 5',
                hearingRoomId: 'room 5',
                hearingJudgeId: 'hearingJudgeId2',
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
                      firstName: 'DWP',
                      lastName: null,
                      preferredHearingChannel: 'byVideo'
                    }
                  }
                ]
              }]
            }]
          }
        }
      };

      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual(['hearingJudgeId1', 'hearingJudgeId2']);
    });
  });
});
