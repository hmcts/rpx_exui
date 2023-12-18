import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getCaseworkerRefDataAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_caseworkerRefUsers', port: 8000 });

const MockApp = require('../../../../../test_codecept/nodeMock/app');

xdescribe('Caseworker ref data api, get all caseworkers for a specific location and service', () => {
  const baseLocations = [
    { location_id: somethingLike(1), location: somethingLike('National'), is_primary: somethingLike(true) }
  ];
  const RESPONSE_BODY = [
    {
      'email_id': somethingLike('test_person@test.gov.uk'),
      'first_name': somethingLike('testfn'),
      'last_name': somethingLike('testln'),
      'id': somethingLike('004b7164-0943-41b5-95fc-39794af4a9fe'),
      'base_location': baseLocations
    }
  ];

  describe('get /caseworker', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'A list of users for CRD request',
        uponReceiving: 'get list of caseworkers for location and service',
        withRequest: {
          method: 'GET',
          path: '/caseworker/location/1/service/IA',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          body: null
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

      MockApp.onPost('/am/role-assignments/query', (req, res) => {
        res.send({
          roleAssignmentResponse: [
            { actorId: '004b7164-0943-41b5-95fc-39794af4a9fe', roleCategory: 'case-worker' },
            { actorId: '004b7164-0943-41b5-95fc-39794af4a9fe', roleCategory: 'case-worker' }
          ]
        });
      });
      await MockApp.startServer();
      const configValues = getCaseworkerRefDataAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      configValues['services.role_assignment.roleApi'] = 'http://localhost:8080';

      // @ts-ignore
      configValues.waSupportedJurisdictions = 'IA';
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getCaseWorkersForLocationAndService } = requireReloaded('../../../../workAllocation/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        params: { locationId: '1', serviceId: 'IA' }

      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getCaseWorkersForLocationAndService(req, response, next);

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
  console.log(JSON.stringify(dto));
  expect(dto[0].email_id).to.be.equal('test_person@test.gov.uk');
  expect(dto[0].first_name).to.be.equal('testfn');
  expect(dto[0].last_name).to.be.equal('testln');
  expect(dto[0].id).to.be.equal('004b7164-0943-41b5-95fc-39794af4a9fe');
  expect(dto[0].base_location[0].location_id).to.be.equal(1);
  expect(dto[0].base_location[0].location).to.be.equal('National');
  expect(dto[0].base_location[0].is_primary).to.be.equal(true);
}
