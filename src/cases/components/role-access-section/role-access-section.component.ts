import { Component, Input } from '@angular/core';
import { CaseView } from '@hmcts/ccd-case-ui-toolkit';

import { CaseRole, RoleCategory } from '../../../role-access/models';
import { Params } from '@angular/router';

@Component({
  selector: 'exui-role-access-section',
  templateUrl: './role-access-section.component.html'
})
export class RoleAccessSectionComponent {
  @Input() public title: string;
  @Input() public roles: CaseRole [];
  @Input() public caseDetails: CaseView;
  @Input() public showAllocateRoleLink = false;
  @Input() public roleRouterLink: string;
  @Input() public roleQueryParams: Params;
  @Input() public roleCategory: RoleCategory;
  @Input() public showAllocate: boolean;
  @Input() public linkText = 'Allocate a role';
  @Input() public existingUsers: string[];
}
