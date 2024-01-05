import { FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';
import {
  BookingDateFormErrorMessage,
  BookingDateOption
} from '../../models';
import { DateValidators } from './date-validators';

describe('DateValidators', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl({});
  });

  it('should not allow the start date to be after today', () => {
    const formGroup = new FormBuilder().group({
      startDate_day: '',
      startDate_month: '',
      startDate_year: '',
      endDate_year: '',
      endDate_month: '',
      endDate_day: '',
      dateOption: ''
    });
    formGroup.get('startDate_day').setValue('10');
    formGroup.get('startDate_month').setValue('12');
    formGroup.get('startDate_year').setValue('2020');
    formGroup.get('endDate_year').setValue('10');
    formGroup.get('endDate_month').setValue('12');
    formGroup.get('endDate_day').setValue('2010');
    formGroup.get('dateOption').setValue(BookingDateOption.DATERANGE);
    const bookingDateValidator = DateValidators.bookingDateValidator();
    expect(bookingDateValidator(formGroup)).toEqual({
      isValid: false,
      errorType: BookingDateFormErrorMessage.PAST_DATE_CHECK
    });
  });

  // TODO: after es6 upgrade this test started to fail , It has same implementation with previous test,
  // needs investigation, to check es6 on pipeline it is deactivated temporarily
  it('should not allow the start date to be after the end date', () => {
    const formGroup = new FormBuilder().group({
      startDate_day: '',
      startDate_month: '',
      startDate_year: '',
      endDate_year: '',
      endDate_month: '',
      endDate_day: '',
      dateOption: ''
    });
    formGroup.get('startDate_day').setValue('11');
    formGroup.get('startDate_month').setValue('12');
    formGroup.get('startDate_year').setValue('' + (Number(moment().format('YYYY')) + 1));
    formGroup.get('endDate_year').setValue('10');
    formGroup.get('endDate_month').setValue('12');
    formGroup.get('endDate_day').setValue('' + (Number(moment().format('YYYY')) + 1));
    formGroup.get('dateOption').setValue(BookingDateOption.DATERANGE);
    const dateComparisonValidator = DateValidators.bookingDateValidator();
    expect(dateComparisonValidator(formGroup)).toEqual({
      isValid: false,
      errorType: BookingDateFormErrorMessage.DATE_COMPARISON
    });
  });
});
