import { somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const pactSetUp = new PactTestSetup({ provider: 'am_roleAssignment_deleteRoleByCaseAndRoleId', port: 8000 });

const assignmentId = '704c8b1c-e89b-436a-90f6-953b1dc40157';

const REQUEST_BODY = {
  'assignmentId': assignmentId
};

xdescribe('access management service, delete role by case and role id', () => {
  describe('delete /am/role-assignments/{assignmentId}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'An actor with provided id is available in role assignment service',
        uponReceiving: 'delete role by case and role id',
        withRequest: {
          method: 'DELETE',
          path: `/am/role-assignments/${assignmentId}`,
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          body: {
            'assignmentId': somethingLike(assignmentId)
          }
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

      const { deleteRoleByCaseAndRoleId } = requireReloaded('../../../../roleAccess/index');
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
        await deleteRoleByCaseAndRoleId(req, response, next);
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
  // The API does not send any response back
  expect(dto).to.be.equal(undefined);
}
