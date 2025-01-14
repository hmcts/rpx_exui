import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../app/services/logger/logger.service';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../hearing.test.data';
import { LovRefDataModel } from '../../models/lovRefData.model';
import { HearingsService } from '../../services/hearings.service';
import { CancelHearingComponent } from './cancel-hearing.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CancelHearingComponent', () => {
  let component: CancelHearingComponent;
  let fixture: ComponentFixture<CancelHearingComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  const loggerServiceMock = jasmine.createSpyObj('loggerService', ['error']);
  const hearingsService = new HearingsService(mockedHttpClient);
  const reasons: LovRefDataModel[] = [
    {
      key: 'reasonOne',
      value_en: 'Reason 1',
      value_cy: '',
      hint_text_en: 'reason 1',
      hint_text_cy: '',
      lov_order: 1,
      parent_key: null,
      category_key: 'CancelHearingReason',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      key: 'reasonTwo',
      value_en: 'Reason 2',
      value_cy: '',
      hint_text_en: 'Reason 2',
      hint_text_cy: '',
      lov_order: 2,
      parent_key: null,
      category_key: 'CancelHearingReason',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      key: 'reasonThree',
      value_en: 'Reason 3',
      value_cy: '',
      hint_text_en: 'Reason 3',
      hint_text_cy: '',
      lov_order: 4,
      parent_key: null,
      category_key: 'CancelHearingReason',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    }
  ];

  const HEARING_ID = 'h00001';
  const CASE_REF = '1111222233334444';
  let mockHearingService: any;
  let mockStore: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    declarations: [CancelHearingComponent, MockRpxTranslatePipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([
            { path: 'cases/case-details/1111222233334444/hearings', redirectTo: '' }
        ])],
    providers: [
        LoadingService,
        { provide: HearingsService, useValue: hearingsService },
        { provide: LoggerService, useValue: loggerServiceMock },
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {
                        hearingCancelOptions: reasons
                    }
                },
                params: of({ hearingId: HEARING_ID })
            }
        },
        provideMockStore({ initialState }),
        FormBuilder,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(CancelHearingComponent);
    component = fixture.componentInstance;
    component.hearingCancelOptions = reasons;
    mockHearingService = TestBed.inject(HearingsService);
    spyOn(component, 'initForm').and.callThrough();
    spyOn(component, 'getChosenReasons').and.callThrough();
    spyOn(mockHearingService, 'cancelHearingRequest').and.returnValue(of({}));
    spyOn(component, 'isFormValid').and.callThrough();
    mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
    mockStore.pipe.and.returnValue(of(initialState.hearings.hearingList));
    fixture.detectChanges();
  });

  it('should assign hearingId in component', () => {
    expect(component.hearingId).toEqual(HEARING_ID);
  });

  it('should call methods in oninit', () => {
    expect(component.initForm).toHaveBeenCalled();
    expect(component.hearingCancelOptions.length).toEqual(reasons.length);
    expect(component.getReasonsTypeFormArray.length).toBeGreaterThan(0);
  });

  it('should localise casehearing variables', () => {
    expect(component.caseId).toEqual(CASE_REF);
    expect(component.caseHearing.hearingID).toEqual(initialState.hearings.hearingList.hearingListMainModel.caseHearings[0].hearingID);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call cancelHearingRequest when executeAction is called with a valid form', () => {
    component.executeContinue();
    expect(mockHearingService.cancelHearingRequest).not.toHaveBeenCalled();
  });

  it('should call cancelHearingRequest when executeAction is called with a valid form', () => {
    (component.hearingCancelForm.controls.reasons as FormArray).controls
      .forEach((reason) => reason.value.selected = true);
    component.executeContinue();
    expect(mockHearingService.cancelHearingRequest).toHaveBeenCalled();
    expect(component.getChosenReasons).toHaveBeenCalled();
  });

  it('should be true when calling isFormValid reasons selected', () => {
    (component.hearingCancelForm.controls.reasons as FormArray).controls
      .forEach((reason) => reason.value.selected = true);
    const formValid = component.isFormValid();
    expect(formValid).toEqual(true);
  });

  it('should be false when calling isFormValid with no reasons selected', () => {
    const formValid = component.isFormValid();
    expect(component.validationErrors.length).toBeGreaterThan(0);
    expect(formValid).toEqual(false);
  });

  it('should have a validation error message mapped when cancel hearing DELETE request failed', () => {
    (component.hearingCancelForm.controls.reasons as FormArray).controls
      .forEach((reason) => reason.value.selected = true);
    hearingsService.cancelHearingRequest = jasmine.createSpy().and.returnValue(throwError(''));
    component.executeContinue();
    expect(component.validationErrors).not.toBeNull();
  });
});
