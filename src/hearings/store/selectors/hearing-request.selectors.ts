import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getHearingRequest = createSelector(
  fromFeature.getHearingsFeatureState,
  (state: fromFeature.State) => state.hearingRequest
);

export const getHearingRequestLastError = createSelector(
  getHearingRequest,
  fromFeature.hearingRequestLastError
);

export const selectGetJudicialUsersError = createSelector(
  fromFeature.getHearingsFeatureState,
  (state: fromFeature.State) => state.hearingRequest.getJudicialUsersError
);
