import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockRes } from 'sinon-express-mock';
import { http } from '../lib/http';
import { fetchNewUserData, fetchRoleAssignmentsForNewUsers } from './caseWorkerUserDataCacheService';
import { StaffUserDetails } from './interfaces/staffUserDetails';

chai.use(sinonChai);

describe('Caseworker Cache Service', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchNewUserData', () => {
    it('should make a get request', async () => {
      const mockStaffDetails = [{
        ccd_service_name: 'IA',
        staff_profile: {
          id: '1',
          first_name: 'IA',
          last_name: 'User',
          email_id: 'IAUser@test.com',
          base_location: [{
            location: 'IA location',
            location_id: 'a',
            is_primary: true
          }]
        }
      },
      {
        ccd_service_name: 'CIVIL',
        staff_profile: {
          id: '1',
          first_name: 'IA',
          last_name: 'User',
          email_id: 'IAUser@test.com',
          base_location: [{
            location: 'CIVIL location',
            location_id: 'b',
            is_primary: false
          },
          {
            location: 'IA location',
            location_id: 'a',
            is_primary: true
          }]
        }
      },
      {
        ccd_service_name: 'PRIVATELAW',
        staff_profile: {
          id: '2',
          first_name: 'PL',
          last_name: 'User',
          email_id: 'PLUser@test.com',
          base_location: [{
            location: 'PL location',
            location_id: 'c',
            is_primary: true
          },
          {
            location: 'IA location',
            location_id: 'a',
            is_primary: false
          }]
        }
      }];
      const mockMergedStaffUsers = [
        {
          ccd_service_name: 'IA',
          staff_profile: {
            id: '1',
            first_name: 'IA',
            last_name: 'User',
            email_id: 'IAUser@test.com',
            base_location: [{
              is_primary: true,
              location: 'IA location',
              location_id: 'a',
              services: ['IA', 'CIVIL']
            }]
          },
          ccd_service_names: ['IA', 'CIVIL']
        },
        {
          ccd_service_name: 'PRIVATELAW',
          staff_profile: {
            id: '2',
            first_name: 'PL',
            last_name: 'User',
            email_id: 'PLUser@test.com',
            base_location: [{
              is_primary: true,
              location: 'PL location',
              location_id: 'c'
            },
            {
              is_primary: false,
              location: 'IA location',
              location_id: 'a'
            }]
          },
          ccd_service_names: ['PRIVATELAW']
        }
      ];
      const res = mockRes({ status: 200, data: mockStaffDetails });
      sandbox.stub(http, 'get').resolves(res);
      const data = await fetchNewUserData();
      expect(data).to.deep.equal(mockMergedStaffUsers);
    });
  });

  describe('fetchRoleAssignmentsForNewUsers', () => {
    it('should make a post request', async () => {
      const mockMergedStaffUsers = [
        {
          ccd_service_name: 'IA',
          staff_profile: {
            id: '1',
            first_name: 'IA',
            last_name: 'User',
            email_id: 'IAUser@test.com',
            base_location: [{
              is_primary: true,
              location: 'IA location',
              location_id: 'a',
              services: ['IA', 'CIVIL']
            }]
          },
          ccd_service_names: ['IA', 'CIVIL']
        },
        {
          ccd_service_name: 'PRIVATELAW',
          staff_profile: {
            id: '2',
            first_name: 'PL',
            last_name: 'User',
            email_id: 'PLUser@test.com',
            base_location: [{
              is_primary: true,
              location: 'PL location',
              location_id: 'c'
            },
            {
              is_primary: false,
              location: 'IA location',
              location_id: 'a'
            }]
          },
          ccd_service_names: ['PRIVATELAW']
        }
      ];
      const mockRoleAssignments = [{
        id: '123',
        attributes: {},
        roleCategory: 'ADMIN',
        actorId: '1'
      },
      {
        id: '124',
        attributes: {},
        roleCategory: 'CTSC',
        actorId: '2'
      }];
      const finalCaseworkers = [{
        email: 'IAUser@test.com',
        firstName: 'IA',
        idamId: '1',
        lastName: 'User',
        locations: [{ id: 'a', locationName: 'IA location', services: ['IA', 'CIVIL'] }],
        roleCategory: 'ADMIN',
        services: ['IA', 'CIVIL']
      },
      {
        email: 'PLUser@test.com',
        firstName: 'PL',
        idamId: '2',
        lastName: 'User',
        locations: [
          { id: 'c', locationName: 'PL location', services: undefined }
        ],
        roleCategory: 'CTSC',
        services: ['PRIVATELAW']
      }];
      const res = mockRes({ status: 200, data: { roleAssignmentResponse: mockRoleAssignments } });
      sandbox.stub(http, 'post').resolves(res);
      const data = await fetchRoleAssignmentsForNewUsers(mockMergedStaffUsers as StaffUserDetails[]);
      expect(data).to.deep.equal(finalCaseworkers);
    });
  });
});
