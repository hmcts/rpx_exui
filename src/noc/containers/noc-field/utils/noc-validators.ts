import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

const REGEX_DOS_FIX_LIMIT = 100;

export class NocValidators {
  private static isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  public static numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEmpty(control.value)) {
        return null;
      }
      const value = control.value.toString();
      const isValid = value.length < REGEX_DOS_FIX_LIMIT && /^\d\{1,100}(\.\d\{1,100})?$/.test(value);
      return isValid ? null : { number: true };
    };
  }

  public static postcodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEmpty(control.value)) {
        return null;
      }
      const value = control.value.toString();
      const regEx1 = new RegExp(
        /^(([A-Za-z]{1,2}\d[A-Za-z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA)) ?/.source //eg SE17 & special postcodes
        + /\d[A-Za-z]{2}|BFPO ?/.source
        + /\d{1,4}|(KY\d|MSR|VG|AI)[ -]?/.source //british forces postal overseas
        + /\d[A-Za-z]{2}|BFPO ?\d{1,4}|(KY\d|MSR|VG|AI)[ -]?/.source // postcode
        + /\d{4}|[A-Za-z]{2} ?\d{2}|GE ?CX|GIR ?/.source // postcodes
        +/ 0A{2}|SAN ?TA1/.source // more postcode
        + /$/.source
      );
      const isValid = value.length < REGEX_DOS_FIX_LIMIT && regEx1.test(value);
      return isValid ? null : { postcode: true };
    };
  }

  public static phoneUKValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEmpty(control.value)) {
        return null;
      }
      const value = control.value.toString();
      const regEx = new RegExp(
        /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?))/.source
      + /(([\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))/.source // telephone
      + /(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)))/.source
      + /[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})/.source // optionals
      + /(?:[\s-]?(?:x|ext\.?)\d{3,4})?$/.source
      );
      const isValid = value.length < REGEX_DOS_FIX_LIMIT && regEx.test(value);
      return isValid ? null : { phoneUK: true };
    };
  }

  public static dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEmpty(control.value)) {
        return null;
      }
      const value = control.value.toString();
      const [year, month, day] = value.split('-').map(Number);
      const isValidDate = moment(value, 'YYYY-MM-DD', true).isValid();
      if (!isValidDate || year === 0 || month === 0 || month > 12 || day === 0 || day > 31) {
        return { date: true, month: true, year: true, valid: false };
      }
      return null;
    };
  }

  public static dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEmpty(control.value)) {
        return null;
      }
      const value = control.value.toString().replace('T', ' ').replace('.000', '');
      const isValidDateTime = moment(value, 'YYYY-MM-DD HH:mm:ss', true).isValid();
      const [datePart, timePart] = control.value.toString().split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute, second] = (timePart || '').split(':').map(Number);

      if (!isValidDateTime || year === 0 || month === 0 || month > 12 || day === 0 || day > 31 ||
          hour > 23 || minute > 59 || (second !== undefined && second > 59)) {
        return { datetime: true, month: true, year: true, valid: false };
      }
      return null;
    };
  }

  public static timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEmpty(control.value)) {
        return null;
      }
      const value = control.value.toString();
      const [hour, minute, second] = value.split(':').map(Number);
      const isValidTime = moment(value, 'HH:mm:ss', true).isValid();
      if (!isValidTime || hour > 23 || minute > 59 || (second !== undefined && second > 59)) {
        return { hour: true, time: true, valid: false, message: '' };
      }
      return null;
    };
  }
}
