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

const RESPONSE_BODY = {
  hearingGroupRequestId: somethingLike('string')
};

describe('Hearings, create single hearing linked group', () => {
  describe('POST /linkedHearingGroup', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction: InteractionObject = {
        state: 'create single hearing linked group for',
        uponReceiving: 'create single hearing linked group',
        withRequest: {
          method: 'POST',
          path: '/linkedHearingGroup',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
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

      const { postLinkedHearingGroup } = requireReloaded('../../../../hearings/hmc.index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        body: EXAMPLE_REQUEST_BODY
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await postLinkedHearingGroup(req, response, next);
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
  expect(dto.hearingGroupRequestId).to.be.equal('string');
}
