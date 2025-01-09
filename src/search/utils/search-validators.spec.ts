import { FormBuilder, FormControl } from '@angular/forms';
import { SearchFormControl, SearchFormErrorType } from '../enums';
import { SearchValidators } from './search-validators';

describe('SearchValidators', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl({});
  });

  it('should fail caseReference validation if input is less than 16 digits after removing separators', () => {
    control.setValue('1234 12-- -34-1234  123-');
    const caseReferenceValidator = SearchValidators.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReference validation if input is more than 16 digits after removing separators', () => {
    control.setValue('1234 12-- -34-1234  12345');
    const caseReferenceValidator = SearchValidators.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should pass caseReference validation if input is exactly 16 digits after removing separators', () => {
    control.setValue('1234 12-- -34-1234  1234-');
    const caseReferenceValidator = SearchValidators.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toBeNull();
  });

  it('should fail caseReference validation if input is null', () => {
    control.setValue(null);
    const caseReferenceValidator = SearchValidators.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReference validation if input is the empty string', () => {
    control.setValue('');
    const caseReferenceValidator = SearchValidators.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReference validation if input contains one or more letters', () => {
    control.setValue('1234-1234 1234123A');
    const caseReferenceValidator = SearchValidators.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReference validation if input contains one or more symbols (except for "-")', () => {
    control.setValue('1234-1234 1234_1234');
    const caseReferenceValidator = SearchValidators.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReferenceWithWildcards validation if input is less than 16 digits with no wildcards, after removing separators', () => {
    control.setValue('1234 1234-1234 123-');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReferenceWithWildcards validation if input is more than 16 digits with no wildcards, after removing separators', () => {
    control.setValue('1234 1234-1234 12345');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toEqual({ caseReference: true });
  });

  it('should pass caseReferenceWithWildcards validation if input is exactly 16 digits with no wildcards, after removing separators', () => {
    control.setValue('1234 1234-1234 1234-');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toBeNull();
  });

  it('should pass caseReferenceWithWildcards validation if input is less than 16 digits and wildcards, after removing separators', () => {
    control.setValue('1234 1234-1234 12*-');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toBeNull();
  });

  it('should fail caseReferenceWithWildcards validation if input is more than 16 digits and wildcards, after removing separators', () => {
    control.setValue('1234 1234-1234 *123*-');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toEqual({ caseReference: true });
  });

  it('should pass caseReferenceWithWildcards validation if input is exactly 16 digits and wildcards, after removing separators', () => {
    control.setValue('1234 1234-1234 *12*-');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toBeNull();
  });

  it('should pass caseReferenceWithWildcards validation if input is a single wildcard only', () => {
    control.setValue('*');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toBeNull();
  });

  it('should pass caseReferenceWithWildcards validation if input is a single wildcard followed by at least 1 digit', () => {
    control.setValue('*1');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toBeNull();
  });

  it('should fail caseReferenceWithWildcards validation if input contains any wildcards not separated by at least 1 digit', () => {
    control.setValue('1234 1234-1234**12-');
    const caseReferenceWithWildcardsValidator = SearchValidators.caseReferenceWithWildcardsValidator();
    expect(caseReferenceWithWildcardsValidator(control)).toEqual({ caseReference: true });
  });

  it('postcodeValidator invalid case', () => {
    control.setValue('l15');
    const postcodeValidator = SearchValidators.postcodeValidator();
    expect(postcodeValidator(control)).toEqual({ postcode: true });
  });

  it('postcodeValidator valid case', () => {
    control.setValue('l155ax');
    const postcodeValidator = SearchValidators.postcodeValidator();
    expect(postcodeValidator(control)).toBeNull();
  });

  it('dateComparisonValidator invalid case', () => {
    const formGroup = new FormBuilder().group({
      [SearchFormControl.DATE_OF_BIRTH_DAY]: '',
      [SearchFormControl.DATE_OF_BIRTH_MONTH]: '',
      [SearchFormControl.DATE_OF_BIRTH_YEAR]: '',
      [SearchFormControl.DATE_OF_DEATH_DAY]: '',
      [SearchFormControl.DATE_OF_DEATH_MONTH]: '',
      [SearchFormControl.DATE_OF_DEATH_YEAR]: ''
    });

    formGroup.get(SearchFormControl.DATE_OF_BIRTH_DAY).setValue('1');
    formGroup.get(SearchFormControl.DATE_OF_BIRTH_MONTH).setValue('11');
    formGroup.get(SearchFormControl.DATE_OF_BIRTH_YEAR).setValue('2010');

    formGroup.get(SearchFormControl.DATE_OF_DEATH_DAY).setValue('31');
    formGroup.get(SearchFormControl.DATE_OF_DEATH_MONTH).setValue('10');
    formGroup.get(SearchFormControl.DATE_OF_DEATH_YEAR).setValue('2010');

    const dateComparisonValidator = SearchValidators.dateComparisonValidator();
    expect(dateComparisonValidator(formGroup)).toEqual({ datePair: true, errorType: SearchFormErrorType.DATE_COMPARISON });
  });

  it('dateComparisonValidator valid case', () => {
    const formGroup = new FormBuilder().group({
      [SearchFormControl.DATE_OF_BIRTH_DAY]: '',
      [SearchFormControl.DATE_OF_BIRTH_MONTH]: '',
      [SearchFormControl.DATE_OF_BIRTH_YEAR]: '',
      [SearchFormControl.DATE_OF_DEATH_DAY]: '',
      [SearchFormControl.DATE_OF_DEATH_MONTH]: '',
      [SearchFormControl.DATE_OF_DEATH_YEAR]: ''
    });

    formGroup.get(SearchFormControl.DATE_OF_BIRTH_DAY).setValue('10');
    formGroup.get(SearchFormControl.DATE_OF_BIRTH_MONTH).setValue('12');
    formGroup.get(SearchFormControl.DATE_OF_BIRTH_YEAR).setValue('2010');

    formGroup.get(SearchFormControl.DATE_OF_DEATH_DAY).setValue('10');
    formGroup.get(SearchFormControl.DATE_OF_DEATH_MONTH).setValue('12');
    formGroup.get(SearchFormControl.DATE_OF_DEATH_YEAR).setValue('2020');

    const dateComparisonValidator = SearchValidators.dateComparisonValidator();
    expect(dateComparisonValidator(formGroup)).toBeNull();
  });

  it('dateComparisonValidator valid case - same dates', () => {
    const formGroup = new FormBuilder().group({
      [SearchFormControl.DATE_OF_BIRTH_DAY]: '',
      [SearchFormControl.DATE_OF_BIRTH_MONTH]: '',
      [SearchFormControl.DATE_OF_BIRTH_YEAR]: '',
      [SearchFormControl.DATE_OF_DEATH_DAY]: '',
      [SearchFormControl.DATE_OF_DEATH_MONTH]: '',
      [SearchFormControl.DATE_OF_DEATH_YEAR]: ''
    });

    formGroup.get(SearchFormControl.DATE_OF_BIRTH_DAY).setValue('10');
    formGroup.get(SearchFormControl.DATE_OF_BIRTH_MONTH).setValue('12');
    formGroup.get(SearchFormControl.DATE_OF_BIRTH_YEAR).setValue('2010');

    formGroup.get(SearchFormControl.DATE_OF_DEATH_DAY).setValue('10');
    formGroup.get(SearchFormControl.DATE_OF_DEATH_MONTH).setValue('12');
    formGroup.get(SearchFormControl.DATE_OF_DEATH_YEAR).setValue('2010');

    const dateComparisonValidator = SearchValidators.dateComparisonValidator();
    expect(dateComparisonValidator(formGroup)).toBeNull();
  });

  it('dateComparisonValidator - no comparison if either date is invalid (as per XUI Common Library Date component validation)', () => {
    const formGroup = new FormBuilder().group({
      [SearchFormControl.DATE_OF_BIRTH_DAY]: '',
      [SearchFormControl.DATE_OF_BIRTH_MONTH]: '',
      [SearchFormControl.DATE_OF_BIRTH_YEAR]: '',
      [SearchFormControl.DATE_OF_DEATH_DAY]: '',
      [SearchFormControl.DATE_OF_DEATH_MONTH]: '',
      [SearchFormControl.DATE_OF_DEATH_YEAR]: ''
    });

    // Set an error on date of birth day field deliberately, to simulate invalidity
    formGroup.get(SearchFormControl.DATE_OF_BIRTH_DAY).setErrors({ invalid: true });

    const dateComparisonValidator = SearchValidators.dateComparisonValidator();
    expect(dateComparisonValidator(formGroup)).toBeNull();
  });

  it('dateComparisonValidator - no comparison if either date is empty', () => {
    const formGroup = new FormBuilder().group({
      [SearchFormControl.DATE_OF_BIRTH_DAY]: null,
      [SearchFormControl.DATE_OF_BIRTH_MONTH]: null,
      [SearchFormControl.DATE_OF_BIRTH_YEAR]: null,
      [SearchFormControl.DATE_OF_DEATH_DAY]: '15',
      [SearchFormControl.DATE_OF_DEATH_MONTH]: '12',
      [SearchFormControl.DATE_OF_DEATH_YEAR]: '2021'
    });

    const dateComparisonValidator = SearchValidators.dateComparisonValidator();
    expect(dateComparisonValidator(formGroup)).toBeNull();
  });

  it('should fail form validation if no field values are present (excluding the "Services" drop-down list field)', () => {
    const formGroup = new FormBuilder().group({
      [SearchFormControl.CASE_REF]: null,
      [SearchFormControl.OTHER_REF]: null,
      [SearchFormControl.SERVICES_LIST]: 'ALL'
    });

    const searchFormValidator = SearchValidators.searchFormValidator();
    expect(searchFormValidator(formGroup)).toEqual({ searchForm: true, errorType: SearchFormErrorType.NO_SEARCH_CRITERIA });
  });

  it('should pass form validation if at least one field value is present (excluding the "Services" drop-down list field)', () => {
    const formGroup = new FormBuilder().group({
      [SearchFormControl.CASE_REF]: '0',
      [SearchFormControl.OTHER_REF]: null,
      [SearchFormControl.SERVICES_LIST]: 'ALL'
    });

    const searchFormValidator = SearchValidators.searchFormValidator();
    expect(searchFormValidator(formGroup)).toBeNull();
  });
});
