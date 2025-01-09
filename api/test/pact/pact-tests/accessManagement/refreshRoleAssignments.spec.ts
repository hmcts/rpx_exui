import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementRoleMappingServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';
const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'am_orgRoleMapping_refresh', port: 8000 });

describe('get /am/role-mapping/judicial/refresh', () => {
  const sandbox: sinon.SinonSandbox = sinon.createSandbox();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let next;

  beforeEach(() => {
    next = sandbox.spy();
  });

  before(async () => {
    await pactSetUp.provider.setup();
    const interaction = {
      state: 'A refresh request is received with a valid userId passed',
      uponReceiving: 'a refresh request is received with a valid userId passed',
      withRequest: {
        method: 'POST',
        path: '/am/role-mapping/judicial/refresh',
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        body: { refreshRequest: { userIds: ['5629957f-4dcd-40b8-a0b2-e64ff5898b28'] } }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.uk.gov.hmcts.am-org-role-mapping-service.map-judicial-assignments+json;charset=UTF-8;version=1.0'
        },
        body: {
          'Message': somethingLike('Role assignments have been refreshed successfully')
        }
      }
    };
    // @ts-ignore
    pactSetUp.provider.addInteraction(interaction);
  });

  afterEach(() => {
    sandbox.restore();
    sinon.reset();
    pactSetUp.provider.finalize();
  });

  it('returns the correct response', async () => {
    const configValues = getAccessManagementRoleMappingServiceAPIOverrides(pactSetUp.provider.mockService.baseUrl);
    sandbox.stub(config, 'get').callsFake((prop) => {
      return configValues[prop];
    });

    const { refreshRoleAssignments } = requireReloaded('../../../../accessManagement/index');

    const req = mockReq({
      headers: {
        'Authorization': 'Bearer someAuthorizationToken',
        'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
        'content-type': 'application/json'
      },
      body: {
        userId: '5629957f-4dcd-40b8-a0b2-e64ff5898b28'
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
      await refreshRoleAssignments(req, response, next);
      assertResponses(returnedResponse);
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

function assertResponses(dto: any) {
  expect(dto.Message).to.includes('Role assignments have been refreshed successfully');
}
