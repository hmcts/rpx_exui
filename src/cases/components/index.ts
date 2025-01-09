import { CaseRolesTableComponent } from '../../role-access/components/case-roles-table/case-roles-table.component';
import { ExclusionsTableComponent } from '../../role-access/components/exclusions-table/exclusions-table.component';
import { AllocateARoleLinkComponent } from './allocate-a-role/allocate-a-role-link.component';
import { AlertComponent } from './case-alert/alert.component';
import { CaseHearingsListComponent } from './case-hearings-list/case-hearings-list.component';
import { CaseTaskComponent } from './case-task/case-task.component';
import { RestrictedCaseAccessComponent } from './restricted-case-access/restricted-case-access.component';
import { RoleAccessSectionComponent } from './role-access-section/role-access-section.component';
import { RolesAndAccessComponent } from './roles-and-access/roles-and-access.component';
import { TaskAlertBannerComponent } from './task-alert-banner/task-alert-banner.component';

export const components: any[] = [
  AlertComponent,
  CaseRolesTableComponent,
  ExclusionsTableComponent,
  RolesAndAccessComponent,
  TaskAlertBannerComponent,
  CaseTaskComponent,
  AllocateARoleLinkComponent,
  RoleAccessSectionComponent,
  CaseHearingsListComponent,
  RestrictedCaseAccessComponent
];

export * from './allocate-a-role/allocate-a-role-link.component';
export * from './case-alert/alert.component';
export * from './case-hearings-list/case-hearings-list.component';
export * from './case-task/case-task.component';
export * from './role-access-section/role-access-section.component';
export * from './task-alert-banner/task-alert-banner.component';
