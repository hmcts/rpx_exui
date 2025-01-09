import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CaseRole, RoleCategory } from '../../../role-access/models';
import { Params } from '@angular/router';

@Component({
  selector: 'exui-allocate-a-role-link',
  templateUrl: './allocate-a-role-link.component.html',
  styleUrls: ['./allocate-a-role-link.component.scss']
})

export class AllocateARoleLinkComponent implements OnInit, OnChanges {
    @Input() public routerLink: string;
    @Input() public queryParams: Params = {};
    @Input() public showAllocateRoleLink = false;
    @Input() public roles: CaseRole[] = [];
    @Input() public roleCategory: RoleCategory;
    @Input() public linkText: string;
    @Input() public existingUsers: string[];

    public ngOnInit(): void {
      this.addExistingUsersToQueryParams(this.existingUsers);
    }

    public ngOnChanges(): void {
      this.addExistingUsersToQueryParams(this.existingUsers);
    }

    public addExistingUsersToQueryParams(existingUsers: string[]): string[] {
      if (existingUsers && existingUsers.length > 0) {
        this.queryParams.existingUsers = existingUsers.join(',');
        return this.queryParams.existingUsers;
      }
      return [];
    }
}
