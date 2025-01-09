import { somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const pactSetUp = new PactTestSetup({ provider: 'am_roleAssignment_createSpecificAccessApprovalRole', port: 8000 });

const REQUEST_BODY = {
  specificAccessStateData: {
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
  },
  period: {
    startDate: new Date(),
    endDate: new Date()
  }
};

const SPECIFIC_ACCESS_ROLE_ASSIGNMENT_BODY = {
  'roleRequest': somethingLike({
    'assignerId': somethingLike('123'),
    'replaceExisting': somethingLike(true),
    'process': somethingLike('specific-access'),
    'reference': somethingLike('1594717367271987/specific-access-legal-ops/123')
  }),
  'requestedRoles': somethingLike([
    {
      'roleType': somethingLike('CASE'),
      'readOnly': somethingLike(true),
      'grantType': somethingLike('BASIC'),
      'classification': somethingLike('PRIVATE'),
      'attributes': somethingLike({
        'caseId': somethingLike('1594717367271987'),
        'requestedRole': somethingLike('specific-access-legal-ops')
      }),
      'roleName': somethingLike('specific-access-granted'),
      'roleCategory': somethingLike('LEGAL_OPERATIONS'),
      'actorIdType': somethingLike('IDAM'),
      'actorId': somethingLike('123'),
      'beginTime': somethingLike('2023-07-25T13:57:14.680Z'),
      'endTime': somethingLike('2023-07-25T13:57:14.680Z'),
      'notes': somethingLike([
        {
          'comment': somethingLike('{\'specificReason\':null}'),
          'time': somethingLike('2023-07-25T13:57:19.245Z'),
          'userId': somethingLike('123')
        }
      ])
    },
    {
      'roleType': somethingLike('CASE'),
      'readOnly': somethingLike(true),
      'grantType': somethingLike('SPECIFIC'),
      'classification': somethingLike('RESTRICTED'),
      'attributes': somethingLike({
        'caseId': somethingLike('1594717367271987'),
        'requestedRole': somethingLike('specific-access-legal-ops'),
        'isNew': somethingLike(true)
      }),
      'roleName': somethingLike('specific-access-legal-ops'),
      'roleCategory': somethingLike('LEGAL_OPERATIONS'),
      'actorIdType': somethingLike('IDAM'),
      'actorId': somethingLike('123'),
      'beginTime': somethingLike('2023-07-25T13:57:14.680Z'),
      'endTime': somethingLike('2023-07-25T13:57:14.680Z'),
      'notes': somethingLike([
        {
          'comment': somethingLike('{\'specificReason\':\'Request approved\'}'),
          'userId': somethingLike('123')
        }
      ])
    }
  ])
};

const RESPONSE_BODY = {
  'roleAssignmentResponse': somethingLike({
    'roleRequest': somethingLike({
      'id': somethingLike('7e9aa3ef-511d-4148-a3aa-48a8d88ea65b'),
      'authenticatedUserId': somethingLike('b67651dd-9498-421e-bfd6-2dd478412629'),
      'correlationId': somethingLike('f26f2e76-77c7-4812-968b-88226dd813c1'),
      'assignerId': somethingLike('b67651dd-9498-421e-bfd6-2dd478412629'),
      'requestType': somethingLike('CREATE'),
      'process': somethingLike('specific-access'),
      'reference': somethingLike('1632312593250791/specific-access-admin/b67651dd-9498-421e-bfd6-2dd478412629'),
      'replaceExisting': somethingLike(true),
      'status': somethingLike('APPROVED'),
      'created': somethingLike('2023-07-25T14:05:51.900190178Z'),
      'log': somethingLike('Request has been approved'),
      'byPassOrgDroolRule': somethingLike(true)
    }),
    'requestedRoles': somethingLike([
      {
        'id': somethingLike('4c1055e2-ce97-44ca-8e2f-d70370204a05'),
        'actorIdType': somethingLike('IDAM'),
        'actorId': somethingLike('b67651dd-9498-421e-bfd6-2dd478412629'),
        'roleType': somethingLike('CASE'),
        'roleName': somethingLike('specific-access-requested'),
        'classification': somethingLike('PRIVATE'),
        'grantType': somethingLike('BASIC'),
        'roleCategory': somethingLike('ADMIN'),
        'readOnly': somethingLike(true),
        'endTime': somethingLike('2023-08-24T14:05:51.137Z'),
        'process': somethingLike('specific-access'),
        'reference': somethingLike('1632312593250791/specific-access-admin/b67651dd-9498-421e-bfd6-2dd478412629'),
        'status': somethingLike('LIVE'),
        'created': somethingLike('2023-07-25T14:05:51.900212783Z'),
        'log': somethingLike('Create requested with replace: true\nStage 1 approved : create_specific_access_requested_case_role_for_self\nApproved : validate_role_assignment_against_patterns'),
        'attributes': somethingLike({
          'caseId': somethingLike('1632312593250791'),
          'isNew': somethingLike(true),
          'accessReason': somethingLike('{"specificReason":"test"}'),
          'requestedRole': somethingLike('specific-access-admin'),
          'specificAccessReason': somethingLike('test'),
          'jurisdiction': somethingLike('IA'),
          'caseType': somethingLike('Asylum'),
          'substantive': somethingLike('N')
        }),
        'notes': somethingLike([
          {
            'userId': somethingLike('b67651dd-9498-421e-bfd6-2dd478412629'),
            'time': somethingLike('2023-07-25T14:05:51.137Z'),
            'comment': somethingLike('{"specificReason":"test"}')
          }
        ])
      }
    ])
  })
};

describe('access management service, create specific access approval role', () => {
  describe('create specific access approval role /allocate-role/specific-access-approval', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async() => {
      await pactSetUp.provider.setup();
      const roleAssignmentInteraction = {
        state: 'Create specific access approval role for user',
        uponReceiving: 'create specific access approval role',
        withRequest: {
          method: 'POST',
          path: '/am/role-assignments',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          body: SPECIFIC_ACCESS_ROLE_ASSIGNMENT_BODY
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: RESPONSE_BODY
        }
      };

      const refreshRoleAssignmentInteraction = {
        state: 'An actor with provided id is available in role assignment service',
        uponReceiving: 'refresh role assignment for user',
        withRequest: {
          method: 'GET',
          path: '/am/role-assignments/actors/123',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          }
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
      // @ts-ignore
      pactSetUp.provider.addInteraction(refreshRoleAssignmentInteraction);
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

      const { createSpecificAccessApprovalRole } = requireReloaded('../../../../roleAccess/index');
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
        returnedResponse = await createSpecificAccessApprovalRole(req, response, next);
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
  expect(dto.data.roleAssignmentResponse.roleRequest.assignerId).to.be.equal('b67651dd-9498-421e-bfd6-2dd478412629');
  expect(dto.data.roleAssignmentResponse.roleRequest.process).to.be.equal('specific-access');
  expect(dto.data.roleAssignmentResponse.roleRequest.log).to.be.equal('Request has been approved');
  expect(dto.data.roleAssignmentResponse.roleRequest.reference).to.be.equal('1632312593250791/specific-access-admin/b67651dd-9498-421e-bfd6-2dd478412629');
}
