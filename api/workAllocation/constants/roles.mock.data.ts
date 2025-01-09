import { RoleCategory, TypeOfRole } from '../../roleAccess/models/allocate-role.enum';
import { CaseRole } from '../interfaces/caseRole';

export const CASEROLES: CaseRole[] = [
  {
    actions: [
      { 'id': 'reallocate', 'title': 'Reallocate' },
      { 'id': 'remove', 'title': 'Remove Allocation' }
    ],
    actorId: '37eb0c5e-29c7-453e-b92d-f2029aaed6c3',
    email: 'Judge.Beech@mail.com',
    end: '2021-07-23T00:29:10.656Z',
    id: 'cc311b32-5aea-4cd1-8b72-911fb47c8a2e',
    location: 'Taylor House',
    name: 'Judge Beech',
    roleCategory: RoleCategory.JUDICIAL,
    roleName: TypeOfRole.LeadJudge,
    start: '2021-07-13T00:29:10.656Z'
  },
  {
    actions: [
      { 'id': 'reallocate', 'title': 'Reallocate' },
      { 'id': 'remove', 'title': 'Remove Allocation' }
    ],
    actorId: '38eb0c5e-29c7-453e-b92d-f2029aaed6c3',
    email: 'Kuda.Nyamainashe@mail.com',
    end: null,
    id: '910088b0-9268-491b-8ddd-addc03ff67e7',
    location: 'Milton Keynes',
    name: 'Kuda Nyamainashe',
    roleCategory: RoleCategory.JUDICIAL,
    roleName: TypeOfRole.LeadJudge,
    start: '2021-05-19T00:29:10.656Z'
  },
  {
    actions: [
      { 'id': 'reallocate', 'title': 'Reallocate' },
      { 'id': 'remove', 'title': 'Remove Allocation' }
    ],
    actorId: '1',
    email: 'Bisa.Bulter@mail.com',
    end: '2021-08-22T00:29:10.656Z',
    id: 'cbe74919-e9f0-4c8b-8d90-7da6aede9fe9',
    location: 'Taylor House',
    name: 'Bisa Bulter',
    roleCategory: RoleCategory.LEGAL_OPERATIONS,
    roleName: TypeOfRole.CaseManager,
    start: '2021-08-19T00:29:10.656Z'
  }
];
