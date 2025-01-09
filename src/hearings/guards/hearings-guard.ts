import { Injectable } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConstants } from '../../app/app.constants';
import { SessionStorageService } from '../../app/services';
import * as fromAppStore from '../../app/store';
import { FeatureVariation } from '../../cases/models/feature-variation.model';
import { Utils } from '../../cases/utils/utils';

@Injectable()
export class HearingsGuard {
  public static CASE_INFO: string = 'caseInfo';
  public static JURISDICTION: string = 'jurisdiction';
  public static CASE_TYPE: string = 'caseType';
  public static DEFAULT_URL: string = '/cases';
  public userRoles$: Observable<string[]>;
  protected featureName: string;

  constructor(protected readonly appStore: Store<fromAppStore.State>,
              protected readonly sessionStorageService: SessionStorageService,
              protected readonly featureToggleService: FeatureToggleService) {
    this.userRoles$ = this.appStore.pipe(select(fromAppStore.getUserDetails)).pipe(
      map((userDetails) => userDetails.userInfo.roles)
    );
    this.featureName = AppConstants.FEATURE_NAMES.mcHearingsFeature;
  }

  public hasMatchedPermissions(): Observable<boolean> {
    let jurisdiction: string;
    let caseType: string;
    return this.featureToggleService.getValueOnce<FeatureVariation[]>(this.featureName, []).pipe(
      map((featureVariations: FeatureVariation[]) => {
        const caseInfo = JSON.parse(this.sessionStorageService.getItem(HearingsGuard.CASE_INFO));
        if (caseInfo?.hasOwnProperty(HearingsGuard.JURISDICTION)) {
          jurisdiction = caseInfo[HearingsGuard.JURISDICTION];
        }
        if (caseInfo?.hasOwnProperty(HearingsGuard.CASE_TYPE)) {
          caseType = caseInfo[HearingsGuard.CASE_TYPE];
        }
        if (!jurisdiction || !caseType) {
          return false;
        }
        return featureVariations.some((featureVariation) => Utils.hasMatchedJurisdictionAndCaseType(featureVariation, jurisdiction, caseType));
      })
    );
  }
}
