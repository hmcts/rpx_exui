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

const REQUEST_BODY = {
  caseDetails: {
    caseAdditionalSecurityFlag: somethingLike(true),
    caseCategories: somethingLike([
      {
        categoryParent: somethingLike('string'),
        categoryType: somethingLike('string'),
        categoryValue: somethingLike('string')
      }
    ]),
    caseDeepLink: somethingLike('string'),
    caseInterpreterRequiredFlag: somethingLike(true),
    caseManagementLocationCode: somethingLike('string'),
    caseRef: somethingLike('string'),
    caseSLAStartDate: somethingLike('2023-07-04'),
    caserestrictedFlag: true,
    externalCaseReference: somethingLike('string'),
    hmctsInternalCaseName: somethingLike('string'),
    hmctsServiceCode: somethingLike('string'),
    publicCaseName: somethingLike('string')
  },
  hearingDetails: {
    amendReasonCodes: [somethingLike('string')],
    autolistFlag: somethingLike(true),
    duration: somethingLike(0),
    facilitiesRequired: [somethingLike('string')],
    hearingChannels: [somethingLike('string')],
    hearingInWelshFlag: somethingLike(true),
    hearingIsLinkedFlag: somethingLike(true),
    hearingLocations: [{
      locationId: somethingLike('string'),
      locationType: somethingLike('string')
    }],
    hearingPriorityType: somethingLike('string'),
    hearingRequester: somethingLike('string'),
    hearingType: somethingLike('string'),
    hearingWindow: {
      dateRangeEnd: somethingLike('2023-07-03'),
      dateRangeStart: somethingLike('2023-07-03'),
      firstDateTimeMustBe: somethingLike('2023-07-04T11:47:39.004Z')
    },
    leadJudgeContractType: somethingLike('string'),
    listingAutoChangeReasonCode: somethingLike('string'),
    listingComments: somethingLike('string'),
    nonStandardHearingDurationReasons: [somethingLike('string')],
    numberOfPhysicalAttendees: somethingLike(0),
    panelRequirements: {
      authorisationSubType: [somethingLike('string')],
      authorisationTypes: [somethingLike('string')],
      panelPreferences: [
        {
          memberID: somethingLike('string'),
          memberType: somethingLike('string'),
          requirementType: somethingLike('string')
        }
      ],
      panelSpecialisms: [somethingLike('string')],
      roleType: [somethingLike('string')]
    },
    privateHearingRequiredFlag: somethingLike(true)
  },
  partyDetails: [{
    individualDetails: {
      custodyStatus: somethingLike('string'),
      firstName: somethingLike('string'),
      hearingChannelEmail: [somethingLike('string')],
      hearingChannelPhone: [somethingLike('string')],
      interpreterLanguage: somethingLike('string'),
      lastName: somethingLike('string'),
      otherReasonableAdjustmentDetails: somethingLike('string'),
      preferredHearingChannel: somethingLike('string'),
      reasonableAdjustments: [somethingLike('string')],
      relatedParties: [{
        relatedPartyID: somethingLike('string'),
        relationshipType: somethingLike('string')
      }],
      title: somethingLike('string'),
      vulnerabilityDetails: somethingLike('string'),
      vulnerableFlag: somethingLike(true)
    },
    organisationDetails: {
      cftOrganisationID: somethingLike('string'),
      name: somethingLike('string'),
      organisationType: somethingLike('string')
    },
    partyChannelSubType: somethingLike('string'),
    partyID: somethingLike('string'),
    partyRole: somethingLike('string'),
    partyType: somethingLike('string'),
    unavailabilityDOW: [{
      DOW: somethingLike('string'),
      DOWUnavailabilityType: somethingLike('string')
    }],
    unavailabilityRanges: [{
      unavailabilityType: somethingLike('string'),
      unavailableFromDate: somethingLike('2023-07-04'),
      unavailableToDate: somethingLike('2023-07-04')
    }]
  }]
};

const RESPONSE_BODY = {
  'hearingRequestID': somethingLike(0),
  'partiesNotified': somethingLike('2023-07-04T11:47:39.004Z'),
  'requestVersion': somethingLike(0),
  'responseVersion': somethingLike(0),
  'serviceData': somethingLike({}),
  'status': somethingLike('string'),
  'timeStamp': somethingLike('2023-07-04T11:47:39.004Z'),
  'versionNumber': somethingLike(0)
};

describe('Hearings, create single hearing request', () => {
  describe('get /getHearing/{ccdCaseRef}}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction: InteractionObject = {
        state: 'Create a hearing request',
        uponReceiving: 'create single hearing request',
        withRequest: {
          method: 'POST',
          path: '/hearing',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          body: REQUEST_BODY
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

      const { submitHearingRequest } = requireReloaded('../../../../hearings/hmc.index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        body: {
          caseDetails: {
            caseAdditionalSecurityFlag: true,
            caseCategories: [{
              categoryParent: 'string',
              categoryType: 'string',
              categoryValue: 'string'
            }],
            caseDeepLink: 'string',
            caseInterpreterRequiredFlag: true,
            caseManagementLocationCode: 'string',
            caseRef: 'string',
            caseSLAStartDate: '2023-07-04',
            caserestrictedFlag: true,
            externalCaseReference: 'string',
            hmctsInternalCaseName: 'string',
            hmctsServiceCode: 'string',
            publicCaseName: 'string'
          },
          hearingDetails: {
            amendReasonCodes: ['string'],
            autolistFlag: true,
            duration: 0,
            facilitiesRequired: ['string'],
            hearingChannels: ['string'],
            hearingInWelshFlag: true,
            hearingIsLinkedFlag: true,
            hearingLocations: [{
              locationId: 'string',
              locationType: 'string'
            }],
            hearingPriorityType: 'string',
            hearingRequester: 'string',
            hearingType: 'string',
            hearingWindow: {
              dateRangeEnd: '2023-07-03',
              dateRangeStart: '2023-07-03',
              firstDateTimeMustBe: '2023-07-04T11:47:39.004Z'
            },
            leadJudgeContractType: 'string',
            listingAutoChangeReasonCode: 'string',
            listingComments: 'string',
            nonStandardHearingDurationReasons: ['string'],
            numberOfPhysicalAttendees: 0,
            panelRequirements: {
              authorisationSubType: ['string'],
              authorisationTypes: ['string'],
              panelPreferences: [
                {
                  memberID: 'string',
                  memberType: 'string',
                  requirementType: 'string'
                }
              ],
              panelSpecialisms: ['string'],
              roleType: ['string']
            },
            privateHearingRequiredFlag: true
          },
          partyDetails: [{
            individualDetails: {
              custodyStatus: 'string',
              firstName: 'string',
              hearingChannelEmail: ['string'],
              hearingChannelPhone: ['string'],
              interpreterLanguage: 'string',
              lastName: 'string',
              otherReasonableAdjustmentDetails: 'string',
              preferredHearingChannel: 'string',
              reasonableAdjustments: ['string'],
              relatedParties: [{
                relatedPartyID: 'string',
                relationshipType: 'string'
              }],
              title: 'string',
              vulnerabilityDetails: 'string',
              vulnerableFlag: true
            },
            organisationDetails: {
              cftOrganisationID: 'string',
              name: 'string',
              organisationType: 'string'
            },
            partyChannelSubType: 'string',
            partyID: 'string',
            partyRole: 'string',
            partyType: 'string',
            unavailabilityDOW: [{
              DOW: 'string',
              DOWUnavailabilityType: 'string'
            }],
            unavailabilityRanges: [{
              unavailabilityType: 'string',
              unavailableFromDate: '2023-07-04',
              unavailableToDate: '2023-07-04'
            }]
          }]
        }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await submitHearingRequest(req, response, next);
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
  expect(dto.hearingRequestID).to.be.equal(0);
  expect(dto.partiesNotified).to.be.equal('2023-07-04T11:47:39.004Z');
  expect(dto.requestVersion).to.be.equal(0);
  expect(dto.responseVersion).to.be.equal(0);
  expect(dto.serviceData).to.be.eql({});
  expect(dto.status).to.be.equal('string');
  expect(dto.timeStamp).to.be.equal('2023-07-04T11:47:39.004Z');
  expect(dto.versionNumber).to.be.equal(0);
}
