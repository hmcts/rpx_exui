import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getRdCommonDataAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_commonData', port: 8000 });

const serviceId = 'IA';
const categoryId = 'exampleCat';
const isChildRequired = 'false';

describe('RD get lov ref data', async () => {
  const RESPONSE_BODY = {
    list_of_values: [{
      category_key: somethingLike('category 1'),
      key: somethingLike('cat1'),
      value_en: somethingLike('catflag'),
      value_cy: somethingLike('catDragon'),
      hint_text_en: somethingLike('test example'),
      hint_text_cy: somethingLike('welsh test example'),
      lov_order: somethingLike(1),
      parent_category: somethingLike('examples'),
      parent_key: somethingLike('ex'),
      active_flag: somethingLike('cat1')
    }]
  };

  describe('get lov ref data', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;
    beforeEach(() => {
      next = sandbox.spy();
    });
    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'get lov ref data',
        uponReceiving: 'service id, category id and child required',
        withRequest: {
          method: 'GET',
          path: `/refdata/commondata/lov/categories/${categoryId}`,
          query: `serviceId=${serviceId}&isChildRequired=${false}`,
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          }
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
    });

    it('returns the correct response', async () => {
      const configValues = getRdCommonDataAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });
      const { getLovRefData } = requireReloaded('../../../../prd/lov');
      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        query: { serviceId, categoryId, isChildRequired }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };
      try {
        await getLovRefData(req, response, next);
        assertResponses(returnedResponse);
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      } catch (err) {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
        throw new Error(err);
      }
    });
  });
});

function assertResponses(dto: any) {
  expect(dto[0].category_key).to.be.equal('category 1');
  expect(dto[0].key).to.be.equal('cat1');
  expect(dto[0].value_en).to.be.equal('catflag');
  expect(dto[0].value_cy).to.be.equal('catDragon');
  expect(dto[0].hint_text_en).to.be.equal('test example');
  expect(dto[0].hint_text_cy).to.be.equal('welsh test example');
  expect(dto[0].lov_order).to.be.equal(1);
  expect(dto[0].parent_category).to.be.equal('examples');
  expect(dto[0].parent_key).to.be.equal('ex');
  expect(dto[0].active_flag).to.be.equal('cat1');
}
