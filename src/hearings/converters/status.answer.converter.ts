import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { hearingStatusMappings } from '../models/hearingStatusMappings';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class StatusAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const hearingRequestStatus = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.requestDetails?.status
          : state.hearingRequest.hearingRequestMainModel.requestDetails?.status;
        return hearingStatusMappings.find((mapping) => mapping.hmcStatus === hearingRequestStatus).exuiDisplayStatus;
      })
    );
  }
}
