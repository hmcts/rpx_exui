import { expect } from 'chai';
import Request from './utils/request';
import { setTestContext } from './utils/helper';
import { endpoints } from './config/authenticatedRoutes';

describe('EndpointRequests', () => {
  beforeEach(function() {
    this.timeout(120000);
    setTestContext(this);
    Request.clearSession();
  });

  endpoints.forEach(({ endpoint }) => {
    it(`should send a GET request to ${endpoint}`, async () => {
      // Make GET request and expect a 401 Unauthorized response
      const response = await Request.get(endpoint, null, 401);
      expect(response.data.message).to.equal('Unauthorized');
    });
  });
});
