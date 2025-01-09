import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberType, RequirementType } from '../models/hearings.enum';
import { JudicialUserModel } from '../models/judicialUser.model';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class JudgeNameAnswerConverter implements AnswerConverter {
  constructor(protected readonly route: ActivatedRoute) {}

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    const judicialUsersList: JudicialUserModel[] = this.route.snapshot.data.judicialUsers;

    return hearingState$.pipe(
      map((state) => {
        const panelRequirements = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.panelRequirements
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements;
        const includedJudgeMemberId: string[] = panelRequirements?.panelPreferences.filter((preferences) => preferences.memberType === MemberType.JUDGE && preferences.requirementType === RequirementType.MUSTINC).map((preferences) => preferences.memberID);
        const includedJudge: JudicialUserModel = judicialUsersList.find((judgeInfo) => includedJudgeMemberId.includes(judgeInfo.personalCode));
        return includedJudge.fullName;
      })
    );
  }
}
