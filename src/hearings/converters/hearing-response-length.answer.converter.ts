import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { HearingsUtils } from '../utils/hearings.utils';
import { AnswerConverter } from './answer.converter';

export class HearingResponseLengthAnswerConverter implements AnswerConverter {
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
        const hearingSchedule = hearingDaySchedule[index || 0] || null;
        const startTime = moment(hearingSchedule && hearingSchedule.hearingStartDateTime);
        const endTime = moment(hearingSchedule && hearingSchedule.hearingEndDateTime);
        const duration: number = moment.duration(endTime.diff(startTime)).asMinutes();
        return this.calculateFormattedHearingLength(duration);
      })
    );
  }

  public calculateFormattedHearingLength(duration: number): string {
    if (duration && duration > 0) {
      const minutes = duration % 60;
      duration = duration - minutes;
      const formattedDaysAndHours = this.calculateFormattedDaysAndHours(duration);
      const formattedMinutes = this.calculateFormattedMinutes(minutes);

      return formattedDaysAndHours.length > 0 && formattedMinutes.length > 0
        ? `${formattedDaysAndHours} ${formattedMinutes}`
        : formattedDaysAndHours.length > 0 && formattedMinutes.length === 0
          ? `${formattedDaysAndHours}`
          : formattedDaysAndHours.length === 0 && formattedMinutes.length > 0
            ? `${formattedMinutes}`
            : '';
    }
    return '';
  }

  public calculateFormattedDaysAndHours(duration: number): string {
    const days = Math.floor((duration / 60) / 6);
    const formattedDays = days === 0
      ? ''
      : days > 1
        ? `${days} Days`
        : `${days} Day`;

    const hours = Math.floor((duration / 60) % 6);
    const formattedHours = hours === 0
      ? ''
      : hours > 1
        ? `${hours} Hours`
        : `${hours} Hour`;

    return days > 0 && hours > 0
      ? `${formattedDays} ${formattedHours}`
      : days > 0 && hours === 0
        ? `${formattedDays}`
        : days === 0 && hours > 0
          ? `${formattedHours}`
          : '';
  }

  public calculateFormattedMinutes(minutes: number): string {
    return minutes > 0
      ? `${minutes} Minutes`
      : '';
  }
}
