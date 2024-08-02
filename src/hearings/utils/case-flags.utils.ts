import * as _ from 'underscore';
import { CaseFlagGroup } from '../models/caseFlagGroup.model';
import { CaseFlagReferenceModel } from '../models/caseFlagReference.model';
import { CaseFlagType } from '../models/hearings.enum';
import { AmendmentLabelStatus } from '../models/hearingsUpdateMode.enum';
import { PartyDetailsModel } from '../models/partyDetails.model';
import { PartyFlagsDisplayModel, PartyFlagsModel } from '../models/partyFlags.model';
import { RequestDetailsModel } from '../models/requestDetails.model';

export class CaseFlagsUtils {
  public static ACTIVE = 'active';
  public static LANGUAGE_INTERPRETER_FLAG_ID = 'PF0015';
  public static PARTY_NAME = 'partyName';

  public static getReasonableAdjustmentFlags(caseFlagsRefData: CaseFlagReferenceModel[],
    caseFlags: PartyFlagsModel[], partiesInHMC: PartyDetailsModel[], partiesInSHV: PartyDetailsModel[]): CaseFlagGroup[] {
    // Get all active reasonable adjustment and language interpreter flags
    const activeFlags = this.getActiveDisplaysFlags(caseFlags, caseFlagsRefData, partiesInSHV);
    // Get only the active reasonable adjustment and language interpreter flags
    const reasonableAdjustmentFlags = activeFlags?.filter((caseFlag) =>
      (caseFlag.displayPath?.includes(CaseFlagType.REASONABLE_ADJUSTMENT) || caseFlag.flagId === CaseFlagsUtils.LANGUAGE_INTERPRETER_FLAG_ID)
    );
    // Group the reasonable adjustment flags based on party name
    const groupedReasonableAdjustmentFlags = _.groupBy(reasonableAdjustmentFlags, CaseFlagsUtils.PARTY_NAME);
    return this.getReasonableAdjustmentFlagsGroup(groupedReasonableAdjustmentFlags, partiesInHMC, partiesInSHV);
  }

  public static getNonReasonableAdjustmentFlags(caseFlagsRefData: CaseFlagReferenceModel[],
    caseFlags: PartyFlagsModel[], partiesInHMC: PartyDetailsModel[], partiesInSHV: PartyDetailsModel[],
    hearingDetails: RequestDetailsModel, nonReasonableAdjustmentChangesConfirmed: boolean): CaseFlagGroup[] {
    // Get all active non-reasonable adjustment and language interpreter flags
    const activeFlags = this.getActiveDisplaysFlags(caseFlags, caseFlagsRefData, partiesInSHV);
    const nonReasonableAdjustmentPartyFlags = activeFlags.filter((nonRAF) => nonRAF.displayPath.includes(CaseFlagType.PARTY_FLAGS));
    const activeCaseFlags = activeFlags.filter((nonRAF) => nonRAF.displayPath.includes(CaseFlagType.CASE_FLAG));
    const flags = [...nonReasonableAdjustmentPartyFlags, ...activeCaseFlags];
    const groupedFlags = _.groupBy(flags, CaseFlagsUtils.PARTY_NAME);
    return this.getNonReasonableAdjustmentFlagsGroup(groupedFlags, partiesInHMC, partiesInSHV, hearingDetails, nonReasonableAdjustmentChangesConfirmed);
  }

  /**
   * @overview Generic component display caseFlags with RAF(Reasonable Adjustment Flags) and NonRAF(Non Reasonable Adjustment Flags)
   * @description on hearing requirement page it shows RAF + PF0015
   * @description on hearing facilities page it shows All non RAF + All case flags
   * @description to understand case flags hierarchy refer to caseFlagReference.mock.data.ts
   * @param partyFlags: PartyFlagsModel[] - partyFlags from service API
   * @param caseFlagsRefDataModels: CaseFlagReferenceModel[] - Original caseFlagsRefDataModels from caseFlagReference data
   * @param caseFlagType: CaseFlagType - REASONABLE_ADJUSTMENT/NON_REASONABLE_ADJUSTMENT
   * @return CaseFlagGroup[] - Flags group by case flags type
   */
  public static displayCaseFlagsGroup(partyFlags: PartyFlagsModel[],
    caseFlagsRefDataModels: CaseFlagReferenceModel[],
    caseFlagType: CaseFlagType): CaseFlagGroup[] {
    const allActiveFlags = this.getAllActiveDisplayFlags(partyFlags, caseFlagsRefDataModels) || [];
    const allRAFs = allActiveFlags.filter((caseFlag) =>
      (caseFlag.displayPath.includes(CaseFlagType.REASONABLE_ADJUSTMENT)
        || caseFlag.flagId === CaseFlagsUtils.LANGUAGE_INTERPRETER_FLAG_ID));
    const allNonRAFs = allActiveFlags.filter((activeFlag) => !allRAFs.includes(activeFlag));
    if (caseFlagType === CaseFlagType.REASONABLE_ADJUSTMENT) {
      return this.getAllRAFsWithGroup(allRAFs);
    }

    return this.getAllNonRAFsWithGroup(allNonRAFs);
  }

  private static getAllActiveDisplayFlags(partyFlags: PartyFlagsModel[],
    caseFlagsRefDataModels: CaseFlagReferenceModel[]): PartyFlagsDisplayModel[] {
    const displayCaseFlags: PartyFlagsDisplayModel[] = partyFlags?.map((flag) => {
      const flagPath: CaseFlagReferenceModel = this.findFlagByFlagId(caseFlagsRefDataModels, flag.flagId);
      if (flagPath) {
        return {
          ...flag,
          displayName: flagPath.name,
          displayPath: flagPath.Path
        };
      }

      return {
        ...flag,
        displayName: null,
        displayPath: null
      };
    });
    return displayCaseFlags
      ? displayCaseFlags.filter((flag) => flag.displayPath ? flag.flagStatus.toLowerCase() === CaseFlagsUtils.ACTIVE : false)
      : [];
  }

  private static getAllRAFsWithGroup(flags: PartyFlagsDisplayModel[]): CaseFlagGroup[] {
    const allRAFsWithGroup = _.groupBy(flags, CaseFlagsUtils.PARTY_NAME);
    return this.convertMapToArray(allRAFsWithGroup);
  }

  private static getAllNonRAFsWithGroup(flags: PartyFlagsDisplayModel[]): CaseFlagGroup[] {
    const nonRAPFs = flags.filter((nonRAF) => nonRAF.displayPath.includes(CaseFlagType.PARTY_FLAGS));
    const nonRAPFsWithGroup = _.groupBy(nonRAPFs, CaseFlagsUtils.PARTY_NAME);
    const caseFlags = flags.filter((nonRAF) => nonRAF.displayPath.includes(CaseFlagType.CASE_FLAG));
    const caseFlagsWithGroup = _.groupBy(caseFlags, CaseFlagsUtils.PARTY_NAME);
    return this.convertMapToArray({ ...nonRAPFsWithGroup, ...caseFlagsWithGroup });
  }

  public static findFlagByFlagId(caseFlagReferenceModels: CaseFlagReferenceModel[], flagId: string): CaseFlagReferenceModel {
    let foundFlag = null;
    for (const caseFlag of caseFlagReferenceModels) {
      if (caseFlag.flagCode === flagId) {
        foundFlag = caseFlag;
        break;
      } else {
        if (foundFlag === null && caseFlag.childFlags && caseFlag.childFlags.length > 0) {
          foundFlag = this.findFlagByFlagId(caseFlag.childFlags, flagId);
        }
      }
    }
    return foundFlag;
  }

  public static convertPartiesToPartyWithFlags(caseFlagReferenceModels: CaseFlagReferenceModel[],
    partyDetails: PartyDetailsModel[],
    partiesFromServiceValue?: PartyDetailsModel[]): Map<string, CaseFlagReferenceModel[]> {
    const partyWithFlags: Map<string, CaseFlagReferenceModel[]> = new Map();
    partyDetails.forEach((party) => {
      const foundPartyFromService = partiesFromServiceValue.find((pt) => pt.partyID === party.partyID);
      const partyName = party.partyName ? party.partyName : (foundPartyFromService ? foundPartyFromService.partyName : '');
      let reasonableAdjustments: string[] = party.individualDetails && party.individualDetails.reasonableAdjustments ? party.individualDetails.reasonableAdjustments : [];
      // If reasonable adjustments are not found in the hearing request,
      // check the service hearing values in case flags have been set after the hearing was requested
      if (reasonableAdjustments.length === 0 && foundPartyFromService.individualDetails && foundPartyFromService.individualDetails?.reasonableAdjustments?.length > 0) {
        reasonableAdjustments = foundPartyFromService.individualDetails.reasonableAdjustments;
      }
      const allFlagsId: string[] = reasonableAdjustments.slice();
      if (party.individualDetails?.interpreterLanguage) {
        allFlagsId.push(CaseFlagsUtils.LANGUAGE_INTERPRETER_FLAG_ID);
      }
      const allFlags: CaseFlagReferenceModel[] = allFlagsId.map((flagId) => CaseFlagsUtils.findFlagByFlagId(caseFlagReferenceModels, flagId))
        .filter((foundFlag) => foundFlag !== null);
      if (allFlags?.length > 0 && partyName) {
        partyWithFlags.set(partyName, allFlags);
      }
    });
    return partyWithFlags;
  }

  private static convertMapToArray(caseFlags: Record<string, PartyFlagsDisplayModel[]>): CaseFlagGroup[] {
    const caseFlagGroups = [];
    for (const caseFlag in caseFlags) {
      if (caseFlags.hasOwnProperty(caseFlag)) {
        caseFlagGroups.push(
          {
            name: caseFlag,
            partyFlags: caseFlags[caseFlag]
          } as CaseFlagGroup);
      }
    }
    return caseFlagGroups;
  }

  private static getActiveDisplaysFlags(caseFlags: PartyFlagsModel[],
    caseFlagsRefData: CaseFlagReferenceModel[], partiesInSHV: PartyDetailsModel[]): PartyFlagsDisplayModel[] {
    const flags: PartyFlagsDisplayModel[] = caseFlags?.map((flag) => {
      const flagPath = this.findFlagByFlagId(caseFlagsRefData, flag.flagId);
      const partyInSHV = partiesInSHV.find((party) => party.partyID === flag.partyId);
      if (flagPath) {
        return {
          ...flag,
          partyName: partyInSHV ? partyInSHV.partyName : flag.partyName,
          displayName: flagPath.name,
          displayPath: flagPath.Path
        };
      }
      return {
        ...flag,
        partyName: partyInSHV ? partyInSHV.partyName : flag.partyName,
        displayName: null,
        displayPath: null
      };
    });
    return flags;
  }

  private static getReasonableAdjustmentFlagsGroup(groupedReasonableAdjustmentFlags: Record<string, PartyFlagsDisplayModel[]>,
    partiesInHMC: PartyDetailsModel[], partiesInSHV: PartyDetailsModel[]): CaseFlagGroup[] {
    const reasonableAdjustmentFlagGroups = [];
    for (const reasonableAdjustmentFlag in groupedReasonableAdjustmentFlags) {
      if (groupedReasonableAdjustmentFlags.hasOwnProperty(reasonableAdjustmentFlag)) {
        reasonableAdjustmentFlagGroups.push(
          {
            name: reasonableAdjustmentFlag,
            partyFlags: this.getReasonableAdjustmentFlagsWithAmendedLabelStatus(groupedReasonableAdjustmentFlags[reasonableAdjustmentFlag], partiesInHMC),
            partyAmendmentLabelStatus: this.getPartyAmendmentLabelStatus(groupedReasonableAdjustmentFlags[reasonableAdjustmentFlag], partiesInHMC, partiesInSHV)
          } as CaseFlagGroup);
      }
    }
    return reasonableAdjustmentFlagGroups;
  }

  private static getReasonableAdjustmentFlagsWithAmendedLabelStatus(reasonableAdjustmentFlags: PartyFlagsDisplayModel[],
    partiesInHMC: PartyDetailsModel[]): PartyFlagsDisplayModel[] {
    // Find the party from hearing request main model
    const partyInHMC = partiesInHMC.find((party) => party.partyID === reasonableAdjustmentFlags[0].partyId);
    // Loop through the case flags in service hearing values model and check if the flags ids
    // are present in hearing request main model's individual details' reasonable adjustments
    // and if they are not present it implies that new case flag has been added to the case after
    // the hearing request was created and the label against the flag should be displayed as ACTION NEEDED
    for (const reasonableAdjustmentFlag of reasonableAdjustmentFlags) {
      if (partyInHMC) {
        if (!partyInHMC.individualDetails?.reasonableAdjustments?.includes(reasonableAdjustmentFlag.flagId)) {
          reasonableAdjustmentFlag.flagAmendmentLabelStatus = AmendmentLabelStatus.ACTION_NEEDED;
        }
      }
    }
    return reasonableAdjustmentFlags;
  }

  private static getNonReasonableAdjustmentFlagsGroup(groupedFlags: Record<string, PartyFlagsDisplayModel[]>,
    partiesInHMC: PartyDetailsModel[], partiesInSHV: PartyDetailsModel[], hearingDetails: RequestDetailsModel, nonReasonableAdjustmentChangesConfirmed: boolean): CaseFlagGroup[] {
    const nonReasonableAdjustmentFlagGroups = [];
    for (const flag in groupedFlags) {
      if (groupedFlags.hasOwnProperty(flag)) {
        nonReasonableAdjustmentFlagGroups.push(
          {
            name: flag,
            partyFlags: this.getNonReasonableAdjustmentFlagsWithAmendedLabelStatus(groupedFlags[flag], hearingDetails, nonReasonableAdjustmentChangesConfirmed),
            partyAmendmentLabelStatus: nonReasonableAdjustmentChangesConfirmed ? AmendmentLabelStatus.NONE : this.getPartyAmendmentLabelStatus(groupedFlags[flag], partiesInHMC, partiesInSHV)
          } as CaseFlagGroup);
      }
    }
    return nonReasonableAdjustmentFlagGroups;
  }

  private static getNonReasonableAdjustmentFlagsWithAmendedLabelStatus(flags: PartyFlagsDisplayModel[],
    hearingDetails: RequestDetailsModel, nonReasonableAdjustmentChangesConfirmed: boolean): PartyFlagsDisplayModel[] {
    if (!nonReasonableAdjustmentChangesConfirmed) {
      for (const flag of flags) {
        if ((flag.dateTimeModified && new Date(flag.dateTimeModified) > new Date(hearingDetails.timestamp)) ||
          (flag.dateTimeCreated && new Date(flag.dateTimeCreated) > new Date(hearingDetails.timestamp))) {
          flag.flagAmendmentLabelStatus = AmendmentLabelStatus.ACTION_NEEDED;
        }
      }
    }
    return flags;
  }

  private static getPartyAmendmentLabelStatus(flags: PartyFlagsDisplayModel[],
    partiesInHMC: PartyDetailsModel[], partiesInSHV: PartyDetailsModel[]): AmendmentLabelStatus {
    // Find the party from service hearing values model
    const partyInSHV = partiesInSHV.find((party) => party.partyID === flags[0].partyId);
    const isNewParty = !partiesInHMC.map((party) => party.partyID)?.includes(partyInSHV.partyID);
    // The party from service hearing values model is not present in the hearing reqquest model then
    // it is a new party and the label against the party should be displayed as ACTION NEEDED
    if (isNewParty) {
      return AmendmentLabelStatus.ACTION_NEEDED;
    }
    // The party from service hearing values model is present in the hearing reqquest model and if the party name did not match then
    // it implied that the party name changed and the label against the party should be displayed as AMENDED
    const partyInHMC = partiesInHMC.find((party) => party.partyID === flags[0].partyId);
    if (partyInHMC && partyInHMC.partyName !== partyInSHV.partyName) {
      return AmendmentLabelStatus.AMENDED;
    }
    return AmendmentLabelStatus.NONE;
  }
}
