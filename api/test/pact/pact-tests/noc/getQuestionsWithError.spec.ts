import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getNocAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';
const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;

const pactSetUp = new PactTestSetup({ provider: 'acc_manageCaseAssignment_Noc', port: 8000 });

describe('getNoCQuestions with error API', () => {
  const caseId = '1234567890123456';
  const sandbox: sinon.SinonSandbox = sinon.createSandbox();
  afterEach(() => {
    sinon.reset();
    sandbox.restore();
    pactSetUp.provider.finalize();
    pactSetUp.provider.verify();
  });

  function setUpMockConfigForFunction() {
    const configValues = getNocAPIOverrides(pactSetUp.provider.mockService.baseUrl);
    sandbox.stub(config, 'get').callsFake((prop) => {
      return configValues[prop];
    });
    const { getNoCQuestions } = requireReloaded('../../../../noc/index');
    return getNoCQuestions;
  }

  const req = mockReq({
    headers: {
      'Authorization': 'Bearer someAuthorizationToken',
      'ServiceAuthorization': 'Bearer someServiceAuthorizationToken'
    },
    query: { caseId: '1234567890123456' }
  });
  describe('when an error occurs', () => {
    before(async () => {
      await pactSetUp.provider.setup();
      await pactSetUp.provider.addInteraction({
        state: 'a case with an error exists',
        uponReceiving: 'a request to verify NoC answers',
        withRequest: {
          method: 'GET',
          path: '/noc/noc-questions',
          query: 'case_id=' + caseId
        },
        willRespondWith: {
          status: 400,
          body: {
            status: somethingLike('BAD_REQUEST'),
            message: somethingLike('Case ID has to be a valid 16-digit Luhn number'),
            code: somethingLike('case-id-invalid')
          }
        }
      });
    });

    it('should return an error response', async () => {
      const getNoCQuestions = setUpMockConfigForFunction();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };
      const nextSpy = sinon.spy();
      try {
        await getNoCQuestions(req, response, nextSpy);
        const error = nextSpy.args[0][0];
        assertError(error);
      } catch (err) {
        console.log(err.stack);
        throw new Error(err);
      }
    });
  });
});

function assertError(error: any) {
  expect(error.status).to.be.equal(400);
  expect(error.statusText).to.be.equal('Bad Request');
  expect(error.data.message).to.be.equal('Case ID has to be a valid 16-digit Luhn number');
  expect(error.data.code).to.be.equal('case-id-invalid');
}

