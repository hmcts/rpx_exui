import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StaffState } from '../../models/staff-state.model';

export const selectStaffFeature = createFeatureSelector<any>('staffUI');

export const selectStaffError = createSelector(
  selectStaffFeature,
  (state: StaffState) => state.staffGetError
);
