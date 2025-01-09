import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CaseFlagReferenceModel } from '../models/caseFlagReference.model';
import { State } from '../store';
import { CaseFlagsUtils } from '../utils/case-flags.utils';
import { AnswerConverter } from './answer.converter';

export class ReasonableAdjustmentFlagsAnswerConverter implements AnswerConverter {
  public caseFlagsRefData: CaseFlagReferenceModel[];

  constructor(protected readonly route: ActivatedRoute) {
    this.caseFlagsRefData = this.route.snapshot.data.caseFlags;
  }

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state: State) => {
        const partyDetails = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.partyDetails
          : state.hearingRequest.hearingRequestMainModel.partyDetails;
        return CaseFlagsUtils.convertPartiesToPartyWithReasonableAdjustmentFlags(this.caseFlagsRefData, partyDetails);
      }),
      take(1),
      map((partyWithFlags: Map<string, CaseFlagReferenceModel[]>) => {
        let result = '';
        partyWithFlags.forEach(
          (value, key) => {
            if (value.length > 0) {
              result += `<strong class='bold'>${key}</strong>\n<ul>`;
              value.forEach((flag) => result += `<li>${flag && flag.name ? flag.name : ''}</li>`);
              result += '</ul><br>';
            }
          }
        );
        return result;
      })
    );
  }
}
