import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { NocAnswer } from '../../../../../src/noc/models';
import { PactTestSetup } from '../settings/provider.mock';
import { getNocAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';
const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;

const pactSetUp = new PactTestSetup({ provider: 'acc_manageCaseAssignment_Noc', port: 8000 });

describe('verifyAnswers API', () => {
  const sandbox: sinon.SinonSandbox = sinon.createSandbox();
  afterEach(() => {
    sinon.reset();
    sandbox.restore();
    pactSetUp.provider.verify();
    pactSetUp.provider.finalize();
  });

  const answers: NocAnswer[] = [{
    question_id: '1233434',
    value: 'test@email.com'
  }];
  const mockRequest = {
    case_id: '1234567812345678',
    answers: answers
  };

  const req = mockReq({
    headers: {
      'Authorization': 'Bearer someAuthorizationToken',
      'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
      'content-Type': 'application/json'
    },
    body: mockRequest
  });

  function setUpMockConfigForFunction() {
    const configValues = getNocAPIOverrides(pactSetUp.provider.mockService.baseUrl);
    sandbox.stub(config, 'get').callsFake((prop) => {
      return configValues[prop];
    });
    const { validateNoCQuestions } = requireReloaded('../../../../noc/index');
    return validateNoCQuestions;
  }
  describe('when an error occurs', () => {
    before(async () => {
      await pactSetUp.provider.setup();
      await pactSetUp.provider.addInteraction({
        state: 'An invalid NoC answer request',
        uponReceiving: 'a request to verify NoC answers',
        withRequest: {
          method: 'POST',
          path: '/noc/verify-noc-answers',
          body: mockRequest
        },
        willRespondWith: {
          status: 400,
          body: {
            status: somethingLike('BAD_REQUEST'),
            message: somethingLike('The answers did not match those for any litigant'),
            code: somethingLike('answers-not-matched-any-litigant'),
            errors: []
          }
        }
      });
    });

    it('should return an error response', async () => {
      const validateNoCQuestions = setUpMockConfigForFunction();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };
      const nextSpy = sinon.spy();
      try {
        await validateNoCQuestions(req, response, nextSpy);
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
  expect(error.statusText).to.be.equal('Bad Request ');
  expect(error.data.message).to.be.equal('The answers did not match those for any litigant');
  expect(error.data.code).to.be.equal('answers-not-matched-any-litigant');
}

