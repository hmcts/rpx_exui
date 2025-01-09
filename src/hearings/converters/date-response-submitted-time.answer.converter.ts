import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HearingDateEnum } from '../models/hearings.enum';
import { State } from '../store';
import { HearingsUtils } from '../utils/hearings.utils';
import { AnswerConverter } from './answer.converter';

export class DateResponseSubmittedTimeAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>, index: number): Observable<string> {
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
        const hearingStartDateTime = hearingDaySchedule[index || 0].hearingStartDateTime;
        // it is assumed and confirmed from HMC this date time is always utc so we convert it here.
        return hearingStartDateTime ? moment.utc(hearingStartDateTime).local().format(HearingDateEnum.DisplayTime) : '';
      })
    );
  }
}

