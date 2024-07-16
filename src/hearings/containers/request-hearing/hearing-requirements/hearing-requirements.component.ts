import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { LoggerService } from '../../../../app/services/logger/logger.service';
import * as fromHearingStore from '../../../../hearings/store';
import { ValidatorsUtils } from '../../../../hearings/utils/validators.utils';
import { CaseCategoryDisplayModel } from '../../../models/caseCategory.model';
import { CaseFlagGroup } from '../../../models/caseFlagGroup.model';
import { CaseFlagReferenceModel } from '../../../models/caseFlagReference.model';
import { HearingConditions, KEY_IS_INIT, KEY_MODE } from '../../../models/hearingConditions';
import { HearingRequestMainModel } from '../../../models/hearingRequestMain.model';
import { ACTION, CaseFlagType, Mode } from '../../../models/hearings.enum';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { HearingsService } from '../../../services/hearings.service';
import { LocationsDataService } from '../../../services/locations-data.service';
import { CaseFlagsUtils } from '../../../utils/case-flags.utils';
import { CaseTypesUtils } from '../../../utils/case-types.utils';
import { HearingsUtils } from '../../../utils/hearings.utils';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-requirements',
  templateUrl: './hearing-requirements.component.html'
})
export class HearingRequirementsComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public readonly caseFlagType = CaseFlagType.REASONABLE_ADJUSTMENT;

  public caseFlagsRefData: CaseFlagReferenceModel[];
  public reasonableAdjustmentFlags: CaseFlagGroup[] = [];
  public lostFocus = false;
  public referenceId: string;
  public strRegions: string;
  public caseTypeRefData: LovRefDataModel[];
  public caseTypes: CaseCategoryDisplayModel[];

  @HostListener('window:focus', ['$event'])
  public onFocus(): void {
    if (this.lostFocus) {
      this.hearingStore.dispatch(new fromHearingStore.LoadHearingValues(this.referenceId));
      if (HearingsUtils.hasPropertyAndValue(this.hearingCondition, KEY_MODE, Mode.CREATE_EDIT)
        || HearingsUtils.hasPropertyAndValue(this.hearingCondition, KEY_MODE, Mode.VIEW_EDIT)) {
        setTimeout(() => this.updatePartyFlagsFromHearingValues(), 500);
      }
      this.lostFocus = false;
    }
  }

  @HostListener('window:blur', ['$event'])
  public onBlur(): void {
    this.lostFocus = true;
  }

  constructor(private readonly loggerService: LoggerService,
              private readonly validatorsUtils: ValidatorsUtils,
              public readonly hearingStore: Store<fromHearingStore.State>,
              protected readonly hearingsService: HearingsService,
              protected readonly locationsDataService: LocationsDataService,
              protected readonly featureToggleService: FeatureToggleService,
              protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
    this.caseFlagsRefData = this.route.snapshot.data.caseFlags;
    this.caseTypeRefData = this.route.snapshot.data.caseType;
  }

  public ngOnInit(): void {
    this.setReasonableAdjustmentFlags();
    if (this.hearingListMainModel) {
      this.referenceId = this.hearingListMainModel.caseRef;
    }
    if (HearingsUtils.hasPropertyAndValue(this.hearingCondition, KEY_MODE, Mode.CREATE)
      && HearingsUtils.hasPropertyAndValue(this.hearingCondition, KEY_IS_INIT, true)
      && this.serviceHearingValuesModel) {
      this.initializeHearingCondition();
      this.initializeHearingRequestFromHearingValues();
    }
    this.caseTypes = CaseTypesUtils.getCaseCategoryDisplayModels(this.caseTypeRefData, this.serviceHearingValuesModel.caseCategories);
  }

  /**
   * Initializes hearing request from hearing values
   */
  public initializeHearingRequestFromHearingValues(): void {
    // Get hearing window from hearingRequestMainModel
    let hearingWindow = HearingsUtils.getHearingWindow(this.hearingRequestMainModel);
    // Get hearing window from serviceHearingValuesModel if null
    if (!hearingWindow && this.serviceHearingValuesModel.hearingWindow) {
      hearingWindow = this.serviceHearingValuesModel.hearingWindow;
    }
    const combinedParties: PartyDetailsModel[] = this.combinePartiesWithIndOrOrg(this.serviceHearingValuesModel.parties);

    const hearingRequestMainModel: HearingRequestMainModel = {
      hearingDetails: {
        duration: this.serviceHearingValuesModel.duration,
        hearingType: this.serviceHearingValuesModel.hearingType,
        hearingLocations: this.serviceHearingValuesModel.hearingLocations,
        hearingIsLinkedFlag: this.serviceHearingValuesModel.hearingIsLinkedFlag,
        hearingWindow: hearingWindow,
        privateHearingRequiredFlag: this.serviceHearingValuesModel.privateHearingRequiredFlag,
        panelRequirements: this.serviceHearingValuesModel.panelRequirements,
        autolistFlag: this.serviceHearingValuesModel.autoListFlag,
        hearingPriorityType: this.serviceHearingValuesModel.hearingPriorityType,
        numberOfPhysicalAttendees: this.serviceHearingValuesModel.numberOfPhysicalAttendees,
        hearingInWelshFlag: this.serviceHearingValuesModel.hearingInWelshFlag,
        facilitiesRequired: this.serviceHearingValuesModel.facilitiesRequired,
        listingComments: this.serviceHearingValuesModel.listingComments,
        hearingRequester: this.serviceHearingValuesModel.hearingRequester,
        leadJudgeContractType: this.serviceHearingValuesModel.leadJudgeContractType,
        amendReasonCodes: null,
        hearingChannels: this.serviceHearingValuesModel.hearingChannels,
        listingAutoChangeReasonCode: null
      },
      caseDetails: {
        hmctsServiceCode: this.serviceHearingValuesModel.hmctsServiceID || null,
        caseRef: this.hearingListMainModel?.caseRef || null,
        requestTimeStamp: null,
        hearingID: null,
        caseDeepLink: this.serviceHearingValuesModel.caseDeepLink,
        hmctsInternalCaseName: this.serviceHearingValuesModel.hmctsInternalCaseName,
        publicCaseName: this.serviceHearingValuesModel.publicCaseName,
        caseAdditionalSecurityFlag: this.serviceHearingValuesModel.caseAdditionalSecurityFlag,
        caseInterpreterRequiredFlag: this.serviceHearingValuesModel.caseInterpreterRequiredFlag,
        caseCategories: this.serviceHearingValuesModel.caseCategories,
        caseManagementLocationCode: this.serviceHearingValuesModel.caseManagementLocationCode,
        caserestrictedFlag: this.serviceHearingValuesModel.caserestrictedFlag,
        caseSLAStartDate: this.serviceHearingValuesModel.caseSLAStartDate,
        externalCaseReference: this.serviceHearingValuesModel.externalCaseReference
      },
      partyDetails: combinedParties
    };

    this.hearingStore.dispatch(new fromHearingStore.InitializeHearingRequest(hearingRequestMainModel));
  }

  public updatePartyFlagsFromHearingValues(): void {
    const combinedParties: PartyDetailsModel[] = this.combinePartiesWithIndOrOrg(this.serviceHearingValuesModel.parties);
    const hearingRequestMainModel: HearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      partyDetails: combinedParties
    };
    this.hearingStore.dispatch(new fromHearingStore.InitializeHearingRequest(hearingRequestMainModel));
  }

  public combinePartiesWithIndOrOrg(partyDetails: PartyDetailsModel[]): PartyDetailsModel[] {
    const combinedPartyDetails: PartyDetailsModel[] = [];

    partyDetails.forEach((partyDetail) => {
      const organisationDetails = partyDetail.organisationDetails;
      const party: PartyDetailsModel = {
        ...partyDetail,
        ...organisationDetails && ({ organisationDetails })
      };
      combinedPartyDetails.push(party);
    });
    return combinedPartyDetails;
  }

  public initializeHearingCondition(): void {
    if (this.serviceHearingValuesModel?.hearingLocations) {
      const strLocationIds = this.serviceHearingValuesModel.hearingLocations.map((location) => location.locationId).join(',');
      this.locationsDataService.getLocationById(strLocationIds).toPromise()
        .then((locations) => {
          this.strRegions = locations.map((location) => location.region_id).join(',');
        }).then(() => {
          const hearingCondition: HearingConditions = {
            isInit: false,
            regionId: this.strRegions
          };
          this.hearingStore.dispatch(new fromHearingStore.SaveHearingConditions(hearingCondition));
        }).catch((err) => this.loggerService.error(err));
    }
  }

  protected executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
      const propertiesUpdatedOnPageVisit = this.hearingsService.propertiesUpdatedOnPageVisit;
      if (this.hearingCondition.mode === Mode.VIEW_EDIT &&
          propertiesUpdatedOnPageVisit?.hasOwnProperty('caseFlags') &&
          (propertiesUpdatedOnPageVisit?.afterPageVisit.reasonableAdjustmentChangesRequired || propertiesUpdatedOnPageVisit?.afterPageVisit?.partyDetailsChangesRequired)) {
        // Hearings manual amendment journey is enabled and there are changes to reasonable adjustment flags detected
        this.prepareHearingRequestData();
      }
    }
    super.navigateAction(action);
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy() {
    super.unsubscribe();
  }

  private prepareHearingRequestData() {
    const combinedParties: PartyDetailsModel[] = this.combinePartiesWithIndOrOrg(this.hearingsService.propertiesUpdatedOnPageVisit.parties);
    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      partyDetails: combinedParties
    };
    if (this.hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesRequired) {
      this.hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.reasonableAdjustmentChangesConfirmed = true;
    }
  }

  private setReasonableAdjustmentFlags(): void {
    const propertiesUpdatedOnPageVisit = this.hearingsService.propertiesUpdatedOnPageVisit;
    if (this.hearingCondition.mode === Mode.VIEW_EDIT &&
        propertiesUpdatedOnPageVisit?.hasOwnProperty('caseFlags') &&
        (propertiesUpdatedOnPageVisit?.afterPageVisit.reasonableAdjustmentChangesRequired || propertiesUpdatedOnPageVisit?.afterPageVisit.partyDetailsChangesRequired)) {
      // Hearings manual amendment journey is enabled and there are changes to reasonable adjustment flags detected
      const partyDetails = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.reasonableAdjustmentChangesConfirmed
        ? this.hearingRequestMainModel.partyDetails
        : this.hearingRequestToCompareMainModel.partyDetails;
      this.reasonableAdjustmentFlags = CaseFlagsUtils.getReasonableAdjustmentFlags(this.caseFlagsRefData,
        propertiesUpdatedOnPageVisit.caseFlags?.flags, partyDetails, this.serviceHearingValuesModel.parties);
    } else {
      // Hearings manual amendment journey is NOT enabled
      this.reasonableAdjustmentFlags = CaseFlagsUtils.displayCaseFlagsGroup(this.serviceHearingValuesModel?.caseFlags?.flags,
        this.caseFlagsRefData, this.caseFlagType);
    }
  }
}
