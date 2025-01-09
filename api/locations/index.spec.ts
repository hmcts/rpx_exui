import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { http } from '../lib/http';
import { getLocations } from './index';
import { mockLocations } from './locationTestData.spec';

chai.use(sinonChai);
describe('Fee Pay Judge', () => {
  const GET = 'get';

  let sandbox: sinon.SinonSandbox;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let spy: sinon.SinonSpy;
  const res = mockRes({ status: 200, data: mockLocations });
  let next: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    next = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getLocations', () => {
    it('should return the location for user base location based on search term', async () => {
      spy = sandbox.stub(http, GET).resolves(res);
      const req = mockReq({
        body: {
          searchTerm: 'Gla',
          serviceIds: ['IA', 'CIVIL', 'SSCS', 'BHA1', 'ABA1', 'AAA1'],
          locationType: 'hearing',
          userLocations: [{ service: 'IA', locations: [{ id: '1234' }] }, { service: 'CIVIL', locations: [{ id: '2345' }] }],
          bookingLocations: ['1234', '2343']
        }
      });

      const response = mockRes({
        data: mockLocations
      });

      try {
        await getLocations(req, response, next);
        // should equal 3, two for the two user base locations, one for the SSCS locations
        expect(response.data.results.length).to.equal(3);
      } catch (err) {
        console.log(err.stack);
        throw new Error(err);
      }
    });

    it('should return all locations if there is no base location', async () => {
      spy = sandbox.stub(http, GET).resolves(res);
      const req = mockReq({
        body: {
          searchTerm: 'Gla',
          serviceIds: ['IA', 'CIVIL', 'SSCS', 'BHA1', 'ABA1', 'AAA1'],
          locationType: 'hearing',
          userLocations: [],
          bookingLocations: ['1234', '2343']
        }
      });

      const response = mockRes({
        data: mockLocations
      });

      try {
        await getLocations(req, response, next);
        // expect all locations to be given
        expect(response.data.results.length).to.equal(mockLocations.length);
      } catch (err) {
        console.log(err.stack);
        throw new Error(err);
      }
    });

    it('should return no locations if there is no base location within user locations', async () => {
      spy = sandbox.stub(http, GET).resolves(res);
      const req = mockReq({
        body: {
          searchTerm: 'Gla',
          serviceIds: ['IA', 'CIVIL', 'BHA1', 'ABA1', 'AAA1'],
          locationType: 'hearing',
          userLocations: [{ service: 'IA', locations: [] }],
          bookingLocations: []
        }
      });

      const response = mockRes({
        data: mockLocations
      });

      try {
        await getLocations(req, response, next);
        // expect all civil locations, no IA locations to be given
        expect(response.data.results.length).to.equal(2);
      } catch (err) {
        console.log(err.stack);
        throw new Error(err);
      }
    });

    it('should return locations for regions if there is region information', async () => {
      spy = sandbox.stub(http, GET).resolves(res);
      const req = mockReq({
        body: {
          searchTerm: 'Gla',
          serviceIds: ['IA', 'CIVIL', 'BHA1', 'ABA1', 'AAA1'],
          locationType: 'hearing',
          userLocations: [{ service: 'IA', locations: [{ regionId: '11' }] }],
          bookingLocations: []
        }
      });

      const response = mockRes({
        data: mockLocations
      });

      try {
        await getLocations(req, response, next);
        // expect all civil locations, no IA locations to be given
        expect(response.data.results.length).to.equal(3);
      } catch (err) {
        console.log(err.stack);
        throw new Error(err);
      }
    });

    it('should return no locations if there is no base location within user locations', async () => {
      spy = sandbox.stub(http, GET).resolves(res);
      const req = mockReq({
        body: {
          searchTerm: 'Gla',
          serviceIds: ['IA', 'CIVIL', 'BHA1', 'ABA1', 'AAA1'],
          locationType: 'hearing',
          userLocations: [{ service: 'IA', locations: [] }],
          bookingLocations: []
        }
      });

      const response = mockRes({
        data: mockLocations
      });

      try {
        await getLocations(req, response, next);
        // expect all civil locations, no IA locations to be given
        expect(response.data.results.length).to.equal(2);
      } catch (err) {
        console.log(err.stack);
        throw new Error(err);
      }
    });

    it('should return locations for regions if there is region information', async () => {
      spy = sandbox.stub(http, GET).resolves(res);
      const req = mockReq({
        body: {
          searchTerm: 'Gla',
          serviceIds: ['IA', 'CIVIL', 'BHA1', 'ABA1', 'AAA1'],
          locationType: 'hearing',
          userLocations: [{ service: 'IA', locations: [{ regionId: '11' }] }],
          bookingLocations: []
        }
      });

      const response = mockRes({
        data: mockLocations
      });

      try {
        await getLocations(req, response, next);
        // expect all civil locations, no IA locations to be given
        expect(response.data.results.length).to.equal(3);
      } catch (err) {
        console.log(err.stack);
        throw new Error(err);
      }
    });

    it('should return the possible locations for bookable filter', async () => {
      spy = sandbox.stub(http, GET).resolves(res);
      const req = mockReq({
        body: {
          searchTerm: 'Gla',
          serviceIds: ['IA', 'CIVIL', 'SCSS', 'BHA1', 'ABA1', 'AAA1'],
          locationType: 'hearing',
          userLocations: [{ service: 'IA', locations: [{ id: '1234' }] }],
          bookingLocations: null
        }
      });

      const response = mockRes({
        data: mockLocations
      });

      try {
        await getLocations(req, response, next);
        // should equal 4, only getting base location for IA
        expect(response.data.results.length).to.equal(3);
      } catch (err) {
        console.log(err.stack);
        throw new Error(err);
      }
    });
  });
});
