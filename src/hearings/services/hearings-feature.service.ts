import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionStorageService } from '../../app/services';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { FeatureVariation } from '../../cases/models/feature-variation.model';
import { Utils } from '../../cases/utils/utils';

@Injectable()
export class HearingsFeatureService {
  public static CASE_INFO: string = 'caseInfo';
  public static JURISDICTION: string = 'jurisdiction';
  public static CASE_TYPE: string = 'caseType';

  constructor(protected readonly sessionStorageService: SessionStorageService,
    protected readonly featureToggleService: FeatureToggleService) {}

  public isFeatureEnabled(featureName: string): Observable<boolean> {
    let jurisdiction: string;
    let caseType: string;

    return this.featureToggleService.getValueOnce<FeatureVariation[]>(featureName, []).pipe(
      map((featureVariations: FeatureVariation[]) => {
        const caseInfo = JSON.parse(this.sessionStorageService.getItem(HearingsFeatureService.CASE_INFO));
        if (caseInfo?.hasOwnProperty(HearingsFeatureService.JURISDICTION)) {
          jurisdiction = caseInfo[HearingsFeatureService.JURISDICTION];
        }
        if (caseInfo?.hasOwnProperty(HearingsFeatureService.CASE_TYPE)) {
          caseType = caseInfo[HearingsFeatureService.CASE_TYPE];
        }
        if (!jurisdiction || !caseType) {
          return false;
        }
        return featureVariations.some((featureVariation) => Utils.hasMatchedJurisdictionAndCaseType(featureVariation, jurisdiction, caseType));
      })
    );
  }
}
