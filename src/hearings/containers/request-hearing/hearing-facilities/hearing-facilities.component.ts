import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { CaseFlagGroup } from '../../../models/caseFlagGroup.model';
import { CaseFlagReferenceModel } from '../../../models/caseFlagReference.model';
import { ACTION, CaseFlagType, HearingFacilitiesEnum, Mode } from '../../../models/hearings.enum';
import { AmendmentLabelStatus } from '../../../models/hearingsUpdateMode.enum';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { CaseFlagsUtils } from '../../../utils/case-flags.utils';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-facilities',
  templateUrl: './hearing-facilities.component.html'
})
export class HearingFacilitiesComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public caseFlagsRefData: CaseFlagReferenceModel[];
  public caseFlagType: CaseFlagType = CaseFlagType.NON_REASONABLE_ADJUSTMENT;
  public nonReasonableAdjustmentFlags: CaseFlagGroup[] = [];
  public hearingFactilitiesForm: FormGroup;
  public additionSecurityError: string;
  public validationErrors: { id: string, message: string }[] = [];
  public additionalFacilities: LovRefDataModel[];
  public additionSecurityRequiredValid: boolean = true;
  public amendmentLabelEnum = AmendmentLabelStatus;
  public hearingFacilitiesChangesRequired: boolean;
  public hearingFacilitiesChangesConfirmed: boolean;

  constructor(private fb: FormBuilder,
              protected readonly hearingStore: Store<fromHearingStore.State>,
              protected readonly hearingsService: HearingsService,
              protected readonly featureToggleService: FeatureToggleService,
              protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
    this.additionalFacilities = this.route.snapshot.data.additionFacilitiesOptions;
    this.caseFlagsRefData = this.route.snapshot.data.caseFlags;
  }

  public ngOnInit(): void {
    if (this.hearingCondition.mode === Mode.VIEW_EDIT) {
      this.hearingFacilitiesChangesRequired = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingFacilitiesChangesRequired;
      this.hearingFacilitiesChangesConfirmed = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingFacilitiesChangesConfirmed;
    }

    this.setNonReasonableAdjustmentFlags();

    this.hearingFactilitiesForm = this.fb.group({
      'addition-security-required': ['', Validators.required],
      'addition-securities': this.additionalFacilities ? this.getHearingFacilitiesFormArray : []
    });

    if (this.hearingRequestMainModel.caseDetails?.caseAdditionalSecurityFlag) {
      this.hearingFactilitiesForm.controls['addition-security-required'].setValue('Yes');
    } else {
      this.hearingFactilitiesForm.controls['addition-security-required'].setValue('No');
    }
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public get getHearingFacilitiesFormArray(): FormArray {
    const facilities = this.hearingFacilitiesChangesRequired && !this.hearingFacilitiesChangesConfirmed
      ? this.serviceHearingValuesModel.facilitiesRequired || []
      : this.hearingRequestMainModel.hearingDetails.facilitiesRequired || [];

    if (facilities.length > 0) {
      const additionalFacilitiesValuated = this.additionalFacilities.filter((additionalFacility) => facilities.includes(additionalFacility.key));
      additionalFacilitiesValuated.forEach((facilityValuated) => {
        facilityValuated.selected = true;
        if (this.hearingFacilitiesChangesRequired && !this.hearingFacilitiesChangesConfirmed) {
          facilityValuated.showAmendedLabel = true;
        }
      });
    }

    if (this.hearingFacilitiesChangesRequired && !this.hearingFacilitiesChangesConfirmed) {
      const facilitiesToLabel = this.additionalFacilities.filter(
        (additionalFacility) => this.hearingRequestMainModel.hearingDetails.facilitiesRequired?.includes(additionalFacility.key)
      );
      facilitiesToLabel.forEach((facility) => facility.showAmendedLabel = true);
    }

    return this.fb.array(this.additionalFacilities.map((val) => this.fb.group({
      key: [val.key],
      value_en: [val.value_en],
      value_cy: [val.value_cy],
      hint_text_en: [val.hint_text_en],
      hint_text_cy: [val.hint_text_cy],
      lov_order: [val.lov_order],
      parent_key: [val.parent_key],
      selected: [!!val.selected]
    })));
  }

  public get hearingFacilitiesEnum() {
    return HearingFacilitiesEnum;
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
      if (this.hearingFactilitiesForm && this.hearingFactilitiesForm.controls['addition-security-required']) {
        this.hearingFactilitiesForm.controls['addition-security-required'].markAsDirty();
      }
      this.additionSecurityRequiredValid = this.isFormValid();
      if (this.additionSecurityRequiredValid) {
        this.prepareHearingRequestData();
        super.navigateAction(action);
      }
    } else if (action === ACTION.BACK) {
      super.navigateAction(action);
    }
  }

  public prepareHearingRequestData() {
    const facilitiesRequired: string[] = (this.hearingFactilitiesForm.controls['addition-securities'] as FormArray).controls
      .filter((control) => control.value.selected).map((mapControl) => mapControl.value.key);
    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      caseDetails: {
        ...this.hearingRequestMainModel.caseDetails,
        caseAdditionalSecurityFlag: this.hearingFactilitiesForm.controls['addition-security-required'].value === 'Yes'
      },
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        facilitiesRequired
      }
    };
    const propertiesUpdatedOnPageVisit = this.hearingsService.propertiesUpdatedOnPageVisit;
    if (this.hearingCondition.mode === Mode.VIEW_EDIT) {
      if (propertiesUpdatedOnPageVisit?.hasOwnProperty('caseFlags') &&
        (propertiesUpdatedOnPageVisit?.afterPageVisit.nonReasonableAdjustmentChangesRequired)) {
        this.hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.nonReasonableAdjustmentChangesConfirmed = true;
      }
      if (propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingFacilitiesChangesRequired) {
        this.hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingFacilitiesChangesConfirmed = true;
      }
    }
  }

  public isFormValid(): boolean {
    this.additionSecurityError = null;
    this.validationErrors = [];
    if (!this.hearingFactilitiesForm.controls['addition-security-required'].valid) {
      this.additionSecurityError = HearingFacilitiesEnum.additionSecurityError;
      this.validationErrors.push({
        id: 'addition-security-confirmation',
        message: HearingFacilitiesEnum.additionSecurityError
      });
      return false;
    }
    return true;
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }

  private setNonReasonableAdjustmentFlags(): void {
    const propertiesUpdatedOnPageVisit = this.hearingsService.propertiesUpdatedOnPageVisit;
    if (this.hearingCondition.mode === Mode.VIEW_EDIT &&
        propertiesUpdatedOnPageVisit?.hasOwnProperty('caseFlags') &&
        (propertiesUpdatedOnPageVisit?.afterPageVisit.nonReasonableAdjustmentChangesRequired || propertiesUpdatedOnPageVisit?.afterPageVisit.partyDetailsChangesRequired)) {
      const partyDetails = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.nonReasonableAdjustmentChangesConfirmed
        ? this.hearingRequestMainModel.partyDetails
        : this.hearingRequestToCompareMainModel.partyDetails;
      this.nonReasonableAdjustmentFlags = CaseFlagsUtils.getNonReasonableAdjustmentFlagsGroupedByPartyName(this.caseFlagsRefData,
        propertiesUpdatedOnPageVisit.caseFlags?.flags, partyDetails, this.serviceHearingValuesModel.parties,
        this.hearingRequestMainModel.requestDetails, this.hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.nonReasonableAdjustmentChangesConfirmed);
    } else {
      this.nonReasonableAdjustmentFlags = CaseFlagsUtils.displayCaseFlagsGroup(this.serviceHearingValuesModel?.caseFlags?.flags,
        this.caseFlagsRefData, this.caseFlagType);
    }
  }
}

