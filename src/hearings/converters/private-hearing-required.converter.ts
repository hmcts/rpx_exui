import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class PrivateHearingAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$?: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const privateHearingRequiredFlag = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.privateHearingRequiredFlag
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.privateHearingRequiredFlag;
        return privateHearingRequiredFlag ? 'Yes' : 'No';
      })
    );
  }
}
