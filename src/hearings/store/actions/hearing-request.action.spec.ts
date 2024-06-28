import { HearingResponseError } from '../../../hearings/models/hearingResponseError.model';
import * as fromHearingRequestAction from './hearing-request.action';

describe('Hearing Request Actions', () => {
  describe('Reset', () => {
    it('should create an action', () => {
      const action = new fromHearingRequestAction.ResetHearingRequest();
      expect(action.type).toBe(fromHearingRequestAction.RESET_HEARING_REQUEST);
    });
  });

  describe('UpdateHearingRequest', () => {
    it('should update hearing request action', () => {
      const payload = {
        requestDetails: null,
        hearingDetails: null,
        partyDetails: null
      };
      const hearingConditions = {
        isInit: false,
        region: 'Wales'
      };
      const action = new fromHearingRequestAction.UpdateHearingRequest(payload, hearingConditions);
      expect(action.type).toBe(fromHearingRequestAction.UPDATE_HEARING_REQUEST);
    });
  });

  describe('SubmitHearingRequest', () => {
    it('should submit hearing request action', () => {
      const payload = {
        requestDetails: null,
        hearingDetails: null,
        partyDetails: null
      };
      const action = new fromHearingRequestAction.SubmitHearingRequest(payload);
      expect(action.type).toBe(fromHearingRequestAction.SUBMIT_HEARING_REQUEST);
    });
  });

  describe('SubmitHearingRequestFailure', () => {
    it('should submit hearing request failure action', () => {
      const payload = {
        status: 403,
        errors: null,
        message: 'Http failure response: 403 Forbidden'
      };
      const action = new fromHearingRequestAction.SubmitHearingRequestFailure(payload);
      expect(action.type).toBe(fromHearingRequestAction.SUBMIT_HEARING_REQUEST_FAILURE);
    });
  });

  describe('ResetHearingRequestLastError', () => {
    it('should reset hearing request last error action', () => {
      const action = new fromHearingRequestAction.ResetHearingRequestLastError();
      expect(action.type).toBe(fromHearingRequestAction.RESET_HEARING_REQUEST_LAST_ERROR);
    });
  });

  describe('UpdateHearingValuesFailure', () => {
    it('should fail to update hearing values', () => {
      const payload: HearingResponseError = {
        errorCode: 0,
        status: 'Not Found',
        errorDescription: 'Something went wrong',
        errorMessage: 'Error',
        timeStamp: '2020-01-01T00:00:00'
      };
      const action = new fromHearingRequestAction.GetHearingJudicialUsersFailure(payload);
      expect(action.type).toBe(fromHearingRequestAction.GET_JUDICIAL_USER_FAILURE);
    });
  });
});
