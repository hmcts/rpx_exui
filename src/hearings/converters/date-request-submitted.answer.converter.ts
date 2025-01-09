import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HearingDateEnum } from '../models/hearings.enum';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class DateRequestSubmittedAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const requestDetails = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel?.requestDetails
          : state.hearingRequest.hearingRequestMainModel?.requestDetails;
        if (requestDetails) {
          return moment(requestDetails.timestamp).format(HearingDateEnum.DisplayMonth);
        }
        return '';
      })
    );
  }
}

