import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CaseworkerDataService, WASupportedJurisdictionsService } from '../../../work-allocation/services';
import { RoleCategory } from '../../models';
import { RejectionReasonText } from '../../models/enums/answer-text';
import { AllocateRoleService } from '../../services';

@Component({
  selector: 'exui-rejected-request',
  templateUrl: './rejected-request-view.component.html'
})
export class RejectedRequestViewComponent implements OnInit {
  public caseName: string;
  public caseReference: string;
  public jurisdiction: string;
  public roleCategory: RoleCategory;
  public dateSubmitted: string;
  public accessReason: string;

  public dateRejected: string;
  public reviewer: string;
  public reviewReason: string;
  public reviewerName: string;
  public reviewerRole: string;
  public endDate: string;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly waSupportedJurisdictionsService: WASupportedJurisdictionsService,
              private readonly caseworkerDataService: CaseworkerDataService,
              private readonly allocateRoleService: AllocateRoleService) {
    this.caseName = this.route.snapshot.queryParams && this.route.snapshot.queryParams.caseName ?
      this.route.snapshot.queryParams.caseName : '';
    this.caseReference = this.route.snapshot.queryParams && this.route.snapshot.queryParams.caseReference ?
      this.route.snapshot.queryParams.caseReference : '';
    this.roleCategory = this.route.snapshot.queryParams && this.route.snapshot.queryParams.reviewerRoleCategory ?
      this.route.snapshot.queryParams.reviewerRoleCategory : '';
    this.jurisdiction = this.route.snapshot.queryParams && this.route.snapshot.queryParams.jurisdiction ?
      this.route.snapshot.queryParams.jurisdiction : '';
    this.dateSubmitted = this.route.snapshot.queryParams && this.route.snapshot.queryParams.dateSubmitted ?
      this.route.snapshot.queryParams.dateSubmitted : '';
    this.accessReason = this.route.snapshot.queryParams && this.route.snapshot.queryParams.specificAccessReason ?
      this.route.snapshot.queryParams.specificAccessReason : '';

    this.dateRejected = this.route.snapshot.queryParams && this.route.snapshot.queryParams.dateRejected ?
      this.route.snapshot.queryParams.dateRejected : '';
    this.reviewer = this.route.snapshot.queryParams && this.route.snapshot.queryParams.reviewer ?
      this.route.snapshot.queryParams.reviewer : '';
    this.reviewReason = this.route.snapshot.queryParams && this.route.snapshot.queryParams.infoRequired ?
      this.getRejectReason(JSON.parse(this.route.snapshot.queryParams.infoRequired), this.route.snapshot.queryParams.infoRequiredComment)
      : 'No reason for rejection found';
    this.endDate = this.route.snapshot.queryParams && this.route.snapshot.queryParams.endDate ?
      this.route.snapshot.queryParams.endDate : '';
  }

  public ngOnInit(): void {
    if (!this.reviewer) {
      return;
    }
    if (this.roleCategory === RoleCategory.JUDICIAL) {
      this.allocateRoleService.getCaseRolesUserDetails([this.reviewer], [this.jurisdiction]).subscribe(
        (caseRoleUserDetails) => {
          this.reviewerName = caseRoleUserDetails[0].full_name;
        }
      );
    } else {
      this.waSupportedJurisdictionsService.getWASupportedJurisdictions().subscribe((services) => {
        this.caseworkerDataService.getUsersFromServices(services).subscribe(
          (caseworkers) => {
            const caseworker = caseworkers.find((thisCaseworker) => thisCaseworker.idamId === this.reviewer);
            if (caseworker) {
              this.reviewerName = `${caseworker.firstName} ${caseworker.lastName}`;
            }
          });
      });
    }
  }

  public onBack(): void {
    window.history.back();
  }

  public async goToRequest(): Promise<void> {
    const requestUrl = `/cases/case-details/${this.caseReference}/specific-access-request`;
    await this.router.navigate([requestUrl]);
  }

  public getRejectReason(infoRequired: boolean, infoRequiredComment: string): string {
    return infoRequired ?
      infoRequiredComment ? infoRequiredComment : RejectionReasonText.MoreInformation :
      RejectionReasonText.Rejected;
  }
}
