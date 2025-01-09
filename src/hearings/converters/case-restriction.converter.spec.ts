import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { RadioOptions } from '../models/hearings.enum';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';
import { CaseRestrictedAnswerConverter } from './case-restriction.converter';

describe('PrivateHearingAnswerConverter', () => {
  let converter: AnswerConverter;

  beforeEach(() => {
    TestBed.configureTestingModule({

    });
    converter = new CaseRestrictedAnswerConverter();
  });

  it('should transform private hearing answer selection to yes', () => {
    const STATE: State = initialState.hearings;
    STATE.hearingRequest.hearingRequestMainModel.caseDetails.caserestrictedFlag = true;
    const result$ = converter.transformAnswer(of(STATE));
    const option = RadioOptions.YES;
    const expected = cold('(b|)', { b: option });
    expect(result$).toBeObservable(expected);
  });

  it('should transform private hearing answer selection to no', () => {
    const STATE: State = initialState.hearings;
    STATE.hearingRequest.hearingRequestMainModel.caseDetails.caserestrictedFlag = false;
    const result$ = converter.transformAnswer(of(STATE));
    const option = RadioOptions.NO;
    const expected = cold('(b|)', { b: option });
    expect(result$).toBeObservable(expected);
  });

  it('should transform private hearing answer selection to yes when hearings amendment is enabled', () => {
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
            caserestrictedFlag: true
          }
        }
      }
    };
    const result$ = converter.transformAnswer(of(STATE));
    const option = RadioOptions.YES;
    const expected = cold('(b|)', { b: option });
    expect(result$).toBeObservable(expected);
  });

  it('should transform private hearing answer selection to no when hearings amendment is enabled', () => {
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
            caserestrictedFlag: false
          }
        }
      }
    };
    const result$ = converter.transformAnswer(of(STATE));
    const option = RadioOptions.NO;
    const expected = cold('(b|)', { b: option });
    expect(result$).toBeObservable(expected);
  });
});
