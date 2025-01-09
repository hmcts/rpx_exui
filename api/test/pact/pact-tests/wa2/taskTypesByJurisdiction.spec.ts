import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getWorkAllocationAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';
const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;

const pactSetUp = new PactTestSetup({ provider: 'wa_task_management_api_get_task_types_by_jurisdiction', port: 8000 });

describe('Task management api, tasks by jurisdiction', () => {
  const RESPONSE_BODY = {
    task_types: [
      {
        'task_type': {
          'task_type_id': somethingLike('someTaskTypeId'),
          'task_type_name': somethingLike('Some task type name')
        }
      }
    ]
  };

  describe('get task/task-types?jurisdictionserviceId', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'retrieve all task types by jurisdiction',
        uponReceiving: 'retrieve all task types by jurisdiction',
        withRequest: {
          method: 'GET',
          path: '/task/task-types',
          query: 'jurisdiction=wa',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken'
            // 'content-Type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {},
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
      const configValues = getWorkAllocationAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getTaskNames } = requireReloaded('../../../../workAllocation/index');

      const req = mockReq({
        headers: {
          Authorization: 'Bearer someAuthorizationToken',
          ServiceAuthorization: 'Bearer someServiceAuthorizationToken'
          // 'content-Type': 'application/json',
        },
        body: {
          service: 'wa'
        }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
        return response;
      };

      try {
        await getTaskNames(req, response, next);

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
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertResponses(dto: any) {
  // expect(dto[0].key).to.be.equal('1234');
  // expect(dto[0].label).to.be.equal('test');
}
