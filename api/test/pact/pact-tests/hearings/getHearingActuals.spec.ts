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
const pactSetUp = new PactTestSetup({ provider: 'hmc_hearingActuals', port: 8000 });

const hearingId = '1234567890123456';

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
  hearingActuals: {
    actualHearingDays: [{
      actualDayParties: [{
        actualOrganisationName: somethingLike('string'),
        actualPartyId: somethingLike('string'),
        didNotAttendFlag: somethingLike(true),
        individualDetails: {
          firstName: somethingLike('string'),
          lastName: somethingLike('string')
        },
        partyChannelSubType: somethingLike('string'),
        partyRole: somethingLike('string'),
        representedParty: somethingLike('string')
      }],
      hearingDate: somethingLike('2023-07-03'),
      hearingEndTime: somethingLike('2023-07-03T13:00:50.368Z'),
      hearingStartTime: somethingLike('2023-07-03T13:00:50.368Z'),
      notRequired: somethingLike(true),
      pauseDateTimes: [{
        pauseEndTime: somethingLike('2023-07-03T13:00:50.368Z'),
        pauseStartTime: somethingLike('2023-07-03T13:00:50.368Z')
      }]
    }],
    hearingOutcome: {
      hearingFinalFlag: somethingLike(true),
      hearingResult: somethingLike('string'),
      hearingResultDate: somethingLike('2023-07-03'),
      hearingResultReasonType: somethingLike('string'),
      hearingType: somethingLike('string')
    }
  },
  hearingPlanned: {
    plannedHearingDays: [{
      parties: [{
        individualDetails: {
          custodyStatus: somethingLike('string'),
          firstName: somethingLike('string'),
          hearingChannelEmail: [
            somethingLike('string')
          ],
          hearingChannelPhone: [
            somethingLike('string')
          ],
          interpreterLanguage: somethingLike('string'),
          lastName: somethingLike('string'),
          otherReasonableAdjustmentDetails: somethingLike('string'),
          preferredHearingChannel: somethingLike('string'),
          reasonableAdjustments: [
            somethingLike('string')
          ],
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
        partyRole: somethingLike('string')
      }],
      plannedEndTime: somethingLike('2023-07-03T13:00:50.368Z'),
      plannedStartTime: somethingLike('2023-07-03T13:00:50.368Z')
    }],
    plannedHearingType: somethingLike('string')
  },
  hmcStatus: somethingLike('string')
};

describe('Hearings, get single hearing actuals for given hearingId', () => {
  describe('get /hearingActuals/{hearingId}}', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction: InteractionObject = {
        state: 'Get hearing actuals by hearingId',
        uponReceiving: 'get hearing actuals for given hearingId',
        withRequest: {
          method: 'GET',
          path: `/hearingActuals/${hearingId}`,
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

      const { getHearingActuals } = requireReloaded('../../../../hearings/hmc.index.ts');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        params: {
          hearingId
        }
      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getHearingActuals(req, response, next);
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

  expect(dto.hearingActuals.actualHearingDays[0].actualDayParties).to.be.eql([{
    actualOrganisationName: 'string',
    actualPartyId: 'string',
    didNotAttendFlag: true,
    individualDetails: {
      firstName: 'string',
      lastName: 'string'
    },
    partyChannelSubType: 'string',
    partyRole: 'string',
    representedParty: 'string'
  }]);
  expect(dto.hearingActuals.actualHearingDays[0].hearingDate).to.be.equal('2023-07-03');
  expect(dto.hearingActuals.actualHearingDays[0].hearingEndTime).to.be.equal('2023-07-03T13:00:50.368Z');
  expect(dto.hearingActuals.actualHearingDays[0].hearingStartTime).to.be.equal('2023-07-03T13:00:50.368Z');
  expect(dto.hearingActuals.actualHearingDays[0].notRequired).to.be.equal(true);
  expect(dto.hearingActuals.actualHearingDays[0].pauseDateTimes).to.be.eql([{
    pauseEndTime: '2023-07-03T13:00:50.368Z',
    pauseStartTime: '2023-07-03T13:00:50.368Z'
  }]);

  expect(dto.hearingActuals.hearingOutcome.hearingFinalFlag).to.be.equal(true);
  expect(dto.hearingActuals.hearingOutcome.hearingResult).to.be.equal('string');
  expect(dto.hearingActuals.hearingOutcome.hearingResultDate).to.be.equal('2023-07-03');
  expect(dto.hearingActuals.hearingOutcome.hearingResultReasonType).to.be.equal('string');
  expect(dto.hearingActuals.hearingOutcome.hearingType).to.be.equal('string');

  expect(dto.hearingPlanned.plannedHearingDays[0].parties[0].individualDetails).to.be.eql({
    custodyStatus: 'string',
    firstName: 'string',
    hearingChannelEmail: [
      'string'
    ],
    hearingChannelPhone: [
      'string'
    ],
    interpreterLanguage: 'string',
    lastName: 'string',
    otherReasonableAdjustmentDetails: 'string',
    preferredHearingChannel: 'string',
    reasonableAdjustments: [
      'string'
    ],
    relatedParties: [{
      relatedPartyID: 'string',
      relationshipType: 'string'
    }],
    title: 'string',
    vulnerabilityDetails: 'string',
    vulnerableFlag: true
  });

  expect(dto.hearingPlanned.plannedHearingDays[0].parties[0].organisationDetails).to.be.eql({
    cftOrganisationID: 'string',
    name: 'string',
    organisationType: 'string'
  });
  expect(dto.hearingPlanned.plannedHearingDays[0].parties[0].partyChannelSubType).to.be.equal('string');
  expect(dto.hearingPlanned.plannedHearingDays[0].parties[0].partyID).to.be.equal('string');
  expect(dto.hearingPlanned.plannedHearingDays[0].parties[0].partyRole).to.be.equal('string');

  expect(dto.hearingPlanned.plannedHearingDays[0].plannedEndTime).to.be.equal('2023-07-03T13:00:50.368Z');
  expect(dto.hearingPlanned.plannedHearingDays[0].plannedStartTime).to.be.equal('2023-07-03T13:00:50.368Z');
  expect(dto.hearingPlanned.plannedHearingType).to.be.equal('string');

  expect(dto.hmcStatus).to.be.equal('string');
}
