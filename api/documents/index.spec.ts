import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as documents from './index';

chai.use(sinonChai);

const { expect } = chai;

describe('Documents Uploading', () => {
  let sandbox;
  let res;
  let req;
  let proxyRes;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let json;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    proxyRes = mockRes();
    req = mockReq();
    res = {
      session: {
        lastUploadTime: 1705066299756,
        nextTimeout: 10000
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    json = [
      {
        classification: 'PUBLIC',
        size: 12317,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        originalDocumentName: 'blank copy 4.docx',
        hashToken: 'c62d79ffa737bfe5213f2dfbc5a0e848f6bd35781acadb65a3a0822b3ec69b7c',
        createdOn: '2024-01-12T14:30:10.000+00:00',
        createdBy: 'c9ca25c7-0554-4e05-b781-442f02a59907',
        lastModifiedBy: 'c9ca25c7-0554-4e05-b781-442f02a59907',
        modifiedOn: '2024-01-12T14:30:10.000+00:00',
        ttl: '2024-01-13T14:30:10.000+00:00',
        metadata: [Object],
        _links: [Object]
      }
    ];
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle request and return true if not rate-limited', () => {
    const result = documents.handleRequest(req, res, proxyRes);

    expect(result).to.deep.equal(true);
  });

  it('should handle request and return false if rate-limited', () => {
    const nextTimeout = Date.now() + 5;
    const rateLimitedReq = {
      method: 'POST',
      session: {
        lastUploadTime: Date.now(),
        nextTimeout: nextTimeout
      }
    };

    const result = documents.handleRequest(req, rateLimitedReq, proxyRes);
    expect(result).to.deep.equal(false);
  });
});
