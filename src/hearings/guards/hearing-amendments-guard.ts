import { Injectable } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { SessionStorageService } from '../../app/services';
import * as fromAppStore from '../../app/store';
import { HearingsGuard } from './hearings-guard';
import { AppConstants } from '../../app/app.constants';

import { Observable } from 'rxjs';

@Injectable()
export class HearingAmendmentsGuard extends HearingsGuard {
  constructor(protected readonly appStore: Store<fromAppStore.State>,
    protected readonly sessionStorageService: SessionStorageService,
    protected readonly featureToggleService: FeatureToggleService) {
    super(appStore, sessionStorageService, featureToggleService);

    // featureName initialization should be called after the super
    this.featureName = AppConstants.FEATURE_NAMES.enableHearingAmendments;
  }

  canActivate(): Observable<boolean> {
    return super.hasMatchedPermissions();
  }
}
