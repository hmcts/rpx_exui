import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LovRefDataModel } from '../models/lovRefData.model';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class StageAnswerConverter implements AnswerConverter {
  constructor(
    protected readonly route: ActivatedRoute) {}

  private static getHearingTypeDisplayValue(hearingStageOptions: LovRefDataModel[], key: string): string {
    const lovData: LovRefDataModel = hearingStageOptions.find((stage) => stage.key === key);
    return lovData ? lovData.value_en : '';
  }

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    const hearingStageOptions = this.route.snapshot.data.hearingStageOptions;

    return hearingState$.pipe(
      map((state) => {
        const selection = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingType
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingType;

        return StageAnswerConverter.getHearingTypeDisplayValue(hearingStageOptions, selection);
      })
    );
  }
}
