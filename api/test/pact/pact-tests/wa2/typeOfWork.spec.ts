import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getWorkAllocationAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';
const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;

const pactSetUp = new PactTestSetup({ provider: 'wa_task_management_api_get_work_types', port: 8000 });

describe('Task management api, work types', () => {
  const RESPONSE_BODY = {
    'work_types': [
      {
        id: somethingLike('hearing_work'),
        label: somethingLike('Hearing Work')
      },
      {
        id: somethingLike('upper_tribunal'),
        label: somethingLike('Upper Tribunal')
      },
      {
        id: somethingLike('routine_work'),
        label: somethingLike('Routine work')
      },
      {
        id: somethingLike('decision_making_work'),
        label: somethingLike('Decision-making work')
      },
      {
        id: somethingLike('applications'),
        label: somethingLike('Applications')
      },
      {
        id: somethingLike('priority'),
        label: somethingLike('Priority')
      },
      {
        id: somethingLike('access_requests'),
        label: somethingLike('Access requests')
      },
      {
        id: somethingLike('error_management'),
        label: somethingLike('Error management')
      },
      {
        id: somethingLike('review_case'),
        label: somethingLike('Review Case')
      },
      {
        id: somethingLike('evidence'),
        label: somethingLike('Evidence')
      },
      {
        id: somethingLike('follow_up'),
        label: somethingLike('Follow Up')
      },
      {
        id: somethingLike('pre_hearing'),
        label: somethingLike('Pre-Hearing')
      },
      {
        id: somethingLike('post_hearing'),
        label: somethingLike('Post-Hearing')
      }
    ]
  };

  describe('get /work-types', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'retrieve work types by userId',
        uponReceiving: 'retrieve all work types',
        withRequest: {
          method: 'GET',
          path: '/work-types',
          query: 'filter-by-user=true',
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

      const { getTypesOfWork } = requireReloaded('../../../../workAllocation/index');

      const req = mockReq({
        headers: {
          Authorization: 'Bearer someAuthorizationToken',
          ServiceAuthorization: 'Bearer someServiceAuthorizationToken'
          // 'content-Type': 'application/json',
        }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getTypesOfWork(req, response, next);

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

function assertResponses(dto: any) {
  expect(dto[0].key).to.be.equal('hearing_work');
}
