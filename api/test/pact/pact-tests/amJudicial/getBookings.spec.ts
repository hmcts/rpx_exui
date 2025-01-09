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

const MockApp = require('../../../../../test_codecept/nodeMock/app');

const REQUEST_BODY = {
  queryRequest: { userIds: ['018a0310-f122-4377-9504-f635301f39ed-test2'] }
};

const RESPONSE_BODY = { bookings: [{
  beginTime: somethingLike('01-01-2000'),
  endTime: somethingLike('01-01-3000'),
  created: somethingLike('01-01-1999'),
  id: somethingLike('123456789'),
  locationId: somethingLike('123'),
  regionId: somethingLike('1'),
  userId: somethingLike('018a0310-f122-4377-9504-f635301f39ed-test2'),
  locationName: somethingLike('Test Location') }]
};

describe('Access management api, get bookings', () => {
  describe('post /am/bookings/query', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'return bookings for specific user',
        uponReceiving: 'relevant user id',
        withRequest: {
          method: 'POST',
          path: '/am/bookings/query',
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
      MockApp.stopServer();
    });

    it('returns the correct response', async () => {
      MockApp.setServerPort(8080);
      MockApp.init();

      MockApp.onGet('/refdata/location/court-venues/services', (req, res) => {
        res.send({
          court_venues: [
            { epimms_id: '1234', location: [{ site_name: 'Test location' }] }
          ]
        });
      });
      await MockApp.startServer();

      const configValues = getJudicialBookingAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      configValues['services.location_api'] = 'http://localhost:8080';

      // @ts-ignore
      configValues.serviceRefDataMapping = [
        { 'service': 'IA', 'serviceCodes': ['BFA1'] }, { 'service': 'CIVIL', 'serviceCodes': ['AAA6', 'AAA7'] }
      ];

      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getBookings } = requireReloaded('../../../../accessManagement/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        body: {
          userId: '018a0310-f122-4377-9504-f635301f39ed-test2',
          bookableServices: ['IA']
        }

      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getBookings(req, response, next);

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
  expect(dto[0].beginTime).to.be.equal('01-01-2000');
  expect(dto[0].endTime).to.be.equal('01-01-3000');
  expect(dto[0].created).to.be.equal('01-01-1999');
  expect(dto[0].id).to.be.equal('123456789');
  expect(dto[0].locationId).to.be.equal('123');
  expect(dto[0].regionId).to.be.equal('1');
  expect(dto[0].userId).to.be.equal('018a0310-f122-4377-9504-f635301f39ed-test2');
  expect(dto[0].locationName).to.be.equal(null);
}
