import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getJudicialBookingAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'am_judicialBooking', port: 8000 });

const RESPONSE_BODY = {
  userId: somethingLike('018a0310-f122-4377-9504-f635301f39ed-test2'),
  locationId: somethingLike('123'),
  regionId: somethingLike('1'),
  beginTime: somethingLike('01-01-2000'),
  endTime: somethingLike('01-01-3000'),
  created: somethingLike('01-01-1999'),
  log: somethingLike('Booking created')
};

const REQUEST_BODY = { bookingRequest: {
  beginTime: somethingLike('01-01-2000'),
  endTime: somethingLike('01-01-3000'),
  locationId: somethingLike('123'),
  regionId: somethingLike('1'),
  userId: somethingLike('018a0310-f122-4377-9504-f635301f39ed-test2')
} };

describe('Access management api, create booking', () => {
  describe('post /am/bookings', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'create booking',
        uponReceiving: 'relevant user id',
        withRequest: {
          method: 'POST',
          path: '/am/bookings',
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
            'Content-Type': 'application/json'
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
      const configValues = getJudicialBookingAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { createBooking } = requireReloaded('../../../../accessManagement/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        body: {
          beginTime: '01-01-2000',
          endTime: '01-01-3000',
          locationId: '123',
          regionId: '1',
          userId: '018a0310-f122-4377-9504-f635301f39ed-test2'
        }

      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await createBooking(req, response, next);

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
  expect(dto.beginTime).to.be.equal('01-01-2000');
  expect(dto.endTime).to.be.equal('01-01-3000');
  expect(dto.created).to.be.equal('01-01-1999');
  expect(dto.locationId).to.be.equal('123');
  expect(dto.regionId).to.be.equal('1');
  expect(dto.userId).to.be.equal('018a0310-f122-4377-9504-f635301f39ed-test2');
}
