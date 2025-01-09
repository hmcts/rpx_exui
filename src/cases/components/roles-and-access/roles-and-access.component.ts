import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CaseNotifier, CaseView } from '@hmcts/ccd-case-ui-toolkit';

import { CaseRole, RoleCategory, RoleExclusion } from '../../../role-access/models';
import { Caseworker } from '../../../work-allocation/models/dtos';

@Component({
  selector: 'exui-roles-and-access',
  templateUrl: './roles-and-access.component.html'
})
export class RolesAndAccessComponent implements OnInit, OnChanges {
  public exclusionsNotNamed = false;
  public legalRolesNotNamed = false;
  public ctscRolesNotNamed = false;
  public adminRolesNotNamed = false;
  public legalOpsRoles: CaseRole[] = [];
  public ctscRoles: CaseRole[] = [];
  public adminRoles: CaseRole[] = [];
  public namedLegalRoles: CaseRole[];
  public namedAdminRoles: CaseRole[];
  public existingAdminUsers: string[];
  public existingCTSCUsers: string[];
  public namedCTSCRoles: CaseRole[];
  public judicialRoles: CaseRole[] = [];
  public namedExclusions: RoleExclusion[];
  public legalOps = RoleCategory.LEGAL_OPERATIONS;
  public judicial = RoleCategory.JUDICIAL;
  public caseId: string;
  public jurisdiction: string;

  @Input() public exclusions: RoleExclusion[] = [];
  @Input() public showAllocateRoleLink: boolean = false;
  @Input() public caseDetails: CaseView;
  @Input() public caseworkers: Caseworker[];

  private pRoles: CaseRole[] = [];
  public jurisdictionFieldId = '[JURISDICTION]';
  public showLegalOpsAllocate: boolean;

  public get roles(): CaseRole[] {
    return this.pRoles;
  }

  @Input()
  public set roles(value: CaseRole[]) {
    this.pRoles = value;
    if (this.roles) {
      this.legalOpsRoles = this.roles.filter((role) => role.roleCategory === RoleCategory.LEGAL_OPERATIONS);
      this.judicialRoles = this.roles.filter((role) => role.roleCategory === RoleCategory.JUDICIAL);
      this.adminRoles = this.roles.filter((role) => role.roleCategory === RoleCategory.ADMIN);
      this.ctscRoles = this.roles.filter((role) => role.roleCategory === RoleCategory.CTSC);
    }
    // Get unique array of existing admin user id's
    this.existingAdminUsers = [... new Set(this.adminRoles.map((ar) => ar.actorId))];
    // Get unique array of existing CTSC user id's
    this.existingCTSCUsers = [... new Set(this.ctscRoles.map((ar) => ar.actorId))];

    this.showLegalOpsAllocate = this.showAllocateRoleLink && this.legalOpsRoles.length === 0;
  }

  constructor(
    private readonly caseNotifier: CaseNotifier) {}

  public ngOnInit(): void {
    this.caseId = this.caseDetails.case_id;
    const jurisdictionField = this.caseDetails.metadataFields.find((field) => field.id === this.jurisdictionFieldId);
    if (jurisdictionField) {
      this.jurisdiction = jurisdictionField.value;
    }
  }

  public removeCashedCase(): void {
    this.caseNotifier.removeCachedCase();
  }

  public ngOnChanges(): void {
    // All of the below is in order to ensure the name is shown for roles if present
    // if not present this will be ignored
    if (this.legalOpsRoles && this.legalOpsRoles.length > 0 && !this.legalOpsRoles[0].name) {
      // checking one name will reveal whether caseworker names are available
      this.legalRolesNotNamed = true;
    }
    if (this.ctscRoles && this.ctscRoles.length > 0 && !this.ctscRoles[0].name) {
      // checking one name will reveal whether caseworker names are available
      this.ctscRolesNotNamed = true;
    }
    if (this.adminRoles && this.adminRoles.length > 0 && !this.adminRoles[0].name) {
      // checking one name will reveal whether caseworker names are available
      this.adminRolesNotNamed = true;
    }
    if (this.exclusions && this.exclusions.length > 0) {
      for (const exclusion of this.exclusions) {
        // some exclusions are judicial so this checks whether any exclusion is missing a name
        if (exclusion.userType === RoleCategory.LEGAL_OPERATIONS || exclusion.userType === RoleCategory.ADMIN || exclusion.userType === RoleCategory.CTSC) {
          if (!exclusion.name) {
            this.exclusionsNotNamed = true;
          } else {
            break;
          }
        }
      }
    }
    if (this.caseworkers && this.legalOpsRoles && this.legalOpsRoles.length > 0) {
      this.namedLegalRoles = this.checkSetNamedRoles(this.legalOpsRoles, this.legalRolesNotNamed);
    }
    if (this.caseworkers && this.exclusions && this.exclusions.length > 0) {
      this.namedExclusions = this.checkSetNamedRoles(this.exclusions, this.exclusionsNotNamed);
    }
    if (this.caseworkers && this.ctscRoles && this.ctscRoles.length > 0) {
      this.namedCTSCRoles = this.checkSetNamedRoles(this.ctscRoles, this.ctscRolesNotNamed);
    }
    if (this.caseworkers && this.adminRoles && this.adminRoles.length > 0) {
      this.namedAdminRoles = this.checkSetNamedRoles(this.adminRoles, this.adminRolesNotNamed);
    }
  }

  private checkSetNamedRoles(roles: any[], notNamed: boolean): any[] {
    if (notNamed) {
      roles.forEach(
        (role) => {
          const caseWorker = this.caseworkers.find((caseworker) => caseworker.idamId === role.actorId);
          if (caseWorker) {
            role.name = `${caseWorker.firstName} ${caseWorker.lastName}`;
          }
        }
      );
    }
    return roles;
  }
}
