import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HearingChannelEnum } from '../../hearings/models/hearings.enum';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class IsPaperHearingAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const hearingChannels = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingChannels
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingChannels;

        return (hearingChannels.includes(HearingChannelEnum.ONPPR)
          || !!state.hearingRequest.hearingRequestMainModel.hearingDetails.isPaperHearing)
          ? 'Yes' : 'No';
      })
    );
  }
}

