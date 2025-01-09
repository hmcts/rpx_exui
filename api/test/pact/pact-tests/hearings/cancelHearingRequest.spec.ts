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
const pactSetUp = new PactTestSetup({ provider: 'hmcHearingServiceProvider', port: 8000 });

const hearingId = '1234567890123456';

const REQUEST_BODY = {
  cancellationReasonCodes: [somethingLike('string')]
};

const RESPONSE_BODY = {
  'hearingRequestID': somethingLike(0),
  'partiesNotified': somethingLike('2023-07-04T11:47:39.004Z'),
  'requestVersion': somethingLike(0),
  'responseVersion': somethingLike(0),
  'serviceData': somethingLike({}),
  'status': somethingLike('string'),
  'timeStamp': somethingLike('2023-07-04T11:47:39.004Z'),
  'versionNumber': somethingLike(0)
};

describe('Hearings, delete a single hearing request', () => {
  describe('delete /hearing/{hearingId}}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction: InteractionObject = {
        state: 'Delete a hearing request',
        uponReceiving: 'delete single hearing request',
        withRequest: {
          method: 'DELETE',
          path: `/hearing/${hearingId}`,
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

      const { cancelHearingRequest } = requireReloaded('../../../../hearings/hmc.index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        query: {
          hearingId
        },
        body: {
          cancellationReasonCodes: ['string']
        }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await cancelHearingRequest(req, response, next);
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
  expect(dto.hearingRequestID).to.be.equal(0);
  expect(dto.partiesNotified).to.be.equal('2023-07-04T11:47:39.004Z');
  expect(dto.requestVersion).to.be.equal(0);
  expect(dto.responseVersion).to.be.equal(0);
  expect(dto.serviceData).to.be.eql({});
  expect(dto.status).to.be.equal('string');
  expect(dto.timeStamp).to.be.equal('2023-07-04T11:47:39.004Z');
  expect(dto.versionNumber).to.be.equal(0);
}
