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
const pactSetUp = new PactTestSetup({ provider: 'hmc_hearingActuals', port: 8000 });

const hearingId = '1234567890123456';

const EXAMPLE_REQUEST_BODY = {
  actualHearingDays: [{
    actualDayParties: [{
      actualOrganisationName: 'string',
      actualPartyId: 'string',
      didNotAttendFlag: true,
      individualDetails: {
        firstName: 'string',
        lastName: 'string'
      },
      partyChannelSubType: 'string',
      partyRole: 'string',
      representedParty: 'string'
    }],
    hearingDate: '2023-07-03',
    hearingEndTime: '2023-07-03T13:00:50.368Z',
    hearingStartTime: '2023-07-03T13:00:50.368Z',
    notRequired: true,
    pauseDateTimes: [{
      pauseEndTime: '2023-07-03T13:00:50.368Z',
      pauseStartTime: '2023-07-03T13:00:50.368Z'
    }]
  }],
  hearingOutcome: {
    hearingFinalFlag: true,
    hearingResult: 'string',
    hearingResultDate: '2023-07-03',
    hearingResultReasonType: 'string',
    hearingType: 'string'
  }
};

const REQUEST_BODY = {
  actualHearingDays: [{
    actualDayParties: [{
      actualOrganisationName: somethingLike('string'),
      actualPartyId: somethingLike('string'),
      didNotAttendFlag: somethingLike(true),
      individualDetails: {
        firstName: somethingLike('string'),
        lastName: somethingLike('string')
      },
      partyChannelSubType: somethingLike('string'),
      partyRole: somethingLike('string'),
      representedParty: somethingLike('string')
    }],
    hearingDate: somethingLike('2023-07-03'),
    hearingEndTime: somethingLike('2023-07-03T13:00:50.368Z'),
    hearingStartTime: somethingLike('2023-07-03T13:00:50.368Z'),
    notRequired: somethingLike(true),
    pauseDateTimes: [{
      pauseEndTime: somethingLike('2023-07-03T13:00:50.368Z'),
      pauseStartTime: somethingLike('2023-07-03T13:00:50.368Z')
    }]
  }],
  hearingOutcome: {
    hearingFinalFlag: somethingLike(true),
    hearingResult: somethingLike('string'),
    hearingResultDate: somethingLike('2023-07-03'),
    hearingResultReasonType: somethingLike('string'),
    hearingType: somethingLike('string')
  }
};

describe('Hearings, update single hearing actuals for given hearingId', () => {
  describe('PUT /hearingActuals/{hearingId}}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction: InteractionObject = {
        state: 'Update hearing actuals by hearingId',
        uponReceiving: 'update hearing actuals for given hearingId',
        withRequest: {
          method: 'PUT',
          path: `/hearingActuals/${hearingId}`,
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
          body: {}
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

      const { updateHearingActuals } = requireReloaded('../../../../hearings/hmc.index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        query: {
          hearingId
        },
        body: EXAMPLE_REQUEST_BODY
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await updateHearingActuals(req, response, next);
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
