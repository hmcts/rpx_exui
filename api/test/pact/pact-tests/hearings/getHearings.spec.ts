import { InteractionObject } from '@pact-foundation/pact/src/dsl/interaction';
import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getHearingsAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'hmcHearingServiceProvider', port: 8000 });

const caseId = '1667564306557767';

describe('Hearings, get hearings for a given caseId', () => {
  const RESPONSE_BODY = {
    caseHearings: [
      {
        hearingChannels: [somethingLike('CVP')],
        hearingDaySchedule: [
          {
            attendees: [
              {
                hearingSubChannel: somethingLike('CVP'),
                partyID: somethingLike('string')
              }
            ],
            hearingEndDateTime: somethingLike('2023-07-03T12:37:25.683Z'),
            hearingJudgeId: somethingLike('string'),
            hearingRoomId: somethingLike('string'),
            hearingStartDateTime: somethingLike('2023-07-03T12:37:25.683Z'),
            hearingVenueId: somethingLike('string'),
            listAssistSessionID: somethingLike('string'),
            panelMemberIds: [
              somethingLike('string')
            ]
          }
        ],
        hearingGroupRequestId: somethingLike('string'),
        hearingID: somethingLike(0),
        hearingIsLinkedFlag: somethingLike(true),
        hearingListingStatus: somethingLike('string'),
        hearingRequestDateTime: somethingLike('2023-07-03T12:37:25.683Z'),
        hearingType: somethingLike('string'),
        hmcStatus: somethingLike('string'),
        lastResponseReceivedDateTime: somethingLike('2023-07-03T12:37:25.683Z'),
        listAssistCaseStatus: somethingLike('string'),
        requestVersion: somethingLike(0)
      }
    ],
    caseRef: somethingLike('string'),
    hmctsServiceCode: somethingLike('string')
  };

  describe('get /getHearings}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction: InteractionObject = {
        state: 'Get hearings',
        uponReceiving: 'get list of hearings for given caseId',
        withRequest: {
          method: 'GET',
          path: `/hearings/${caseId}`,
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

      pactSetUp.provider.addInteraction(interaction);
    });

    afterEach(() => {
      sandbox.restore();
      sinon.reset();
    });

    it('returns the correct response', async () => {
      const configValues = getHearingsAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getHearings } = requireReloaded('../../../../hearings/hmc.index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        query: {
          caseId
        }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getHearings(req, response, next);
      } catch (err) {
        throw new Error(err);
      }

      assertResponses(returnedResponse);
      pactSetUp.provider.verify();
      pactSetUp.provider.finalize();
    });
  });
});

function assertResponses(dto: any) {
  expect(dto.caseHearings[0].hearingChannels).to.eql(['CVP']);
  expect(dto.caseHearings[0].hearingDaySchedule).to.eql([
    {
      attendees: [
        {
          hearingSubChannel: 'CVP',
          partyID: 'string'
        }
      ],
      hearingEndDateTime: '2023-07-03T12:37:25.683Z',
      hearingJudgeId: 'string',
      hearingRoomId: 'string',
      hearingStartDateTime: '2023-07-03T12:37:25.683Z',
      hearingVenueId: 'string',
      listAssistSessionID: 'string',
      panelMemberIds: [
        'string'
      ]
    }
  ]);
  expect(dto.caseHearings[0].hearingGroupRequestId).to.be.equal('string');
  expect(dto.caseHearings[0].hearingID).to.be.equal(0);
  expect(dto.caseHearings[0].hearingIsLinkedFlag).to.be.equal(true);
  expect(dto.caseHearings[0].hearingListingStatus).to.be.equal('string');
  expect(dto.caseHearings[0].hearingRequestDateTime).to.be.equal('2023-07-03T12:37:25.683Z');
  expect(dto.caseHearings[0].hearingType).to.be.equal('string');
  expect(dto.caseHearings[0].hmcStatus).to.be.equal('string');
  expect(dto.caseHearings[0].lastResponseReceivedDateTime).to.be.equal('2023-07-03T12:37:25.683Z');
  expect(dto.caseHearings[0].listAssistCaseStatus).to.be.equal('string');
  expect(dto.caseHearings[0].requestVersion).to.be.equal(0);

  expect(dto.caseRef).to.be.equal('string');
  expect(dto.hmctsServiceCode).to.be.equal('string');
}
