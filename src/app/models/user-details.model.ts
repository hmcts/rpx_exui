export interface UserInfo {
  id: string;
  forename: string;
  surname: string;
  email: string;
  active: boolean;
  roles: string[];
  uid?: string;
  roleCategory?: string;
}

export interface RoleAssignmentInfo {
  // TODO: Review model changes
  primaryLocation?: string;
  baseLocation?: string;
  jurisdiction: string;
  substantive?: string;
  isCaseAllocator: boolean;
  bookable?: boolean | string;
  region?: string;
  roleType?: string;
  roleName?: string;
  beginTime?: string;
  endTime?: string;
  caseId?: string;
}

export interface UserDetails {
  sessionTimeout: {
    idleModalDisplayTime: number,
    totalIdleTime: number,
  };
  canShareCases: boolean;
  userInfo: UserInfo;
  roleAssignmentInfo?: RoleAssignmentInfo[];
}

export enum UserRole {
  Admin = 'admin',
  LegalOps = 'legalops',
  Judicial = 'judicial',
  Ctsc = 'ctsc',
  Ogd = 'ogd',
  CTSC = 'ctsc',
  HearingManager = 'hearing-manager',
  HearingViewer = 'hearing-viewer',
  ListedHearingViewer = 'listed-hearing-viewer'
}
