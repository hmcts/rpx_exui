import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as staffSupportedJurisdictions from './index';

chai.use(sinonChai);

describe('Staff Supported Jurisdictions', () => {
  let sandbox;
  let res;
  let req;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = mockRes();
    req = mockReq({});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get supported jurisdictions', async() => {
    await staffSupportedJurisdictions.getStaffSupportedJurisdictions(req, res, null);
    // note: CMC not included for caseworker errors
    const response = ['ST_CIC', 'CIVIL', 'EMPLOYMENT', 'PRIVATELAW', 'PUBLICLAW', 'IA', 'SSCS', 'DIVORCE', 'FR'];
    expect(res.send).to.have.been.calledWith(sinon.match(response));
  });

  it('should get only the list of supported jurisdictions', async() => {
    const jurisdictionList = staffSupportedJurisdictions.getStaffSupportedJurisdictionsList();
    expect(jurisdictionList).to.deep.equal(['ST_CIC', 'CIVIL', 'EMPLOYMENT', 'PRIVATELAW', 'PUBLICLAW', 'IA', 'SSCS', 'DIVORCE', 'FR']);
  });
});
