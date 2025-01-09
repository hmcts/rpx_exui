
import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getJudicialRefDataAPIOverrides } from '../utils/configOverride';
import { DateTimeMatcher2 } from '../utils/matchers';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike, term } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_judicial', port: 8000 });

const MockApp = require('../../../../../test_codecept/nodeMock/app');

const REQUEST_BODY = {
  userIds: ['004b7164-0943-41b5-95fc-39794af4a9fe', '004b7164-0943-41b5-95fc-39794af4a9ff'],
  services: ['IA']
};

const user1 = getDummyJudgeUserDetails();
user1.sidam_id = somethingLike(REQUEST_BODY.userIds[0]);
user1.known_as = somethingLike('Lead judge');
user1.surname = somethingLike('cruz');
user1.full_name = somethingLike('Tom cruz');
user1.email_id = somethingLike('tom.cruz@hmcts.net');

describe('Judicial ref data api, get all judge users', () => {
  const RESPONSE_BODY = [];
  RESPONSE_BODY.push(user1);

  describe('post /refdata/judicial/users/search', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'return judicial user profiles along with their active appointments and authorisations',
        uponReceiving: 'get list of judicial users from search',
        withRequest: {
          method: 'POST',
          path: '/refdata/judicial/users/search',
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
      const configValues = getJudicialRefDataAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      configValues['services.role_assignment.roleApi'] = 'http://localhost:8080';

      // @ts-ignore
      configValues.serviceRefDataMapping = [
        { 'service': 'IA', 'serviceCodes': ['BFA1'] }, { 'service': 'CIVIL', 'serviceCodes': ['AAA6', 'AAA7'] }
      ];

      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getJudicialUsersSearch } = requireReloaded('../../../../prd/judicial/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        body: {
          userIds: ['004b7164-0943-41b5-95fc-39794af4a9fe', '004b7164-0943-41b5-95fc-39794af4a9ff'],
          services: ['IA']
        }

      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getJudicialUsersSearch(req, response, next);

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
  expect(dto[0].sidam_id).to.be.equal(REQUEST_BODY.userIds[0]);
  expect(dto[0].known_as).to.be.equal('Lead judge');
  expect(dto[0].surname).to.be.equal('cruz');
  expect(dto[0].full_name).to.be.equal('Tom cruz');
  expect(dto[0].email_id).to.be.equal('tom.cruz@hmcts.net');
}

function getDummyJudgeUserDetails() {
  return {
    'sidam_id': somethingLike('018a0310-f122-4377-9504-f635301f39ed-test2'),
    'object_id': somethingLike('018a0310-f122-4377-9504-f635301f39ed-test2'),
    'known_as': somethingLike('Joe'),
    'surname': somethingLike('snjudge'),
    'full_name': somethingLike('fntest'),
    'post_nominals': somethingLike('Ms'),
    'email_id': somethingLike('test@judicial.com'),
    'appointments': [
      {
        'base_location_id': somethingLike('testBaseLocID'),
        'epimms_id': somethingLike('testEpimmsId'),
        'court_name': somethingLike('Social Entitlement'),
        'cft_region_id': somethingLike('1'),
        'cft_region': somethingLike('National'),
        'location_id': somethingLike('1'),
        'location': somethingLike('National'),
        'is_principal_appointment': somethingLike('true'),
        'appointment': somethingLike('Tribunal Member Disability'),
        'appointment_type': somethingLike('Fee Paid'),
        'service_code': somethingLike('testServiceCode'),
        'roles': ['testTitle'],
        'start_date': somethingLike('2018-12-05'),
        'end_date': somethingLike('2022-03-04')
      }
    ],
    'authorisations': [
      {
        'jurisdiction': somethingLike('Authorisation Tribunals'),
        'ticket_description': somethingLike('Social Security and Child Support'),
        'ticket_code': somethingLike('357'),
        'service_codes': [],
        'start_date': somethingLike('2013-12-05T00:00'),
        'end_date': term(DateTimeMatcher2('2022-03-04T10:11:00.619526'))
      }
    ]
  };
}
