import { expect } from 'chai';
import { RefinedRole } from './models/roleType';
import { substantiveRolesValid } from './utils';

describe('roleAssignment.utils', () => {
  describe('substantiveRolesValid', () => {
    it('should check substantive roles to confirm validity', () => {
      const mockSubstantiveRoles: RefinedRole[] = [
        {
          roleCategory: 'ADMIN',
          roleId: '1',
          roleName: 'test role',
          roleJurisdiction: {
            mandatory: false,
            values: ['1', '2']
          }
        }
      ];
      expect(substantiveRolesValid(mockSubstantiveRoles)).to.equal(true);
      const mockDangerousRole = {
        roleCategory: 'ADMIN',
        roleId: '1',
        roleName: 'test role<script>',
        roleJurisdiction: {
          mandatory: false,
          values: ['1', '2']
        }
      };
      mockSubstantiveRoles.push(mockDangerousRole);
      expect(substantiveRolesValid(mockSubstantiveRoles)).to.equal(false);
      mockSubstantiveRoles.pop();
      expect(substantiveRolesValid(mockSubstantiveRoles)).to.equal(true);
      mockDangerousRole.roleJurisdiction.values.push('<script>');
      mockDangerousRole.roleName = 'test role';
      mockSubstantiveRoles.push(mockDangerousRole);
      expect(substantiveRolesValid(mockSubstantiveRoles)).to.equal(false);
    });
  });
});
