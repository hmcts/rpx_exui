import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';
import { RadioOptions } from '../models/hearings.enum';

export class AdditionalSecurityAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const caseAdditionalSecurityFlag = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.caseDetails.caseAdditionalSecurityFlag
          : state.hearingRequest.hearingRequestMainModel.caseDetails.caseAdditionalSecurityFlag;
        return caseAdditionalSecurityFlag
          ? RadioOptions.YES
          : RadioOptions.NO;
      })
    );
  }
}
