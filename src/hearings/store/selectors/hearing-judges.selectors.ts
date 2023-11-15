import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';
export const getHearingJudgeIds = createSelector(
  fromFeature.getHearingsFeatureState,
  (state: fromFeature.State) => {
    if (!state) {
      return [];
    }
    const caseHearings = state.hearingList && state.hearingList.hearingListMainModel && state.hearingList.hearingListMainModel.caseHearings || [];
    return caseHearings.reduce((acc, caseHearing) => {
      if (caseHearing.hearingDaySchedule) {
        const judges = caseHearing.hearingDaySchedule.map((schedule) => schedule.hearingJudgeId);
        return acc.concat(judges);
      }
      return acc;
    }, []);
  }
);
