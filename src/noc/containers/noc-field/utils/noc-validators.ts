import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export class NocValidators {
  public static numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return;
      }
      if (!control.value.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) {
        return { number: true };
      }
      return;
    };
  }

  public static postcodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return;
      }
      if (!control.value.toString().match(/^(([A-Za-z]{1,2}[0-9][A-Za-z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Za-z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Za-z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/)) {
        return { postcode: true };
      }
      return;
    };
  }

  public static phoneUKValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return;
      }
      // eslint-disable-next-line no-useless-escape
      if (!control.value.toString().match(/^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/)) {
        return { phoneUK: true };
      }
      return;
    };
  }

  public static dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return;
      }
      const dateValues = control.value.toString().split('-');
      if (dateValues) {
        if (dateValues[0]) {
          const number = Number(dateValues[0]);
          if (number === 0 || dateValues[0].length < 4) {
            return { date: true, year: true, valid: false };
          }
        } else {
          return { date: true, year: true };
        }
        if (dateValues[1]) {
          const number = Number(dateValues[1]);
          if (number === 0 || number > 12) {
            return { date: true, month: true, valid: false };
          }
        } else {
          return { date: true, month: true };
        }
        if (dateValues[2]) {
          const number = Number(dateValues[2]);
          if (number === 0 || number > 31) {
            return { date: true, day: true, valid: false };
          }
        } else {
          return { date: true, day: true };
        }
      }
      if (!moment(control.value.toString(), 'YYYY-MM-DD', true).isValid()) {
        return { date: true };
      }
      return;
    };
  }

  public static dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return;
      }
      const [datePart, timePart] = control.value.toString().split('T');
      const dateValues = datePart.split('-');
      if (dateValues) {
        if (dateValues[0]) {
          const number = Number(dateValues[0]);
          if (number === 0 || dateValues[0].length < 4) {
            return { datetime: true, year: true, valid: false };
          }
        } else {
          return { datetime: true, year: true };
        }
        if (dateValues[1]) {
          const number = Number(dateValues[1]);
          if (number === 0 || number > 12) {
            return { datetime: true, month: true, valid: false };
          }
        } else {
          return { datetime: true, month: true };
        }
        if (dateValues[2]) {
          const number = Number(dateValues[2]);
          if (number === 0 || number > 31) {
            return { datetime: true, day: true, valid: false };
          }
        } else {
          return { datetime: true, day: true };
        }
        if (timePart) {
          const timeValues = timePart.split(':');
          if (timeValues[0]) {
            const number = Number(timeValues[0]);
            if (number > 23) {
              return { datetime: true, hour: true, valid: false };
            }
          } else {
            return { datetime: true, hour: true };
          }
          if (timeValues[1]) {
            const number = Number(timeValues[1]);
            if (number > 59) {
              return { datetime: true, minute: true, valid: false };
            }
          } else {
            return { datetime: true, minute: true };
          }
          if (timeValues[2]) {
            const number = Number(timeValues[2]);
            if (number > 59) {
              return { datetime: true, second: true, valid: false };
            }
          } else {
            return { datetime: true, second: true };
          }
        }
      }
      const momentValue = control.value.toString().replace('T', ' ').replace('.000', '');
      if (!moment(momentValue, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
        return { datetime: true };
      }
      return;
    };
  }

  public static timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return;
      }
      const timeValues = control.value.toString().split(':');
      if (timeValues) {
        if (timeValues[0]) {
          const number = Number(timeValues[0]);
          if (number > 23) {
            return { time: true, hour: true, valid: false, message: '' };
          }
        } else {
          return { time: true, hour: true };
        }
        if (timeValues[1]) {
          const number = Number(timeValues[1]);
          if (number > 59) {
            return { time: true, minute: true, valid: false };
          }
        } else {
          return { time: true, minute: true };
        }
        if (timeValues[2]) {
          const number = Number(timeValues[2]);
          if (number > 59) {
            return { time: true, second: true, valid: false };
          }
        } else {
          return { time: true, second: true };
        }
      }
      if (!moment(control.value.toString(), 'HH:mm:ss', true).isValid()) {
        return { time: true };
      }
      return;
    };
  }
}

