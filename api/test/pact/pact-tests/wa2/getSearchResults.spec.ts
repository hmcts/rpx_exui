import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getCcdDataAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;

const pactSetUp = new PactTestSetup({ provider: 'ccdDataStoreAPI_search', port: 8000 });
const MockApp = require('../../../../../test_codecept/nodeMock/app');

describe('Global serarch API', () => {
  let next;

  describe('post /results', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    const REQUEST_BODY = {
      'searchCriteria': {
        'CCDJurisdictionIds': somethingLike(['PUBLICLAW']),
        'caseReferences': somethingLike(['1675871084353511'])
      },
      'sortCriteria': null,
      'maxReturnRecordCount': somethingLike(25),
      'startRecordNumber': somethingLike(1)
    };

    const RESPONSE_BODY = {
      'resultInfo': {
        'casesReturned': somethingLike(1),
        'caseStartRecord': somethingLike(1),
        'moreResultsToGo': somethingLike(false)
      },
      'results': [
        {
          'stateId': somethingLike('PREPARE_FOR_HEARING'),
          'processForAccess': somethingLike('SPECIFIC'),
          'caseReference': somethingLike('1675871084353511'),
          'otherReferences': somethingLike([]),
          'CCDJurisdictionId': somethingLike('PUBLICLAW'),
          'CCDJurisdictionName': somethingLike('Public Law'),
          'CCDCaseTypeId': somethingLike('CARE_SUPERVISION_EPO'),
          'CCDCaseTypeName': somethingLike('Public Law Applications')
        }
      ]
    };

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Search for case id',
        uponReceiving: 'return case details',
        withRequest: {
          method: 'POST',
          path: '/globalSearch',
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
      const configValues = getCcdDataAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getSearchResults } = requireReloaded('../../../../globalSearch/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        body: {
          'searchCriteria': {
            'CCDJurisdictionIds': ['PUBLICLAW'],
            'caseReferences': ['1675871084353511']
          },
          'sortCriteria': null,
          'maxReturnRecordCount': 25,
          'startRecordNumber': 1
        }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getSearchResults(req, response, next);
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
  expect(dto.resultInfo.casesReturned).to.be.equal(1);
  expect(dto.resultInfo.caseStartRecord).to.be.equal(1);
  expect(dto.resultInfo.moreResultsToGo).to.be.equal(false);
  expect(dto.results[0].stateId).to.be.equal('PREPARE_FOR_HEARING');
  expect(dto.results[0].processForAccess).to.be.equal('SPECIFIC');
  expect(dto.results[0].caseReference).to.be.equal('1675871084353511');
  expect(dto.results[0].CCDJurisdictionId).to.be.equal('PUBLICLAW');
  expect(dto.results[0].CCDJurisdictionName).to.be.equal('Public Law');
  expect(dto.results[0].CCDCaseTypeId).to.be.equal('CARE_SUPERVISION_EPO');
  expect(dto.results[0].CCDCaseTypeName).to.be.equal('Public Law Applications');
}
