import { oidc } from '@hmcts/rpx-xui-node-lib';
import { assert } from 'chai';
import mockResponse from '../../mocks/openid-well-known-configuration.mock';
import { PactTestSetup } from '../settings/provider.mock';

const pactSetUp = new PactTestSetup({ provider: 'idamApi_oidc', port: 8000 });

describe('OpenId Connect API', () => {
  // Write Pact when all tests done
  after(() => pactSetUp.provider.finalize());

  describe('when a request to a well-known endpoint is made', () => {
    before(async () => {
      await pactSetUp.provider.setup();
      pactSetUp.provider.addInteraction({
        state: '.well-known endpoint',
        uponReceiving: 'a request for configuration',
        withRequest: {
          method: 'GET',
          path: '/o/.well-known/openid-configuration'
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: mockResponse
        }
      });
    });

    after(() => pactSetUp.provider.verify());

    it('returns a json configuration', async () => {
      const oidcUrl = `${pactSetUp.provider.mockService.baseUrl}/o`;

      const issuer = await oidc.configure({
        allowRolesRegex: '.',
        authorizationURL: `${oidcUrl}/authorize`,
        callbackURL: `${pactSetUp.provider.mockService.baseUrl}/oauth2/callback`,
        clientID: 'rpx-ao',
        clientSecret: 'secret',
        discoveryEndpoint: `${oidcUrl}/.well-known/openid-configuration`,
        issuerURL: `${oidcUrl}`,
        logoutURL: `${oidcUrl}/logout`,
        responseTypes: ['code'],
        scope: 'openid email',
        sessionKey: 'xui-webapp',
        tokenEndpointAuthMethod: 'client_secret_post',
        tokenURL: `${oidcUrl}/token`,
        useRoutes: false
      });
      assert.isDefined(issuer, 'issuer exists');
    });
  });
});
