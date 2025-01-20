import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as waSupportedJurisdictions from './index';

chai.use(sinonChai);

describe('WA Supported Jurisdictions', () => {
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
    await waSupportedJurisdictions.getWASupportedJurisdictions(req, res, null);
    const response = ['IA', 'CIVIL', 'PRIVATELAW', 'PUBLICLAW', 'EMPLOYMENT', 'SSCS'];
    expect(res.send).to.have.been.calledWith(sinon.match(response));
  });

  it('should get only the list of supported jurisdictions', async() => {
    const jurisdictionList = waSupportedJurisdictions.getWASupportedJurisdictionsList();
    expect(jurisdictionList).to.deep.equal(['IA', 'CIVIL', 'PRIVATELAW', 'PUBLICLAW', 'EMPLOYMENT', 'SSCS']);
  });
});
