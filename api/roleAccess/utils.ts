import { allContainOnlySafeCharacters } from '../utils';
import { RefinedRole } from './models/roleType';

// confirm no dangerous characters in substantive roles
// may not be needed as should be created internally but is a Fortify safety check
export function substantiveRolesValid(substantiveRoles: RefinedRole[]): boolean {
  if (!substantiveRoles || substantiveRoles.length < 0) {
    return true;
  }
  for (const role of substantiveRoles) {
    const roleStrings = [role.roleCategory, role.roleId, role.roleName];
    if (!allContainOnlySafeCharacters(roleStrings)) {
      return false;
    } else if (role.roleJurisdiction && !allContainOnlySafeCharacters(role.roleJurisdiction.values)) {
      return false;
    }
  }
  return true;
}
