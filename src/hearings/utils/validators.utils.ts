import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { HearingDateEnum } from '../models/hearings.enum';
import { HearingWindowModel } from '../models/hearingWindow.model';
import { HearingRequestMainModel } from '../models/hearingRequestMain.model';

@Injectable({ providedIn: 'root' })
export class ValidatorsUtils {
  private static validPauseTime(formGroup: FormGroup, pauseTime, startTimes: any, message: string, errorName): any {
    const startTimeControl = formGroup.controls[startTimes.startTime];
    const finishTimeControl = formGroup.controls[startTimes.endTime];

    const pauseTimeControl = formGroup.controls[pauseTime];
    if (!startTimeControl || !finishTimeControl || !startTimeControl.value || !finishTimeControl.value || !pauseTimeControl || !pauseTimeControl.value) {
      return null;
    }
    const startTimeMoment = moment(startTimeControl.value, 'HH:mm');
    const finishTimeMoment = moment(finishTimeControl.value, 'HH:mm');
    const pauseTimeMoment = moment(pauseTimeControl.value, 'HH:mm');

    if (pauseTimeMoment.isValid() && !pauseTimeMoment.isBetween(startTimeMoment, finishTimeMoment, null, '[]')) {
      return { [errorName]: { [pauseTime]: { error: true, message } } };
    }
    return null;
  }

  public numberLargerThanValidator(greaterThan: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inputNumber = Number(control.value) || 0;
      return !isNaN(Number(control.value)) && inputNumber >= greaterThan ? null : { isValid: false };
    };
  }

  public numberMinMaxValidator(minNumber: number, maxNumber: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inputNumber = Number(control.value) || 0;
      return !isNaN(Number(control.value)) && inputNumber >= minNumber && inputNumber <= maxNumber ? null : { isValid: false };
    };
  }

  public numberMultipleValidator(givenNumber: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inputNumber = Number(control.value) || 0;
      return !isNaN(Number(control.value)) && (inputNumber % givenNumber) === 0 ? null : { isValid: false };
    };
  }

  public hearingLengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const days = Number(control.get('days').value) || 0;
      const hours = Number(control.get('hours').value) || 0;
      const minutes = Number(control.get('minutes').value) || 0;
      return days > 0 || hours > 0 || minutes > 0 ? null : { isValid: false };
    };
  }

  public hearingDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValidDate = Object.values(control.value).every((value) => value !== null);
      const selectedDate = moment(Object.values(control.value).join('-'), HearingDateEnum.DefaultFormat);
      return isValidDate && selectedDate.isValid() &&
        (!selectedDate.isBefore() || selectedDate.isSame(new Date(), 'd')) &&
        ((selectedDate.weekday() !== 6) && (selectedDate.weekday() !== 0))
        ? null : { isValid: false };
    };
  }

  public calcBusinessDays(startDate: moment.Moment, endDate: moment.Moment): number {
    const day = startDate;
    let businessDays = 0;

    while (day.isSameOrBefore(endDate, 'day')) {
      if (day.day() !== 0 && day.day() !== 6) {
        businessDays++;
      }
      day.add(1, 'd');
    }
    return businessDays;
  }

  public isWeekendDate(date: moment.Moment): boolean {
    if (date && date.day() === 0 || date.day() === 6) {
      return true;
    }
    return false;
  }

  public hearingDateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const firstDateRangeList = Object.values(control.value[Object.keys(control.value)[0]]);
      const secondDateRangeList = Object.values(control.value[Object.keys(control.value)[1]]);
      const isValidFirstDate = firstDateRangeList.every((value) => value !== null);
      const isValidSecondDate = secondDateRangeList.every((value) => value !== null);
      const firstDateNullLength = firstDateRangeList.filter((value) => value === null).length;
      const secondDateNullLength = secondDateRangeList.filter((value) => value === null).length;
      const firstDate = moment(firstDateRangeList.join('-'), HearingDateEnum.DefaultFormat);
      const secondDate = moment(secondDateRangeList.join('-'), HearingDateEnum.DefaultFormat);
      const isLatestDate = (isValidFirstDate && isValidSecondDate) ? secondDate >= firstDate : (isValidFirstDate || isValidSecondDate);
      const isEarliestDateWeekendDate = this.isWeekendDate(firstDate);
      const isLatestDateWeekendDate = this.isWeekendDate(secondDate);
      return (isValidFirstDate || isValidSecondDate) && (firstDateNullLength === 0 || firstDateNullLength === 3) && (secondDateNullLength === 0 || secondDateNullLength === 3) &&
        (firstDate.isValid() || secondDate.isValid()) && isLatestDate &&
        (isValidFirstDate ? (firstDate.isAfter() || firstDate.isSame(new Date(), 'd')) : true) &&
        (isValidSecondDate ? (secondDate.isAfter() || secondDate.isSame(new Date(), 'd')) : true) &&
        !isEarliestDateWeekendDate && !isLatestDateWeekendDate
        ? null : { isValid: false };
    };
  }

  public errorValidator(message: string): ValidatorFn {
    return (): { [key: string]: any } | null => {
      return { error: message };
    };
  }

  public formArraySelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value.every((option) => !option.selected) ? { isValid: false } : null;
    };
  }

  public validTime(message: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(control.value) ? null : { invalidTime: { error: true, message } };
    };
  }

  public mandatory(message: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        return null;
      }
      return { mandatory: { error: true, message } };
    };
  }

  public validateTimeRange(startTime: string, finishTime: string, message: string): ValidatorFn {
    return (formGroup: FormGroup) => {
      const startTimeControl = formGroup.controls[startTime];
      const finishTimeControl = formGroup.controls[finishTime];
      if (!startTimeControl || !finishTimeControl || !startTimeControl.value || !finishTimeControl.value) {
        return null;
      }
      const startTimeMoment = moment(startTimeControl.value, 'HH:mm');
      const finishTimeMoment = moment(finishTimeControl.value, 'HH:mm');

      if (startTimeMoment.isAfter(finishTimeMoment)) {
        return { invalidTimeRange: { [startTime]: { error: true, message } } };
      }
      return null;
    };
  }

  public validatePauseTimeRange(pauseTime: string, startTimes: any, message: string, errorName): ValidatorFn {
    return (formGroup: FormGroup) => ValidatorsUtils.validPauseTime(formGroup, pauseTime, startTimes, message, errorName);
  }

  public validateDuplicateEntries(index: number, message: string): ValidatorFn {
    return (formGroup: FormGroup) => {
      const parent = formGroup.parent as FormArray;
      const values: string[] = parent && parent.controls
        .filter((control, i) => i !== index)
        .map((c) => JSON.stringify(c.value));
      const value: string = JSON.stringify(formGroup.value);
      const formControlKeys = Object.keys(formGroup.controls);
      if (formControlKeys.some((key) => formGroup.controls[key].invalid)) {
        return null;
      }
      const duplicateEntries = values.filter((v) => v === value);
      return duplicateEntries.length > 0 ? { duplicateEntries: { error: true, message } } : null;
    };
  }

  public validateLinkedHearings(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const linkedCases = formGroup.value.linkedCasesWithHearings;
      if (linkedCases) {
        let isHearingSelected: boolean;
        linkedCases.forEach((caseInfo) => {
          if (caseInfo.caseHearings.find((hearingInfo) => !!hearingInfo.isSelected)) {
            isHearingSelected = true;
          }
        });
        return isHearingSelected ? null : { error: true };
      }

      return null;
    };
  }

  public getHearingWindow(hearingRequestMainModel: HearingRequestMainModel): HearingWindowModel {
    return hearingRequestMainModel.hearingDetails.hearingWindow && Object.keys(hearingRequestMainModel.hearingDetails.hearingWindow).length === 0 ?
      null : hearingRequestMainModel.hearingDetails.hearingWindow;
  }
}

