import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class NeedWelshAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const hearingInWelshFlag = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingInWelshFlag
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingInWelshFlag;
        return hearingInWelshFlag ? 'Yes' : 'No';
      })
    );
  }
}
