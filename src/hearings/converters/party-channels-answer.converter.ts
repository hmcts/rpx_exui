import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PartyType } from '../models/hearings.enum';
import { LovRefDataModel } from '../models/lovRefData.model';
import { PartyDetailsModel } from '../models/partyDetails.model';
import * as fromHearingStore from '../store';
import { AnswerConverter } from './answer.converter';

export class PartyChannelsAnswerConverter implements AnswerConverter {
  constructor(protected readonly route: ActivatedRoute) { }

  private static getPartyChannelValue(refData: LovRefDataModel[], party: PartyDetailsModel): string {
    let preferredHearingChannelRefData = null;
    if (party.individualDetails) {
      preferredHearingChannelRefData = refData.find((ref) => ref.key === party.individualDetails.preferredHearingChannel);
    }
    return preferredHearingChannelRefData && preferredHearingChannelRefData.value_en ? preferredHearingChannelRefData.value_en : '';
  }

  public transformAnswer(hearingState$: Observable<fromHearingStore.State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const partyChannels = [...this.route.snapshot.data.partyChannels, ...this.route.snapshot.data.partySubChannels];
        const partiesFromRequest = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.partyDetails
          : state.hearingRequest.hearingRequestMainModel.partyDetails;
        const partiesFromServiceValue = state.hearingValues.serviceHearingValuesModel.parties;
        let strReturn = '<ul>';
        partiesFromRequest.filter((party) => party.partyType === PartyType.IND)
          .forEach((party: PartyDetailsModel) => {
            const foundPartyFromService = partiesFromServiceValue.find((pty) => pty.partyID === party.partyID);
            const name = this.getPartyName(party, foundPartyFromService);
            const value = PartyChannelsAnswerConverter.getPartyChannelValue(partyChannels, party);
            strReturn += `<li>${name} - ${value}</li>`;
          });
        strReturn += '</ul>';
        return strReturn;
      })
    );
  }

  public getPartyName(party: PartyDetailsModel, foundPartyFromService: PartyDetailsModel): string {
    if (party) {
      return this.getFullName(party);
    }

    if (foundPartyFromService) {
      return this.getFullName(foundPartyFromService);
    }
  }

  getFullName(pdm: PartyDetailsModel) {
    if (pdm.partyName) {
      return pdm.partyName;
    } else if (pdm.individualDetails) {
      return this.getVal(pdm.individualDetails.firstName) + ' ' + this.getVal(pdm.individualDetails.lastName);
    }
    return pdm.partyID;
  }

  getVal(item: string) {
    return item ? item : '';
  }
}
