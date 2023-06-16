import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivityService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppConstants } from '../../app/app.constants';

@Injectable()
export class ActivityResolver implements Resolve<boolean> {
  constructor(
    private readonly activityService: ActivityService,
    private readonly featureToggleService: FeatureToggleService
  ) {
    this.featureToggleService.getValue<string>(AppConstants.ACTIVITY_TRACKER_MODE, undefined)
      .pipe(filter((mode) => !!mode))
      .subscribe((mode) => {
        this.activityService.mode = ActivityService.MODES[mode] || ActivityService.MODES.off;
        if (this.activityService.mode !== ActivityService.MODES.off) {
          this.activityService.verifyUserIsAuthorized();
        }
      });
  }

  public resolve(): Observable<boolean> {
    return of(this.activityService.mode !== ActivityService.MODES.off);
  }
}
