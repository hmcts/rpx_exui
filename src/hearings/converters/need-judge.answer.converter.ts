import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberType, RadioOptions } from '../models/hearings.enum';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class NeedJudgeAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const panelRequirements = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.panelRequirements
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements;
        const panelPreferences = panelRequirements?.panelPreferences;
        const hasJudgeDetails = panelPreferences?.filter((panel) => panel.memberType === MemberType.JUDGE);
        if (panelRequirements?.roleType?.length) {
          return RadioOptions.NO;
        } else if (hasJudgeDetails?.length) {
          return RadioOptions.YES;
        }
        return '';
      })
    );
  }
}
