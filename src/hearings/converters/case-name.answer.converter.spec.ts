import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { CaseNameAnswerConverter } from './case-name.answer.converter';

describe('CaseNameAnswerConverter', () => {
  let caseNameAnswerConverter: CaseNameAnswerConverter;

  beforeEach(() => {
    caseNameAnswerConverter = new CaseNameAnswerConverter();
  });

  it('should transform case name', () => {
    const STATE: State = initialState.hearings;
    const result$ = caseNameAnswerConverter.transformAnswer(of(STATE));
    const caseName = 'Jane Smith vs DWP';
    const expected = cold('(b|)', { b: caseName });
    expect(result$).toBeObservable(expected);
  });

  it('should transform case name when hearings amendment is enabled', () => {
    const STATE = {
      ...initialState.hearings,
      hearingConditions: {
        ...initialState.hearings.hearingConditions,
        isHearingAmendmentsEnabled: true
      },
      hearingRequestToCompare: {
        ...initialState.hearings.hearingRequestToCompare,
        hearingRequestMainModel: {
          ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
          caseDetails: {
            ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.caseDetails,
            hmctsInternalCaseName: 'John Doe vs Jane Smith'
          }
        }
      }
    };
    const result$ = caseNameAnswerConverter.transformAnswer(of(STATE));
    const caseName = 'John Doe vs Jane Smith';
    const expected = cold('(b|)', { b: caseName });
    expect(result$).toBeObservable(expected);
  });
});
