import { somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const pactSetUp = new PactTestSetup({ provider: 'am_roleAssignment_createSpecificAccessDenyRole', port: 8000 });

const REQUEST_BODY = {
  caseId: '1594717367271987',
  action: '',
  assignmentId: 'assignment-id-001',
  typeOfRole: { id: 'specific-access-granted', name: 'specific-access-granted' },
  requestedRole: 'specific-access-legal-ops',
  requestId: '59bedc19-9cc6-4bff-9f58-041c3ba664a0',
  allocateTo: 'Allocate to me',
  personToBeRemoved: null,
  person: { id: 'db17f6f7-1abf-4223-8b5e-1eece04ee5d8', name: null, domain: null },
  actorId: '123',
  assigneeId: 'assignee-id-001',
  durationOfRole: '7 days',
  roleCategory: 'LEGAL_OPERATIONS',
  period: {
    startDate: new Date(),
    endDate: new Date()
  },
  jurisdiction: 'IA',
  comment: null,
  originalRequestDate: null,
  requestCreated: null,
  accessReason: null,
  originalRequestJustification: null,
  specificReason: null
};

const DENY_SPECIFIC_ACCESS_ROLE_ASSIGNMENTS_BODY = {
  roleRequest: somethingLike({
    assignerId: somethingLike('123'),
    replaceExisting: somethingLike(true),
    process: somethingLike('specific-access'),
    reference: somethingLike('1594717367271987/specific-access-legal-ops/assignee-id-001')
  }),
  requestedRoles: somethingLike([
    {
      roleType: somethingLike('CASE'),
      readOnly: somethingLike(true),
      grantType: somethingLike('BASIC'),
      classification: somethingLike('PRIVATE'),
      attributes: {
        caseId: somethingLike('1594717367271987'),
        requestedRole: somethingLike('specific-access-legal-ops'),
        requestDate: null,
        reviewer: somethingLike('123'),
        infoRequired: somethingLike(false),
        infoRequiredComment: null,
        isNew: somethingLike(true)
      },
      roleName: somethingLike('specific-access-denied'),
      roleCategory: somethingLike('LEGAL_OPERATIONS'),
      actorIdType: somethingLike('IDAM'),
      actorId: somethingLike('assignee-id-001'),
      endTime: somethingLike('2023-08-07T00:00:00.000Z'),
      notes: [
        {
          comment: null,
          time: somethingLike('2023-07-24T15:46:19.182Z'),
          userId: somethingLike('123')
        }
      ]
    }
  ])
};

describe('access management service, create specific access deny role', () => {
  describe('create specific access deny role', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async() => {
      await pactSetUp.provider.setup();
      const roleAssignmentInteraction = {
        state: 'Create specific access deny role for user',
        uponReceiving: 'create specific access deny role',
        withRequest: {
          method: 'POST',
          path: '/am/role-assignments',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          body: DENY_SPECIFIC_ACCESS_ROLE_ASSIGNMENTS_BODY
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/vnd.uk.gov.hmcts.role-assignment-service.post-assignment-query-request+json;charset=UTF-8;version=2.0'
          },
          body: {}
        }
      };

      // @ts-ignore
      pactSetUp.provider.addInteraction(roleAssignmentInteraction);
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

      const { createSpecificAccessDenyRole } = requireReloaded('../../../../roleAccess/index');
      const req = mockReq({
        headers: {
          'Authorization': 'Bearer someAuthorizationToken',
          'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
          'content-type': 'application/json'
        },
        session: { passport: { user: { userinfo: { id: '123' } } } },
        body: REQUEST_BODY
      });

      let returnedResponse = null;
      const response = null;

      try {
        returnedResponse = await createSpecificAccessDenyRole(req, response, next);
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
  expect(dto.status).to.be.equal(200);
  expect(dto.data).to.eql({});
}
