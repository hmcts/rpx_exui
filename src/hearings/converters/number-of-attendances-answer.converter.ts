import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromHearingStore from '../store';
import { AnswerConverter } from './answer.converter';

export class NumberOfAttendancesAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<fromHearingStore.State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        return state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.numberOfPhysicalAttendees.toString()
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.numberOfPhysicalAttendees.toString();
      })
    );
  }
}
