import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { ErrorMessagesModel, GovUiConfigModel } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/models';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import * as fromHearingStore from '../../../../hearings/store';
import { HearingWindowModel } from '../../../models/hearingWindow.model';
import {
  ACTION,
  HearingDateEnum,
  HearingDatePriorityConstEnum,
  HearingDatePriorityEnum,
  Mode,
  RadioOptions
} from '../../../models/hearings.enum';
import { AmendmentLabelStatus } from '../../../models/hearingsUpdateMode.enum';
import { SourceOfData } from '../../../../../api/hearings/models/hearings.enum';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { UnavailabilityRangeModel } from '../../../models/unavailabilityRange.model';
import { HearingsService } from '../../../services/hearings.service';
import { HearingsUtils } from '../../../utils/hearings.utils';
import { ValidatorsUtils } from '../../../utils/validators.utils';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { isEmpty } from 'lodash';

@Component({
  selector: 'exui-hearing-timing',
  templateUrl: './hearing-timing.component.html'
})
export class HearingTimingComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public priorityForm: FormGroup;
  public priorities: LovRefDataModel[];
  public checkedHearingAvailability: string;
  public partiesNotAvailableDates: string[] = [];
  public firstHearingDate: GovUiConfigModel;
  public earliestHearingDate: GovUiConfigModel;
  public latestHearingDate: GovUiConfigModel;
  public validationErrors: { id: string, message: string }[] = [];
  public hearingLengthErrorValue: string;
  public hearingPriorityError: string;
  public hearingPriorityDateError: string;
  public dateRangeWeekendError: string;
  public firstDateOfHearingError: ErrorMessagesModel;
  public earliestDateOfHearingError: ErrorMessagesModel;
  public latestDateOfHearingError: ErrorMessagesModel;
  public priorityFormInfo: { days: string, hours: string, minutes: string, startDate: Date, firstDate: Date, secondDate: Date, priority: string };
  public hearingWindowChangesRequired: boolean;
  public hearingWindowChangesConfirmed: boolean;
  public hearingUnavailabilityDatesChanged: boolean;
  public dateRangeStartChanged: boolean;
  public dateRangeEndChanged: boolean;
  public firstDateTimeMustBeChanged: boolean;
  public durationChanged: boolean;
  public priorityChanged: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;
  public duration: number;
  public hearingWindow: HearingWindowModel;
  public hearingPriorityType: string;
  public unavailabilityDateList: UnavailabilityRangeModel[];
  public sourceOfData = SourceOfData.HEARING_REQUEST_MAIN_MODEL;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly validatorsUtils: ValidatorsUtils,
    protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly hearingsService: HearingsService,
    protected readonly featureToggleService: FeatureToggleService,
    protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
  }

  public get firstHearingFormGroup(): FormGroup {
    return this.priorityForm.controls.firstHearing as FormGroup;
  }

  public get dateRangeHearingFormGroup(): FormGroup {
    return this.priorityForm.controls.dateRangeHearing as FormGroup;
  }

  public get earliestHearingFormGroup(): FormGroup {
    return this.dateRangeHearingFormGroup.controls.earliestHearing as FormGroup;
  }

  public get latestHearingFormGroup(): FormGroup {
    return this.dateRangeHearingFormGroup.controls.latestHearing as FormGroup;
  }

  public ngOnInit(): void {
    this.initDateConfig();
    this.setSourceOfData();
    this.setDataItems();
    if (this.hearingCondition.mode === Mode.VIEW_EDIT) {
      this.setAmendmentFlags();
    }
    this.getFormData(this.duration, HearingsUtils.getHearingWindow(this.hearingWindow), this.hearingPriorityType);
    this.initForm();
    this.priorities = this.route.snapshot.data.hearingPriorities.sort((currentPriority: { order: number; }, nextPriority: { order: number; }) => (currentPriority.order < nextPriority.order ? -1 : 1));
    this.checkUnavailableDatesList(this.unavailabilityDateList);
  }

  setSourceOfData() {
    if (this.hearingCondition.mode === Mode.VIEW_EDIT) {
      if (this.hearingsService.propertiesUpdatedOnPageVisit?.hasOwnProperty('hearingWindow')) {
        this.hearingWindowChangesRequired = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingWindowChangesRequired;
        this.hearingWindowChangesConfirmed = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingWindowChangesConfirmed;
      }
      if (this.hearingWindowChangesRequired && !this.hearingWindowChangesConfirmed) {
        this.sourceOfData = SourceOfData.SERVICE_HEARING_VALUES;
      } else {
        this.sourceOfData = SourceOfData.HEARING_REQUEST_MAIN_MODEL;
      }
    } else {
      this.sourceOfData = SourceOfData.HEARING_REQUEST_MAIN_MODEL;
    }
  }

  public setDataItems() {
    if (this.sourceOfData === SourceOfData.SERVICE_HEARING_VALUES) {
      this.duration = this.serviceHearingValuesModel.duration;
      this.hearingWindow = this.serviceHearingValuesModel.hearingWindow;
      this.hearingPriorityType = this.serviceHearingValuesModel.hearingPriorityType;
      this.unavailabilityDateList = this.serviceHearingValuesModel.parties.flatMap((party) => party.unavailabilityRanges);
    } else {
      this.duration = this.hearingRequestMainModel.hearingDetails.duration;
      this.hearingWindow = this.hearingRequestMainModel.hearingDetails.hearingWindow;
      this.hearingPriorityType = this.hearingRequestMainModel.hearingDetails.hearingPriorityType;
      this.unavailabilityDateList = this.hearingRequestMainModel.partyDetails.flatMap((party) => party.unavailabilityRanges);
    }
  }

  public setAmendmentFlags() {
    this.hearingUnavailabilityDatesChanged = this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingUnavailabilityDatesChanged &&
      !this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit?.hearingUnavailabilityDatesConfirmed;
    this.dateRangeStartChanged = HearingsUtils.hasDateChanged(this.hearingRequestMainModel.hearingDetails.hearingWindow?.dateRangeStart, this.serviceHearingValuesModel.hearingWindow?.dateRangeStart);
    this.dateRangeEndChanged = HearingsUtils.hasDateChanged(this.hearingRequestMainModel.hearingDetails.hearingWindow?.dateRangeEnd, this.serviceHearingValuesModel.hearingWindow?.dateRangeEnd);
    this.firstDateTimeMustBeChanged = HearingsUtils.hasDateChanged(this.hearingRequestMainModel.hearingDetails.hearingWindow?.firstDateTimeMustBe, this.serviceHearingValuesModel.hearingWindow?.firstDateTimeMustBe);
    this.durationChanged = HearingsUtils.hasHearingDurationChanged(this.hearingRequestMainModel.hearingDetails.duration, this.serviceHearingValuesModel.duration);
    this.priorityChanged = HearingsUtils.hasHearingPriorityChanged(this.hearingRequestMainModel.hearingDetails.hearingPriorityType, this.serviceHearingValuesModel.hearingPriorityType);
  }

  public getFormData(durationInput: number, hearingWindowInput: HearingWindowModel, priorityInput: string): void {
    let duration: number;
    let startDate: Date = null;
    let firstDate: Date = null;
    let secondDate: Date = null;
    duration = durationInput ? durationInput : 0;
    const hearingWindow: HearingWindowModel = hearingWindowInput;
    if (hearingWindow && (hearingWindow.dateRangeStart || hearingWindow.dateRangeEnd)) {
      this.checkedHearingAvailability = RadioOptions.CHOOSE_DATE_RANGE;
      startDate = hearingWindow.dateRangeStart && new Date(hearingWindow.dateRangeStart);
      secondDate = hearingWindow.dateRangeEnd && new Date(hearingWindow.dateRangeEnd);
    } else if (hearingWindow && hearingWindow.firstDateTimeMustBe) {
      this.checkedHearingAvailability = RadioOptions.YES;
      firstDate = new Date(hearingWindow.firstDateTimeMustBe);
    } else if (isEmpty(hearingWindow)) {
      this.checkedHearingAvailability = RadioOptions.NO;
    }
    const priority: string = priorityInput ? priorityInput : '';

    let days = 0;
    let hours = 0;
    let minutes = 0;
    if (duration > 0) {
      minutes = duration % 60;
      duration = duration - minutes;
      days = Math.floor((duration / 60) / 6);
      hours = Math.floor((duration / 60) % 6);
    }
    this.priorityFormInfo = {
      days: days > 0 ? `${days}` : '',
      hours: hours > 0 ? `${hours}` : '',
      minutes: minutes > 0 ? `${minutes}` : '',
      firstDate, secondDate, priority, startDate
    };
  }

  public initDateConfig(): void {
    this.firstHearingDate = {
      id: 'firstHearingDate',
      name: 'firstHearingDate',
      hint: '',
      classes: 'govuk-fieldset__legend govuk-fieldset__legend--s',
      label: 'The first date of the hearing must be'
    };

    this.earliestHearingDate = {
      id: 'earliestHearingDate',
      name: 'earliestHearingDate',
      hint: '',
      classes: 'govuk-fieldset__legend govuk-fieldset__legend--s',
      label: 'Earliest start date'
    };
    this.latestHearingDate = {
      id: 'latestHearingDate',
      name: 'latestHearingDate',
      hint: '',
      classes: 'govuk-fieldset__legend govuk-fieldset__legend--s',
      label: 'Latest end date'
    };
  }

  public initForm(): void {
    this.priorityForm = this.formBuilder.group({
      durationLength: this.formBuilder.group({
        days: [this.priorityFormInfo.days, this.validatorsUtils.numberLargerThanValidator(HearingDatePriorityConstEnum.MinDays)],
        hours: [this.priorityFormInfo.hours, [this.validatorsUtils.numberMinMaxValidator(HearingDatePriorityConstEnum.MinHours, HearingDatePriorityConstEnum.MaxHours)]],
        minutes: [this.priorityFormInfo.minutes, [this.validatorsUtils.numberMultipleValidator(HearingDatePriorityConstEnum.MinutesMuliplier)]]
      }, { validator: this.validatorsUtils.hearingLengthValidator() }),
      specificDate: [this.checkedHearingAvailability, Validators.required],
      firstHearing: this.formBuilder.group({
        firstHearingDate_day: [this.priorityFormInfo.firstDate && this.priorityFormInfo.firstDate.getDate()],
        firstHearingDate_month: [this.priorityFormInfo.firstDate && this.priorityFormInfo.firstDate.getMonth() + 1],
        firstHearingDate_year: [this.priorityFormInfo.firstDate && this.priorityFormInfo.firstDate.getFullYear()]
      }),
      dateRangeHearing: this.formBuilder.group({
        earliestHearing: this.formBuilder.group({
          earliestHearingDate_day: [this.priorityFormInfo.startDate && this.priorityFormInfo.startDate.getDate()],
          earliestHearingDate_month: [this.priorityFormInfo.startDate && this.priorityFormInfo.startDate.getMonth() + 1],
          earliestHearingDate_year: [this.priorityFormInfo.startDate && this.priorityFormInfo.startDate.getFullYear()]
        }),
        latestHearing: this.formBuilder.group({
          latestHearingDate_day: [this.priorityFormInfo.secondDate && this.priorityFormInfo.secondDate.getDate()],
          latestHearingDate_month: [this.priorityFormInfo.secondDate && this.priorityFormInfo.secondDate.getMonth() + 1],
          latestHearingDate_year: [this.priorityFormInfo.secondDate && this.priorityFormInfo.secondDate.getFullYear()]
        })
      }),
      priority: [this.priorityFormInfo.priority, Validators.required]
    });
  }

  public showDateAvailability(): void {
    this.checkedHearingAvailability = this.priorityForm.controls.specificDate.value;
    this.firstHearingFormGroup.clearValidators();
    this.dateRangeHearingFormGroup.clearValidators();
    if (this.checkedHearingAvailability === RadioOptions.YES) {
      this.firstHearingFormGroup.setValidators([this.validatorsUtils.hearingDateValidator()]);
    } else if (this.checkedHearingAvailability === RadioOptions.CHOOSE_DATE_RANGE) {
      this.dateRangeHearingFormGroup.setValidators([this.validatorsUtils.hearingDateRangeValidator()]);
    }
    this.firstHearingFormGroup.updateValueAndValidity();
    this.dateRangeHearingFormGroup.updateValueAndValidity();
  }

  public checkUnavailableDatesList(dateList: UnavailabilityRangeModel[]): void {
    dateList.forEach((dateRange) => {
      if (dateRange) {
        this.setUnavailableDates(dateRange);
      }
    });
    this.partiesNotAvailableDates.sort((currentDate, previousDate) => new Date(currentDate).getTime() - new Date(previousDate).getTime());
  }

  public setUnavailableDates(dateRange: UnavailabilityRangeModel): void {
    const startDate = moment(dateRange.unavailableFromDate);
    const endDate = moment(dateRange.unavailableToDate);

    while (startDate <= endDate) {
      const currentDate = startDate.format(HearingDateEnum.DisplayMonth);
      if (!this.partiesNotAvailableDates.includes(currentDate)) {
        this.partiesNotAvailableDates.push(currentDate);
      }
      startDate.add(1, 'd');
    }
  }

  public isWeekDay(givenDate: moment.Moment): boolean {
    return (givenDate.weekday() !== 6) && (givenDate.weekday() !== 0);
  }

  public showHearingLengthError(): void {
    const durationLengthFormGroup = this.priorityForm.controls.durationLength;
    if (!durationLengthFormGroup.get('days').valid) {
      this.hearingLengthErrorValue = HearingDatePriorityEnum.LengthError;
      this.validationErrors.push({ id: 'durationdays', message: HearingDatePriorityEnum.LengthError });
    } else if (!durationLengthFormGroup.get('hours').valid) {
      this.hearingLengthErrorValue = isNaN(durationLengthFormGroup.get('hours').value)
        ? HearingDatePriorityEnum.LengthError
        : HearingDatePriorityEnum.LengthHoursError;
      this.validationErrors.push({ id: 'durationhours', message: this.hearingLengthErrorValue });
    } else if (!durationLengthFormGroup.get('minutes').valid) {
      this.hearingLengthErrorValue = isNaN(durationLengthFormGroup.get('minutes').value)
        ? HearingDatePriorityEnum.LengthError
        : HearingDatePriorityEnum.LengthMinutesError;
      this.validationErrors.push({ id: 'durationmins', message: this.hearingLengthErrorValue });
    } else if (!durationLengthFormGroup.valid) {
      this.hearingLengthErrorValue = HearingDatePriorityEnum.TotalLengthError;
      this.validationErrors.push({ id: 'durationdays', message: HearingDatePriorityEnum.TotalLengthError });
    }
  }

  public showChosenDateError(): void {
    const firstHearingDateEntered = this.isDatePopulated(this.firstHearingFormGroup, this.firstHearingDate.id);
    const chosenDate = moment(this.getDateFormatted(this.firstHearingFormGroup, this.firstHearingDate.id), HearingDateEnum.DefaultFormat);
    const isFirstHearingDateValid = chosenDate.isValid();
    const isPastDate = chosenDate.isBefore(moment().startOf('day'));
    const isWeekday = this.isWeekDay(chosenDate);
    if ((firstHearingDateEntered && !isFirstHearingDateValid) || !firstHearingDateEntered) {
      this.validationErrors.push({
        id: this.firstHearingDate.id,
        message: HearingDatePriorityEnum.InValidHearingDateError
      });
      this.firstDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.InValidHearingDateError] };
    } else if (!isFirstHearingDateValid) {
      this.validationErrors.push({ id: this.firstHearingDate.id, message: HearingDatePriorityEnum.DateRangeError });
      this.firstDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.DateRangeError] };
    } else if (!isWeekday) {
      this.validationErrors.push({ id: this.firstHearingDate.id, message: HearingDatePriorityEnum.WeekendError });
      this.firstDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.WeekendError] };
    } else if (isPastDate) {
      this.validationErrors.push({ id: this.firstHearingDate.id, message: HearingDatePriorityEnum.DatePastError });
      this.firstDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.DatePastError] };
    }
  }

  public showChosenDateRangeError(): void {
    const EarliestDateEntered= this.isDatePopulated(this.earliestHearingFormGroup, this.earliestHearingDate.id);
    const LatestDateEntered = this.isDatePopulated(this.latestHearingFormGroup, this.latestHearingDate.id);
    const chosenEarliestDate = moment(this.getDateFormatted(this.earliestHearingFormGroup, this.earliestHearingDate.id), HearingDateEnum.DefaultFormat);
    const chosenLatestDate = moment(this.getDateFormatted(this.latestHearingFormGroup, this.latestHearingDate.id), HearingDateEnum.DefaultFormat);
    const isEarliestDateValid = chosenEarliestDate.isValid();
    const isLatestHearingDateValid = chosenLatestDate.isValid();
    const isLatestBeforeEarliest = chosenEarliestDate > chosenLatestDate;
    const isPastEarliestDate = chosenEarliestDate.isBefore(moment().startOf('day'));
    const isPastLatestDate = chosenLatestDate.isBefore(moment().startOf('day'));
    const isEarliestDateWeekendDate = this.validatorsUtils.isWeekendDate(chosenEarliestDate);
    const isLatestDateWeekendDate = this.validatorsUtils.isWeekendDate(chosenLatestDate);
    const numberOfBusinessDays = this.validatorsUtils.calcBusinessDays(chosenEarliestDate, chosenLatestDate);
    let invalidDate = false;

    // First check if dates are entered, are they valid, real dates.

    if (EarliestDateEntered && !isEarliestDateValid){
      this.earliestDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.InValidHearingDateError] };
      invalidDate = true;
    }
    if (LatestDateEntered && !isLatestHearingDateValid){
      this.latestDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.InValidHearingDateError] };
      invalidDate = true;
    }
    if (invalidDate) {
      if ((this?.earliestDateOfHearingError && this?.earliestDateOfHearingError.isInvalid) && (this?.latestDateOfHearingError && this?.latestDateOfHearingError.isInvalid)) {
        this.validationErrors.push({
          id: this.earliestHearingDate.id,
          message: HearingDatePriorityEnum.EitherDateRangeError
        });
      } else {
        this.validationErrors.push({
          id: this.earliestHearingDate.id,
          message: HearingDatePriorityEnum.InValidHearingDateError
        });
      }
      return;
    }

    // With dates confirmed to be real dates, apply validation rules to dates

    if (EarliestDateEntered && isPastEarliestDate) {
      this.validationErrors.push({ id: this.earliestHearingDate.id, message: HearingDatePriorityEnum.DatePastError });
      this.earliestDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.DatePastError] };
    } else if (LatestDateEntered && isPastLatestDate) {
      this.validationErrors.push({ id: this.latestHearingDate.id, message: HearingDatePriorityEnum.DatePastError });
      this.latestDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.DatePastError] };
    } else if (EarliestDateEntered && LatestDateEntered && isLatestBeforeEarliest) {
      this.validationErrors.push({
        id: this.earliestHearingDate.id,
        message: HearingDatePriorityEnum.EarliestHearingDateError
      });
      this.earliestDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.EarliestHearingDateError] };
    } else if ((isEarliestDateWeekendDate || isLatestDateWeekendDate) && numberOfBusinessDays === 0) {
      this.validationErrors.push({ id: this.earliestHearingDate.id, message: HearingDatePriorityEnum.WeekDayError });
      this.dateRangeWeekendError = HearingDatePriorityEnum.WeekDayError;
    } else if (EarliestDateEntered && LatestDateEntered && (numberOfBusinessDays * 6 * 60) < this.calculateDuration()) {
      this.validationErrors.push({ id: this.earliestHearingDate.id, message: HearingDatePriorityEnum.NotEnoughDaysInDateRangeError });
      this.earliestDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.NotEnoughDaysInDateRangeError] };
      this.latestDateOfHearingError = { isInvalid: true, messages: [HearingDatePriorityEnum.NotEnoughDaysInDateRangeError] };
    }
  }

  public isDatePopulated(formGroup: FormGroup, fieldName: string) {
    const day = formGroup.get(`${fieldName}_day`).value ? formGroup.get(`${fieldName}_day`).value : '';
    const month = formGroup.get(`${fieldName}_month`).value ? formGroup.get(`${fieldName}_month`).value : '';
    const year = formGroup.get(`${fieldName}_year`).value ? formGroup.get(`${fieldName}_year`).value : '';
    return !(day === '' && month === '' && year === '');
  }

  public showHearingDateError(): void {
    if (!this.priorityForm.controls.specificDate.valid) {
      this.hearingPriorityDateError = HearingDatePriorityEnum.PriorityDateError;
      this.validationErrors.push({ id: 'noSpecificDate', message: HearingDatePriorityEnum.PriorityDateError });
    } else if (this.priorityForm.controls.specificDate.value === RadioOptions.YES) {
      this.showChosenDateError();
    } else if (this.priorityForm.controls.specificDate.value === RadioOptions.CHOOSE_DATE_RANGE) {
      this.showChosenDateRangeError();
    }
  }

  public showHearingPriorityError(): void {
    if (!this.priorityForm.controls.priority.valid) {
      this.hearingPriorityError = HearingDatePriorityEnum.PriorityError;
      this.validationErrors.push({ id: this.priorities[0].key, message: HearingDatePriorityEnum.PriorityError });
    }
  }

  public checkFormData(): void {
    this.validationErrors = [];
    this.hearingLengthErrorValue = null;
    this.latestDateOfHearingError = null;
    this.earliestDateOfHearingError = null;
    this.firstDateOfHearingError = null;
    this.hearingPriorityError = null;
    this.hearingPriorityDateError = null;
    this.dateRangeWeekendError = null;
    if (!this.priorityForm.valid) {
      this.showHearingLengthError();
      this.showHearingDateError();
      this.showHearingPriorityError();
    }
  }

  public getDateFormatted(formGroup: FormGroup, fieldName: string): string {
    const day = formGroup.get(`${fieldName}_day`).value;
    const month = formGroup.get(`${fieldName}_month`).value;
    const year = formGroup.get(`${fieldName}_year`).value;
    if (day === '' || month === '' || year === '') {
      return null;
    }
    return `${day}-${month}-${year}`;
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
      this.checkFormData();
      if (this.isFormValid()) {
        this.prepareHearingRequestData();
        super.navigateAction(action);
      }
    } else if (action === ACTION.BACK) {
      super.navigateAction(action);
    }
  }

  public prepareHearingRequestData(): void {
    const duration = this.calculateDuration();
    let firstDateMustBe = null;
    let startDate = null;
    let endDate = null;
    let hearingWindow: HearingWindowModel = {};
    if (this.priorityForm.value.specificDate === RadioOptions.YES) {
      firstDateMustBe = `${moment.utc(Object.values(this.priorityForm.value.firstHearing).join('-'), HearingDateEnum.DefaultFormat).local().toISOString()}`;
    } else if (this.priorityForm.value.specificDate === RadioOptions.CHOOSE_DATE_RANGE) {
      startDate = this.priorityForm.value.dateRangeHearing.earliestHearing
        && this.priorityForm.value.dateRangeHearing.earliestHearing.earliestHearingDate_day
        && this.priorityForm.value.dateRangeHearing.earliestHearing.earliestHearingDate_month
        && this.priorityForm.value.dateRangeHearing.earliestHearing.earliestHearingDate_year ?
        `${moment.utc(Object.values(this.priorityForm.value.dateRangeHearing.earliestHearing).join('-'), HearingDateEnum.DefaultFormat).local().toISOString()}` : null;
      endDate = this.priorityForm.value.dateRangeHearing.latestHearing
        && this.priorityForm.value.dateRangeHearing.latestHearing.latestHearingDate_day
        && this.priorityForm.value.dateRangeHearing.latestHearing.latestHearingDate_month
        && this.priorityForm.value.dateRangeHearing.latestHearing.latestHearingDate_year ?
        `${moment.utc(Object.values(this.priorityForm.value.dateRangeHearing.latestHearing).join('-'), HearingDateEnum.DefaultFormat).local().toISOString()}` : null;
    }
    if (startDate || endDate) {
      hearingWindow = {
        dateRangeStart: startDate,
        dateRangeEnd: endDate
      };
    } else if (firstDateMustBe) {
      hearingWindow = {
        firstDateTimeMustBe: firstDateMustBe
      };
    }
    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        duration,
        hearingWindow,
        hearingPriorityType: this.priorityForm.value.priority
      },
      partyDetails: [...this.updatePartyDetails(this.serviceHearingValuesModel.parties)]
    };
    if (this.hearingCondition.mode === Mode.VIEW_EDIT) {
      if (this.hearingsService.propertiesUpdatedOnPageVisit?.hasOwnProperty('hearingWindow')) {
        this.hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingWindowChangesConfirmed = true;
      }
      if (this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit.hearingUnavailabilityDatesChanged ||
        this.hearingsService.propertiesUpdatedOnPageVisit?.afterPageVisit.partyDetailsAnyChangesRequired) {
        this.hearingsService.propertiesUpdatedOnPageVisit.afterPageVisit.hearingUnavailabilityDatesConfirmed = true;
      }
    }
  }

  public updatePartyDetails(parties: PartyDetailsModel[]): PartyDetailsModel[] {
    const newParty: PartyDetailsModel[] = [];

    if (Array.isArray(this.hearingRequestMainModel.partyDetails)) {
      this.hearingRequestMainModel.partyDetails.forEach((party) => {
        const serviceParty = parties.find((serviceParty) => serviceParty.partyID === party.partyID);
        if (serviceParty) {
          newParty.push({
            ...party,
            unavailabilityRanges: this.compareAndUpdateServiceHearingValues(party?.unavailabilityRanges, serviceParty?.unavailabilityRanges)
          });
        }
      });
    }

    parties.filter((svcParty) => !newParty.find((y) => y.partyID === svcParty.partyID))
      .forEach((svcParty) => {
        newParty.push(svcParty);
      });
    return newParty;
  }

  private compareAndUpdateServiceHearingValues(currentValue, serviceHearingValue) {
    if (!currentValue && !serviceHearingValue) {
      return currentValue;
    }
    return serviceHearingValue;
  }

  public calculateDuration(): number {
    return Number(this.priorityForm.value.durationLength.days * 6 * 60) +
      Number(this.priorityForm.value.durationLength.hours * 60) +
      Number(this.priorityForm.value.durationLength.minutes);
  }

  public isFormValid(): boolean {
    return this.validationErrors.length === 0;
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }
}
