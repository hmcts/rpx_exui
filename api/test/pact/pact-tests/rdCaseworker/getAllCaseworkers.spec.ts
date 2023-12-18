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

xdescribe('Caseworker ref data api, get all caseworkers', () => {
  const REQUEST_BODY = {
    userIds: [somethingLike('004b7164-0943-41b5-95fc-39794af4a9fe'), somethingLike('004b7164-0943-41b5-95fc-39794af4a9fe')]
  };

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
        uponReceiving: 'get list of caseworkers',
        withRequest: {
          method: 'POST',
          path: '/refdata/case-worker/users/fetchUsersById',
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
      MockApp.setServerPort(9000);
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
      configValues['services.role_assignment.roleApi'] = 'http://localhost:9000';

      // @ts-ignore
      configValues.waSupportedJurisdictions = 'IA';
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getAllCaseWorkers } = requireReloaded('../../../../workAllocation/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        }

      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getAllCaseWorkers(req, response, next);

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
  expect(dto[0].email).to.be.equal('test_person@test.gov.uk');
  expect(dto[0].firstName).to.be.equal('testfn');
  expect(dto[0].lastName).to.be.equal('testln');
  expect(dto[0].roleCategory).to.be.equal('case-worker');
  expect(dto[0].idamId).to.be.equal('004b7164-0943-41b5-95fc-39794af4a9fe');
  expect(dto[0].location.id).to.be.equal(1);
  expect(dto[0].location.locationName).to.be.equal('National');
}
