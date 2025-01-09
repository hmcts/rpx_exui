import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LaCaseStatus } from '../models/hearings.enum';
import { State } from '../store';
import { HiddenConverter } from './hidden.converter';

export class ListedHiddenConverter implements HiddenConverter {
  public transformHidden(hearingState$: Observable<State>): Observable<boolean> {
    return hearingState$.pipe(map((state) => {
      const hearingResponse = state.hearingConditions?.isHearingAmendmentsEnabled
        ? state.hearingRequestToCompare.hearingRequestMainModel.hearingResponse
        : state.hearingRequest.hearingRequestMainModel.hearingResponse;
      return hearingResponse.laCaseStatus === LaCaseStatus.LISTED;
    }
    ));
  }
}
