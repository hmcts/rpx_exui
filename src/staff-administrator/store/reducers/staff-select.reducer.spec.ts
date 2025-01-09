import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { staffSelectReducer, initialState } from './staff-select.reducer';
import * as ErrorActions from '../actions/staff-select.action';
import { StaffUserResponseError } from '../../models/staff-user-response-error.model';

describe('staffSelectReducer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })]
    });
  });

  it('should return the initial state', () => {
    const action = { type: 'NOOP' } as any;
    const result = staffSelectReducer(initialState, action);

    expect(result).toEqual(initialState);
  });

  it('should handle RESET_STAFF_SELECT_ERROR', () => {
    const action = new ErrorActions.ResetStaffSelect();
    const result = staffSelectReducer(initialState, action);

    expect(result).toEqual(initialState);
  });

  it('should handle SET_STAFF_SELECT_ERROR', () => {
    const error: StaffUserResponseError = {
      errorMessage: 'Test error',
      errorCode: 123,
      errorDescription: 'Test error description',
      status: 'Error',
      timeStamp: '2022-01-01T00:00:00Z'
    };
    const action = new ErrorActions.SetError(error);
    const result = staffSelectReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      staffGetError: error
    });
  });
});
