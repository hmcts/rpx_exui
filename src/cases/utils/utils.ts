import { CaseRole, CaseRoleDetails, RoleCategory, RoleExclusion } from '../../role-access/models';
import { FeatureVariation } from '../models/feature-variation.model';

export class Utils {
  public static isStringOrNumber(value: any): boolean {
    return (typeof value === 'string' && value.length !== 0) || (typeof value === 'number');
  }

  public static getFilterType(fieldName: string, metadataFields): string {
    return (metadataFields && (metadataFields.indexOf(fieldName) > -1)) ?
      'metadataFilter' : 'caseFilter';
  }

  public static sanitiseMetadataFieldName(filterType: string, fieldName: string): string {
    if (filterType === 'metadataFilter') {
      fieldName = fieldName.replace(/\[(.*?)]/g, '$1').toLocaleLowerCase();
    }
    return fieldName;
  }

  public static escapeRegExp(string: string): string {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  public static replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(Utils.escapeRegExp(find), 'g'), replace);
  }

  public static getJudicialUserIds(caseRoles: CaseRole[]): string[] {
    return caseRoles.filter((role) => role.roleCategory === RoleCategory.JUDICIAL).map((caseRole) => caseRole.actorId);
  }

  public static getJudicialUserIdsFromExclusions(exclusions: RoleExclusion[]): string[] {
    return exclusions.filter((role) => role.userType.toUpperCase() === RoleCategory.JUDICIAL).map((exclusionRole) => exclusionRole.actorId);
  }

  public static mapCaseRolesForExclusions(exclusions: RoleExclusion[], caseRolesWithUserDetails: CaseRoleDetails[]): RoleExclusion[] {
    exclusions.forEach((exclusion) => {
      if (caseRolesWithUserDetails.find((detail) => detail.sidam_id === exclusion.actorId)) {
        exclusion.name = caseRolesWithUserDetails.find((detail) => detail.sidam_id === exclusion.actorId).known_as;
      }
    });
    return exclusions;
  }

  public static mapCaseRoles(caseRoles: CaseRole[], caseRolesWithUserDetails: CaseRoleDetails[]): CaseRole[] {
    return caseRoles.map((role) => {
      const userDetails = caseRolesWithUserDetails.find((detail) => detail.sidam_id === role.actorId);
      if (!userDetails) {
        return role;
      }
      return {
        ...role,
        name: userDetails.full_name,
        email: userDetails.email_id
      };
    });
  }

  public static hasMatchedJurisdictionAndCaseType(featureVariation: FeatureVariation, jurisdictionId: string, caseType: string): boolean {
    if (featureVariation.jurisdiction === jurisdictionId) {
      if ((featureVariation?.caseType === caseType) ||
        (featureVariation?.includeCaseTypes?.length > 0 &&
          featureVariation?.includeCaseTypes.some((ct) => ct === caseType || new RegExp('^'+ ct + '$').test(caseType)))) {
        return true;
      }
    }
    return false;
  }
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
