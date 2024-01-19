import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'am_roleAssignment_queryAssignment', port: 8000 });

const caseId = '12345';

describe.skip('getAccessRolesByCaseId - access management service, query role assignments', () => {
  const REQUEST_BODY = {
    queryRequests: [
      {
        attributes: {
          caseId: [somethingLike('12345')]
        }
      }
    ]
  };
  const RESPONSE_BODY = {
    roleAssignmentResponse: [
      {
        id: somethingLike('b83acc2f-6720-4cf9-a1f8-52367c35963d'),
        actorIdType: somethingLike('IDAM'),
        actorId: somethingLike('271ebdd4-f757-492d-b57f-101b8e47c90e'),
        roleType: somethingLike('CASE'),
        roleName: somethingLike('case-manager'),
        classification: somethingLike('PUBLIC'),
        grantType: somethingLike('SPECIFIC'),
        roleCategory: somethingLike('LEGAL_OPERATIONS'),
        readOnly: somethingLike(false),
        beginTime: somethingLike('2022-09-15T23:00:00Z'),
        created: somethingLike('2022-09-16T13:06:44.295367Z'),
        attributes: {
          substantive: somethingLike('Y'),
          caseId: somethingLike('1546883526751282'),
          jurisdiction: somethingLike('IA'),
          caseType: somethingLike('Asylum')
        }
      }
    ]
  };

  describe('post /am/role-assignments/query', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'A list of role assignments for the search query',
        uponReceiving: 'query role assignments for caseId',
        withRequest: {
          method: 'POST',
          path: '/am/role-assignments/query',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/vnd.uk.gov.hmcts.role-assignment-service.post-assignment-query-request+json;charset=UTF-8;version=2.0'
          },
          body: REQUEST_BODY
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/vnd.uk.gov.hmcts.role-assignment-service.post-assignment-query-request+json;charset=UTF-8;version=2.0'
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
      const configValues = getAccessManagementServiceAPIOverrides(pactSetUp.provider.mockService.baseUrl);
      sandbox.stub(config, 'get').callsFake((prop) => {
        return configValues[prop];
      });

      const { getAccessRolesByCaseId } = requireReloaded('../../../../roleAccess/index');

      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/vnd.uk.gov.hmcts.role-assignment-service.post-assignment-query-request+json;charset=UTF-8;version=2.0'
        },
        body: {
          caseId: caseId
        }

      });
      let returnedResponse = null;
      const response = mockRes();
      response.send = (ret) => {
        returnedResponse = ret;
      };

      try {
        await getAccessRolesByCaseId(req, response, next);
        assertResponses(returnedResponse);
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      } catch (err) {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
        throw new Error(err);
      }
    });
  });
});

function assertResponses(dto: any) {
  expect(dto.length).to.be.equal(1);
  expect(dto[0].actions[0].id).to.be.equal('reallocate');
  expect(dto[0].actions[0].title).to.be.equal('Reallocate');
  expect(dto[0].actorId).to.be.equal('271ebdd4-f757-492d-b57f-101b8e47c90e');
  expect(dto[0].end).to.be.equal(null);
  expect(dto[0].id).to.be.equal('b83acc2f-6720-4cf9-a1f8-52367c35963d');
  expect(dto[0].roleId).to.be.equal(null);
  expect(dto[0].location).to.be.equal(null);
  expect(dto[0].roleCategory).to.be.equal('LEGAL_OPERATIONS');
  expect(dto[0].roleName).to.be.equal('case-manager');
  expect(dto[0].start).to.be.equal('2022-09-15T23:00:00Z');
  expect(dto[0].created).to.be.equal('2022-09-16T13:06:44.295367Z');
  expect(dto[0].notes).to.be.equal('No reason for case access given');
  expect(dto[0].requestedRole).to.be.equal(null);
}
