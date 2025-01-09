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

const searchTerm = 'cen';
const strCourtTypeIds = '10';

describe('Locations ref data api, get matching location for search term', () => {
  const RESPONSE_BODY = [
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
  ];

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
        uponReceiving: 'get list of court venues for given search term',
        withRequest: {
          method: 'GET',
          path: '/refdata/location/court-venues/venue-search',
          query: `search-string=${searchTerm}&court-type-id=${strCourtTypeIds}`,
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
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getLocations } = requireReloaded('../../../../locations/index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        body: {
          'serviceIds': 'CIVIL',
          'locationType': 'case-management',
          'searchTerm': 'cen',
          'userLocations': [
            {
              'service': 'CIVIL',
              'locations': [
                {
                  'userId': '4ea1f8b9-b862-4fbe-b33d-9a3afdcc9936',
                  'locationName': '',
                  'services': [
                    'CIVIL'
                  ],
                  'regionId': '1'
                }
              ]
            }
          ]
        }

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
  console.log(JSON.stringify(dto));
  expect(dto[0].court_venue_id).to.be.equal('10576');
  expect(dto[0].epimms_id).to.be.equal('20262');
  expect(dto[0].site_name).to.be.equal('Central London County Court');
  expect(dto[0].region_id).to.be.equal('1');
  expect(dto[0].region).to.be.equal('London');
  expect(dto[0].court_type).to.be.equal('County Court');
  expect(dto[0].court_type_id).to.be.equal('10');
  expect(dto[0].cluster_id).to.be.equal(null);
  expect(dto[0].cluster_name).to.be.equal(null);
  expect(dto[0].open_for_public).to.be.equal('YES');
  expect(dto[0].court_address).to.be.equal('Thomas More Building, Royal Courts of Justice, Strand, London');
  expect(dto[0].postcode).to.be.equal('WC2A 2LL');
  expect(dto[0].phone_number).to.be.equal('0207 947 7502');
  expect(dto[0].closed_date).to.be.equal(null);
  expect(dto[0].court_location_code).to.be.equal('372');
  expect(dto[0].dx_address).to.be.equal('DX: 44453 STRAND');
  expect(dto[0].welsh_site_name).to.be.equal('');
  expect(dto[0].welsh_court_address).to.be.equal('');
  expect(dto[0].court_status).to.be.equal('Open');
  expect(dto[0].court_open_date).to.be.equal(null);
  expect(dto[0].court_name).to.be.equal('Central London County Court');
  expect(dto[0].venue_name).to.be.equal('Central London');
  expect(dto[0].is_case_management_location).to.be.equal('Y');
  expect(dto[0].is_hearing_location).to.be.equal('Y');
  expect(dto[0].welsh_venue_name).to.be.equal('');
  expect(dto[0].is_temporary_location).to.be.equal('N');
  expect(dto[0].is_nightingale_court).to.be.equal('N');
  expect(dto[0].location_type).to.be.equal('COURT');
  expect(dto[0].parent_location).to.be.equal('');
  expect(dto[0].welsh_court_name).to.be.equal('');
  expect(dto[0].uprn).to.be.equal('');
  expect(dto[0].venue_ou_code).to.be.equal('');
  expect(dto[0].mrd_building_location_id).to.be.equal('MRD-BLD-295');
  expect(dto[0].mrd_venue_id).to.be.equal('MRD-CRT-0808');
  expect(dto[0].service_url).to.be.equal('');
  expect(dto[0].fact_url).to.be.equal('https://www.find-court-tribunal.service.gov.uk/courts/administrative-court');
}
