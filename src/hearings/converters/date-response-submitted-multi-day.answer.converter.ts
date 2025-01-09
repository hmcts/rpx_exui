import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HearingDateEnum } from '../models/hearings.enum';
import { State } from '../store';
import { HearingsUtils } from '../utils/hearings.utils';
import { AnswerConverter } from './answer.converter';

export class DateResponseSubmittedMultiDayAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const hearingResponse = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingResponse
          : state.hearingRequest.hearingRequestMainModel.hearingResponse;
        let hearingDaySchedule = hearingResponse && hearingResponse.hearingDaySchedule;
        if (!hearingDaySchedule) {
          return '';
        }
        hearingDaySchedule = HearingsUtils.sortHearingDaySchedule(hearingDaySchedule);
        const hearingStartDateTime = hearingDaySchedule[0].hearingStartDateTime;
        const hearingEndDateTime = hearingDaySchedule[hearingDaySchedule.length - 1].hearingEndDateTime;
        return hearingStartDateTime && hearingEndDateTime
          ? `${moment(hearingStartDateTime).format(HearingDateEnum.DisplayMonth)} - ${moment(hearingEndDateTime).format(HearingDateEnum.DisplayMonth)}`
          : '';
      })
    );
  }
}
