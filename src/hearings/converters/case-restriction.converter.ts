import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class CaseRestrictedAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$?: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const caserestrictedFlag = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.caseDetails.caserestrictedFlag
          : state.hearingRequest.hearingRequestMainModel.caseDetails.caserestrictedFlag;
        return caserestrictedFlag ? 'Yes' : 'No';
      })
    );
  }
}
