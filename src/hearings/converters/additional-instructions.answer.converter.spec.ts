import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store';
import { AdditionalInstructionsAnswerConverter } from './additional-instructions.answer.converter';

describe('AdditionalInstructionsAnswerConverter', () => {
  let converter: AdditionalInstructionsAnswerConverter;

  beforeEach(() => {
    converter = new AdditionalInstructionsAnswerConverter();
  });

  it('should transform additional instructions', () => {
    const STATE: State = initialState.hearings;
    const result$ = converter.transformAnswer(of(STATE));
    const listingComments = 'blah blah blah';
    const expected = cold('(b|)', { b: listingComments });
    expect(result$).toBeObservable(expected);
  });

  it('should transform additional instructions when hearings amendment is enabled', () => {
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
          hearingDetails: {
            ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
            listingComments: 'some comments to compare'
          }
        }
      }
    };
    const result$ = converter.transformAnswer(of(STATE));
    const listingComments = 'some comments to compare';
    const expected = cold('(b|)', { b: listingComments });
    expect(result$).toBeObservable(expected);
  });
});
