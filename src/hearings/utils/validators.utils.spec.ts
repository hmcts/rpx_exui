import { inject, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { HearingDateEnum } from '../models/hearings.enum';
import { ValidatorsUtils } from './validators.utils';

describe('ValidatorsUtils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidatorsUtils
      ]
    });
  });

  it('should be created', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    expect(service).toBeTruthy();
  }));

  it('should check numberMinMaxValidator', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const control = new FormControl();

    control.setValidators(service.numberMinMaxValidator(5, 10));
    control.setValue(6);
    expect(control.hasError('isValid')).toBeFalsy();
  }));

  it('should check numberLargerThanValidator', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const control = new FormControl();

    control.setValidators(service.numberLargerThanValidator(0));
    control.setValue(6);
    expect(control.hasError('isValid')).toBeFalsy();
  }));

  it('should check numberMultipleValidator', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const control = new FormControl();

    control.setValidators(service.numberMultipleValidator(5));
    control.setValue(10);
    expect(control.hasError('isValid')).toBeFalsy();
  }));

  it('should check errorValidator', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormControl();
    form.setValidators(service.errorValidator('message'));
    expect(form.hasError('error')).toBeFalsy();
  }));

  it('should check validateLinkedHearings', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormControl();
    form.setValidators(service.validateLinkedHearings());
    expect(form.hasError('error')).toBeFalsy();
  }));

  it('should check hearingLengthValidator', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      days: new FormControl(),
      hours: new FormControl(),
      minutes: new FormControl()
    });
    form.setValidators(service.hearingLengthValidator());
    form.controls.days.setValue('5');
    form.controls.hours.setValue('');
    form.controls.minutes.setValue('');
    console.log('FORM HAS ERROR', form.hasError('isValid'));
    expect(form.hasError('isValid')).toBeFalsy();
    form.controls.days.setValue('');
    form.controls.hours.setValue('4');
    form.controls.minutes.setValue('');
    console.log('FORM HAS ERROR', form.hasError('isValid'));
    expect(form.hasError('isValid')).toBeFalsy();
    form.controls.days.setValue('');
    form.controls.hours.setValue('');
    form.controls.minutes.setValue('40');
    console.log('FORM HAS ERROR', form.hasError('isValid'));
    expect(form.hasError('isValid')).toBeFalsy();
  }));

  it('should check hearingDateValidator', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      day: new FormControl(),
      month: new FormControl(),
      year: new FormControl()
    });
    const control = new FormControl();
    control.setValue('null-null-null');
    form.setValidators(service.hearingDateValidator());
    form.controls.day.setValue('12');
    form.controls.month.setValue('12');
    form.controls.year.setValue('2021');
    expect(form.hasError('isValid')).toBeFalsy();
    form.controls.day.setValue('12');
    form.controls.month.setValue('12');
    form.controls.year.setValue('2022');
    expect(form.hasError('isValid')).toBeFalsy();
  }));

  it('should check isWeekendDate', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    expect(service.isWeekendDate(moment('24-06-2022', HearingDateEnum.DefaultFormat))).toBeFalsy();
    expect(service.isWeekendDate(moment('25-06-2022', HearingDateEnum.DefaultFormat))).toBeTruthy();
    expect(service.isWeekendDate(moment('26-06-2022', HearingDateEnum.DefaultFormat))).toBeTruthy();
    expect(service.isWeekendDate(moment('27-06-2022', HearingDateEnum.DefaultFormat))).toBeFalsy();
  }));

  it('should check hearingDateRangeValidator', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      earliestHearing: new FormGroup({
        day: new FormControl(),
        month: new FormControl(),
        year: new FormControl()
      }),
      latestHearing: new FormGroup({
        day: new FormControl(),
        month: new FormControl(),
        year: new FormControl()
      })
    });
    form.setValidators(service.hearingDateRangeValidator());
    form.controls.earliestHearing.get('day').setValue('12');
    form.controls.earliestHearing.get('month').setValue('12');
    form.controls.earliestHearing.get('year').setValue('2022');
    expect(form.hasError('isValid')).toBeFalsy();
    form.setValidators(service.hearingDateRangeValidator());
    form.controls.latestHearing.get('day').setValue('12');
    form.controls.latestHearing.get('month').setValue('12');
    form.controls.latestHearing.get('year').setValue('2022');
    expect(form.hasError('isValid')).toBeFalsy();
  }));

  it('should check formArraySelectedValidator', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      arrayControl: new FormArray([new FormGroup({
        selection: new FormGroup({})
      })]
      )
    });
    form.setValidators(service.formArraySelectedValidator());
    expect(form.hasError('isValid')).toBeFalsy();
  }));

  it('should set time 12:00 as valid', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      arrayControl: new FormControl('12:00', service.validTime('Enter a valid time'))
    });
    form.get('arrayControl').setValue('12:00');
    form.updateValueAndValidity();
    expect(form.hasError('isValid')).toBeFalsy();
  }));

  it('should show error as mandatory', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      arrayControl: new FormControl(null, [service.mandatory('Enter a time')])
    });
    expect(form.get('arrayControl').hasError('mandatory')).toBeTruthy();
    expect(form.get('arrayControl').getError('mandatory').message).toBe('Enter a time');
  }));

  it('should set time 33:00 as invalid', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      arrayControl: new FormControl('33:00', [service.validTime('Enter a valid time')])
    });
    expect(form.get('arrayControl').hasError('invalidTime')).toBeTruthy();
  }));

  it('should set startTime 13:00 and endTime 12:00 to be invalid', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      start: new FormControl('13:00', [service.validTime('Enter a valid start time')]),
      end: new FormControl('12:00', [service.validTime('Enter a valid end time')])
    }, { validators: [service.validateTimeRange('start', 'end', 'Start time must be before finish time')] });
    expect(form.hasError('invalidTimeRange')).toBeTruthy();
    expect(form.getError('invalidTimeRange').start.message).toBe('Start time must be before finish time');
  }));

  it('should set startTime 12:00 and endTime 13:00 to be valid', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      start: new FormControl('12:00', [service.validTime('Enter a valid start time')]),
      end: new FormControl('13:00', [service.validTime('Enter a valid end time')])
    }, { validators: [service.validateTimeRange('start', 'end', 'Start time must be before finish time')] });
    expect(form.valid).toBeTruthy();
  }));

  it('should set pauseTime 9:30 to be invalid if not between the start time and end time', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      start: new FormControl('12:00', [service.validTime('Enter a valid start time')]),
      end: new FormControl('13:00', [service.validTime('Enter a valid end time')]),
      pause: new FormControl('09:30', [service.validTime('Enter a valid end time')])
    }, { validators: [service.validatePauseTimeRange('pause', { startTime: 'start', endTime: 'end' }, 'Pause time must be between the hearing start and finish times', 'invalidPauseStartTimeRange')] });
    expect(form.hasError('invalidPauseStartTimeRange')).toBeTruthy();
    expect(form.getError('invalidPauseStartTimeRange').pause.message).toBe('Pause time must be between the hearing start and finish times');
  }));

  it('should set resumeTime 9:30 to be invalid if not between the start time and end time', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const form = new FormGroup({
      start: new FormControl('12:00', [service.validTime('Enter a valid start time')]),
      end: new FormControl('13:00', [service.validTime('Enter a valid end time')]),
      resume: new FormControl('09:30', [service.validTime('Enter a valid end time')])
    }, { validators: [service.validatePauseTimeRange('resume', { startTime: 'start', endTime: 'end' }, 'Resume time must be between the hearing start and finish times', 'invalidPauseEndTimeRange')] });
    expect(form.hasError('invalidPauseEndTimeRange')).toBeTruthy();
    expect(form.getError('invalidPauseEndTimeRange').resume.message).toBe('Resume time must be between the hearing start and finish times');
  }));

  it('should detect duplicate entries', inject([ValidatorsUtils], (service: ValidatorsUtils) => {
    const parties = new FormArray([]);
    const form1 = new FormGroup({
      start: new FormControl('12:00'),
      end: new FormControl('13:00')
    });
    const form2 = new FormGroup({
      start: new FormControl('22:00'),
      end: new FormControl('24:00')
    });
    parties.push(form1);
    parties.push(form2);
    const evaluatedForm = new FormGroup({
      start: new FormControl('12:00'),
      end: new FormControl('13:00')
    }) as FormGroup;
    evaluatedForm.setParent(parties);
    const result = service.validateDuplicateEntries(1, 'Duplicate entry')(evaluatedForm);
    expect(result.hasOwnProperty('duplicateEntries')).toBeTruthy();
  }));
});
