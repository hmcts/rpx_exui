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
      const mockStaffDetails = [{}, {}, {}];
      const res = mockRes({ status: 200, data: mockStaffDetails });
      sandbox.stub(http, 'get').resolves(res);
      const data = await fetchNewUserData();
      expect(data).to.equal(mockStaffDetails);
    });
  });

  describe('fetchRoleAssignmentsForNewUsers', () => {
    it('should make a post request', async () => {
      const mockStaffUserDetails: StaffUserDetails[] = [
        {
          ccd_service_name: 'EMPLOYMENT',
          staff_profile: {
            id: '0bdd43aa-527b-40ac-9d68-d72bd45054f4',
            first_name: 'Latest',
            last_name: 'New',
            region_id: '1',
            user_type: 'CTSC',
            suspended: 'false',
            case_allocator: 'Y',
            task_supervisor: 'Y',
            staff_admin: 'N',
            email_id: 'test@test.com',
            region: 'London',
            base_location: [{
              location_id: '637145',
              location: 'Wrexham',
              is_primary: true
            }],
            user_type_id: '1',
            role: [],
            skills: [],
            work_area: [],
            idam_roles: '',
            created_time: new Date(),
            last_updated_time: new Date()
          }
        }];
      const mockRoleAssignments = [{
        id: '123',
        attributes: {},
        roleCategory: 'ADMIN',
        actorId: '0bdd43aa-527b-40ac-9d68-d72bd45054f4'
      }];
      const finalCaseworkers = [{
        email: 'test@test.com',
        firstName: 'Latest',
        idamId: '0bdd43aa-527b-40ac-9d68-d72bd45054f4',
        lastName: 'New',
        location: { id: '637145', locationName: 'Wrexham', services: undefined },
        roleCategory: 'ADMIN',
        service: 'EMPLOYMENT'
      }];
      const res = mockRes({ status: 200, data: { roleAssignmentResponse: mockRoleAssignments } });
      sandbox.stub(http, 'post').resolves(res);
      const data = await fetchRoleAssignmentsForNewUsers(mockStaffUserDetails);
      expect(data).to.deep.equal(finalCaseworkers);
    });
  });
});
