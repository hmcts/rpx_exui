import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialStateImmutable } from '../hearing.test.data';
import { State } from '../store/reducers';
import { AdditionalSecurityAnswerConverter } from './additional-security.answer.converter';
import { AnswerConverter } from './answer.converter';

describe('AdditionalSecurityAnswerConverter', () => {
  let converter: AnswerConverter;

  beforeEach(() => {
    converter = new AdditionalSecurityAnswerConverter();
  });

  it('should transform additional security converter', () => {
    const STATE: State = initialStateImmutable.hearings;
    const result$ = converter.transformAnswer(of(STATE));
    const expected = cold('(b|)', { b: 'No' });
    expect(result$).toBeObservable(expected);
  });

  it('should transform additional security converter when hearings amendment is enabled', () => {
    const STATE = {
      ...initialStateImmutable.hearings,
      hearingConditions: {
        ...initialStateImmutable.hearings.hearingConditions,
        isHearingAmendmentsEnabled: true
      },
      hearingRequestToCompare: {
        ...initialStateImmutable.hearings.hearingRequestToCompare,
        hearingRequestMainModel: {
          ...initialStateImmutable.hearings.hearingRequestToCompare.hearingRequestMainModel,
          caseDetails: {
            ...initialStateImmutable.hearings.hearingRequestToCompare.hearingRequestMainModel.caseDetails,
            caseAdditionalSecurityFlag: true
          }
        }
      }
    };
    const result$ = converter.transformAnswer(of(STATE));
    const expected = cold('(b|)', { b: 'Yes' });
    expect(result$).toBeObservable(expected);
  });
});
