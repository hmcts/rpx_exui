import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JudicialUserModel } from '../models/judicialUser.model';
import { State } from '../store';
import { HearingsUtils } from '../utils/hearings.utils';
import { AnswerConverter } from './answer.converter';

export class JudicialMembersAnswerConverter implements AnswerConverter {
  constructor(protected readonly route: ActivatedRoute) {}

  public transformAnswer(hearingState$: Observable<State>, index: number): Observable<string> {
    const judicialUsersList: JudicialUserModel[] = this.route.snapshot.data.judicialResponseUsers || [];
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
        const hearingJudgeId = hearingDaySchedule[index || 0].hearingJudgeId;
        const judicialUserInfo = judicialUsersList.find((judicialUser) => judicialUser.personalCode === hearingJudgeId);
        return judicialUserInfo ? judicialUserInfo.fullName : '';
      })
    );
  }
}
