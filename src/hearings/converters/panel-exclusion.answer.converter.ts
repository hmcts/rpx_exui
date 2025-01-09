import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberType, RequirementType } from '../models/hearings.enum';
import { JudicialUserModel } from '../models/judicialUser.model';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class PanelExclusionAnswerConverter implements AnswerConverter {
  constructor(protected readonly route: ActivatedRoute) {}

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    const judicialUsersList: JudicialUserModel[] = this.route.snapshot.data.judicialUsers;

    return hearingState$.pipe(
      map((state) => {
        const panelRequirements = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.panelRequirements
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements;
        const excludedJudges: string[] = panelRequirements?.panelPreferences.filter((preferences) => preferences.memberType === MemberType.PANEL_MEMBER && preferences.requirementType === RequirementType.EXCLUDE).map((preferences) => preferences.memberID);
        const excludedJudgeNames: string[] = [];
        judicialUsersList.forEach((judgeInfo) => {
          if (excludedJudges.includes(judgeInfo.personalCode)) {
            excludedJudgeNames.push(judgeInfo.fullName);
          }
        });
        return excludedJudgeNames.join();
      })
    );
  }
}
