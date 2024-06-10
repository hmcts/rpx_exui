import { cold } from 'jasmine-marbles';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { DateRequestFailedAnswerConverter } from './date-request-failed.answer.converter';

describe('DateRequestFailedAnswerConverter', () => {
  let dateRequestSubmittedAnswerConverter: DateRequestFailedAnswerConverter;

  beforeEach(() => {
    dateRequestSubmittedAnswerConverter = new DateRequestFailedAnswerConverter();
  });

  it('should transform error timestamp from request', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingResponse.errorTimestamp = STATE.hearingRequest.hearingRequestMainModel.hearingResponse.receivedDateTime;
    const result$ = dateRequestSubmittedAnswerConverter.transformAnswer(of(STATE));
    const type = '30 November 2021 09:00:00';
    const expected = cold('(b|)', { b: type });
    expect(result$).toBeObservable(expected);
  });
});
