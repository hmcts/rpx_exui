import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { HearingsUtils } from '../utils/hearings.utils';
import { AnswerConverter } from './answer.converter';

export class RoomIdAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>, index: number): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const hearingResponse = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingResponse
          : state.hearingRequest.hearingRequestMainModel.hearingResponse;
        let hearingDaySchedule = hearingResponse?.hearingDaySchedule;
        if (!hearingDaySchedule) {
          return '';
        }
        hearingDaySchedule = HearingsUtils.sortHearingDaySchedule(hearingDaySchedule);
        return hearingDaySchedule[index || 0].hearingRoomId;
      })
    );
  }
}
