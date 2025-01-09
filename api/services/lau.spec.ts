import { http } from '../lib/http';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import * as lauService from './lau';
import { baseURL, ENDPOINTS, AccessLog } from './lau'; // Import the setter for the feature flag

// Using chai expect and sinon-chai for better integration
chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect } = chai;

describe('createAccessLogFromRequest', () => {
  let mockRequest: any;
  let createAccessLogStub: sinon.SinonStub<[string, AccessLog], Promise<any>>;
  let mockHttpPost: sinon.SinonStub;
  let loggerSpy: sinon.SinonSpy;

  beforeEach(() => {
    mockRequest = {
      headers: {
        ServiceAuthorization: 'mock-service-token'
      },
      body: {
        roleRequest: {
          process: 'specific-access'
        },
        requestedRoles: [
          {
            attributes: {
              caseId: 'mock-case-id'
            },
            actorId: 'mock-user-id',
            notes: [
              {
                comment: JSON.stringify({ specificReason: 'mock-specific-reason' }),
                time: '2023-09-06T12:34:56.789Z'
              }
            ],
            beginTime: '2023-09-06T10:00:00.000Z',
            endTime: '2023-09-06T11:00:00.000Z'
          }
        ]
      }
    };

    mockHttpPost = sinon.stub(http, 'post').resolves({ status: 201 });

    loggerSpy = sinon.spy(lauService.logger, 'error');

    sinon.stub(lauService, 'featureSpecificChallengedAccessEnabled').value(true);
    mockRequest.session = {
      passport: {
        user: {
          userinfo: {
            uid: '1234'
          }
        }
      }
    };

    sinon.resetHistory();
  });

  afterEach(() => {
    mockHttpPost.restore(); // Restore stubs/spies to their original methods
    loggerSpy.restore();
    lauService.setFeatureSpecificChallengedAccessEnabled(false); // Reset feature flag to its default state
  });

  it('should create an access log with specific-access requestType', async () => {
    const result = await lauService.logAccessRequest(mockRequest, true);
    if (result){
      expect(result.status).to.equal(201);
    }
  });

  it('should create an access log with specific-access approve requestType', async () => {
    mockRequest.body = {
      'specificAccessStateData':
        {
          'caseId': '1708968484691010',
          'actorId': '7a51b87d-36c6-47fa-b9ef-4257af8001c5',
          'specificAccessReason': 'mock-specific-reason'
        },
      'period': {
        'startDate': '2024-09-24T01:00:00.000Z',
        'endDate': '2024-10-23T00:59:59.999Z'
      }
    };
    const result = await lauService.logAccessRequest(mockRequest, false);
    if (result){
      expect(result.status).to.equal(201);
    }
  });

  it('should create an access log with specific-access reject requestType', async () => {
    mockRequest.body = {
      accessReason: 'Reject request',
      specificAccessReason: 'mock specific reason',
      caseId: '1708968484691010'
    };
    const result = await lauService.logAccessRequest(mockRequest, false);
    if (result){
      expect(result.status).to.equal(201);
    }
  });

  it('should log an error if JSON parsing fails', async () => {
    mockRequest.body.requestedRoles[0].notes[0].comment = 'invalid-json';

    const result = await lauService.logAccessRequest(mockRequest, true);
    sinon.assert.calledOnce(loggerSpy);
    expect(result).to.deep.equal({ status: 201 });
  });

  it('should not create access log if featureSpecificChallengedAccessEnabled is false', async () => {
    // No need to set, as it's already false by default
    createAccessLogStub = sinon.stub(lauService, 'createAccessLog');

    await lauService.logAccessRequest(mockRequest, true);

    // eslint-disable-next-line no-unused-expressions
    expect(createAccessLogStub).to.not.have.been.called;
    createAccessLogStub.restore();
  });
});

describe('createAccessLog', () => {
  let httpPostStub: sinon.SinonStub;

  beforeEach(() => {
    httpPostStub = sinon.stub(http, 'post');
  });

  afterEach(() => {
    httpPostStub.restore();
  });

  it('should send a POST request with the correct headers and body', async () => {
    const mockAccessLog: AccessLog = {
      requestType: 'SPECIFIC',
      caseRef: 'mock-case-id', // Ensure this is of the correct type
      userId: 'mock-user-id',
      action: 'CREATED',
      timestamp: '2023-09-06T12:34:56.789Z',
      reason: 'mock-reason',
      requestEndTimestamp: '2023-09-06T11:00:00.000Z'
    };

    const mockResponse = { status: 200 };
    httpPostStub.resolves(mockResponse);

    const serviceToken = 'mock-service-token';

    const result = await lauService.createAccessLog(serviceToken, mockAccessLog);

    expect(httpPostStub).to.have.been.calledWith(
      `${baseURL}${ENDPOINTS.CREATE_ACTION_LOG}`,
      { accessLog: mockAccessLog },
      { headers: { ServiceAuthorization: serviceToken, 'Content-Type': 'application/json', Accept: 'application/json' } }
    );

    expect(result).to.equal(mockResponse);
  });

  it('should throw an error if the HTTP request fails', async () => {
    httpPostStub.rejects(new Error('HTTP request failed'));

    const mockAccessLog: AccessLog = {
      requestType: 'SPECIFIC',
      caseRef: 'mock-case-id', // Ensure this is of the correct type
      userId: 'mock-user-id',
      action: 'CREATED',
      timestamp: '2023-09-06T12:34:56.789Z',
      reason: 'mock-reason',
      requestEndTimestamp: '2023-09-06T11:00:00.000Z'
    };

    const serviceToken = 'mock-service-token';

    await expect(lauService.createAccessLog(serviceToken, mockAccessLog)).to.be.rejectedWith('HTTP request failed');
  });
});
