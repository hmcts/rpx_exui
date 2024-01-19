import { expect } from 'chai';
import { PactTestSetup } from '../settings/provider.mock';
import { postS2SLease } from '../../pactUtil';
import { S2SResponse } from '../../pactFixtures';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 's2s_auth', port: 8000 });

describe('S2S Auth API', () => {
  describe('post S2S lease', () => {
    const mockRequest = {
      microservice: 'xui-webapp', oneTimePassword: 'exPassword'
    };

    const mockResponse = somethingLike('sometoken');

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'microservice with valid credentials',
        uponReceiving: 'a request for a token',
        withRequest: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'ServiceAuthorization': 'ServiceAuthToken'
          },
          path: '/lease',
          body: mockRequest
        },
        willRespondWith: {
          headers: {
            'Content-Type': 'text/plain'
          },
          status: 200,
          body: mockResponse
        }
      };
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction);
    });

    it('returns the correct response', async () => {
      const s2sUrl: string = `${pactSetUp.provider.mockService.baseUrl}/lease`;
      try {
        const resp = await postS2SLease(s2sUrl, mockRequest);
        assertResponse(resp.data);
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      } catch (e) {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
        throw new Error(e);
      }
    });
  });
});

function assertResponse(dto: S2SResponse) {
  expect(dto).to.be.equal('sometoken');
}
