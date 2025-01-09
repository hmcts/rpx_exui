import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LovRefDataModel } from '../models/lovRefData.model';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class HearingPriorityAnswerConverter implements AnswerConverter {
  constructor(protected readonly route: ActivatedRoute) {}

  private static getHearingPriorityDisplayValue(hearingPriorities: LovRefDataModel[], key: string): string {
    const lovData: LovRefDataModel = hearingPriorities.find((priority) => priority.key === key);
    return lovData ? lovData.value_en : '';
  }

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    const hearingPriorities = this.route.snapshot.data.hearingPriorities;

    return hearingState$.pipe(
      map((state) => {
        const selection = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingPriorityType
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingPriorityType;

        return HearingPriorityAnswerConverter.getHearingPriorityDisplayValue(hearingPriorities, selection);
      })
    );
  }
}
