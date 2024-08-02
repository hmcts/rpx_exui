import { UserInfo } from '../../auth/interfaces/UserInfo';
import { AllocateRoleData } from '../models/allocate-role-state-data.interface';
import { AllocateTo, Period, RoleCategory } from '../models/allocate-role.enum';

export function toRoleAssignmentBody(currentUserId: string, allocateRoleData: AllocateRoleData) {
  return {
    roleRequest: {
      assignerId: currentUserId,
      replaceExisting: false
    },
    requestedRoles: [{
      roleType: 'CASE',
      grantType: 'SPECIFIC',
      classification: 'RESTRICTED',
      attributes: {
        caseId: allocateRoleData.caseId,
        jurisdiction: allocateRoleData.jurisdiction
      },
      roleName: allocateRoleData.typeOfRole.id,
      roleCategory: allocateRoleData.roleCategory,
      actorIdType: 'IDAM',
      actorId: getActorId(currentUserId, allocateRoleData),
      beginTime: allocateRoleData.period.startDate,
      endTime: allocateRoleData.period.endDate
    }]
  };
}

export function toSARoleAssignmentBody(
  currentUserId: string, specificAccessData: { specificAccessStateData: AllocateRoleData, period: Period },
  extraAttributesForBasicRole: { [x: string]: string | boolean } = {},
  extraAttributesForSpecificRole: { [x: string]: string | boolean } = {}
) {
  const todayDate = new Date();
  const allocateRoleData = specificAccessData.specificAccessStateData;
  const period = specificAccessData.period;
  const requestedRole = allocateRoleData.requestedRole !== 'specific-access-judicial'
    ? allocateRoleData.requestedRole : 'specific-access-judiciary';
  return {
    roleRequest: {
      assignerId: currentUserId,
      replaceExisting: true,
      process: 'specific-access',
      reference: `${allocateRoleData.caseId}/${requestedRole}/${allocateRoleData.actorId}`
    },
    requestedRoles: [{
      roleType: 'CASE',
      readOnly: true,
      grantType: 'BASIC',
      classification: 'PRIVATE',
      attributes: {
        caseId: allocateRoleData.caseId,
        requestedRole,
        ...extraAttributesForBasicRole
      },
      roleName: 'specific-access-granted',
      roleCategory: allocateRoleData.roleCategory,
      actorIdType: 'IDAM',
      actorId: allocateRoleData.actorId,
      beginTime: period.startDate,
      endTime: period.endDate
        ? period.endDate : new Date(todayDate.setMonth(todayDate.getMonth() + 1)),
      // TODO: Include notes once we have that information
      notes: [
        {
          comment: `{"specificReason":${allocateRoleData.accessReason}}`,
          time: new Date().toISOString(),
          userId: allocateRoleData.actorId
        }
      ]
    },
    {
      roleType: 'CASE',
      readOnly: true,
      grantType: 'SPECIFIC',
      classification: 'RESTRICTED',
      attributes: {
        caseId: allocateRoleData.caseId,
        requestedRole,
        ...extraAttributesForSpecificRole
      },
      roleName: requestedRole,
      roleCategory: allocateRoleData.roleCategory,
      actorIdType: 'IDAM',
      actorId: allocateRoleData.actorId,
      beginTime: period.startDate,
      endTime: period.endDate,
      // TODO: Include notes once we have that information
      notes: [
        {
          comment: '{"specificReason":"Request approved"}',
          time: new Date().toISOString,
          userId: allocateRoleData.actorId
        }
      ]
    }]
  };
}

export function toDenySARoleAssignmentBody(
  currentUser: UserInfo, allocateRoleData: AllocateRoleData, extraAttributesForBasicRole: { [x: string]: string | boolean } = {}
) {
  const currentUserId = currentUser.id ? currentUser.id : currentUser.uid;
  let requestedrole;
  switch (allocateRoleData.roleCategory) {
    case RoleCategory.JUDICIAL:
      requestedrole = 'specific-access-judiciary';
      break;
    case RoleCategory.LEGAL_OPERATIONS:
      requestedrole = 'specific-access-legal-ops';
      break;
    case RoleCategory.ADMIN:
      requestedrole = 'specific-access-admin';
      break;
    case RoleCategory.CTSC:
      requestedrole = 'specific-access-ctsc';
      break;
    default:
      break;
  }
  return {
    roleRequest: {
      assignerId: currentUserId,
      replaceExisting: true,
      process: 'specific-access',
      reference: `${allocateRoleData.caseId}/${requestedrole}/${allocateRoleData.assigneeId}`
    },
    requestedRoles: [{
      roleType: 'CASE',
      readOnly: true,
      grantType: 'BASIC',
      classification: 'PRIVATE',
      attributes: {
        caseId: allocateRoleData.caseId,
        requestedRole: requestedrole,
        specificAccessReason: allocateRoleData.specificAccessReason,
        requestDate: allocateRoleData.requestCreated,
        reviewer: currentUserId,
        reviewerRoleCategory: currentUser.roleCategory,
        infoRequired: allocateRoleData.accessReason === 'Request more information',
        infoRequiredComment: allocateRoleData.comment,
        // note: line below added in conflict with lines above
        // since the lines above are crucial, some are required within the state data
        // and the development for the above has already been approved by QA this will be kept for now
        ...extraAttributesForBasicRole
      },
      roleName: 'specific-access-denied',
      roleCategory: allocateRoleData.roleCategory,
      actorIdType: 'IDAM',
      actorId: allocateRoleData.assigneeId,
      endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 14)).setUTCHours(0, 0, 0, 0)),
      notes: [{
        comment: allocateRoleData.comment,
        time: new Date(),
        userId: currentUserId
      }]
    }
    ]
  };
}
export function toDenySADletionRequestedRoleBody(requestId: string) {
  return {
    pathVariables: {
      process: 'staff-organisational-role-mapping',
      reference: requestId
    },
    queryParams: null,
    body: {
      userIds: [requestId]
    },
    multipart: false
  };
}

export function toSARequestRoleAssignmentBody(allocateRoleData: AllocateRoleData,
  extraAttributesForBasicRole: { [x: string]: string | boolean } = {}
) {
  const todayDate = new Date();
  return {
    roleRequest: {
      assignerId: allocateRoleData.person.id,
      replaceExisting: true,
      process: 'specific-access',
      reference: `${allocateRoleData.caseId}/${allocateRoleData.requestedRole}/${allocateRoleData.person.id}`
    },
    requestedRoles: [{
      roleType: 'CASE',
      readOnly: true,
      grantType: 'BASIC',
      classification: 'PRIVATE',
      attributes: {
        caseId: allocateRoleData.caseId,
        requestedRole: allocateRoleData.requestedRole,
        ...extraAttributesForBasicRole
      },
      roleName: 'specific-access-requested',
      roleCategory: allocateRoleData.roleCategory,
      actorIdType: 'IDAM',
      actorId: allocateRoleData.person.id,
      beginTime: new Date(),
      endTime: allocateRoleData.period && allocateRoleData.period.endDate ? allocateRoleData.period.endDate
        : new Date(todayDate.setMonth(todayDate.getMonth() + 1)),
      // TODO: Include notes once we have that information
      notes: [{
        comment: `{"specificReason":${allocateRoleData.specificReason}}`,
        time: new Date().toISOString(),
        userId: allocateRoleData.person.id
      }]
    }]
  };
}

export function getActorId(currentUserId: string, allocateRoleData: AllocateRoleData): string {
  if (allocateRoleData.allocateTo === AllocateTo.ALLOCATE_TO_ME) {
    return currentUserId;
  }

  return allocateRoleData.person.id;
}
