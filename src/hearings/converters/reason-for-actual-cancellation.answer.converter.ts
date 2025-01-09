import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LovRefDataModel } from '../models/lovRefData.model';
import { State } from '../store';
import { HearingsUtils } from '../utils/hearings.utils';
import { AnswerConverter } from './answer.converter';

export class ReasonForActualCancellationAnswerConverter implements AnswerConverter {
  constructor(protected readonly route: ActivatedRoute) {}

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    const cancelHearingReasons: LovRefDataModel[] = this.route.snapshot.data.cancelHearingReasons;
    const cancelHearingActualReasons: LovRefDataModel[] = this.route.snapshot.data.cancelHearingActualReasons;

    return hearingState$.pipe(
      map((state) => {
        const cancellationReasonCodes = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel?.requestDetails?.cancellationReasonCodes
          : state.hearingRequest.hearingRequestMainModel?.requestDetails?.cancellationReasonCodes;
        const values: string[] = HearingsUtils.getValues(cancellationReasonCodes, cancelHearingReasons);
        const valuesFromRequest = values && values.length ? values.join('<br>') : '';

        const hearingResultReasonType = state.hearingActuals.hearingActualsMainModel
          && state.hearingActuals.hearingActualsMainModel.hearingActuals
          && state.hearingActuals.hearingActualsMainModel.hearingActuals.hearingOutcome
          && state.hearingActuals.hearingActualsMainModel.hearingActuals.hearingOutcome.hearingResultReasonType;
        const valueFromActual = HearingsUtils.getValue(hearingResultReasonType, cancelHearingActualReasons);

        return valuesFromRequest || valueFromActual;
      })
    );
  }
}
