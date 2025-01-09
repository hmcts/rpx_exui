import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HearingChannelEnum } from '../models/hearings.enum';
import { State } from '../store';
import { HiddenConverter } from './hidden.converter';

export class PaperHearingHiddenConverter implements HiddenConverter {
  public transformHidden(hearingState$: Observable<State>): Observable<boolean> {
    return hearingState$.pipe(map((state) => {
      const hearingChannels = state.hearingConditions?.isHearingAmendmentsEnabled
        ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingChannels
        : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingChannels;

      return (hearingChannels.includes(HearingChannelEnum.ONPPR)
        || !!state.hearingRequest.hearingRequestMainModel.hearingDetails.isPaperHearing);
    }
    ));
  }
}
