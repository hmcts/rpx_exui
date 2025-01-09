import { expect } from 'chai';
import { CASE_ALLOCATOR_ROLE, LEGAL_OPS_TYPE } from './constants';
import { getOrganisationRoles, getUserRoleCategory, isCurrentUserCaseAllocator, userDetailsValid } from './utils';

describe('user.utils', () => {
  describe('isCurrentUserCaseAllocator without jurisdiction and location', () => {
    it('should return true', () => {
      const ROLE_ASSIGNMENT_EXAMPLE = {
        id: '478c83f8-0ed0-4651-b8bf-cd2b1e206ac2',
        actorIdType: 'IDAM',
        actorId: 'c5a983be-ca99-4b8a-97f7-23be33c3fd22',
        roleType: 'ORGANISATION',
        roleName: CASE_ALLOCATOR_ROLE,
        classification: 'PUBLIC',
        grantType: 'STANDARD',
        roleCategory: LEGAL_OPS_TYPE,
        readOnly: false,
        created: new Date(2021, 9, 8),
        attributes: {
          baseLocation: '231596',
          jurisdiction: 'IA'
        }
      };
      expect(isCurrentUserCaseAllocator(ROLE_ASSIGNMENT_EXAMPLE)).to.equal(true);
    });

    it('should return false', () => {
      const ROLE_ASSIGNMENT_EXAMPLE = {
        id: '478c83f8-0ed0-4651-b8bf-cd2b1e206ac2',
        actorIdType: 'IDAM',
        actorId: 'c5a983be-ca99-4b8a-97f7-23be33c3fd22',
        roleType: 'ORGANISATION',
        roleName: 'ROLE',
        classification: 'PUBLIC',
        grantType: 'STANDARD',
        roleCategory: LEGAL_OPS_TYPE,
        readOnly: false,
        created: new Date(2021, 9, 8),
        attributes: {
          baseLocation: '231596',
          jurisdiction: 'IA'
        }
      };
      expect(isCurrentUserCaseAllocator(ROLE_ASSIGNMENT_EXAMPLE)).to.equal(false);
    });
  });

  describe('isCurrentUserCaseAllocator with jurisdiction and location', () => {
    it('should return true', () => {
      const ROLE_ASSIGNMENT_EXAMPLE = {
        id: '478c83f8-0ed0-4651-b8bf-cd2b1e206ac2',
        actorIdType: 'IDAM',
        actorId: 'c5a983be-ca99-4b8a-97f7-23be33c3fd22',
        roleType: 'ORGANISATION',
        roleName: CASE_ALLOCATOR_ROLE,
        classification: 'PUBLIC',
        grantType: 'STANDARD',
        roleCategory: LEGAL_OPS_TYPE,
        readOnly: false,
        created: new Date(2021, 9, 8),
        attributes: {
          baseLocation: '231596',
          jurisdiction: 'IA'
        }
      };
      expect(isCurrentUserCaseAllocator(ROLE_ASSIGNMENT_EXAMPLE, 'IA', '231596')).to.equal(true);
    });

    it('should return false', () => {
      const ROLE_ASSIGNMENT_EXAMPLE = {
        id: '478c83f8-0ed0-4651-b8bf-cd2b1e206ac2',
        actorIdType: 'IDAM',
        actorId: 'c5a983be-ca99-4b8a-97f7-23be33c3fd22',
        roleType: 'ORGANISATION',
        roleName: CASE_ALLOCATOR_ROLE,
        classification: 'PUBLIC',
        grantType: 'STANDARD',
        roleCategory: LEGAL_OPS_TYPE,
        readOnly: false,
        created: new Date(2021, 9, 8),
        attributes: {
          baseLocation: '231596',
          jurisdiction: 'IA'
        }
      };
      expect(isCurrentUserCaseAllocator(ROLE_ASSIGNMENT_EXAMPLE, 'DIVORCE', '123123')).to.equal(false);
    });
  });

  describe('getOrganisationRoles', () => {
    it('should return empty when empty array', () => {
      const roleAssignmentInfo = [];
      const response = getOrganisationRoles(roleAssignmentInfo);
      expect(response.length).to.equal(0);
    });

    it('should return empty when null', () => {
      const roleAssignmentInfo = null;
      const response = getOrganisationRoles(roleAssignmentInfo);
      expect(response.length).to.equal(0);
    });

    it('should return 1 row', () => {
      const roleAssignmentInfo = [{
        id: '478c83f8-0ed0-4651-b8bf-cd2b1e206ac2',
        actorIdType: 'IDAM',
        actorId: 'c5a983be-ca99-4b8a-97f7-23be33c3fd22',
        roleType: 'CASE',
        roleName: 'SOME_ROLE',
        classification: 'PUBLIC',
        grantType: 'STANDARD',
        roleCategory: LEGAL_OPS_TYPE,
        readOnly: false,
        created: new Date(2021, 9, 8),
        attributes: {
          baseLocation: '231596',
          jurisdiction: 'IA'
        }
      },
      {
        id: '478c83f8-0ed0-4651-b8bf-cd2b1e206ac3',
        actorIdType: 'IDAM',
        actorId: 'c5a983be-ca99-4b8a-97f7-23be33c3fd22',
        roleType: 'ORGANISATION',
        roleName: CASE_ALLOCATOR_ROLE,
        classification: 'PUBLIC',
        grantType: 'STANDARD',
        roleCategory: LEGAL_OPS_TYPE,
        readOnly: false,
        created: new Date(2021, 9, 8),
        attributes: {
          baseLocation: '231596',
          jurisdiction: 'IA'
        }
      }];
      const response = getOrganisationRoles(roleAssignmentInfo);
      expect(response.length).to.equal(1);
      expect(response[0]).to.equal(CASE_ALLOCATOR_ROLE);
    });
  });

  describe('getUserRoleCategory', () => {
    it('should return UserRoleCategory', () => {
      const roles = ['ADMIN', 'caseworker-ia',
        'caseworker-ia-caseofficer', 'cwd-user',
        'case-allocator', 'tribunal-caseworker',
        'hmcts-legal-operations', 'task-supervisor'];
      expect(getUserRoleCategory(roles)).to.equal('admin');
    });
  });

  describe('userDetailsValid', () => {
    const mockUserDetails = {
      given_name: 'judge',
      email: 'test@ejudiciary.net',
      family_name: 'user',
      name: 'judge user',
      ssoProvider: 'testing-support',
      uid: '12345-45678-567890',
      identity: 'id=12345-45678-567890,ou=test-config',
      roles: [
        'test-role',
        'caseworker-role',
        'judge-role'
      ],
      sub: 'test@ejudiciary.net',
      subname: 'test@ejudiciary.net',
      iss: 'https://test-url.com?test=1'
    };
    it('should ensure user details are valid', () => {
      expect(userDetailsValid(null)).to.equal(true);
      expect(userDetailsValid(mockUserDetails)).to.equal(true);
    });

    it('should set user details to invalid if it has dangerous characters', () => {
      mockUserDetails.email = '<script>alert("hello")</script>';
      expect(userDetailsValid(mockUserDetails)).to.equal(false);
      mockUserDetails.email = 'test@ejudiciary.net';
    });

    it('should set user details to invalid if iss has dangerous characters', () => {
      mockUserDetails.iss = '/*http://test-url.com';
      expect(userDetailsValid(mockUserDetails)).to.equal(false);
      mockUserDetails.iss = 'http://test-url.com&';
      expect(userDetailsValid(mockUserDetails)).to.equal(true);
    });
  });
});
