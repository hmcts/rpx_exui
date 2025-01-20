import { expect } from 'chai';
import { LEGAL_OPS_TYPE } from './constants';
import { getActiveRoleAssignments } from './index';
import { RoleAssignment } from './interfaces/roleAssignment';

describe('Index', () => {
  let roleAssignments: RoleAssignment[];

  beforeEach(() => {
    roleAssignments = [{
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
    }];
  });

  describe('getActiveRoleAssignments', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    const yesterday = new Date(today);

    it('should return role assignment if end date is empty', async () => {
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, new Date());
      expect(activeRoleAssignments.length).to.equal(1);
    });

    it('should return role assignment if end date is tomorrow (not expired)', async () => {
      tomorrow.setDate(tomorrow.getDate() + 1);
      roleAssignments[0].endTime = tomorrow;
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, new Date());
      expect(activeRoleAssignments.length).to.equal(1);
    });

    it('should return role assignment if end date is now (not expired)', async () => {
      roleAssignments[0].endTime = today;
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, today);
      expect(activeRoleAssignments.length).to.equal(1);
    });

    it('should return role assignment if end date is now (expired)', async () => {
      roleAssignments[0].endTime = today;
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, new Date());
      expect(activeRoleAssignments.length).to.equal(0);
    });

    it('should return role assignment if end date is yesterday (expired)', async () => {
      yesterday.setDate(yesterday.getDate() - 1);
      roleAssignments[0].endTime = yesterday;
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, new Date());
      expect(activeRoleAssignments.length).to.equal(0);
    });

    const filterDate = new Date(2022, 10, 20);

    it('should return role assignment if end date is empty and filter date 20 Oct 2022', async () => {
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, filterDate);
      expect(activeRoleAssignments.length).to.equal(1);
    });

    it('should return role assignment if end date is 20 Oct 2022 filter date 20 Oct 2022', async () => {
      roleAssignments[0].endTime = filterDate;
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, filterDate);
      expect(activeRoleAssignments.length).to.equal(1);
    });

    it('should return role assignment if end date is end date is 21 Oct 2022 filter date 20 Oct 2022', async () => {
      roleAssignments[0].endTime = new Date(2022, 10, 21);
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, filterDate);
      expect(activeRoleAssignments.length).to.equal(1);
    });

    it('should return role assignment if end date is is 19 Oct 2022 filter date 20 Oct 2022', async () => {
      roleAssignments[0].endTime = new Date(2022, 10, 19);
      const activeRoleAssignments = getActiveRoleAssignments(roleAssignments, filterDate);
      expect(activeRoleAssignments.length).to.equal(0);
    });
  });
});

