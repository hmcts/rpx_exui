import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';
import { HearingRequestMainModel } from '../../../../models/hearingRequestMain.model';
import { HearingWindowModel } from '../../../../models/hearingWindow.model';
import { HearingDateEnum, RadioOptions } from '../../../../models/hearings.enum';
import { AmendmentLabelStatus } from '../../../../models/hearingsUpdateMode.enum';
import { LovRefDataModel } from '../../../../models/lovRefData.model';
import { ServiceHearingValuesModel } from '../../../../models/serviceHearingValues.model';
import { HearingsService } from '../../../../services/hearings.service';
import { HearingsUtils } from '../../../../utils/hearings.utils';

@Component({
  selector: 'exui-hearing-timing-section',
  templateUrl: './hearing-timing-section.component.html'
})
export class HearingTimingSectionComponent implements OnInit {
  @Input() public hearingPrioritiesRefData: LovRefDataModel[];
  @Input() public hearingRequestMainModel: HearingRequestMainModel;
  @Input() public hearingRequestToCompareMainModel: HearingRequestMainModel;
  @Input() public serviceHearingValuesModel: ServiceHearingValuesModel;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  constructor(private readonly hearingsService: HearingsService) {
  }

  public hearingLength: string;
  public specificDate: string;
  public specificDateSelection: string;
  public earliestHearingDate: string;
  public latestHearingDate: string;
  public firstHearingDate: string;
  public hearingPriority: string;
  public hearingLengthChanged: boolean;
  public hearingPriorityChanged: boolean;
  public hearingUnavailabilityDatesChanged: boolean;
  public partyDetailsAnyChangesRequired: boolean;
  public hearingUnavailabilityDatesConfirmed: boolean;
  public hearingWindowChangesRequired: boolean;
  public hearingWindowChangesConfirmed: boolean;
  public showActionNeededLabelForPageTitle: boolean;
  public showAmendedLabelForPageTitle: boolean;
  public dateRangeStartChanged: boolean;
  public dateRangeEndChanged: boolean;
  public hearingDateChanged: boolean;
  public firstDateTimeMustBeChanged: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;
  public radioOptions = RadioOptions;

  public ngOnInit(): void {
    this.hearingWindowChangesRequired = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit.hearingWindowChangesRequired;
    this.hearingWindowChangesConfirmed = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingWindowChangesConfirmed;
    this.hearingUnavailabilityDatesConfirmed = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingUnavailabilityDatesConfirmed;
    this.partyDetailsAnyChangesRequired = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.partyDetailsAnyChangesRequired;
    this.hearingLength = HearingsUtils.getHearingLength(this.hearingRequestMainModel.hearingDetails.duration);
    this.specificDate = this.getSpecificDate();
    this.hearingPriority = this.getHearingPriority();
    const hearingWindow = this.hearingRequestMainModel.hearingDetails.hearingWindow;
    this.specificDateSelection = this.getSpecificDateSelection(hearingWindow);
    this.earliestHearingDate = this.getEarliestHearingDate(hearingWindow);
    this.latestHearingDate = this.getLatestHearingDate(hearingWindow);
    this.firstHearingDate = this.getFirstHearingDate(hearingWindow);

    this.setAmendmentLabels();
  }

  public onChange(fragmentId: string): void {
    let changeLink = '';
    switch (fragmentId) {
      case 'hearingLength':
        changeLink = '/hearings/request/hearing-timing#durationdays';
        break;
      case 'hearingSpecificDate':
        changeLink = this.setDateSectionForChange();
        break;
      case 'hearingPriority':
        changeLink = '/hearings/request/hearing-timing#urgent';
        break;
    }
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }

  private setDateSectionForChange(): string{
    const BASE_URL = '/hearings/request/hearing-timing#';
    if (this.earliestHearingDate.length > 0 || this.latestHearingDate.length > 0) {
      return BASE_URL + 'hearingDateRange';
    }
    if (this.firstHearingDate.length > 0) {
      return BASE_URL + 'hearingSingleDate';
    }
    return BASE_URL + 'noSpecificDate';
  }

  private getSpecificDate(): string {
    let specificDateSelection: string = RadioOptions.NO;
    let earliestHearingDate: string = '';
    let latestHearingDate: string = '';
    const hearingWindow = this.hearingRequestMainModel.hearingDetails.hearingWindow;

    if (hearingWindow?.dateRangeStart || hearingWindow?.dateRangeEnd) {
      specificDateSelection = RadioOptions.CHOOSE_DATE_RANGE;
      earliestHearingDate = moment(hearingWindow.dateRangeStart).format(HearingDateEnum.DisplayMonth);
      latestHearingDate = hearingWindow.dateRangeEnd && moment(hearingWindow.dateRangeEnd).format(HearingDateEnum.DisplayMonth);
      specificDateSelection += earliestHearingDate !== HearingDateEnum.InvalidDate ? `<br>Earliest start date: ${earliestHearingDate}` : '';
      specificDateSelection += latestHearingDate && latestHearingDate !== HearingDateEnum.InvalidDate ? `<br>Latest end date: ${latestHearingDate}` : '';
    } else if (hearingWindow?.firstDateTimeMustBe) {
      specificDateSelection = RadioOptions.YES;
      const firstDate = moment(hearingWindow.firstDateTimeMustBe).format(HearingDateEnum.DisplayMonth);
      specificDateSelection += firstDate !== HearingDateEnum.InvalidDate ? `<dt class="heading-h3 bottom-0">The first date of the hearing must be</dt><exui-amendment-label [displayLabel]="${AmendmentLabelStatus.ACTION_NEEDED}"></exui-amendment-label>${firstDate}` : '';
    } else if (hearingWindow === null) {
      specificDateSelection = RadioOptions.NO;
    }

    return specificDateSelection;
  }

  private getSpecificDateSelection(hearingWindow: HearingWindowModel): string {
    if (hearingWindow?.dateRangeStart || hearingWindow?.dateRangeEnd) {
      return RadioOptions.CHOOSE_DATE_RANGE;
    }
    if (hearingWindow?.firstDateTimeMustBe) {
      return RadioOptions.YES;
    }
    return RadioOptions.NO;
  }

  private getEarliestHearingDate(hearingWindow: HearingWindowModel): string {
    return hearingWindow?.dateRangeStart
      ? moment(hearingWindow.dateRangeStart).format(HearingDateEnum.DisplayMonth)
      : '';
  }

  private getLatestHearingDate(hearingWindow: HearingWindowModel): string {
    return hearingWindow?.dateRangeEnd
      ? moment(hearingWindow.dateRangeEnd).format(HearingDateEnum.DisplayMonth)
      : '';
  }

  private getFirstHearingDate(hearingWindow: HearingWindowModel): string {
    return hearingWindow?.firstDateTimeMustBe
      ? moment(hearingWindow.firstDateTimeMustBe).format(HearingDateEnum.DisplayMonth)
      : '';
  }

  private getHearingPriority(): string {
    const hearingPriorityFromRefData = this.hearingPrioritiesRefData.find((priority) => priority.key === this.hearingRequestMainModel.hearingDetails.hearingPriorityType);
    return (hearingPriorityFromRefData?.value_en || '');
  }

  private setAmendmentLabels(): void {
    this.hearingLengthChanged = HearingsUtils.hasHearingDurationChanged(this.hearingRequestToCompareMainModel.hearingDetails.duration, this.hearingRequestMainModel.hearingDetails.duration);

    this.dateRangeStartChanged = HearingsUtils.hasDateChanged(this.hearingRequestToCompareMainModel.hearingDetails.hearingWindow?.dateRangeStart, this.hearingRequestMainModel.hearingDetails.hearingWindow?.dateRangeStart);

    this.dateRangeEndChanged = HearingsUtils.hasDateChanged(this.hearingRequestToCompareMainModel.hearingDetails.hearingWindow?.dateRangeEnd, this.hearingRequestMainModel.hearingDetails.hearingWindow?.dateRangeEnd);

    this.firstDateTimeMustBeChanged = HearingsUtils.hasDateChanged(this.hearingRequestToCompareMainModel.hearingDetails.hearingWindow?.firstDateTimeMustBe, this.hearingRequestMainModel.hearingDetails.hearingWindow?.firstDateTimeMustBe);

    this.hearingPriorityChanged = HearingsUtils.hasHearingPriorityChanged(this.hearingRequestToCompareMainModel.hearingDetails.hearingPriorityType, this.hearingRequestMainModel.hearingDetails.hearingPriorityType);

    this.hearingUnavailabilityDatesChanged = !_.isEqual(
      HearingsUtils.getPartiesNotAvailableDates(this.hearingRequestMainModel.partyDetails),
      HearingsUtils.getPartiesNotAvailableDates(this.hearingRequestToCompareMainModel.partyDetails)
    );
    this.hearingDateChanged = this.dateRangeEndChanged || this.dateRangeStartChanged || this.firstDateTimeMustBeChanged;

    this.showActionNeededLabelForPageTitle =
      (!this.hearingWindowChangesConfirmed && this.hearingWindowChangesRequired) ||
      (!this.hearingUnavailabilityDatesConfirmed && this.hearingUnavailabilityDatesChanged) ||
      (!this.hearingUnavailabilityDatesConfirmed && this.partyDetailsAnyChangesRequired);

    this.showAmendedLabelForPageTitle = !this.showActionNeededLabelForPageTitle &&
      (
        (this.hearingWindowChangesConfirmed && this.hearingWindowChangesRequired) ||
        this.hearingLengthChanged ||
        this.hearingDateChanged ||
        this.hearingPriorityChanged ||
        this.hearingUnavailabilityDatesConfirmed
      );
  }
}
