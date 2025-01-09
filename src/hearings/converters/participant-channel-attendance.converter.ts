import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LovRefDataModel } from '../models/lovRefData.model';
import * as fromHearingStore from '../store';
import { AnswerConverter } from './answer.converter';

export class ParticipantChannelAttendenceAnswerConverter implements AnswerConverter {
  constructor(
    protected readonly route: ActivatedRoute) {}

  private static getPartyChannelValue(refData: LovRefDataModel[], channelName: string): string {
    const participantChannelName = refData.find((ref) => ref.key === channelName);
    return participantChannelName && participantChannelName.value_en ? participantChannelName.value_en : '';
  }

  public transformAnswer(hearingState$: Observable<fromHearingStore.State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const partyChannels = [...this.route.snapshot.data.partyChannels, ...this.route.snapshot.data.partySubChannels];
        const participants = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingChannels
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingChannels;
        let strReturn = '<ul>';
        participants?.forEach((channelName: string) => {
          const name = ParticipantChannelAttendenceAnswerConverter.getPartyChannelValue(partyChannels, channelName);
          strReturn += `<li>${name}</li>`;
        });
        strReturn += '</ul>';
        return strReturn;
      })
    );
  }
}
