import { somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const pactSetUp = new PactTestSetup({ provider: 'am_roleAssignment_confirmAllocateRole', port: 8000 });

const REQUEST_BODY = {
  caseId: '1234123412341234',
  jurisdiction: 'IA',
  assignmentId: 'a123456',
  state: 1,
  typeOfRole: {
    id: 'lead-judge',
    name: 'Lead judge'
  },
  allocateTo: 'Allocate to me',
  personToBeRemoved: {
    id: 'p111111',
    name: 'test1',
    domain: ''
  },
  person: {
    id: 'p222222',
    name: 'test2',
    domain: ''
  },
  durationOfRole: '7 days',
  action: 'allocate',
  period: {
    startDate: '11-07-2023',
    endDate: '18-07-2023'
  },
  roleCategory: 'LEGAL_OPERATIONS'
};

const ROLE_ASSIGNMENTS_BODY = {
  roleRequest: somethingLike({
    assignerId: somethingLike('123'),
    replaceExisting: somethingLike(false)
  }),
  requestedRoles: somethingLike([{
    roleType: somethingLike('CASE'),
    grantType: somethingLike('SPECIFIC'),
    classification: somethingLike('PUBLIC'),
    attributes: {
      caseId: somethingLike('1234123412341234'),
      jurisdiction: somethingLike('IA')
    },
    roleName: somethingLike('lead-judge'),
    roleCategory: somethingLike('LEGAL_OPERATIONS'),
    actorIdType: somethingLike('IDAM'),
    actorId: somethingLike('123'),
    beginTime: somethingLike('11-07-2023'),
    endTime: somethingLike('18-07-2023')
  }])
};

describe('access management service, confirm allocate role', () => {
  describe('confirm allocate role /allocate-role/confirm', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async() => {
      await pactSetUp.provider.setup();
      const roleAssignmentInteraction = {
        state: 'Confirm allocate role for user',
        uponReceiving: 'confirm role allocation',
        withRequest: {
          method: 'POST',
          path: '/am/role-assignments',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          body: ROLE_ASSIGNMENTS_BODY
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/vnd.uk.gov.hmcts.role-assignment-service.post-assignment-query-request+json;charset=UTF-8;version=2.0'
          },
          body: {}
        }
      };
      const refreshRoleAssignmentInteraction = {
        state: 'An actor with provided id is available in role assignment service',
        uponReceiving: 'refresh role assignment for user',
        withRequest: {
          method: 'GET',
          path: '/am/role-assignments/actors/123',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/vnd.uk.gov.hmcts.role-assignment-service.post-assignment-query-request+json;charset=UTF-8;version=2.0'
          }
        }
      };

      // @ts-ignore
      pactSetUp.provider.addInteraction(roleAssignmentInteraction);
      // @ts-ignore
      pactSetUp.provider.addInteraction(refreshRoleAssignmentInteraction);
    });

    afterEach(() => {
      sandbox.restore();
      sinon.reset();
    });

    it('returns the correct response', async () => {
      const configValues = getAccessManagementServiceAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { confirmAllocateRole } = requireReloaded('../../../../roleAccess/index');
      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        session: { passport: { user: { userinfo: { id: '123' } } } },
        body: REQUEST_BODY
      });

      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await confirmAllocateRole(req, response, next);
        assertResponses(returnedResponse);
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      } catch (err) {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
        throw new Error(err);
      }
    });
  });
});

function assertResponses(dto: any) {
  expect(dto).to.eql({});
}
