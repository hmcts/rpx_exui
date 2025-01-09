import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConstants } from '../../../../app/app.constants';
import { UserRole } from '../../../../app/models';
import * as fromAppStore from '../../../../app/store';
import { ACTION, Mode } from '../../../models/hearings.enum';
import { Section } from '../../../models/section';
import { HearingsFeatureService } from '../../../services/hearings-feature.service';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { HEARING_REQUEST_VIEW_SUMMARY_TEMPLATE } from '../../../templates/hearing-request-view-summary.template';
import { HEARING_VIEW_ONLY_SUMMARY_TEMPLATE } from '../../../templates/hearing-view-only-summary.template';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-viewsummary',
  templateUrl: './hearing-view-summary.component.html',
  styleUrls: ['./hearing-view-summary.component.scss']
})
export class HearingViewSummaryComponent extends RequestHearingPageFlow implements OnInit {
  public template: Section[];
  public mode = Mode.VIEW;
  public isHearingAmendmentsEnabled$: Observable<boolean>;
  public isHearingManager$: Observable<boolean>;

  constructor(protected readonly appStore: Store<fromAppStore.State>,
    private readonly router: Router,
    private readonly hearingsFeatureService: HearingsFeatureService,
    protected readonly hearingsService: HearingsService,
    protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly featureToggleService: FeatureToggleService,
    protected readonly route: ActivatedRoute
  ) {
    super(hearingStore, hearingsService, featureToggleService, route);
  }

  public ngOnInit(): void {
    this.isHearingAmendmentsEnabled$ = this.hearingsFeatureService.isFeatureEnabled(AppConstants.FEATURE_NAMES.enableHearingAmendments);

    this.isHearingManager$ = this.appStore.pipe(select(fromAppStore.getUserDetails)).pipe(
      map((userDetails) => userDetails?.userInfo?.roles.includes(UserRole.HearingManager))
    );

    combineLatest([this.isHearingAmendmentsEnabled$, this.isHearingManager$])
      .subscribe(([isHearingAmendmentsEnabled, isHearingManager]) => {
        this.template = isHearingAmendmentsEnabled && isHearingManager
          ? HEARING_REQUEST_VIEW_SUMMARY_TEMPLATE
          : HEARING_VIEW_ONLY_SUMMARY_TEMPLATE;
      });
  }

  public onEdit(): void {
    this.router.navigate(['/', 'hearings', 'request', 'hearing-edit-summary']);
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.BACK) {
      // Navigate to the hearings tab
      this.router.navigate(['/', 'cases', 'case-details', this.hearingRequestMainModel.caseDetails.caseRef, 'hearings']);
    }
  }
}
