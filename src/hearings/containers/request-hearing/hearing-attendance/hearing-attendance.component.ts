import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { ACTION, HearingChannelEnum, Mode, PartyType, RadioOptions } from '../../../models/hearings.enum';
import { AmendmentLabelStatus } from '../../../models/hearingsUpdateMode.enum';
import { IndividualDetailsModel } from '../../../models/individualDetails.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { HearingsUtils } from '../../../utils/hearings.utils';
import { ValidatorsUtils } from '../../../utils/validators.utils';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-attendance',
  templateUrl: './hearing-attendance.component.html',
  styleUrls: ['./hearing-attendance.component.scss']
})
export class HearingAttendanceComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public attendanceFormGroup: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];
  public hint: string = 'Where known, contact details for remote attendees will be included in the request.';
  public title: string = 'Participant attendance';
  public partiesFormArray: FormArray;
  public formValid: boolean = true;
  public partyChannels: LovRefDataModel[];
  public hearingLevelChannels: LovRefDataModel[];
  public selectionValid: boolean = true;
  public isAttendanceSelected: boolean = true;
  public partyDetailsChangesRequired: boolean;
  public partyDetailsChangesConfirmed: boolean;

  constructor(private readonly validatorsUtils: ValidatorsUtils,
    private readonly fb: FormBuilder,
    protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly hearingsService: HearingsService,
    protected readonly featureToggleService: FeatureToggleService,
    protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
    this.hearingLevelChannels = this.route.snapshot.data.hearingChannels.filter((channel: LovRefDataModel) => channel.key !== HearingChannelEnum.ONPPR && channel.key !== HearingChannelEnum.NotAttending);
    this.partyChannels = this.route.snapshot.data.hearingChannels.filter((channel: LovRefDataModel) => channel.key !== HearingChannelEnum.ONPPR);
    this.partyDetailsChangesRequired = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.partyDetailsChangesRequired;
    this.partyDetailsChangesConfirmed = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.partyDetailsChangesConfirmed;
    this.attendanceFormGroup = fb.group({
      estimation: [null, [Validators.pattern(/^\d+$/)]],
      parties: fb.array([]),
      hearingLevelChannels: this.getHearingLevelChannels,
      paperHearing: this.isPaperHearing()
    });
    this.partiesFormArray = fb.array([]);
  }

  private isPaperHearing(): string {
    return (this.hearingRequestMainModel.hearingDetails.hearingChannels?.includes(HearingChannelEnum.ONPPR)
    || !!this.hearingRequestMainModel.hearingDetails?.isPaperHearing)
      ? RadioOptions.YES : RadioOptions.NO;
  }

  public get getHearingLevelChannels(): FormArray {
    const hearingLevelParticipantChannels = this.hearingRequestMainModel.hearingDetails.hearingChannels;
    return this.fb.array(this.hearingLevelChannels.map((val) => this.fb.group({
      key: [val.key],
      value_en: [val.value_en],
      value_cy: [val.value_cy],
      hint_text_en: [val.hint_text_en],
      hint_text_cy: [val.hint_text_cy],
      lov_order: [val.lov_order],
      parent_key: [val.parent_key],
      selected: [!!val.selected || (hearingLevelParticipantChannels?.includes(val.key))]
    })), [this.validatorsUtils.formArraySelectedValidator()]);
  }

  public ngOnInit(): void {
    if (this.hearingCondition.mode === Mode.VIEW_EDIT) {
      // This will be triggered due to changes in the hearing service call
      if (this.hearingsService.propertiesUpdatedOnPageVisit?.hasOwnProperty('parties') &&
      this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit.partyDetailsChangesRequired) {
        this.initialiseFromHearingValuesForAmendments();
      } else {
        // This will be triggered when a user is amending
        this.initialiseFormValues(this.hearingRequestMainModel.partyDetails);
      }
    } else {
      // This will be triggered on a create request
      this.initialiseFormValues(this.serviceHearingValuesModel.parties);
    }
    this.attendanceFormGroup.controls.estimation.setValue(this.hearingRequestMainModel.hearingDetails.numberOfPhysicalAttendees || 0);
    this.partiesFormArray = this.attendanceFormGroup.controls.parties as FormArray;
  }

  public initialiseFormValues(source: PartyDetailsModel[]): void {
    source.filter((party) => party.partyType === PartyType.IND)
      .forEach((partyDetail) => {
        (this.attendanceFormGroup.controls.parties as FormArray).push(this.patchValues({
          partyID: partyDetail.partyID,
          partyType: partyDetail.partyType,
          partyRole: partyDetail.partyRole,
          partyName: `${partyDetail.individualDetails.firstName} ${partyDetail.individualDetails.lastName}`,
          individualDetails: {
            ...partyDetail.individualDetails,
            preferredHearingChannel: partyDetail.individualDetails?.preferredHearingChannel ? partyDetail.individualDetails?.preferredHearingChannel : ''
          },
          organisationDetails: partyDetail.organisationDetails,
          unavailabilityDOW: partyDetail.unavailabilityDOW,
          unavailabilityRanges: partyDetail.unavailabilityRanges
        } as PartyDetailsModel) as FormGroup);
      });
  }

  public initialiseFromHearingValuesForAmendments(): void {
    const partyDetails = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit.partyDetailsChangesConfirmed
      ? this.hearingRequestMainModel.partyDetails
      : this.hearingRequestToCompareMainModel.partyDetails;
    const individualPartyIdsInHMC = partyDetails.filter((party) => party.partyType === PartyType.IND)?.map((party) => party.partyID);
    const individualPartiesInSHV = this.serviceHearingValuesModel.parties.filter((party) => party.partyType === PartyType.IND);
    individualPartiesInSHV?.forEach((partyDetailsModel: PartyDetailsModel) => {
      if (!individualPartyIdsInHMC.includes(partyDetailsModel.partyID)) {
        partyDetailsModel = {
          ...partyDetailsModel,
          partyName: `${partyDetailsModel.individualDetails.firstName} ${partyDetailsModel.individualDetails.lastName}`,
          partyAmendmentStatus: AmendmentLabelStatus.ACTION_NEEDED
        };
        (this.attendanceFormGroup.controls.parties as FormArray).push(this.patchValues(partyDetailsModel) as FormGroup);
      } else {
        const partyInHMC = partyDetails.find((party) => party.partyID === partyDetailsModel.partyID);
        if (partyInHMC) {
          (this.attendanceFormGroup.controls.parties as FormArray).push(this.patchValues({
            partyID: partyDetailsModel.partyID,
            partyType: partyDetailsModel.partyType,
            partyRole: partyDetailsModel.partyRole,
            partyName: `${partyDetailsModel.individualDetails.firstName} ${partyDetailsModel.individualDetails.lastName}`,
            individualDetails: partyDetailsModel.individualDetails && {
              ...partyDetailsModel.individualDetails,
              preferredHearingChannel: partyInHMC.individualDetails?.preferredHearingChannel
            },
            organisationDetails: partyDetailsModel.organisationDetails,
            unavailabilityDOW: partyDetailsModel.unavailabilityDOW,
            unavailabilityRanges: partyDetailsModel.unavailabilityRanges,
            partyAmendmentStatus: HearingsUtils.hasPartyNameChanged(partyInHMC, partyDetailsModel) ? AmendmentLabelStatus.AMENDED : AmendmentLabelStatus.NONE
          } as PartyDetailsModel) as FormGroup);
        }
      }
    });
    this.partiesFormArray = this.attendanceFormGroup.controls.parties as FormArray;
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
      if (this.isFormValid()) {
        this.prepareHearingRequestData();
        super.navigateAction(action);
      }
    } else if (action === ACTION.BACK) {
      super.navigateAction(action);
    }
  }

  public prepareHearingRequestData(): void {
    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      partyDetails: [...this.getIndividualParties(), ...this.getOrganisationParties()],
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        hearingChannels: this.getHearingChannels(),
        numberOfPhysicalAttendees: parseInt(this.attendanceFormGroup.controls.estimation.value, 0),
        isPaperHearing: this.attendanceFormGroup.controls.paperHearing.value === RadioOptions.YES
      }
    };
    if ((this.hearingCondition.mode === Mode.VIEW_EDIT &&
      this.hearingsService.propertiesUpdatedOnPageVisit?.hasOwnProperty('parties'))) {
      this.hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.partyDetailsChangesConfirmed = true;
    }
  }

  public getIndividualParties(): PartyDetailsModel[] {
    const individualParties: PartyDetailsModel[] = [];

    (this.attendanceFormGroup.controls.parties as FormArray).controls.forEach((control) => {
      const partyDetail: PartyDetailsModel = {
        partyID: control.value.partyID,
        partyType: control.value.partyType,
        partyRole: control.value.partyRole,
        partyName: control.value.partyName,
        individualDetails: control.value.individualDetails,
        unavailabilityDOW: control.value.unavailabilityDOW,
        unavailabilityRanges: control.value.unavailabilityRanges
      };
      individualParties.push(partyDetail);
    });
    return individualParties;
  }

  public getOrganisationParties(): PartyDetailsModel[] {
    return this.serviceHearingValuesModel.parties.filter((party) => party.partyType === PartyType.ORG);
  }

  public getHearingChannels(): string[] {
    if (this.attendanceFormGroup.controls.paperHearing.value === RadioOptions.YES) {
      return [HearingChannelEnum.ONPPR];
    }
    return this.attendanceFormGroup.controls.hearingLevelChannels.value.filter((channel) => channel.selected).map((channel) => channel.key);
  }

  public isFormValid(): boolean {
    this.validationErrors = [];
    let formValid = true;
    let selectionValid = true;
    this.isAttendanceSelected = true;

    if (this.attendanceFormGroup.controls.paperHearing.value === RadioOptions.YES) {
      return formValid;
    }

    (this.attendanceFormGroup.controls.parties as FormArray).controls.forEach((element) => {
      if (!element.valid) {
        formValid = false;
        selectionValid = false;
        this.validationErrors.push({
          id: `partyChannel${(this.attendanceFormGroup.controls.parties as FormArray).controls.indexOf(element)}`,
          message: 'Select how each participant will attend the hearing'
        });
      }
    });

    this.attendanceFormGroup.controls.estimation.markAsDirty();
    if (!this.attendanceFormGroup.controls.estimation.valid) {
      formValid = false;
      this.validationErrors.push({ id: 'attendance-number', message: 'Enter a valid number of attendees' });
    }
    if (this.attendanceFormGroup.controls.hearingLevelChannels.invalid) {
      formValid = false;
      this.isAttendanceSelected = false;
      this.validationErrors.push({ id: 'attendance-selection-error', message: 'Select a way of participant attendance' });
    }

    this.selectionValid = selectionValid;
    this.formValid = formValid;
    return formValid;
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }

  private patchValues(party: PartyDetailsModel): FormGroup {
    const individualDetails = party.individualDetails && this.initIndividualDetailsFormGroup(party.individualDetails);
    const organisationDetails = party.organisationDetails;
    return this.fb.group({
      partyID: [party.partyID],
      partyType: [party.partyType],
      partyName: [party.partyName],
      partyRole: [party.partyRole],
      ...individualDetails && ({ individualDetails }),
      ...organisationDetails && ({ organisationDetails }),
      unavailabilityDOW: [party.unavailabilityDOW],
      unavailabilityRanges: [party.unavailabilityRanges],
      partyAmendmentStatus: [party.partyAmendmentStatus]
    });
  }

  private initIndividualDetailsFormGroup(individualDetails: IndividualDetailsModel): FormGroup {
    return this.fb.group({
      firstName: [individualDetails.firstName],
      lastName: [individualDetails.lastName],
      preferredHearingChannel: [individualDetails.preferredHearingChannel, Validators.required],
      interpreterLanguage: [individualDetails.interpreterLanguage],
      reasonableAdjustments: [individualDetails.reasonableAdjustments],
      relatedParties: [individualDetails.relatedParties],
      title: [individualDetails.title],
      vulnerableFlag: [individualDetails.vulnerableFlag],
      vulnerabilityDetails: [individualDetails.vulnerabilityDetails],
      hearingChannelEmail: [individualDetails.hearingChannelEmail],
      hearingChannelPhone: [individualDetails.hearingChannelPhone],
      custodyStatus: [individualDetails.custodyStatus],
      otherReasonableAdjustmentDetails: [individualDetails.otherReasonableAdjustmentDetails]
    });
  }
}
