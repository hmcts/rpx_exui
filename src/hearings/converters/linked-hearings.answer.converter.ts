import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class LinkedHearingsAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$?: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const hearingIsLinkedFlag = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingIsLinkedFlag
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingIsLinkedFlag;
        return hearingIsLinkedFlag ? 'Yes' : 'No';
      })
    );
  }
}
