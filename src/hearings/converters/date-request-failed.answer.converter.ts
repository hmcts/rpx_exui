import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HearingDateEnum } from '../models/hearings.enum';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class DateRequestFailedAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const hearingResponse = state.hearingRequest.hearingRequestMainModel;
        const userTimezone = moment.tz.guess(); // Detect the user's timezone

        if (hearingResponse.hearingResponse?.errorTimestamp) {
          const errorTimestampBST = moment.utc(hearingResponse.hearingResponse.errorTimestamp).tz(userTimezone); // Convert to local time zone
          return errorTimestampBST.format(HearingDateEnum.RequestFailedDateAndTime);
        } else if (hearingResponse.requestDetails) {
          const requestTimestampBST = moment.utc(hearingResponse.requestDetails.timestamp).tz(userTimezone); // Convert to local time zone
          return requestTimestampBST.format(HearingDateEnum.RequestFailedDateAndTime);
        }

        return '';
      })
    );
  }
}
