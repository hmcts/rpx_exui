import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getLocationsRefDataAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_location', port: 8000 });

const service = 'IA';
const serviceCode = 'BFA1';

describe('Locations ref data api, get matching location for service code', () => {
  const RESPONSE_BODY = {
    'service_code': somethingLike('AAA6'),
    'court_type_id': somethingLike('10'),
    'court_type': somethingLike('County Court'),
    'welsh_court_type': null,
    'court_venues': [
      {
        'court_venue_id': somethingLike('10576'),
        'epimms_id': somethingLike('20262'),
        'site_name': somethingLike('Central London County Court'),
        'region_id': somethingLike('1'),
        'region': somethingLike('London'),
        'court_type': somethingLike('County Court'),
        'court_type_id': somethingLike('10'),
        'cluster_id': null,
        'cluster_name': null,
        'open_for_public': somethingLike('YES'),
        'court_address': somethingLike('Thomas More Building, Royal Courts of Justice, Strand, London'),
        'postcode': somethingLike('WC2A 2LL'),
        'phone_number': somethingLike('0207 947 7502'),
        'closed_date': null,
        'court_location_code': somethingLike('372'),
        'dx_address': somethingLike('DX: 44453 STRAND'),
        'welsh_site_name': somethingLike(''),
        'welsh_court_address': somethingLike(''),
        'court_status': somethingLike('Open'),
        'court_open_date': null,
        'court_name': somethingLike('Central London County Court'),
        'venue_name': somethingLike('Central London'),
        'is_case_management_location': somethingLike('Y'),
        'is_hearing_location': somethingLike('Y'),
        'welsh_venue_name': somethingLike(''),
        'is_temporary_location': somethingLike('N'),
        'is_nightingale_court': somethingLike('N'),
        'location_type': somethingLike('COURT'),
        'parent_location': somethingLike(''),
        'welsh_court_name': somethingLike(''),
        'uprn': somethingLike(''),
        'venue_ou_code': somethingLike(''),
        'mrd_building_location_id': somethingLike('MRD-BLD-295'),
        'mrd_venue_id': somethingLike('MRD-CRT-0808'),
        'service_url': somethingLike(''),
        'fact_url': somethingLike('https://www.find-court-tribunal.service.gov.uk/courts/administrative-court')
      }
    ]
  };

  describe('get /getLocations}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Search for locations',
        uponReceiving: 'get list of court venues for given service code',
        withRequest: {
          method: 'GET',
          path: '/refdata/location/court-venues/services',
          query: `service_code=${serviceCode}`,
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
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
      const configValues = getLocationsRefDataAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      // @ts-ignore
      configValues.serviceRefDataMapping = [
        { 'service': 'IA', 'serviceCodes': ['BFA1'] }, { 'service': 'CIVIL', 'serviceCodes': ['AAA6', 'AAA7'] }
      ];
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getLocations } = requireReloaded('../../../../workAllocation/locationController');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        query: { serviceCodes: service }

      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getLocations(req, response, next);
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
  expect(dto[0].id).to.be.equal('20262');
  expect(dto[0].locationName).to.be.equal('Central London County Court');
}
