import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { initialState } from '../../../hearing.test.data';
import { HearingsService } from '../../../services/hearings.service';
import { ValidatorsUtils } from '../../../utils/validators.utils';
import { HearingActualsTimingComponent } from './hearing-actuals-timing.component';

import * as _ from 'lodash';

@Component({ selector: 'exui-app-blank', template: '' })
class BlankComponent { }

const mockActivatedRoute = {
  paramMap: of(convertToParamMap({
    id: '1',
    hearingDate: '2021-03-12'
  })),
  snapshot: {
    data: {}
  },
  navigate: (): boolean => true
};

describe('HearingActualsTimingComponent', () => {
  const hearingsService = jasmine.createSpyObj('HearingsService', ['updateHearingActuals']);
  let store: Store<any>;
  let component: HearingActualsTimingComponent;
  let fixture: ComponentFixture<HearingActualsTimingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([{ path: 'hearings/actuals/1/hearing-actual-add-edit-summary', component: BlankComponent }]), HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        ValidatorsUtils
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [HearingActualsTimingComponent, BlankComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingActualsTimingComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    expect(component.formGroup.value.hearingStartTime).toBe('09:00');
    expect(component.formGroup.value.hearingEndTime).toBe('10:00');
  });

  it('should submit form when hearingStartTime and hearingEndTime are present with recordTimes being no', () => {
    spyOn(store, 'dispatch');
    component.formGroup.patchValue({
      hearingStartTime: '09:00',
      hearingEndTime: '10:00',
      recordTimes: 'no'
    });
    component.onSubmit(component.formGroup.value, component.formGroup.valid);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should submit form when only hearingStartTime is present with recordTimes being no', () => {
    spyOn(store, 'dispatch');
    component.formGroup.patchValue({
      hearingStartTime: '09:00',
      hearingEndTime: null,
      recordTimes: 'no'
    });
    component.onSubmit(component.formGroup.value, component.formGroup.valid);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should submit form when hearingStartTime and hearingEndTime are not present with recordTimes being no', () => {
    spyOn(store, 'dispatch');
    component.formGroup.patchValue({
      hearingStartTime: null,
      hearingEndTime: null,
      recordTimes: 'no'
    });
    component.onSubmit(component.formGroup.value, component.formGroup.valid);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should NOT submit form when only hearingEndTime is present with recordTimes being no', () => {
    spyOn(store, 'dispatch');
    component.formGroup.patchValue({
      hearingStartTime: null,
      hearingEndTime: '10:00',
      recordTimes: 'no'
    });
    component.onSubmit(component.formGroup.value, component.formGroup.valid);

    expect(component.formGroup.get('hearingStartTime').hasError('mandatory')).toBeTruthy();
    expect(component.formGroup.get('hearingStartTime').hasError('required')).toBeTruthy();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should set errors enter valid time when the hearingStartTime and hearingEndTime are not valid', () => {
    component.formGroup.patchValue({
      hearingStartTime: '44:00',
      hearingEndTime: '44:00',
      recordTimes: 'no'
    });
    component.onSubmit(component.formGroup.value, component.formGroup.valid);
    expect(component.formGroup.get('hearingStartTime').hasError('invalidTime')).toBeTruthy();
    expect(component.formGroup.get('hearingEndTime').hasError('invalidTime')).toBeTruthy();
  });

  it('should set errors invalid time range if start time is greater than finish time', () => {
    component.formGroup.patchValue({
      hearingStartTime: '10:00',
      hearingEndTime: '09:00',
      recordTimes: 'no'
    });
    component.onSubmit(component.formGroup.value, component.formGroup.valid);
    expect(component.formGroup.hasError('invalidTimeRange')).toBeTruthy();
    expect(component.formGroup.getError('invalidTimeRange').hearingStartTime.message).toBe('Start time must be before finish time');
  });

  it('should set errors enter valid pauseTime and resumeTime when user selects recordTimes', () => {
    component.formGroup.patchValue({
      hearingStartTime: '10:00',
      hearingEndTime: '09:00',
      recordTimes: 'yes',
      pauseStartTime: null,
      pauseEndTime: null
    });
    component.onSubmit(component.formGroup.value, component.formGroup.valid);
    expect(component.formGroup.get('pauseStartTime').hasError('mandatory')).toBeTruthy();
    expect(component.formGroup.get('pauseEndTime').hasError('mandatory')).toBeTruthy();
  });

  it('should set errors enter valid pauseTime and resumeTime should be between hearingStartTime and hearingEndTime', () => {
    component.formGroup.patchValue({
      hearingStartTime: '10:00',
      hearingEndTime: '09:00',
      recordTimes: 'yes',
      pauseStartTime: '11:00',
      pauseEndTime: '12:00'
    });
    component.onSubmit(component.formGroup.value, component.formGroup.valid);
    expect(component.formGroup.hasError('invalidPauseStartTimeRange')).toBeTruthy();
    expect(component.formGroup.hasError('invalidPauseEndTimeRange')).toBeTruthy();
  });
});

describe('HearingActualsTimingComponent', () => {
  const hearingsService = jasmine.createSpyObj('HearingsService', ['updateHearingActuals']);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<any>;
  let component: HearingActualsTimingComponent;
  let fixture: ComponentFixture<HearingActualsTimingComponent>;

  const updatedInitialState = {
    ..._.cloneDeep(initialState)
  };

  updatedInitialState.hearings.hearingActuals.hearingActualsMainModel.hearingActuals.actualHearingDays[0].hearingStartTime = null;
  updatedInitialState.hearings.hearingActuals.hearingActualsMainModel.hearingActuals.actualHearingDays[0].hearingEndTime = null;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([{ path: 'hearings/actuals/1/hearing-actual-add-edit-summary', component: BlankComponent }]), HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: updatedInitialState }),
        { provide: HearingsService, useValue: hearingsService },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        ValidatorsUtils
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [HearingActualsTimingComponent, BlankComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingActualsTimingComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
