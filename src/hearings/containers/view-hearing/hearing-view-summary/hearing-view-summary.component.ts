import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConstants } from '../../../../app/app.constants';
import { UserRole } from '../../../../app/models';
import * as fromAppStore from '../../../../app/store';
import { HEARING_REQUEST_VIEW_SUMMARY_TEMPLATE } from '../../../../hearings/templates/hearing-request-view-summary.template';
import { Mode } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import { HearingsFeatureService } from '../../../services/hearings-feature.service';
import { HEARING_VIEW_ONLY_SUMMARY_TEMPLATE } from '../../../templates/hearing-view-only-summary.template';

@Component({
  selector: 'exui-hearing-viewsummary',
  templateUrl: './hearing-view-summary.component.html',
  styleUrls: ['./hearing-view-summary.component.scss']
})
export class HearingViewSummaryComponent implements OnInit {
  public template = HEARING_VIEW_ONLY_SUMMARY_TEMPLATE;
  public mode = Mode.VIEW;
  public isHearingAmendmentsEnabled$: Observable<boolean>;
  public isHearingManager$: Observable<boolean>;

  constructor(protected readonly appStore: Store<fromAppStore.State>,
    private readonly router: Router,
    private readonly hearingsFeatureService: HearingsFeatureService,
    private readonly hearingsService: HearingsService,
  ) { }

  public ngOnInit(): void {
    this.isHearingAmendmentsEnabled$ = this.hearingsFeatureService.isFeatureEnabled(AppConstants.FEATURE_NAMES.enableHearingAmendments);

    this.isHearingManager$ = this.appStore.pipe(select(fromAppStore.getUserDetails)).pipe(
      map((userDetails) => userDetails?.userInfo?.roles.includes(UserRole.HearingManager))
    );

    combineLatest([this.isHearingAmendmentsEnabled$, this.isHearingManager$])
      .subscribe(([isHearingAmendmentsEnabled, isHearingManager]) => {
        if (isHearingAmendmentsEnabled && isHearingManager) {
          this.hearingsService.propertiesUpdatedAutomatically = { pageless: {}, withinPage: {} };
          this.hearingsService.propertiesUpdatedOnPageVisit = null;
          this.template = HEARING_REQUEST_VIEW_SUMMARY_TEMPLATE;
        }
      });
  }

  public onEdit(): void {
    this.router.navigateByUrl('/hearings/request/hearing-edit-summary');
  }
}
