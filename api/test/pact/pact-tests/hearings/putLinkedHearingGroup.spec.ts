import { InteractionObject } from '@pact-foundation/pact/src/dsl/interaction';
import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getHearingsAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'hmc_hearingGroup', port: 8000 });

const groupId = '123456789';

const EXAMPLE_REQUEST_BODY = {
  groupDetails: {
    groupComments: 'string',
    groupLinkType: 'string',
    groupName: 'string',
    groupReason: 'string'
  },
  hearingsInGroup: [
    {
      hearingId: 'string',
      hearingOrder: 0
    }
  ]
};

const REQUEST_BODY = {
  groupDetails: {
    groupComments: somethingLike('string'),
    groupLinkType: somethingLike('string'),
    groupName: somethingLike('string'),
    groupReason: somethingLike('string')
  },
  hearingsInGroup: [{
    hearingId: somethingLike('string'),
    hearingOrder: somethingLike(0)
  }]
};

const RESPONSE_BODY = somethingLike({});

describe('Hearings, update single hearing linked group by a given groupId', () => {
  describe('POST /linkedHearingGroup/{groupId}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction: InteractionObject = {
        state: 'update single hearing linked group for given groupId',
        uponReceiving: 'update single hearing linked group for given groupId',
        withRequest: {
          method: 'PUT',
          path: '/linkedHearingGroup',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          query: {
            id: groupId
          },
          body: REQUEST_BODY
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: RESPONSE_BODY
        }
      };

      pactSetUp.provider.addInteraction(interaction);
    });

    afterEach(() => {
      sandbox.restore();
      sinon.reset();
    });

    it('returns the correct response', async () => {
      const configValues = getHearingsAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { putLinkedHearingGroup } = requireReloaded('../../../../hearings/hmc.index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        query: {
          groupId
        },
        body: EXAMPLE_REQUEST_BODY
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await putLinkedHearingGroup(req, response, next);
      } catch (err) {
        throw new Error(err);
      }

      assertResponses(returnedResponse);
      pactSetUp.provider.verify();
      pactSetUp.provider.finalize();
    });
  });
});

function assertResponses(dto: any) {
  expect(dto).to.be.eql({});
}
