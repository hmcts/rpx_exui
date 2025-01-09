import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { NeedWelshAmendedConverter } from './need-welsh.amended.converter';

describe('NeedWelshAmendedConverter', () => {
  let needWelshAmendedConverter: NeedWelshAmendedConverter;

  beforeEach(() => {
    needWelshAmendedConverter = new NeedWelshAmendedConverter();
  });

  it('should transform need welsh flag based on selection', () => {
    initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails.hearingInWelshFlag = true;
    initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingInWelshFlag = true;
    const STATE: State = initialState.hearings;
    const result$ = needWelshAmendedConverter.transformIsAmended(of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });
});
