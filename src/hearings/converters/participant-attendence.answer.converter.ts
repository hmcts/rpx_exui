import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PartyType } from '../models/hearings.enum';
import { LovRefDataModel } from '../models/lovRefData.model';
import { PartyDetailsModel } from '../models/partyDetails.model';
import { State } from '../store';
import { HearingsUtils } from '../utils/hearings.utils';
import { AnswerConverter } from './answer.converter';

export class ParticipantAttendenceAnswerConverter implements AnswerConverter {
  constructor(
    protected readonly route: ActivatedRoute) {}

  private static getPartyChannelValue(refData: LovRefDataModel[], party: PartyDetailsModel): string {
    const preferredHearingChannelRefData = refData.find((ref) => ref.key === party.hearingSubChannel);
    return preferredHearingChannelRefData?.value_en ? preferredHearingChannelRefData.value_en : `Error: ${party.hearingSubChannel}`;
  }

  private static getPartyName(partiesFromServiceValue: PartyDetailsModel[], partyInfo: PartyDetailsModel): string {
    const partyDetails = partiesFromServiceValue.find((pty) => pty.partyID === partyInfo.partyID);
    if (partyDetails) {
      return `${partyDetails.individualDetails.firstName} ${partyDetails.individualDetails.lastName}`;
    }
    return `Error: ${partyInfo.partyID}`;
  }

  public transformAnswer(hearingState$: Observable<State>, index: number): Observable<string> {
    const partyChannels = [...this.route.snapshot.data.partyChannels, ...this.route.snapshot.data.partySubChannels];

    return hearingState$.pipe(
      map((state) => {
        const hearingResponse = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingResponse
          : state.hearingRequest.hearingRequestMainModel.hearingResponse;
        let hearingDaySchedule = hearingResponse && hearingResponse.hearingDaySchedule;
        if (!hearingDaySchedule) {
          return '';
        }
        const partiesFromServiceValue = state.hearingValues.serviceHearingValuesModel.parties?.filter((party) => party.partyType === PartyType.IND);
        if (!partiesFromServiceValue) {
          return '';
        }
        const partyIds = partiesFromServiceValue.map((party) => party.partyID);
        hearingDaySchedule = HearingsUtils.sortHearingDaySchedule(hearingDaySchedule);
        const partiesFromRequest = hearingDaySchedule[index || 0].attendees?.filter((attendee) => partyIds.includes(attendee.partyID));
        return partiesFromRequest.map((partyInfo) => {
          const name = ParticipantAttendenceAnswerConverter.getPartyName(partiesFromServiceValue, partyInfo);
          const value = ParticipantAttendenceAnswerConverter.getPartyChannelValue(partyChannels, partyInfo);
          return `${name} - ${value}`;
        }).join('<br>');
      })
    );
  }
}
