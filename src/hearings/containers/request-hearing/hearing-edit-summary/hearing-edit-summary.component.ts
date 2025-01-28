import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConstants } from '../../../../app/app.constants';
import { CaseCategoryModel } from '../../../models/caseCategory.model';
import { AfterPageVisitProperties, AutoUpdateMode, PagelessPropertiesEnum, WithinPagePropertiesEnum } from '../../../models/hearingsUpdateMode.enum';
import { ServiceHearingValuesModel } from '../../../models/serviceHearingValues.model';
import { CaseFlagsUtils } from '../../../utils/case-flags.utils';
import { CaseFlagReferenceModel } from '../../../models/caseFlagReference.model';
import { EditHearingChangeConfig } from '../../../models/editHearingChangeConfig.model';
import { HearingConditions } from '../../../models/hearingConditions';
import { hearingStatusMappings } from '../../../models/hearingStatusMappings';
import {
  ACTION,
  CategoryType,
  HearingDateEnum,
  HearingScreensEnum,
  HearingTemplate,
  LaCaseStatus,
  Mode,
  PartyType
} from '../../../models/hearings.enum';
import { JudicialUserModel } from '../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { HearingsFeatureService } from '../../../services/hearings-feature.service';
import { HearingsService } from '../../../services/hearings.service';
import { LocationsDataService } from '../../../services/locations-data.service';
import * as fromHearingStore from '../../../store';
import { HearingsUtils } from '../../../utils/hearings.utils';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';
import { UnavailabilityRangeModel } from '../../../models/unavailabilityRange.model';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'exui-hearing-edit-summary',
  templateUrl: './hearing-edit-summary.component.html'
})
export class HearingEditSummaryComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  private readonly notUpdatedMessage = 'The request has not been updated';

  public readonly REGION_ID = '7';
  public readonly LANGUAGE_INTERPRETER_FLAG_ID = 'PF0015';
  public caseReference: string;
  public status: string;
  public requestSubmittedDate: string;
  public responseReceivedDate: string;
  public caseStatus: string;
  public isHearingListed: boolean;
  public showLanguageRequirementsSection$: Observable<boolean>;
  public hearingValuesSubscription: Subscription;
  public featureToggleServiceSubscription: Subscription;
  public validationErrors: { id: string, message: string }[] = [];
  public additionalFacilitiesRefData: LovRefDataModel[];
  public caseFlagsRefData: CaseFlagReferenceModel[];
  public caseTypeRefData: LovRefDataModel[];
  public hearingPrioritiesRefData: LovRefDataModel[];
  public hearingStageOptionsRefData: LovRefDataModel[];
  public judgeTypesRefData: LovRefDataModel[];
  public judicialUsers: JudicialUserModel[];
  public partyChannelsRefData: LovRefDataModel[];
  public partySubChannelsRefData: LovRefDataModel[];
  public panelRolesRefData: LovRefDataModel[];
  public isHearingAmendmentsEnabled: boolean;
  public hearingTemplate = HearingTemplate;
  public isPagelessAttributeChanged: boolean;
  public isWithinPageAttributeChanged: boolean;
  public pageVisitChangeExists: boolean;
  public afterPageVisit: AfterPageVisitProperties;
  public sectionsToDisplay: string[];
  public hearingScreenEnum = HearingScreensEnum;

  constructor(private readonly router: Router,
    private readonly locationsDataService: LocationsDataService,
    protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly hearingsService: HearingsService,
    protected readonly featureToggleService: FeatureToggleService,
    protected readonly hearingsFeatureService: HearingsFeatureService,
    protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
    this.additionalFacilitiesRefData = this.route.snapshot.data.additionFacilitiesOptions;
    this.caseFlagsRefData = this.route.snapshot.data.caseFlags;
    this.caseTypeRefData = this.route.snapshot.data.caseType;
    this.hearingPrioritiesRefData = this.route.snapshot.data.hearingPriorities;
    this.hearingStageOptionsRefData = this.route.snapshot.data.hearingStageOptions;
    this.judgeTypesRefData = this.route.snapshot.data.judgeTypes;
    this.judicialUsers = this.route.snapshot.data.judicialUsers;
    this.partyChannelsRefData = this.route.snapshot.data.partyChannels;
    this.partySubChannelsRefData = this.route.snapshot.data.partySubChannels;
    this.panelRolesRefData = this.route.snapshot.data.otherPanelRoles;
  }

  public ngOnInit(): void {
    this.caseReference = String(this.hearingRequestMainModel.caseDetails.caseRef).replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
    this.status = hearingStatusMappings.find((mapping) => mapping.hmcStatus === this.hearingRequestMainModel.requestDetails?.status)?.exuiDisplayStatus || '';
    this.requestSubmittedDate = moment(this.hearingRequestMainModel?.requestDetails?.timestamp)?.format(HearingDateEnum.DisplayMonth) || '';
    this.responseReceivedDate = moment(this.hearingRequestMainModel.hearingResponse?.receivedDateTime).format(HearingDateEnum.DisplayMonth) || '';
    this.caseStatus = this.hearingRequestMainModel.hearingResponse?.laCaseStatus || '';
    this.isHearingListed = this.caseStatus === LaCaseStatus.LISTED;
    this.hearingsService.hearingRequestForSubmitValid = false;
    this.sectionsToDisplay = HearingsUtils.checkScreensForHearingRequiremnts(
      this.serviceHearingValuesModel?.screenFlow.map((screen) => screen.screenName),
      this.hearingRequestMainModel?.hearingDetails?.isAPanelFlag);
    const locationIds = this.hearingRequestMainModel.hearingDetails.hearingLocations?.map((location) => location.locationId).join(',');
    this.showLanguageRequirementsSection$ = this.locationsDataService.getLocationById(locationIds).pipe(
      map((locations) => {
        return locations.some((location) => location.region_id === this.REGION_ID);
      })
    );

    // Enable hearings manual amendments journey only if the feature is toggled on
    this.featureToggleServiceSubscription = this.hearingsFeatureService.isFeatureEnabled(AppConstants.FEATURE_NAMES.enableHearingAmendments).subscribe((enabled: boolean) => {
      this.isHearingAmendmentsEnabled = enabled;
      if (enabled) {
        this.setPropertiesUpdatedAutomatically();
      }
    });
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
    this.hearingValuesSubscription?.unsubscribe();
    this.featureToggleServiceSubscription?.unsubscribe();
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.BACK) {
      this.router.navigate(['/', 'hearings', 'request', 'hearing-view-summary']);
    } else {
      if (action === ACTION.VIEW_EDIT_REASON) {
        this.hearingsService.displayValidationError = false;
        this.validationErrors = [];
        if (!this.hasHearingRequestObjectChanged()) {
          this.validationErrors = [{ id: 'no-update', message: this.notUpdatedMessage }];
          window.scrollTo({ top: 0, left: 0 });
          return;
        }
        if (this.pageVisitChangesNotConfirmed()) {
          this.hearingsService.displayValidationError = true;
          return;
        }
        super.navigateAction(action);
      }
    }
  }

  public onChange(event: EditHearingChangeConfig): void {
    const hearingCondition: HearingConditions = {
      fragmentId: event.fragmentId,
      mode: Mode.VIEW_EDIT,
      isHearingAmendmentsEnabled: this.isHearingAmendmentsEnabled
    };
    this.hearingStore.dispatch(new fromHearingStore.SaveHearingConditions(hearingCondition));
    this.router.navigateByUrl(event.changeLink);
  }

  public fragmentFocus(): void {
    this.route.fragment.subscribe((frag) => {
      const element = document.getElementById(frag);
      if (element) {
        element.scrollIntoView();
        element.focus();
      }
    });
  }

  private hasHearingRequestObjectChanged(): boolean {
    let partyDetailsModels: PartyDetailsModel[] = [];
    let partyDetailsCompareModels: PartyDetailsModel[] = [];

    if (!!this.hearingRequestMainModel?.partyDetails) {
      partyDetailsModels = [...this.hearingRequestMainModel.partyDetails];
      partyDetailsModels.sort(this.compareParties);
    }

    if (!!this.hearingRequestToCompareMainModel?.partyDetails) {
      partyDetailsCompareModels = [...this.hearingRequestToCompareMainModel.partyDetails];
      partyDetailsCompareModels.sort(this.compareParties);
    }

    const hearingRequestMainModel = {
      requestDetails: { ...this.hearingRequestMainModel.requestDetails },
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        hearingChannels: [...this.hearingsService.getHearingChannels(this.hearingRequestMainModel)]
      },
      caseDetails: { ...this.hearingRequestMainModel.caseDetails },
      hearingResponse: { ...this.hearingRequestMainModel.hearingResponse },
      partyDetails: [...partyDetailsModels]
    };

    const hearingRequestToCompareMainModel = {
      requestDetails: { ...this.hearingRequestToCompareMainModel.requestDetails },
      hearingDetails: { ...this.hearingRequestToCompareMainModel.hearingDetails },
      caseDetails: { ...this.hearingRequestToCompareMainModel.caseDetails },
      hearingResponse: { ...this.hearingRequestToCompareMainModel.hearingResponse },
      partyDetails: [...partyDetailsCompareModels]
    };

    return !_.isEqual(
      JSON.parse(JSON.stringify(hearingRequestMainModel, this.replacer)),
      JSON.parse(JSON.stringify(hearingRequestToCompareMainModel, this.replacer))
    );
  }

  hasHearingRequestPartiesUnavailableDatesChanged(): boolean {
    let SHVUnavailabilityDates: UnavailabilityRangeModel[];
    let CompareUnavailabilityDates: UnavailabilityRangeModel[];

    if (!!this.serviceHearingValuesModel.parties) {
      SHVUnavailabilityDates = this.serviceHearingValuesModel.parties.flatMap((party) => party.unavailabilityRanges)
        .filter((SHVUnavailabilityDates) => SHVUnavailabilityDates!== null && SHVUnavailabilityDates !== undefined)
        .sort((currentDate, previousDate) => {
          return new Date(currentDate.unavailableFromDate).getTime() - new Date(previousDate.unavailableFromDate).getTime()
         || new Date(currentDate.unavailableToDate).getDate() - new Date(previousDate.unavailableToDate).getDate();
        });
    }

    if (!!this.hearingRequestToCompareMainModel?.partyDetails) {
      CompareUnavailabilityDates = this.hearingRequestToCompareMainModel.partyDetails.flatMap((party) => party.unavailabilityRanges)
        .filter((CompareUnavailabilityDates) => CompareUnavailabilityDates!== null && CompareUnavailabilityDates!== undefined)
        .sort((currentDate, previousDate) => {
          return new Date(currentDate.unavailableFromDate).getTime() - new Date(previousDate.unavailableFromDate).getTime()
           || new Date(currentDate.unavailableToDate).getDate() - new Date(previousDate.unavailableToDate).getDate();
        });
    }
    return !_.isEqual(
      JSON.parse(JSON.stringify(CompareUnavailabilityDates, this.replacer)),
      JSON.parse(JSON.stringify(SHVUnavailabilityDates, this.replacer))
    );
  }

  private compareParties(firstParty: PartyDetailsModel, secondParty: PartyDetailsModel) {
    return firstParty.partyID.localeCompare(secondParty.partyID);
  }

  private replacer (key: any, value: any) {
    // Party name is not present in HMC so ignoring it.
    // Is paper hearing flag is transient to indicate whether it is paper hearing
    // As well as, ignoring keys which are initialised with null value
    if (key === 'partyName' || key === 'isPaperHearing' || value === null) {
      return undefined;
    }
    return value;
  }

  private setPropertiesUpdatedAutomatically(): void {
    // Set properties updated on page visit
    this.setPropertiesUpdatedOnPageVisit(this.serviceHearingValuesModel);

    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      caseDetails: {
        ...this.hearingRequestMainModel?.caseDetails,
        caseManagementLocationCode: this.compareAndUpdateServiceHearingValues(this.hearingRequestMainModel?.caseDetails.caseManagementLocationCode, this.serviceHearingValuesModel.caseManagementLocationCode, AutoUpdateMode.PAGELESS, PagelessPropertiesEnum.CASE_MANAGEMENT_LOCATIONCODE),
        caseInterpreterRequiredFlag: this.compareAndUpdateServiceHearingValues(this.hearingRequestMainModel?.caseDetails.caseInterpreterRequiredFlag, this.serviceHearingValuesModel.caseInterpreterRequiredFlag, AutoUpdateMode.PAGELESS, PagelessPropertiesEnum.CASE_INTERPRETER_REQUIRED_FLAG),
        hmctsInternalCaseName: this.compareAndUpdateServiceHearingValues(this.hearingRequestMainModel?.caseDetails.hmctsInternalCaseName, this.serviceHearingValuesModel.hmctsInternalCaseName, AutoUpdateMode.WITHIN_PAGE, WithinPagePropertiesEnum.HMCTS_INTERNAL_CASENAME),
        publicCaseName: this.compareAndUpdateServiceHearingValues(this.hearingRequestMainModel?.caseDetails.publicCaseName, this.serviceHearingValuesModel.publicCaseName, AutoUpdateMode.WITHIN_PAGE, WithinPagePropertiesEnum.PUBLIC_CASE_NAME),
        caserestrictedFlag: this.compareAndUpdateServiceHearingValues(this.hearingRequestMainModel?.caseDetails.caserestrictedFlag, this.serviceHearingValuesModel.caserestrictedFlag, AutoUpdateMode.WITHIN_PAGE, WithinPagePropertiesEnum.CASE_RESTRICTED_FLAG),
        caseCategories: this.compareAndUpdateCaseCategories(this.hearingRequestMainModel?.caseDetails.caseCategories, this.serviceHearingValuesModel.caseCategories)
      },
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        privateHearingRequiredFlag: this.compareAndUpdateServiceHearingValues(this.hearingRequestMainModel.hearingDetails.privateHearingRequiredFlag, this.serviceHearingValuesModel.privateHearingRequiredFlag, AutoUpdateMode.WITHIN_PAGE, WithinPagePropertiesEnum.PRIVATE_HEARING_REQUIRED_FLAG)
      },
      partyDetails: [
        ...this.updatePartyDetails(this.serviceHearingValuesModel.parties)
      ]
    };

    // Set banner
    this.setBanner();

    this.hearingStore.dispatch(new fromHearingStore.UpdateHearingRequest(this.hearingRequestMainModel, this.hearingCondition));
  }

  private setPropertiesUpdatedOnPageVisit(serviceHearingValues: ServiceHearingValuesModel): void {
    if (serviceHearingValues) {
      if (!_.isEqual(this.hearingsService.propertiesUpdatedOnPageVisit?.hearingId, this.hearingRequestMainModel.requestDetails.hearingRequestID)) {
        this.hearingsService.propertiesUpdatedOnPageVisit = {
          hearingId: this.hearingRequestMainModel.requestDetails.hearingRequestID,
          caseFlags: serviceHearingValues.caseFlags,
          parties: serviceHearingValues.parties,
          hearingWindow: serviceHearingValues.hearingWindow,
          afterPageVisit: {
            reasonableAdjustmentChangesRequired: this.pageVisitReasonableAdjustmentChangeExists(),
            nonReasonableAdjustmentChangesRequired: this.pageVisitNonReasonableAdjustmentChangeExists(),
            partyDetailsChangesRequired: this.pageVisitPartiesChangeExists(),
            hearingWindowChangesRequired: this.pageVisitHearingWindowChangeExists(),
            hearingFacilitiesChangesRequired: this.pageVisitHearingFacilitiesChanged(),
            partyDetailsAnyChangesRequired: this.hasHearingRequestPartiesUnavailableDatesChanged(),
            hearingUnavailabilityDatesChanged: HearingsUtils.hasPartyUnavailabilityDatesChanged(this.hearingRequestToCompareMainModel.partyDetails, this.serviceHearingValuesModel.parties)
          }
        };
      }
    }
  }

  private compareAndUpdateCaseCategories(hmcCaseCategories: CaseCategoryModel[], shvCaseCategories: CaseCategoryModel[]): CaseCategoryModel[] {
    this.hearingsService.propertiesUpdatedAutomatically.withinPage.caseCategories = [];

    // Get case types
    const hmcCategoryValues = hmcCaseCategories.filter((caseCategories) => caseCategories.categoryType === CategoryType.CaseType).map((c) => c.categoryValue);
    const shvCategoryValues = shvCaseCategories.filter((caseCategories) => caseCategories.categoryType === CategoryType.CaseType).map((c) => c.categoryValue);

    const newCaseTypes = _.difference(shvCategoryValues, hmcCategoryValues);

    if (newCaseTypes.length > 0) {
      // Assign the new case types
      this.hearingsService.propertiesUpdatedAutomatically.withinPage.caseCategories = newCaseTypes;
    }

    hmcCategoryValues.forEach((hmcCategoryValue: string) => {
      // Check if subtype has changed
      const hmcSubTypes = hmcCaseCategories.filter((hmcCaseCategory) => hmcCaseCategory.categoryParent === hmcCategoryValue);
      const svhSubTypes = shvCaseCategories.filter((shvCaseCategory) => shvCaseCategory.categoryParent === hmcCategoryValue);

      if (!_.isEqual(hmcSubTypes, svhSubTypes)) {
        // Insert the existing category value for which the sub type has changed
        this.hearingsService.propertiesUpdatedAutomatically.withinPage.caseCategories.push(hmcCategoryValue);
      }
    });

    // Remove attribute with null to ignore change in CR-84 auto update
    const newCaseCategories: CaseCategoryModel[] = [];

    shvCaseCategories.forEach((s) => {
      const caseCategory: CaseCategoryModel = {
        categoryType: s.categoryType,
        categoryValue: s.categoryValue
      };

      if (s.categoryParent) {
        caseCategory.categoryParent = s.categoryParent;
      }
      newCaseCategories.push(caseCategory);
    });

    return newCaseCategories;
  }

  private compareAndUpdateServiceHearingValues(currentValue, serviceHearingValue, pageMode: AutoUpdateMode = null, property: string = null) {
    if (!currentValue && !serviceHearingValue) {
      return currentValue;
    }
    if (!_.isEqual(currentValue, serviceHearingValue)) {
      // Store ammended properties to dispay it in UI
      if (pageMode && (property || pageMode === AutoUpdateMode.PARTY)) {
        switch (pageMode) {
          case AutoUpdateMode.WITHIN_PAGE:
            this.hearingsService.propertiesUpdatedAutomatically.withinPage[property] = true;
            break;
          case AutoUpdateMode.PAGELESS:
            this.hearingsService.propertiesUpdatedAutomatically.pageless[property] = true;
            break;
          case AutoUpdateMode.PARTY:
            this.hearingsService.propertiesUpdatedAutomatically.pageless[PagelessPropertiesEnum.PARTIES] = true;
            break;
        }
      }
    }
    return serviceHearingValue;
  }

  private updatePartyDetails(parties: PartyDetailsModel[]): PartyDetailsModel[] {
    const newParty: PartyDetailsModel[] = [];
    if (Array.isArray(this.hearingRequestMainModel.partyDetails)) {
      this.hearingRequestMainModel.partyDetails.forEach((party) => {
        const serviceParty = parties.find((serviceParty) => serviceParty.partyID === party.partyID);
        if (serviceParty) {
          if (serviceParty.partyType === PartyType.IND) {
            newParty.push({
              ...party,
              partyRole: this.compareAndUpdateServiceHearingValues(party.partyRole, serviceParty.partyRole, AutoUpdateMode.PARTY),
              individualDetails: {
                ...party.individualDetails,
                relatedParties: this.compareAndUpdateServiceHearingValues(party.individualDetails?.relatedParties, serviceParty.individualDetails?.relatedParties, AutoUpdateMode.PARTY),
                custodyStatus: this.compareAndUpdateServiceHearingValues(party.individualDetails?.custodyStatus, serviceParty.individualDetails?.custodyStatus, AutoUpdateMode.PARTY),
                vulnerableFlag: this.compareAndUpdateServiceHearingValues(party.individualDetails?.vulnerableFlag, serviceParty.individualDetails?.vulnerableFlag, AutoUpdateMode.PARTY),
                vulnerabilityDetails: this.compareAndUpdateServiceHearingValues(party.individualDetails?.vulnerabilityDetails, serviceParty.individualDetails?.vulnerabilityDetails, AutoUpdateMode.PARTY),
                hearingChannelEmail: this.compareAndUpdateServiceHearingValues(party.individualDetails?.hearingChannelEmail, serviceParty.individualDetails?.hearingChannelEmail, AutoUpdateMode.PARTY),
                hearingChannelPhone: this.compareAndUpdateServiceHearingValues(party.individualDetails?.hearingChannelPhone, serviceParty.individualDetails?.hearingChannelPhone, AutoUpdateMode.PARTY)
              },
              unavailabilityDOW: this.compareAndUpdateServiceHearingValues(party?.unavailabilityDOW, serviceParty?.unavailabilityDOW, AutoUpdateMode.WITHIN_PAGE, WithinPagePropertiesEnum.PARTIES)
            });
          } else {
            newParty.push({
              ...party,
              partyRole: this.compareAndUpdateServiceHearingValues(party.partyRole, serviceParty.partyRole, AutoUpdateMode.PARTY),
              organisationDetails: {
                ...party.organisationDetails,
                name: this.compareAndUpdateServiceHearingValues(party.organisationDetails?.name, serviceParty.organisationDetails?.name),
                organisationType: this.compareAndUpdateServiceHearingValues(party.organisationDetails?.organisationType, serviceParty.organisationDetails?.organisationType, AutoUpdateMode.PARTY),
                cftOrganisationID: this.compareAndUpdateServiceHearingValues(party.organisationDetails?.cftOrganisationID, serviceParty.organisationDetails?.cftOrganisationID, AutoUpdateMode.PARTY)
              },
              unavailabilityDOW: this.compareAndUpdateServiceHearingValues(party?.unavailabilityDOW, serviceParty?.unavailabilityDOW, AutoUpdateMode.WITHIN_PAGE, WithinPagePropertiesEnum.PARTIES)
            });
          }
        }
      });
    }

    parties.filter((svcParty) => !newParty.find((y) => y.partyID === svcParty.partyID))
      .forEach((svcParty) => {
        newParty.push(svcParty);
      });

    return newParty;
  }

  private setBanner(): void {
    // check pageless automatic update
    this.isPagelessAttributeChanged = Object.entries(this.hearingsService.propertiesUpdatedAutomatically.pageless).some((prop) => prop);
    // check automatic update within page
    this.isWithinPageAttributeChanged = Object.entries(this.hearingsService.propertiesUpdatedAutomatically.withinPage).some((prop) => prop);
    // page visit change exists
    this.pageVisitChangeExists = this.pageVisitReasonableAdjustmentChangeExists() ||
      this.pageVisitNonReasonableAdjustmentChangeExists() ||
      this.pageVisitPartiesChangeExists() ||
      this.pageVisitHearingWindowChangeExists() ||
      this.pageVisitHearingFacilitiesChanged();
    // Reset submit updated request event
    this.hearingsService.submitUpdatedRequestClicked = false;
  }

  private pageVisitChangesNotConfirmed(): boolean {
    return this.pageVisitReasonableAdjustmentChangeExists() ||
      this.pageVisitNonReasonableAdjustmentChangeExists() ||
      this.pageVisitPartiesChangeExists() ||
      this.pageVisitHearingWindowChangeExists();
  }

  pageVisitReasonableAdjustmentChangeExists(): boolean {
    if (!this.sectionsToDisplay.includes(this.hearingScreenEnum.HEARING_REQUIREMENTS)) {
      // Do not consider reasonable adjustments as hearing requirements is not part of the screen flow
      return false;
    }
    if (this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.reasonableAdjustmentChangesConfirmed) {
      // Reasonable adjustment changes already confirmed
      return false;
    }
    const HRMIndividualParties = this.extractAndSortParties(this.hearingRequestMainModel.partyDetails);
    const SHVIndividualParties = this.extractAndSortParties(this.serviceHearingValuesModel.parties);

    const HRMIndiviualAdjustments = this.extractReasonableAdjustments(HRMIndividualParties);
    const SHVIndiviualAdjustments = this.extractReasonableAdjustments(SHVIndividualParties);

    if (!_.isEqual(HRMIndiviualAdjustments, SHVIndiviualAdjustments)){
      return true;
    }

    const interpreterLanguagesSHV = this.extractInterpreterLanguages(SHVIndividualParties);
    const interpreterLanguagesHMC = this.extractInterpreterLanguages(HRMIndividualParties);

    if (!_.isEqual(interpreterLanguagesSHV, interpreterLanguagesHMC)){
      return true;
    }
    if (this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.reasonableAdjustmentChangesRequired) {
      return !this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.reasonableAdjustmentChangesConfirmed;
    }
    // There are no changes for reasonable adjustments and language interpreter flags when SHV compared with HMC
    return false;
  }

  private extractReasonableAdjustments(partyDetails: PartyDetailsModel[]) {
    // Return a string of party id and reasonable adjustments.
    return partyDetails.map((parties) => parties.partyID + ',' + parties.individualDetails?.reasonableAdjustments?.
      filter((adjustments) => adjustments.startsWith('RA'))).
      filter((adjustments) => !adjustments.includes(',undefined', null)).
      filter((adjustments) => !adjustments.endsWith(','));
  }

  private extractInterpreterLanguages(partyDetails: PartyDetailsModel[]) {
    // Return true if there are changes to the interpreter languages
    return partyDetails.map(
      (party) => party.individualDetails?.interpreterLanguage
    )?.filter(
      (interpreterLanguage) => interpreterLanguage !== null && interpreterLanguage !== undefined
    ).sort((a, b) => {
      return a > b ? 1 : (a === b ? 0 : -1);
    });
  }

  private extractAndSortParties(partyDetails: PartyDetailsModel[]){
    // Get the individual parties and sort reasonable adjustments into order.
    let individualParties = cloneDeep(partyDetails);
    individualParties = individualParties.filter(
      (party) => party.partyType === PartyType.IND).sort((a, b) => {
      return a.partyID > b.partyID ? 1 : (a.partyID === b.partyID ? 0 : -1);
    });
    individualParties.forEach(
      (party) => party.individualDetails?.reasonableAdjustments?.sort((a, b) => {
        return a.localeCompare(b);
      })
    );
    return individualParties;
  }

  private pageVisitNonReasonableAdjustmentChangeExists(): boolean {
    if (!this.sectionsToDisplay.includes(this.hearingScreenEnum.HEARING_FACILITIES)) {
      // Do not consider non-reasonable adjustment case flags as hearing facilities is not part of the screen flow
      return false;
    }
    if (this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.nonReasonableAdjustmentChangesConfirmed) {
      // Reasonable adjustment changes already confirmed
      return false;
    }
    const nonReasonableAdjustmentFlags = CaseFlagsUtils.getNonReasonableAdjustmentFlags(this.caseFlagsRefData, this.serviceHearingValuesModel.caseFlags?.flags, this.serviceHearingValuesModel.parties);
    const caseFlagsModifiedDate = nonReasonableAdjustmentFlags?.map((flags) => flags.dateTimeModified);
    const caseFlagsCreatedDate = nonReasonableAdjustmentFlags?.map((flags) => flags.dateTimeCreated);
    const caseFlagsWithModifiedDate = caseFlagsModifiedDate.filter((date) => date !== null).filter((date) => date !== undefined);
    const caseFlagsWithCreatedDate = caseFlagsCreatedDate.filter((date) => date !== null).filter((date) => date !== undefined);

    if (caseFlagsWithModifiedDate.length > 0 || caseFlagsWithCreatedDate.length > 0) {
      // Check for the caseflags timestamp with HMC timestamp
      return caseFlagsWithModifiedDate.some((date) => new Date(date) > new Date(this.hearingRequestMainModel.requestDetails?.timestamp)) ||
        caseFlagsWithCreatedDate.some((date) => new Date(date) > new Date(this.hearingRequestMainModel.requestDetails?.timestamp));
    }
    return false;
  }

  private pageVisitHearingFacilitiesChanged(): boolean {
    if (!this.sectionsToDisplay.includes(this.hearingScreenEnum.HEARING_FACILITIES)) {
      // Do not consider non-reasonable adjustment case flags as hearing facilities is not part of the screen flow
      return false;
    }
    const facilitiesInHMC = this.hearingRequestMainModel.hearingDetails.facilitiesRequired || [];
    const facilitiesInSHV = this.serviceHearingValuesModel.facilitiesRequired || [];

    const sortedFacilitiesInHMC = facilitiesInHMC.slice().sort((a, b) => {
      return a > b ? 1 : (a === b ? 0 : -1);
    });
    const sortedFacilitiesInSHV = facilitiesInSHV.slice().sort((a, b) => {
      return a > b ? 1 : (a === b ? 0 : -1);
    });
    return !_.isEqual(sortedFacilitiesInHMC, sortedFacilitiesInSHV);
  }

  private pageVisitPartiesChangeExists(): boolean {
    if (this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.partyDetailsChangesConfirmed) {
      // Reasonable adjustment changes already confirmed
      return false;
    }
    const partiesSHV = this.serviceHearingValuesModel.parties;
    const partiesHMC = this.hearingRequestMainModel.partyDetails;
    // Return true if the number of parties in SHV and HMC are different
    if (partiesSHV.length !== partiesHMC.length) {
      return true;
    }
    // Number of parties are the same in both SHV and HMC
    // Loop through the parties in SHV, locate the corresponding party in HMC
    // and return true if there are any changes in the party name of party type
    for (const partySHV of partiesSHV) {
      const party = partiesHMC.find((partyHMC) => partyHMC.partyID === partySHV.partyID);
      if (!party || party.partyType !== partySHV.partyType ||
        HearingsUtils.hasPartyNameChanged(party, partySHV)) {
        return true;
      }
    }

    if (this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit.partyDetailsChangesRequired) {
      return !this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.partyDetailsChangesConfirmed;
    }

    if (this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit.hearingUnavailabilityDatesChanged) {
      return !this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit.hearingUnavailabilityDatesConfirmed;
    }

    // There are no changes for parties when compared SHV with HMC
    return false;
  }

  private pageVisitHearingWindowChangeExists(): boolean {
    if (!this.sectionsToDisplay.includes(this.hearingScreenEnum.HEARING_TIMING)) {
      // Do not consider hearing window changes as hearing timing is not part of the screen flow
      return false;
    }
    if (this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingWindowChangesConfirmed) {
      // Reasonable adjustment changes already confirmed
      return false;
    }

    if (this.hearingRequestMainModel.partyDetails) {
      if (HearingsUtils.hasPartyUnavailabilityDatesChanged(this.hearingRequestToCompareMainModel.partyDetails, this.serviceHearingValuesModel.parties)){
        return true;
      }
    }
    return false;
  }
}
