import { StaffUserResponseError } from '../../models/staff-user-response-error.model';
import { SetError, ResetStaffSelect, SET_STAFF_SELECT_ERROR, RESET_STAFF_SELECT_ERROR } from './staff-select.action';

describe('StaffSelect Actions', () => {
  describe('SetError', () => {
    it('should create an action', () => {
      const error: StaffUserResponseError = {
        errorMessage: 'An error occurred.',
        errorCode: 404,
        errorDescription: 'A description of the error.',
        status: 'Failed',
        timeStamp: new Date().toISOString()
      };
      const action = new SetError(error);

      expect({ ...action }).toEqual({
        type: SET_STAFF_SELECT_ERROR,
        payload: error
      });
    });
  });

  describe('ResetStaffSelect', () => {
    it('should create an action', () => {
      const action = new ResetStaffSelect();

      expect({ ...action }).toEqual({
        type: RESET_STAFF_SELECT_ERROR
      });
    });
  });
});
