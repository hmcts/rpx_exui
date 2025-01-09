import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PartyType } from '../../../../../hearings/models/hearings.enum';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import { CaseFlagReferenceModel } from '../../../../models/caseFlagReference.model';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';
import { HearingRequestMainModel } from '../../../../models/hearingRequestMain.model';
import { PartyDetailsModel } from '../../../../models/partyDetails.model';
import { ServiceHearingValuesModel } from '../../../../models/serviceHearingValues.model';
import { HearingsService } from '../../../../services/hearings.service';
import { CaseFlagsUtils } from '../../../../utils/case-flags.utils';
import { HearingsUtils } from '../../../../utils/hearings.utils';

@Component({
  selector: 'exui-hearing-requirements-section',
  templateUrl: './hearing-requirements-section.component.html'
})
export class HearingRequirementsSectionComponent implements OnInit {
  @Input() public caseFlagsRefData: CaseFlagReferenceModel[];
  @Input() public serviceHearingValuesModel: ServiceHearingValuesModel;
  @Input() public hearingRequestMainModel: HearingRequestMainModel;
  @Input() public hearingRequestToCompareMainModel: HearingRequestMainModel;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public reasonableAdjustmentChangesRequired: boolean;
  public reasonableAdjustmentChangesConfirmed: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;
  public partyDetails: PartyDetailsModel[];
  public partyIds: string[];
  public partyNamesInHMC: string[];
  public partyNamesInHMCRequestToCompare: string[];
  public partiesWithFlags: Map<string, CaseFlagReferenceModel[]>;

  constructor(private readonly hearingsService: HearingsService) {}

  public ngOnInit(): void {
    this.reasonableAdjustmentChangesRequired = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.reasonableAdjustmentChangesRequired;
    this.reasonableAdjustmentChangesConfirmed = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.reasonableAdjustmentChangesConfirmed;
    this.partyDetails = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.reasonableAdjustmentChangesConfirmed
      ? this.hearingRequestMainModel.partyDetails.filter((party) => party.partyType === PartyType.IND)
      : this.hearingRequestToCompareMainModel.partyDetails.filter((party) => party.partyType === PartyType.IND);
    this.partyIds = this.partyDetails.map(((party) => party.partyID));
    this.partyNamesInHMC = this.partyDetails.map(((party) => HearingsUtils.getPartyNameFormatted(party.individualDetails)));
    this.partyNamesInHMCRequestToCompare = this.hearingRequestToCompareMainModel.partyDetails.filter(
      (party) => party.partyType === PartyType.IND
    )?.map(
      ((party) => HearingsUtils.getPartyNameFormatted(party.individualDetails))
    );
    this.partiesWithFlags = this.getPartiesWithFlagData();
  }

  private getPartiesWithFlagData(): Map<string, CaseFlagReferenceModel[]> {
    const partiesWithFlags: Map<string, CaseFlagReferenceModel[]> = new Map();
    const individualParties = this.serviceHearingValuesModel.parties.filter((party) => party.partyType === PartyType.IND);
    individualParties.forEach((partyInSHV) => {
      if (this.partyIds.includes(partyInSHV.partyID)) {
        let flagIds: string[] = [];
        if (this.reasonableAdjustmentChangesConfirmed) {
          const reasonableAdjustments = partyInSHV.individualDetails?.reasonableAdjustments?.filter((flagCode) => flagCode?.startsWith('RA'));
          flagIds = CaseFlagsUtils.addLanguageFlagIfMissing(reasonableAdjustments.slice(), partyInSHV.individualDetails);
        } else {
          const partyInHMC = this.partyDetails.find((partyInHMC) => partyInHMC.partyID === partyInSHV.partyID);
          if (partyInHMC) {
            const reasonableAdjustments = partyInHMC.individualDetails?.reasonableAdjustments?.filter((flagCode) => flagCode?.startsWith('RA'));
            flagIds = CaseFlagsUtils.addLanguageFlagIfMissing(reasonableAdjustments.slice(), partyInHMC?.individualDetails);
          }
        }
        const flags = flagIds?.map((flagId) => CaseFlagsUtils.findFlagByFlagId(this.caseFlagsRefData, flagId))?.filter((flag) => flag !== null);
        const partyName = HearingsUtils.getPartyNameFormatted(partyInSHV.individualDetails);
        if (partyName && flags?.length > 0) {
          partiesWithFlags.set(partyName, flags);
        }
      }
    });
    return partiesWithFlags;
  }

  public onChange(fragmentId: string): void {
    const changeLink = '/hearings/request/hearing-requirements#linkAmendFlags';
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }
}
