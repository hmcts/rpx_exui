import { Injectable } from '@angular/core';

import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Observable } from 'rxjs';
import { AppConstants } from '../../app/app.constants';

@Injectable()
export class RestrictedCaseAccessGuard {
  constructor(private readonly featureToggleService: FeatureToggleService) {
  }

  public canActivate(): Observable<boolean> {
    return this.featureToggleService.getValueOnce<boolean>(AppConstants.FEATURE_NAMES.enableRestrictedCaseAccess, false);
  }
}
