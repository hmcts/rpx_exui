import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class NeedPanelAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const isAPanelFlag = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails?.isAPanelFlag
          : state.hearingRequest.hearingRequestMainModel.hearingDetails?.isAPanelFlag;
        return isAPanelFlag ? 'Yes' : 'No';
      })
    );
  }
}
