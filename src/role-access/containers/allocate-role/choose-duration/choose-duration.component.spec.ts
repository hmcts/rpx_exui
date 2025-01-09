import { waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import {
  Actions, AllocateRoleNavigationEvent,
  AllocateRoleState,
  AllocateRoleStateData,
  AllocateTo,
  DurationOfRole,
  RoleCategory
} from '../../../models';
import * as fromFeature from '../../../store';
import { ChooseDurationComponent } from './choose-duration.component';

describe('ChooseDurationComponent', () => {
  let component: ChooseDurationComponent;
  let mockStore: any;
  let formBuilder: FormBuilder;
  const ALLOCATE_ROLE_STATE_DATA: AllocateRoleStateData = {
    caseId: '1111111111111111',
    jurisdiction: 'IA',
    assignmentId: 'a123456',
    state: AllocateRoleState.CHOOSE_ALLOCATE_TO,
    typeOfRole: { id: 'lead-judge', name: 'Lead judge' },
    allocateTo: AllocateTo.ALLOCATE_TO_ME,
    personToBeRemoved: {
      id: 'p111111',
      name: 'test1',
      domain: ''
    },
    person: {
      id: 'p222222',
      name: 'test2',
      domain: ''
    },
    durationOfRole: DurationOfRole.SEVEN_DAYS,
    action: Actions.Allocate,
    period: {
      startDate: new Date(),
      endDate: new Date()
    },
    roleCategory: RoleCategory.LEGAL_OPERATIONS
  };

  beforeEach(waitForAsync(() => {
    mockStore = jasmine.createSpyObj('mockStore', ['pipe', 'dispatch']);
    formBuilder = new FormBuilder();
  }));

  beforeEach(() => {
    component = new ChooseDurationComponent(mockStore, formBuilder);
  });

  it('should create component', () => {
    mockStore.pipe.and.returnValue(of(ALLOCATE_ROLE_STATE_DATA));
    component.ngOnInit();
    expect(component.formGroup.contains('dayStartDate')).toBeTruthy();
    expect(component.formGroup.contains('monthStartDate')).toBeTruthy();
    expect(component.formGroup.contains('yearStartDate')).toBeTruthy();
    expect(component.formGroup.contains('dayEndDate')).toBeTruthy();
    expect(component.formGroup.contains('monthEndDate')).toBeTruthy();
    expect(component.formGroup.contains('yearEndDate')).toBeTruthy();
    expect(component.formGroup.contains('radioSelected')).toBeTruthy();
  });

  it('should create component', () => {
    const STATE_DATA = {
      ...ALLOCATE_ROLE_STATE_DATA,
      durationOfRole: DurationOfRole.ANOTHER_PERIOD,
      period: {
        startDate: new Date('2021-12-17T03:24:00'),
        endDate: new Date('2021-12-27T03:24:00')
      }
    };
    component.selectDurationRole(STATE_DATA);
    expect(component.dayStartDate.value).toBe(17);
    expect(component.monthStartDate.value).toBe(12);
    expect(component.yearStartDate.value).toBe(2021);
    expect(component.dayEndDate.value).toBe(27);
    expect(component.monthEndDate.value).toBe(12);
    expect(component.yearEndDate.value).toBe(2021);
  });

  it('should navigationHandler', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.selectedDuration = DurationOfRole.SEVEN_DAYS;
    component.navigationHandler(navEvent);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromFeature.ChooseDurationAndGo({
      durationOfRole: DurationOfRole.SEVEN_DAYS,
      period: {
        startDate: component.getTodayDate(),
        endDate: new Date(component.getTodayDate().setDate(new Date().getDate() + 7))
      },
      allocateRoleState: AllocateRoleState.CHECK_ANSWERS }
    ));
  });

  it('should return true if start date not in past', () => {
    component.dayStartDate.setValue(12);
    component.monthStartDate.setValue(11);
    component.yearStartDate.setValue(2021);
    const result = component.startDateNotInPast();
    // date is now in past
    expect(result).toBeFalsy();
  });

  it('should return false if start date in past', () => {
    component.dayStartDate.setValue(12);
    component.monthStartDate.setValue(10);
    component.yearStartDate.setValue(2021);
    const result = component.startDateNotInPast();
    expect(result).toBeFalsy();
  });

  it('should return false if date is missed', () => {
    component.dayStartDate.setValue(12);
    component.monthStartDate.setValue(10);
    component.yearStartDate.setValue(2021);
    const result = component.datesMissing();
    expect(result).toBeFalsy();
  });

  it('should create component and initialise durations', () => {
    expect(component).toBeTruthy();
    expect(component.allDurations).not.toBeNull();
    expect(component.allDurations.length).toEqual(3);
    expect(component.allDurations[0].duration).toEqual(DurationOfRole.SEVEN_DAYS);
    expect(component.allDurations[0].description).toEqual(ChooseDurationComponent.sevenDaysDesc);

    expect(component.allDurations[1].duration).toEqual(DurationOfRole.INDEFINITE);
    expect(component.allDurations[1].description).toEqual(ChooseDurationComponent.indefiniteDesc);

    expect(component.allDurations[2].duration).toEqual(DurationOfRole.ANOTHER_PERIOD);
    expect(component.allDurations[2].description).toEqual(ChooseDurationComponent.anotherPeriodDesc);
  });

  it('getPeriod should return correct period for 7 days', () => {
    const period = component.getPeriod(DurationOfRole.SEVEN_DAYS);
    expect(period.startDate.getMonth()).toEqual(new Date().getMonth());
    expect(period.startDate.getFullYear()).toEqual(new Date().getFullYear());
    expect(period.startDate.getDate()).toEqual(new Date().getDate());

    expect(period.endDate).not.toBeNull();
    const nextDate = new Date().setDate(new Date().getDate() + 7);
    expect(period.endDate.getMonth()).toEqual(new Date(nextDate).getMonth());
    expect(period.endDate.getFullYear()).toEqual(new Date(nextDate).getFullYear());
    expect(period.endDate.getDate()).toEqual(new Date(nextDate).getDate());
  });

  it('getPeriod should return correct period for Indefinite', () => {
    const period = component.getPeriod(DurationOfRole.INDEFINITE);
    expect(period.startDate.getMonth()).toEqual(new Date().getMonth());
    expect(period.startDate.getFullYear()).toEqual(new Date().getFullYear());
    expect(period.startDate.getDate()).toEqual(new Date().getDate());

    expect(period.endDate).toBeNull();
  });

  it('startDateLessThanEndDate truthy', () => {
    component.yearStartDate.setValue(2021);
    component.monthStartDate.setValue(12);
    component.dayStartDate.setValue(7);

    component.yearEndDate.setValue(2021);
    component.monthEndDate.setValue(12);
    component.yearEndDate.setValue(2021);
    const result = component.startDateLessThanEndDate();
    expect(result).toBeTruthy();
  });

  it('startDateLessThanEndDate falsy', () => {
    component.yearStartDate.setValue(2021);
    component.monthStartDate.setValue(12);
    component.dayStartDate.setValue(7);

    component.yearEndDate.setValue(2021);
    component.monthEndDate.setValue(12);
    component.dayEndDate.setValue(6);
    const result = component.startDateLessThanEndDate();
    expect(result).toBeFalsy();
  });

  it('getStartDate', () => {
    component.yearStartDate.setValue(2021);
    component.monthStartDate.setValue(12);
    component.dayStartDate.setValue(7);
    const startDate = component.getStartDate();
    expect(startDate).toEqual(new Date(2021, 11, 7, 0, 0, 0, 0));
  });

  it('getEndDate', () => {
    component.yearEndDate.setValue(2021);
    component.monthEndDate.setValue(12);
    component.dayEndDate.setValue(6);
    const endDate = component.getEndDate();
    expect(endDate).toEqual(new Date(2021, 11, 6, 0, 0, 0, 0));
  });

  it('getTodayDate', () => {
    const currentDate = component.getTodayDate();
    expect(currentDate.getFullYear()).toEqual(new Date().getFullYear());
    expect(currentDate.getDate()).toEqual(new Date().getDate());
    expect(currentDate.getMonth()).toEqual(new Date().getMonth());
  });

  it('invalid StartDate', () => {
    component.yearStartDate.setValue(2021);
    component.monthStartDate.setValue(2);
    component.dayStartDate.setValue(30);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(2);
    component.dayEndDate.setValue(29);
    const startDateValid = component.isDateValid();
    expect(component.startDateErrorMessage).toEqual('Invalid Start date');
    expect(startDateValid).toBeFalsy();
  });

  it('valid date', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(2);
    component.dayStartDate.setValue(29);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(2);
    component.dayEndDate.setValue(29);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeTruthy();
  });

  it('valid date', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(1);
    component.dayStartDate.setValue(10);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(1);
    component.dayEndDate.setValue(10);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeTruthy();
  });

  it('valid date', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(10);
    component.dayStartDate.setValue(29);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(10);
    component.dayEndDate.setValue(29);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeTruthy();
  });

  it('valid date', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(11);
    component.dayStartDate.setValue(29);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(11);
    component.dayEndDate.setValue(29);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeTruthy();
  });

  it('isStartDateValid to be falsy', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(12);
    component.dayStartDate.setValue(32);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(2);
    component.dayEndDate.setValue(29);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeFalsy();
  });

  it('isEndDateValid to be false', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(2);
    component.dayStartDate.setValue(29);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(2);
    component.dayEndDate.setValue(30);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeFalsy();
  });

  it('isEndDateValid to be false', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(2);
    component.dayStartDate.setValue(29);

    component.yearEndDate.setValue(2022);
    component.monthEndDate.setValue(12);
    component.dayEndDate.setValue(32);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeFalsy();
  });

  it('isEndDateValid to be true', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(2);
    component.dayStartDate.setValue(29);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(2);
    component.dayEndDate.setValue(29);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeTruthy();
  });

  it('isStartDateValid to be falsy with invalid month', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(13);
    component.dayStartDate.setValue(10);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(2);
    component.dayEndDate.setValue(29);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeFalsy();
  });

  it('isEndDateValid to be falsy with invalid month', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(1);
    component.dayStartDate.setValue(10);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(13);
    component.dayEndDate.setValue(29);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeFalsy();
  });

  it('isStartDateValid to be falsy with invalid year', () => {
    component.yearStartDate.setValue(20201);
    component.monthStartDate.setValue(12);
    component.dayStartDate.setValue(10);

    component.yearEndDate.setValue(2020);
    component.monthEndDate.setValue(2);
    component.dayEndDate.setValue(10);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeFalsy();
  });

  it('isEndDateValid to be falsy with invalid year', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(1);
    component.dayStartDate.setValue(10);

    component.yearEndDate.setValue(20201);
    component.monthEndDate.setValue(12);
    component.dayEndDate.setValue(10);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeFalsy();
  });

  it('isDateValid to be falsy with invalid start and end date', () => {
    component.yearStartDate.setValue(2020);
    component.monthStartDate.setValue(13);
    component.dayStartDate.setValue(10);

    component.yearEndDate.setValue(20201);
    component.monthEndDate.setValue(13);
    component.dayEndDate.setValue(10);
    const startDateValid = component.isDateValid();
    expect(startDateValid).toBeFalsy();
  });
});
