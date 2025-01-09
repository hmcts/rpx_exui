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

const hearingId = '1234567890123456';

describe('Hearings, get single hearing for given hearingId', () => {
  const RESPONSE_BODY = {
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
      caseSLAStartDate: somethingLike('2023-07-03'),
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
        firstDateTimeMustBe: somethingLike('2023-07-03T15:11:34.019Z')
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
    hearingResponse: {
      hearingCancellationReason: somethingLike('string'),
      hearingDaySchedule: [{
        attendees: [{
          hearingSubChannel: somethingLike('string'),
          partyID: somethingLike('string')
        }],
        hearingEndDateTime: somethingLike('2023-07-03T15:11:34.019Z'),
        hearingJudgeId: somethingLike('string'),
        hearingRoomId: somethingLike('string'),
        hearingStartDateTime: somethingLike('2023-07-03T15:11:34.019Z'),
        hearingVenueId: somethingLike('string'),
        listAssistSessionID: somethingLike('string'),
        panelMemberIds: [somethingLike('string')]
      }],
      laCaseStatus: somethingLike('string'),
      listAssistTransactionID: somethingLike('string'),
      listingStatus: somethingLike('string'),
      receivedDateTime: somethingLike('2023-07-03T15:11:34.019Z'),
      requestVersion: somethingLike(0)
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
        unavailableFromDate: somethingLike('2023-07-03'),
        unavailableToDate: somethingLike('2023-07-03')
      }]
    }],
    requestDetails: {
      cancellationReasonCodes: [somethingLike('string')],
      hearingGroupRequestId: somethingLike('string'),
      hearingRequestID: somethingLike('string'),
      partiesNotified: somethingLike('2023-07-03T15:11:34.019Z'),
      status: somethingLike('string'),
      timestamp: somethingLike('2023-07-03T15:11:34.019Z'),
      versionNumber: somethingLike(0)
    }
  };

  describe('get /getHearing/{ccdCaseRef}}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction: InteractionObject = {
        state: 'Get single hearing by hearingId',
        uponReceiving: 'get single hearing for given hearingId',
        withRequest: {
          method: 'GET',
          path: `/hearing/${hearingId}`,
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

      const { getHearing } = requireReloaded('../../../../hearings/hmc.index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        query: {
          hearingId
        }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getHearing(req, response, next);
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
  expect(dto.caseDetails.caseAdditionalSecurityFlag).to.be.equal(true);

  expect(dto.caseDetails.caseCategories).to.be.eql([{
    categoryParent: 'string',
    categoryType: 'string',
    categoryValue: 'string'
  }]);

  expect(dto.caseDetails.caseDeepLink).to.be.equal('string');
  expect(dto.caseDetails.caseInterpreterRequiredFlag).to.be.equal(true);
  expect(dto.caseDetails.caseManagementLocationCode).to.be.equal('string');
  expect(dto.caseDetails.caseRef).to.be.equal('string');
  expect(dto.caseDetails.caseSLAStartDate).to.be.equal('2023-07-03');
  expect(dto.caseDetails.caserestrictedFlag).to.be.equal(true);
  expect(dto.caseDetails.externalCaseReference).to.be.equal('string');
  expect(dto.caseDetails.hmctsInternalCaseName).to.be.equal('string');
  expect(dto.caseDetails.hmctsServiceCode).to.be.equal('string');
  expect(dto.caseDetails.publicCaseName).to.be.equal('string');

  expect(dto.hearingDetails.amendReasonCodes).to.be.eql(['string']);
  expect(dto.hearingDetails.autolistFlag).to.be.equal(true);
  expect(dto.hearingDetails.duration).to.be.equal(0);
  expect(dto.hearingDetails.facilitiesRequired).to.be.eql(['string']);
  expect(dto.hearingDetails.hearingChannels).to.be.eql(['string']);
  expect(dto.hearingDetails.hearingInWelshFlag).to.be.equal(true);
  expect(dto.hearingDetails.hearingIsLinkedFlag).to.be.equal(true);
  expect(dto.hearingDetails.hearingLocations).to.be.eql([
    { locationId: 'string', locationType: 'string' }
  ]);
  expect(dto.hearingDetails.hearingPriorityType).to.be.equal('string');
  expect(dto.hearingDetails.hearingRequester).to.be.equal('string');
  expect(dto.hearingDetails.hearingType).to.be.equal('string');
  expect(dto.hearingDetails.hearingWindow).to.be.eql({
    dateRangeEnd: '2023-07-03',
    dateRangeStart: '2023-07-03',
    firstDateTimeMustBe: '2023-07-03T15:11:34.019Z'
  });
  expect(dto.hearingDetails.leadJudgeContractType).to.be.equal('string');
  expect(dto.hearingDetails.leadJudgeContractType).to.be.equal('string');
  expect(dto.hearingDetails.listingAutoChangeReasonCode).to.be.equal('string');
  expect(dto.hearingDetails.listingComments).to.be.equal('string');
  expect(dto.hearingDetails.nonStandardHearingDurationReasons).to.be.eql(['string']);
  expect(dto.hearingDetails.numberOfPhysicalAttendees).to.be.equal(0);

  expect(dto.hearingDetails.panelRequirements.authorisationSubType).to.be.eql(['string']);
  expect(dto.hearingDetails.panelRequirements.authorisationTypes).to.be.eql(['string']);
  expect(dto.hearingDetails.panelRequirements.panelPreferences).to.be.eql([{
    memberID: 'string',
    memberType: 'string',
    requirementType: 'string'
  }]);
  expect(dto.hearingDetails.panelRequirements.panelSpecialisms).to.be.eql(['string']);
  expect(dto.hearingDetails.panelRequirements.roleType).to.be.eql(['string']);

  expect(dto.hearingDetails.privateHearingRequiredFlag).to.be.equal(true);
  expect(dto.hearingResponse.hearingCancellationReason).to.be.equal('string');

  expect(dto.hearingResponse.hearingDaySchedule.length).to.be.equal(1);
  expect(dto.hearingResponse.hearingDaySchedule[0].attendees).to.eql([{
    hearingSubChannel: 'string',
    partyID: 'string'
  }]);
  expect(dto.hearingResponse.hearingDaySchedule[0].hearingEndDateTime).to.be.equal('2023-07-03T15:11:34.019Z');
  expect(dto.hearingResponse.hearingDaySchedule[0].hearingJudgeId).to.be.equal('string');
  expect(dto.hearingResponse.hearingDaySchedule[0].hearingRoomId).to.be.equal('string');
  expect(dto.hearingResponse.hearingDaySchedule[0].hearingStartDateTime).to.be.equal('2023-07-03T15:11:34.019Z');
  expect(dto.hearingResponse.hearingDaySchedule[0].hearingVenueId).to.be.equal('string');
  expect(dto.hearingResponse.hearingDaySchedule[0].listAssistSessionID).to.be.equal('string');
  expect(dto.hearingResponse.hearingDaySchedule[0].panelMemberIds).to.eql(['string']);
  expect(dto.hearingResponse.hearingDaySchedule[0].hearingVenueId).to.be.equal('string');
  expect(dto.hearingResponse.hearingDaySchedule[0].listAssistSessionID).to.be.equal('string');
  expect(dto.hearingResponse.hearingDaySchedule[0].panelMemberIds).to.be.eql(['string']);

  expect(dto.hearingResponse.laCaseStatus).to.be.equal('string');
  expect(dto.hearingResponse.listAssistTransactionID).to.be.equal('string');
  expect(dto.hearingResponse.listingStatus).to.be.equal('string');
  expect(dto.hearingResponse.receivedDateTime).to.be.equal('2023-07-03T15:11:34.019Z');
  expect(dto.hearingResponse.requestVersion).to.be.equal(0);

  expect(dto.partyDetails.length).to.be.equal(1);
  expect(dto.partyDetails[0].individualDetails.custodyStatus).to.be.equal('string');
  expect(dto.partyDetails[0].individualDetails.firstName).to.be.equal('string');
  expect(dto.partyDetails[0].individualDetails.hearingChannelEmail).to.be.eql(['string']);
  expect(dto.partyDetails[0].individualDetails.hearingChannelPhone).to.be.eql(['string']);
  expect(dto.partyDetails[0].individualDetails.interpreterLanguage).to.be.equal('string');
  expect(dto.partyDetails[0].individualDetails.lastName).to.be.equal('string');
  expect(dto.partyDetails[0].individualDetails.otherReasonableAdjustmentDetails).to.be.equal('string');
  expect(dto.partyDetails[0].individualDetails.preferredHearingChannel).to.be.equal('string');
  expect(dto.partyDetails[0].individualDetails.reasonableAdjustments).to.be.eql(['string']);
  expect(dto.partyDetails[0].individualDetails.relatedParties[0]).to.be.eql({
    relatedPartyID: 'string',
    relationshipType: 'string'
  });
  expect(dto.partyDetails[0].individualDetails.title).to.be.equal('string');
  expect(dto.partyDetails[0].individualDetails.vulnerabilityDetails).to.be.equal('string');
  expect(dto.partyDetails[0].individualDetails.vulnerableFlag).to.be.equal(true);

  expect(dto.partyDetails[0].organisationDetails.cftOrganisationID).to.be.equal('string');
  expect(dto.partyDetails[0].organisationDetails.name).to.be.equal('string');
  expect(dto.partyDetails[0].organisationDetails.organisationType).to.be.equal('string');

  expect(dto.partyDetails[0].partyChannelSubType).to.be.equal('string');
  expect(dto.partyDetails[0].partyID).to.be.equal('string');
  expect(dto.partyDetails[0].partyRole).to.be.equal('string');
  expect(dto.partyDetails[0].partyType).to.be.equal('string');
  expect(dto.partyDetails[0].unavailabilityDOW).to.be.eql([{
    DOW: 'string',
    DOWUnavailabilityType: 'string'
  }]);
  expect(dto.partyDetails[0].unavailabilityRanges).to.be.eql([{
    unavailabilityType: 'string',
    unavailableFromDate: '2023-07-03',
    unavailableToDate: '2023-07-03'
  }]);

  expect(dto.requestDetails.cancellationReasonCodes).to.be.eql(['string']);
  expect(dto.requestDetails.hearingGroupRequestId).to.be.equal('string');
  expect(dto.requestDetails.hearingRequestID).to.be.equal('string');
  expect(dto.requestDetails.partiesNotified).to.be.equal('2023-07-03T15:11:34.019Z');
  expect(dto.requestDetails.status).to.be.equal('string');
  expect(dto.requestDetails.timestamp).to.be.equal('2023-07-03T15:11:34.019Z');
  expect(dto.requestDetails.versionNumber).to.be.equal(0);
}
