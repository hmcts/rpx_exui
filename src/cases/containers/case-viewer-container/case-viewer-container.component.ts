import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseTab, CaseView } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { combineLatest, of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppUtils } from '../../../app/app-utils';
import { AppConstants } from '../../../app/app.constants';
import { UserRole } from '../../../app/models/user-details.model';
import * as fromRoot from '../../../app/store';
import { AllocateRoleService } from '../../../role-access/services';
import { WAFeatureConfig } from '../../../work-allocation/models/common/service-config.model';
import { WASupportedJurisdictionsService } from '../../../work-allocation/services';
import { FeatureVariation } from '../../models/feature-variation.model';
import { Utils } from '../../utils/utils';
import { LoggerService } from '../../../app/services/logger/logger.service';

@Component({
  selector: 'exui-case-viewer-container',
  templateUrl: './case-viewer-container.component.html',
  styleUrls: ['./case-viewer-container.component.scss']
})
export class CaseViewerContainerComponent implements OnInit {
  public caseDetails: CaseView;
  public prependedTabs$: Observable<CaseTab[]>;
  public appendedTabs$: Observable<CaseTab[]>;
  public userRoles$: Observable<string[]>;
  private retryCount: number;
  private waDefaultServiceConfig: any = {
    'configurations': [
      {
        'caseTypes': [
          ''
        ],
        'releaseVersion': '4',
        'serviceName': ''
      },
      {
        'caseTypes': [
          'Asylum'
        ],
        'releaseVersion': '4',
        'serviceName': 'IA'
      },
      {
        'caseTypes': [
          'CIVIL',
          'GENERALAPPLICATION'
        ],
        'releaseVersion': '4',
        'serviceName': 'CIVIL'
      },
      {
        'caseTypes': [
          'PRIVATELAW',
          'PRLAPPS'
        ],
        'releaseVersion': '4',
        'serviceName': 'PRIVATELAW'
      },
      {
        'caseTypes': [
          'CriminalInjuriesCompensation'
        ],
        'releaseVersion': '4',
        'serviceName': 'ST_CIC'
      },
      {
        'caseTypes': [
          'ET_EnglandWales',
          'ET_Scotland',
          'ET_EnglandWales_Multiple',
          'ET_Scotland_Multiple'
        ],
        'releaseVersion': '4',
        'serviceName': 'EMPLOYMENT'
      },
      {
        'caseTypes': [
          'Benefit',
          'SSCS_ExceptionRecord'
        ],
        'releaseVersion': '4',
        'serviceName': 'SSCS'
      },
      {
        'caseTypes': [
          'CARE_SUPERVISION_EPO'
        ],
        'releaseVersion': '4',
        'serviceName': 'PUBLICLAW'
      }
    ]
  };

  private readonly prependedTabs: CaseTab[] = [
    {
      id: 'tasks',
      label: 'Tasks',
      fields: [],
      show_condition: null
    },
    {
      id: 'roles-and-access',
      label: 'Roles and access',
      fields: [],
      show_condition: null
    }
  ];

  private readonly appendedTabs: CaseTab[] = [
    {
      id: 'hearings',
      label: 'Hearings',
      fields: [],
      show_condition: null
    }
  ];

  constructor(private readonly route: ActivatedRoute,
    private readonly store: Store<fromRoot.State>,
    private readonly featureToggleService: FeatureToggleService,
    private readonly allocateRoleService: AllocateRoleService,
    private readonly loggerService: LoggerService,
    private readonly waService: WASupportedJurisdictionsService) {
    this.userRoles$ = this.store.pipe(select(fromRoot.getUserDetails)).pipe(
      map((userDetails) => userDetails?.userInfo?.roles)
    );
  }

  private enablePrependedTabs(features: WAFeatureConfig, userRoles: string[], supportedServices: string[], excludedRoles: string[]): boolean {
    const caseJurisdiction = this.caseDetails && this.caseDetails.case_type && this.caseDetails.case_type.jurisdiction ? this.caseDetails.case_type.jurisdiction.id : null;
    const caseType = this.caseDetails && this.caseDetails.case_type ? this.caseDetails.case_type.id : null;
    let requiredFeature = false;
    features.configurations.forEach((serviceConfig) => {
      if (serviceConfig.serviceName === caseJurisdiction && serviceConfig.caseTypes.includes(caseType)) {
        // EUI-724 - Needed as separator between WA and non-WA services/case types
        requiredFeature = parseFloat(serviceConfig.releaseVersion) >= 2;
      }
    });
    return requiredFeature && !!AppUtils.getUserRole(userRoles) && !!AppUtils.showWATabs(supportedServices, caseJurisdiction, userRoles, excludedRoles);
  }

  public ngOnInit(): void {
    this.caseDetails = this.route.snapshot.data.case as CaseView;
    this.retryCount = 0;
    this.allocateRoleService.manageLabellingRoleAssignment(this.caseDetails.case_id).subscribe();
    let noOfUserRoles = 0;
    this.userRoles$.subscribe((userRoles) => {
      noOfUserRoles = userRoles?.length ?? 0;
      if (noOfUserRoles === 0 && this.retryCount < 3) {
        this.retryCount++;
        this.loggerService.log('case-viewer-container - userRoles length is null or undefined or 0 so calling LoadUserDetails.  Retry count: ', this.retryCount);
        this.store.dispatch(new fromRoot.LoadUserDetails(true));
      } else {
        this.setPrependedCaseViewTabs();
        this.setAppendedCaseViewTabs();
      }
    });
  }

  private setPrependedCaseViewTabs(): void {
    combineLatest([
      this.featureToggleService.getValue(AppConstants.FEATURE_NAMES.waServiceConfig, this.waDefaultServiceConfig),
      this.userRoles$,
      this.waService.getWASupportedJurisdictions(),
      this.featureToggleService.getValue(AppConstants.FEATURE_NAMES.excludedRolesForCaseTabs, [])
    ]).pipe(
      map(([feature, userRoles, supportedServices, excludedRoles]: [WAFeatureConfig, string[], string[], string[]]) =>
        this.enablePrependedTabs(feature, userRoles, supportedServices, excludedRoles) ? this.prependedTabs : []
      ),
      catchError((error) => {
        this.loggerService.log('case-viewer-container - Error in setPrependedCaseViewTabs', error);
        return of([]);
      })
    ).subscribe((tabs) => {
      this.prependedTabs$ = of(tabs);
    });
  }

  private setAppendedCaseViewTabs(): void {
    combineLatest([
      this.featureToggleService.getValueOnce<FeatureVariation[]>(AppConstants.FEATURE_NAMES.mcHearingsFeature, []),
      this.userRoles$
    ]).pipe(
      map(([featureVariations, userRoles]) => {
        const jurisdictionId = this.caseDetails.case_type.jurisdiction.id;
        const caseTypeId = this.caseDetails.case_type.id;
        const hasMatchedPermissions = featureVariations.some((featureVariation) =>
          Utils.hasMatchedJurisdictionAndCaseType(featureVariation, jurisdictionId, caseTypeId)
        );
        const hasHearingRole = userRoles.includes(UserRole.HearingViewer) ||
          userRoles.includes(UserRole.ListedHearingViewer) ||
          userRoles.includes(UserRole.HearingManager);
        return (hasMatchedPermissions && hasHearingRole) ? this.appendedTabs : [];
      })
    ).subscribe((tabs) => {
      this.appendedTabs$ = of(tabs);
    });
  }
}
