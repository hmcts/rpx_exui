import { getHearingJudgeIds } from './hearing-judges.selectors';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, State } from '../reducers';
import { TestBed } from '@angular/core/testing';

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
      const state = { hearingList: undefined };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return an empty array if hearingListMainModel is undefined', () => {
      const state = { hearingList: { hearingListMainModel: undefined } };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return an empty array if caseHearings is undefined', () => {
      const state = { hearingList: { hearingListMainModel: { caseHearings: undefined } } };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return an empty array if caseHearings is empty', () => {
      const state = { hearingList: { hearingListMainModel: { caseHearings: [] } } };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([]);
    });
    it('should return the correct judge ids for each hearing', () => {
      const state = {
        hearingList: {
          hearingListMainModel: {
            caseHearings: [
              { hearingDaySchedule: [{ hearingJudgeId: 1001 }, { hearingJudgeId: 1002 }] },
              { hearingDaySchedule: [{ hearingJudgeId: 1003 }] }
            ]
          }
        }
      };
      const result = getHearingJudgeIds.projector(state);
      expect(result).toEqual([1001, 1002, 1003]);
    });
  });
});
