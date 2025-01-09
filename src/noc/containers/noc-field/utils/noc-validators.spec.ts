import { FormControl } from '@angular/forms';
import { NocValidators } from './noc-validators';

describe('NocValidators', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl({});
  });

  it('numberValidator invalid case', () => {
    control.setValue('invalidNumber');
    const numberValidator = NocValidators.numberValidator();
    expect(numberValidator(control)).toEqual({ number: true });
  });

  it('numberValidator valid case', () => {
    control.setValue('100');
    const numberValidator = NocValidators.numberValidator();
    expect(numberValidator(control)).toEqual({ number: true });
  });

  it('postcodeValidator invalid case', () => {
    control.setValue('l15');
    const postcodeValidator = NocValidators.postcodeValidator();
    expect(postcodeValidator(control)).toEqual({ postcode: true });
  });

  it('postcodeValidator valid case', () => {
    control.setValue('l155ax');
    const postcodeValidator = NocValidators.postcodeValidator();
    expect(postcodeValidator(control)).toBeNull();
  });

  xit('phoneUKValidator invalid case', () => {
    control.setValue('123546547897');
    const phoneUKValidator = NocValidators.phoneUKValidator();
    expect(phoneUKValidator(control)).toEqual({ phoneUK: true });
  });

  it('phoneUKValidator valid case', () => {
    control.setValue('07777777777');
    const phoneUKValidator = NocValidators.phoneUKValidator();
    expect(phoneUKValidator(control)).toEqual({ phoneUK: true });
  });

  it('dateValidator valid case', () => {
    control.setValue('2019-12-24');
    const validator = NocValidators.dateValidator();
    expect(validator(control)).toBeNull();
  });

  it('dateValidator invalid case', () => {
    control.setValue('2019-13-24');
    const validator = NocValidators.dateValidator();
    expect(validator(control)).toEqual({ date: true, month: true, year: true, valid: false });
  });

  it('dateTimeValidator valid 12 hour case', () => {
    control.setValue('2019-12-24T09:15:00.000');
    const validator = NocValidators.dateTimeValidator();
    expect(validator(control)).toBeNull();
  });

  it('dateTimeValidator valid 24 hour case', () => {
    control.setValue('2019-12-24T22:00:00.000');
    const validator = NocValidators.dateTimeValidator();
    expect(validator(control)).toBeNull();
  });

  it('dateTimeValidator invalid case', () => {
    control.setValue('2019-13-24T30:15:00.000');
    const validator = NocValidators.dateTimeValidator();
    expect(validator(control)).toEqual({ datetime: true, month: true, year: true, valid: false });
  });

  it('timeValidator valid 12 hour case', () => {
    control.setValue('09:15:00');
    const validator = NocValidators.timeValidator();
    expect(validator(control)).toBeNull();
  });

  it('timeValidator valid 24 hour case', () => {
    control.setValue('22:00:00');
    const validator = NocValidators.timeValidator();
    expect(validator(control)).toBeNull();
  });

  it('timeValidator invalid case', () => {
    control.setValue('30:15:00');
    const validator = NocValidators.timeValidator();
    expect(validator(control)).toEqual({ time: true, hour: true, valid: false, message: '' });
  });
});
