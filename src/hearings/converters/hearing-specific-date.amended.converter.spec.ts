import { cold } from 'jasmine-marbles';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { HearingSpecificDateAmendedConverter } from './hearing-specific-date.amended.converter';

describe('HearingSpecificDateAmendedConverter', () => {
  let hearingSpecificDateAmendedConverter: HearingSpecificDateAmendedConverter;

  beforeEach(() => {
    hearingSpecificDateAmendedConverter = new HearingSpecificDateAmendedConverter();
  });

  it('should transform hearing specific date amended flag based on selection', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: new Date().toDateString(),
      dateRangeEnd: new Date(new Date().getDay() + 1).toDateString(),
      firstDateTimeMustBe: ''
    };
    const result$ = hearingSpecificDateAmendedConverter.transformIsAmended(of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing specific date amended flag based on firstDateTime', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: null,
      dateRangeEnd: null,
      firstDateTimeMustBe: new Date().toDateString()
    };
    STATE.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: null,
      dateRangeEnd: null,
      firstDateTimeMustBe: new Date(new Date().getDay() + 1).toDateString()
    };
    const result$ = hearingSpecificDateAmendedConverter.transformIsAmended(of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing specific date amended flag based on request', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: null,
      dateRangeEnd: null,
      firstDateTimeMustBe: new Date().toDateString()
    };
    const result$ = hearingSpecificDateAmendedConverter.transformIsAmended(of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing specific date amended flag based on start date changed', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-01-02'
    };
    STATE.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-01-01'
    };

    const result$ = hearingSpecificDateAmendedConverter.transformIsAmended(of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing specific date amended flag based on end date changed', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-01-01',
      dateRangeEnd: '2022-01-05'
    };
    STATE.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-01-01',
      dateRangeEnd: '2022-01-06'
    };

    const result$ = hearingSpecificDateAmendedConverter.transformIsAmended(of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should not transform hearing specific date amended flag based on no changed', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-01-01T09:00:00.000Z'
    };
    STATE.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-01-01'
    };

    const result$ = hearingSpecificDateAmendedConverter.transformIsAmended(of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });
});
