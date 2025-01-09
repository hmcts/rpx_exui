import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const pactSetUp = new PactTestSetup({ provider: 'am_roleAssignment_deleteRoleByAssignmentId', port: 8000 });

const assigmentId = '704c8b1c-e89b-436a-90f6-953b1dc40157';

const REQUEST_BODY = {
  state: 1,
  accessReason: 'Approve request',
  typeOfRole: { id: 'specific-access-granted', name: 'specific-access-granted' },
  period: {
    startDate: new Date(),
    endDate: new Date()
  },
  actorId: '123',
  caseName: 'example name',
  requestCreated: null,
  caseId: '1594717367271987',
  taskId: 'd3f939d2-d4f3-11ec-8d51-b6ad61ebbb09',
  requestId: '59bedc19-9cc6-4bff-9f58-041c3ba664a0',
  jurisdiction: 'IA',
  roleCategory: 'LEGAL_OPERATIONS',
  requestedRole: 'specific-access-legal-ops',
  person: { id: 'db17f6f7-1abf-4223-8b5e-1eece04ee5d8', name: null, domain: null },
  specificAccessFormData: {
    specificAccessDurationForm: {
      selectedOption: '7 days',
      selectedDuration: {
        startDate: {
          day: 11,
          month: 11,
          year: 2024
        },
        endDate: {
          day: 11,
          month: 11,
          year: 2024
        }
      }
    }
  }
};

describe('access management service, delete role by assignment id', () => {
  describe('delete /am/role-assignments/{assigmentId}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'An actor with provided id is available in role assignment service',
        uponReceiving: 'delete role by assignment id',
        withRequest: {
          method: 'DELETE',
          path: `/am/role-assignments/${assigmentId}`,
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          body: REQUEST_BODY
        },
        willRespondWith: {
          status: 204
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
          },
          body: {}
        }
      };

      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction);
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

      const { deleteRoleByAssignmentId } = requireReloaded('../../../../roleAccess/index');
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
      const response = null;

      try {
        returnedResponse = await deleteRoleByAssignmentId(req, response, next, assigmentId);
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
  expect(dto.status).to.be.equal(204);
  expect(dto.data).to.eql('');
}
