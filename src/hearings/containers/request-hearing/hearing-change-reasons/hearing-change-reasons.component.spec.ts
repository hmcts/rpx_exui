import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { ACTION } from '../../../models/hearings.enum';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import { HearingsFeatureService } from '../../../services/hearings-feature.service';
import { HearingChangeReasonsComponent } from './hearing-change-reasons.component';

describe('HearingChangeReasonsComponent', () => {
  let component: HearingChangeReasonsComponent;
  let fixture: ComponentFixture<HearingChangeReasonsComponent>;
  let mockStore: any;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  const mockRouter = jasmine.createSpyObj('router', ['navigateByUrl']);
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['isEnabled']);
  const hearingsFeatureServiceMock = jasmine.createSpyObj('FeatureServiceMock', ['isFeatureEnabled']);

  const reasons: LovRefDataModel[] = [
    {
      key: 'reasonOne',
      value_en: 'Reason 1',
      value_cy: '',
      hint_text_en: 'Reason 1',
      hint_text_cy: '',
      lov_order: 1,
      category_key: 'ChangeReasons',
      parent_category: '',
      parent_key: '',
      active_flag: ''
    },
    {
      key: 'reasonTwo',
      value_en: 'Reason 2',
      value_cy: '',
      hint_text_en: 'Reason 2',
      hint_text_cy: '',
      lov_order: 2,
      category_key: 'ChangeReasons',
      parent_category: '',
      parent_key: '',
      active_flag: ''
    },
    {
      key: 'reasonThree',
      value_en: 'Reason 3',
      value_cy: '',
      hint_text_en: 'Reason 3',
      hint_text_cy: '',
      lov_order: 3,
      category_key: 'ChangeReasons',
      parent_category: '',
      parent_key: '',
      active_flag: ''
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [HearingChangeReasonsComponent, MockRpxTranslatePipe],
      providers: [
        {
          provide: HearingsService,
          useValue: hearingsService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hearingChangeReasons: reasons
              }
            }
          }
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: FeatureToggleService,
          useValue: mockFeatureToggleService
        },
        provideMockStore({ initialState }),
        {
          provide: HearingsService,
          useValue: hearingsService
        },
        {
          provide: HearingsFeatureService,
          useValue: hearingsFeatureServiceMock
        },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingChangeReasonsComponent);
    component = fixture.componentInstance;
    component.hearingChangeReasons = reasons;
    spyOn(component, 'initForm').and.callThrough();
    spyOn(component, 'getChosenReasons').and.callThrough();
    spyOn(component, 'isFormValid').and.callThrough();
    mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
    mockStore.pipe.and.returnValue(of(initialState.hearings.hearingList));
    mockFeatureToggleService.isEnabled.and.returnValue(of(true));
    hearingsFeatureServiceMock.isFeatureEnabled.and.returnValue(of(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call methods in oninit', () => {
    expect(component.initForm).toHaveBeenCalled();
    expect(component.hearingChangeReasons.length).toEqual(reasons.length);
    expect(component.getReasonsTypeFormArray.length).toBeGreaterThan(0);
  });

  it('should be true when calling isFormValid reasons selected', () => {
    (component.hearingChangeReasonForm.controls.reasons as FormArray).controls
      .forEach((reason) => reason.value.selected = true);
    const formValid = component.isFormValid(ACTION.CONTINUE);
    expect(formValid).toEqual(true);
  });

  it('should be false when calling isFormValid with no reasons selected', () => {
    (component.hearingChangeReasonForm.controls.reasons as FormArray).controls
      .forEach((reason) => reason.value.selected = false);
    const formValid = component.isFormValid(ACTION.VIEW_EDIT_SUBMIT);
    expect(formValid).toEqual(false);
  });

  it('should not be any validation errors when back button selected', () => {
    component.isFormValid(ACTION.BACK);
    expect(component.errors.length).toEqual(0);
  });

  it('should have a server error message mapped when update request failed', () => {
    hearingsService.updateHearingRequest = jasmine.createSpy().and.returnValue(throwError(''));
    component.navigateAction(ACTION.VIEW_EDIT_SUBMIT);
    expect(component.errors).not.toEqual(null);
  });

  it('should prepareHearingRequestData', () => {
    (component.hearingChangeReasonForm.controls.reasons as FormArray).controls
      .forEach((reason) => reason.value.selected = true);
    component.prepareHearingRequestData();
    expect(component.hearingRequestMainModel.hearingDetails.amendReasonCodes).toEqual(['reasonOne', 'reasonTwo', 'reasonThree']);
  });

  it('should call unsubscribe', () => {
    spyOn(component.lastErrorSubscription, 'unsubscribe');
    spyOn(component.featureToggleServiceSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.lastErrorSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.featureToggleServiceSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should execute Action', () => {
    (component.hearingChangeReasonForm.controls.reasons as FormArray).controls
      .forEach((reason) => reason.value.selected = true);
    component.executeAction(ACTION.VIEW_EDIT_SUBMIT);
    expect(component.isFormValid).toHaveBeenCalled();
    expect(component.errors.length).toBe(0);
    expect(hearingsService.hearingRequestForSubmitValid = true);
    component.executeAction(ACTION.BACK);
    expect(component.errors.length).toBe(0);
    expect(hearingsService.hearingRequestForSubmitValid = false);
  });

  it('should execute Action and fail validation', () => {
    (component.hearingChangeReasonForm.controls.reasons as FormArray).controls
      .forEach((reason) => reason.value.selected = false);
    hearingsService.hearingRequestForSubmitValid = false;
    component.executeAction(ACTION.VIEW_EDIT_SUBMIT);
    expect(component.isFormValid).toHaveBeenCalled();
    expect(component.errors.length).toBe(1);
    expect(hearingsService.hearingRequestForSubmitValid = false);
    component.executeAction(ACTION.BACK);
    expect(component.errors.length).toBe(1);
  });

  it('should navigate back to hearing view edit summary page', () => {
    component.isHearingAmendmentsEnabled = false;
    component.onBackToSummaryPage();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/hearings/request/hearing-view-edit-summary');
  });

  it('should navigate back to hearing edit summary page', () => {
    component.isHearingAmendmentsEnabled = true;
    component.onBackToSummaryPage();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/hearings/request/hearing-edit-summary');
  });
});
