import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'am_roleAssignment_getAssignment', port: 8000 });

const actorId = '12345';

describe('access management service, get role assignments of actor', () => {
  const RESPONSE_BODY = {
    roleAssignmentResponse: [
      {
        'id': somethingLike('3ed4f960-e50b-4127-af30-47821d5799f7'),
        'actorIdType': somethingLike('IDAM'),
        'actorId': somethingLike('23486'),
        'roleType': somethingLike('ORGANISATION'),
        'roleName': somethingLike('senior-tribunal-caseworker'),
        'classification': somethingLike('PRIVATE'),
        'grantType': somethingLike('STANDARD'),
        'roleCategory': somethingLike('LEGAL_OPERATIONS'),
        'readOnly': somethingLike(false),
        'beginTime': somethingLike(1646762003.936321),
        'endTime': somethingLike(1646934803.936321),
        'process': somethingLike('process'),
        'reference': somethingLike('reference'),
        'statusSequence': somethingLike(10),
        'status': somethingLike('LIVE'),
        'created': somethingLike(1646675603.936321),
        'log': null,
        'attributes': {
          'baseLocation': somethingLike('500A2S'),
          'jurisdiction': somethingLike('IA')
        },
        'notes': null,
        'authorisations': []
      }
    ]
  };

  describe('get /am/role-assignments/actors/${actorId}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'An actor with provided id is available in role assignment service',
        uponReceiving: 'get roles assignments for actorId',
        withRequest: {
          method: 'GET',
          path: `/am/role-assignments/actors/${actorId}`,
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.uk.gov.hmcts.role-assignment-service.get-assignments+json;charset=UTF-8;version=1.0'
          },
          body: RESPONSE_BODY
        }
      };
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction);
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

      const { refreshRoleAssignmentForUser } = requireReloaded('../../../../user/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        params: {
          actorId: actorId
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      const userInfo = {
        uid: '12345',
        roles: []
      };
      // let roleAssignments = null;
      try {
        await refreshRoleAssignmentForUser(userInfo, req);
        // roleAssignments = await refreshRoleAssignmentForUser(userInfo, req);
        // assertResponses(roleAssignments);
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      } catch (err) {
        // console.log(err.stack);
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
        throw new Error(err);
      }
    });

    it('returns the correct response given null userInfo', async () => {
      const configValues = getAccessManagementServiceAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { refreshRoleAssignmentForUser } = requireReloaded('../../../../user/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        params: {
          actorId: actorId
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      // let roleAssignments = null;
      try {
        await refreshRoleAssignmentForUser(null, req);
        // roleAssignments = await refreshRoleAssignmentForUser(userInfo, req);
        // assertResponses(roleAssignments);
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      } catch (err) {
        console.log(err.stack);
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
        throw new Error(err);
      }
    });
  });
});

// function assertResponses(dto: any) {
//   expect(dto.length).to.be.equal(1);
// }

