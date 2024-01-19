import { somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { expect } from 'chai';
import * as config from 'config';
import * as sinon from 'sinon';
import { mockReq } from 'sinon-express-mock';
import { PactTestSetup } from '../settings/provider.mock';
import { getAccessManagementServiceAPIOverrides } from '../utils/configOverride';
import { requireReloaded } from '../utils/moduleUtil';

const pactSetUp = new PactTestSetup({ provider: 'am_roleAssignment_restoreSpecificAccessRequestRole', port: 8000 });

const REQUEST_BODY = {
  state: 1,
  accessReason: 'Approve request',
  typeOfRole: { id: 'specific-access-granted', name: 'specific-access-granted' },
  period: {
    startDate: new Date(),
    endDate: new Date()
  },
  actorId: '123',
  caseName: 'example name',
  requestCreated: null,
  caseId: '1594717367271987',
  taskId: 'd3f939d2-d4f3-11ec-8d51-b6ad61ebbb09',
  requestId: '59bedc19-9cc6-4bff-9f58-041c3ba664a0',
  jurisdiction: 'IA',
  roleCategory: 'LEGAL_OPERATIONS',
  requestedRole: 'specific-access-legal-ops',
  person: { id: 'db17f6f7-1abf-4223-8b5e-1eece04ee5d8', name: null, domain: null },
  specificAccessFormData: {
    specificAccessDurationForm: {
      selectedOption: '7 days',
      selectedDuration: {
        startDate: {
          day: 11,
          month: 11,
          year: 2024
        },
        endDate: {
          day: 11,
          month: 11,
          year: 2024
        }
      }
    }
  }
};

const ROLE_ASSIGNMENTS_BODY = somethingLike({
  roleRequest: somethingLike({
    assignerId: 'db17f6f7-1abf-4223-8b5e-1eece04ee5d8',
    replaceExisting: true,
    process: 'specific-access',
    reference: '1594717367271987/specific-access-legal-ops/db17f6f7-1abf-4223-8b5e-1eece04ee5d8'
  }),
  requestedRoles: somethingLike([
    {
      roleType: somethingLike('CASE'),
      readOnly: somethingLike(true),
      grantType: somethingLike('BASIC'),
      classification: somethingLike('PRIVATE'),
      attributes: {
        caseId: somethingLike('1594717367271987'),
        requestedRole: somethingLike('specific-access-legal-ops')
      },
      roleName: somethingLike('specific-access-requested'),
      roleCategory: somethingLike('LEGAL_OPERATIONS'),
      actorIdType: somethingLike('IDAM'),
      actorId: somethingLike('db17f6f7-1abf-4223-8b5e-1eece04ee5d8'),
      beginTime: somethingLike('2023-07-25T08:13:41.098Z'),
      endTime: somethingLike('2023-07-25T08:13:10.410Z'),
      notes: somethingLike([
        {
          comment: somethingLike('{"specificReason":undefined}'),
          time: somethingLike('2023-07-25T08:13:41.098Z'),
          userId: somethingLike('db17f6f7-1abf-4223-8b5e-1eece04ee5d8')
        }
      ])
    }
  ])
});

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

describe('access management service, restore specific access request role', () => {
  describe('restore specific access request role', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox();
    let next;

    beforeEach(() => {
      next = sandbox.spy();
    });

    before(async() => {
      await pactSetUp.provider.setup();
      const roleAssignmentInteraction = {
        state: 'Restore specific access request role for user',
        uponReceiving: 'restore specific access request role',
        withRequest: {
          method: 'POST',
          path: '/am/role-assignments',
          headers: {
            'Authorization': 'Bearer someAuthorizationToken',
            'ServiceAuthorization': 'Bearer someServiceAuthorizationToken',
            'content-type': 'application/json'
          },
          body: ROLE_ASSIGNMENTS_BODY
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/vnd.uk.gov.hmcts.role-assignment-service.post-assignment-query-request+json;charset=UTF-8;version=2.0'
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

      const { restoreSpecificAccessRequestRole } = requireReloaded('../../../../roleAccess/index');
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
        returnedResponse = await restoreSpecificAccessRequestRole(req, response, next);
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
