import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import { HearingsService } from '../../../../../hearings/services/hearings.service';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';
import { HearingRequestMainModel } from '../../../../models/hearingRequestMain.model';
import { LovRefDataModel } from '../../../../models/lovRefData.model';

@Component({
  selector: 'exui-additional-facilities-section',
  templateUrl: './additional-facilities-section.component.html'
})
export class AdditionalFacilitiesSectionComponent implements OnInit {
  @Input() public additionalFacilitiesRefData: LovRefDataModel[];
  @Input() public hearingRequestMainModel: HearingRequestMainModel;
  @Input() public hearingRequestToCompareMainModel: HearingRequestMainModel;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public additionalFacilitiesRequiredText: string;
  public additionalFacilities: string[] = [];
  public amendmentLabelEnum = AmendmentLabelStatus;
  public pageTitleDisplayLabel: string;
  public nonReasonableAdjustmentChangesRequired: boolean;
  public nonReasonableAdjustmentChangesConfirmed: boolean;
  public hearingFacilitiesChangesRequired: boolean;
  public hearingFacilitiesChangesConfirmed: boolean;
  public caseAdditionalSecurityFlagChanged: boolean;
  public facilitiesChanged: boolean;
  public showAmendedForPageTitle: boolean;
  public facilitiesRequiredToCompare: string[] = [];

  constructor(private readonly hearingsService: HearingsService) {
  }

  public ngOnInit(): void {
    this.additionalFacilitiesRequiredText = this.hearingRequestMainModel.caseDetails?.caseAdditionalSecurityFlag
      ? 'Yes'
      : 'No';

    this.hearingRequestMainModel.hearingDetails.facilitiesRequired?.forEach((facility) => {
      const facilityFromRefData = this.additionalFacilitiesRefData.find((facilityRefData) => facilityRefData.key === facility);
      if (facilityFromRefData) {
        this.additionalFacilities.push(facilityFromRefData.value_en);
      }
    });

    this.nonReasonableAdjustmentChangesRequired = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.nonReasonableAdjustmentChangesRequired;
    this.nonReasonableAdjustmentChangesConfirmed = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.nonReasonableAdjustmentChangesConfirmed;
    this.hearingFacilitiesChangesRequired = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingFacilitiesChangesRequired;
    this.hearingFacilitiesChangesConfirmed = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingFacilitiesChangesConfirmed;

    this.setAmendmentLabels();
  }

  public onChange(fragmentId: string): void {
    let changeLink = '';
    if (fragmentId === 'additionalSecurityRequired') {
      changeLink = '/hearings/request/hearing-facilities#additionalSecurityYes';
    } else {
      changeLink = '/hearings/request/hearing-facilities#immigrationDetentionCentre';
    }
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }

  public showAmendedForFacilitiesRequired(facility: string): boolean {
    return !this.facilitiesRequiredToCompare.includes(facility);
  }

  private setFacilitiesToCompare(): void {
    this.hearingRequestToCompareMainModel.hearingDetails.facilitiesRequired?.forEach((facility) => {
      const facilityFromRefData = this.additionalFacilitiesRefData.find((additionalFacility) => additionalFacility.key === facility);
      if (facilityFromRefData) {
        this.facilitiesRequiredToCompare.push(facilityFromRefData.value_en);
      }
    });
  }

  private setAmendmentLabels(): void {
    this.caseAdditionalSecurityFlagChanged = !_.isEqual(
      this.hearingRequestToCompareMainModel.caseDetails?.caseAdditionalSecurityFlag,
      this.hearingRequestMainModel.caseDetails?.caseAdditionalSecurityFlag
    );

    this.facilitiesChanged = !_.isEqual(
      this.hearingRequestMainModel.hearingDetails?.facilitiesRequired,
      this.hearingRequestToCompareMainModel.hearingDetails?.facilitiesRequired
    );

    if ((this.nonReasonableAdjustmentChangesRequired && !this.nonReasonableAdjustmentChangesConfirmed) ||
      (this.hearingFacilitiesChangesRequired && !this.hearingFacilitiesChangesConfirmed)) {
      this.pageTitleDisplayLabel = AmendmentLabelStatus.ACTION_NEEDED;
    } else {
      if (this.caseAdditionalSecurityFlagChanged ||
        this.facilitiesChanged ||
        (this.nonReasonableAdjustmentChangesRequired && this.nonReasonableAdjustmentChangesConfirmed) ||
        (this.hearingFacilitiesChangesRequired && this.hearingFacilitiesChangesConfirmed)) {
        this.pageTitleDisplayLabel = AmendmentLabelStatus.AMENDED;
      }
    }

    // Set facilities to compare array, used to compare and display amended labels for facilities
    this.setFacilitiesToCompare();
  }
}
