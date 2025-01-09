import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { CaseRole, RoleCategory, TypeOfRole } from '../../role-access/models';

@Directive({
  selector: '[exuiShowAllocateLink]'
})
export class ShowAllocateLinkDirective implements OnInit {
  private static readonly CASE_MANAGERS_LIMIT = 1;
  @Input() public showAllocateRoleLink: boolean = false;
  @Input() public roles: CaseRole[];
  @Input() public roleCategory: RoleCategory;
  @Input() public existingUsers: string[] = [];

  constructor(private readonly element: ElementRef<HTMLElement>) {}

  private static canDisplayLink(roles: CaseRole[], roleCategory: RoleCategory, showAllocateRoleLink: boolean): boolean {
    const show = false;
    if (!showAllocateRoleLink || roleCategory === RoleCategory.LEGAL_OPERATIONS && ShowAllocateLinkDirective.hasExceededNumberCaseManagerRoles(roles)) {
      return show;
    }
    return true;
  }

  private static hasExceededNumberCaseManagerRoles(roles: CaseRole[]): boolean {
    const caseManagers = roles.filter((role: CaseRole) => role.roleName.toLowerCase() === TypeOfRole.CaseManager.toLowerCase());
    return caseManagers.length >= ShowAllocateLinkDirective.CASE_MANAGERS_LIMIT;
  }

  public ngOnInit(): void {
    if (!ShowAllocateLinkDirective.canDisplayLink(this.roles, this.roleCategory, this.showAllocateRoleLink)) {
      const host = this.element.nativeElement;
      host.style.display = 'none';
    }
  }
}
