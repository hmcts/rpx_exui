import * as _ from 'underscore';
import { CaseFlagGroup } from '../models/caseFlagGroup.model';
import { CaseFlagReferenceModel } from '../models/caseFlagReference.model';
import { CaseFlagType } from '../models/hearings.enum';
import { PartyDetailsModel } from '../models/partyDetails.model';
import { PartyFlagsDisplayModel, PartyFlagsModel } from '../models/partyFlags.model';

export class CaseFlagsUtils {
  public static ACTIVE = 'active';
  public static LANGUAGE_INTERPRETER_FLAG_ID = 'PF0015';
  public static PARTY_NAME = 'partyName';

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
    const allActiveFlags = this.getAllActiveDisplayFlags(partyFlags, caseFlagsRefDataModels);
    const allRAFs = allActiveFlags.filter((caseFlag) =>
      (caseFlag.displayPath.includes(CaseFlagType.REASONABLE_ADJUSTMENT)
        || caseFlag.flagId === CaseFlagsUtils.LANGUAGE_INTERPRETER_FLAG_ID));
    const allNonRAFs = allActiveFlags.filter((activeFlag) => !allRAFs.includes(activeFlag));
    if (caseFlagType === CaseFlagType.REASONABLE_ADJUSTMENT) {
      return this.getAllRAFsWithGroup(allRAFs);
    }

    return this.getAllNonRAFsWithGroup(allNonRAFs);
  }

  private static getAllActiveDisplayFlags(partyFlags: PartyFlagsModel[], caseFlagsRefDataModels: CaseFlagReferenceModel[]): PartyFlagsDisplayModel[] {
    const displayCaseFlags: PartyFlagsDisplayModel[] = partyFlags.map((flag) => {
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
    return displayCaseFlags.filter((flag) => flag.displayPath ? flag.flagStatus.toLowerCase() === CaseFlagsUtils.ACTIVE : false);
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
      if (reasonableAdjustments.length === 0 && foundPartyFromService.individualDetails && foundPartyFromService.individualDetails.reasonableAdjustments.length > 0) {
        reasonableAdjustments = foundPartyFromService.individualDetails.reasonableAdjustments;
      }
      const allFlagsId: string[] = reasonableAdjustments.slice();
      if (party.individualDetails && party.individualDetails.interpreterLanguage) {
        allFlagsId.push(party.individualDetails.interpreterLanguage);
      }
      const allFlags: CaseFlagReferenceModel[] = allFlagsId.map((flagId) => CaseFlagsUtils.findFlagByFlagId(caseFlagReferenceModels, flagId));
      if (partyName) {
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
}
