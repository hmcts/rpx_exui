import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { PublicCaseNameAnswerConverter } from './public-case-name.answer.converter';

describe('CaseNameAnswerConverter', () => {
  let caseNameAnswerConverter: PublicCaseNameAnswerConverter;

  beforeEach(() => {
    caseNameAnswerConverter = new PublicCaseNameAnswerConverter();
  });

  it('should transform case name', () => {
    const STATE: State = initialState.hearings;
    const result$ = caseNameAnswerConverter.transformAnswer(of(STATE));
    const caseName = 'Jane Smith vs DWP';
    const expected = cold('(b|)', { b: caseName });
    expect(result$).toBeObservable(expected);
  });
});
