import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { HearingResult } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import { HearingStageResultComponent } from './hearing-stage-result.component';

describe('HearingStageResultComponent', () => {
  let component: HearingStageResultComponent;
  let fixture: ComponentFixture<HearingStageResultComponent>;
  let store: any;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);

  const actualCancellationReasonCodes = [
    {
      category_key: 'ActualCancellationReasonCodes',
      key: 'reasonOne',
      value_en: 'Reason 1',
      value_cy: '',
      hint_text_en: 'Reason 1',
      hint_text_cy: '',
      lov_order: 1,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'ActualCancellationReasonCodes',
      key: 'reasonTwo',
      value_en: 'Reason 2',
      value_cy: '',
      hint_text_en: 'Reason 2',
      hint_text_cy: '',
      lov_order: 2,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'ActualCancellationReasonCodes',
      key: 'reasonThree',
      value_en: 'Reason 3',
      value_cy: '',
      hint_text_en: 'Reason 3',
      hint_text_cy: '',
      lov_order: 3,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HearingStageResultComponent, MockRpxTranslatePipe],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingStageResultComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.submitted).toEqual(false);
    expect(component.adjournHearingErrorMessage.length).toEqual(0);
    expect(component.cancelHearingErrorMessage.length).toEqual(0);
    expect(component.validationErrors.length).toEqual(0);
    expect(component.caseTitle).toEqual('Jane Smith vs DWP');
    expect(component.formControls).toBeDefined();
  });

  it('should unsubscribe', () => {
    component.sub = new Observable().subscribe();
    spyOn(component.sub, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.sub.unsubscribe).toHaveBeenCalled();
  });

  it('should return the correct hearing result based on the option selected', () => {
    component.onHearingResult(HearingResult.COMPLETED);
    expect(component.hearingResult).toEqual(HearingResult.COMPLETED);
  });

  it('should not display hearing result dropdowns by default', () => {
    component.hearingResult = null;
    component.hearingStageResultForm.get('hearingResult').setValue('');
    fixture.detectChanges();
    const nativeElement = fixture.debugElement.nativeElement;
    expect(nativeElement.querySelector('#adjourned-reason')).toBeNull();
    expect(nativeElement.querySelector('#cancelled-reason')).toBeNull();
  });

  it('should display dropdown when selecting a radio button', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const firstRadioButtonElement = nativeElement.querySelector('#completed');
    firstRadioButtonElement.click();
    fixture.detectChanges();

    expect(nativeElement.querySelector('#adjourned-reason')).toBeNull();
    expect(nativeElement.querySelector('#cancelled-reason')).toBeNull();

    const secondRadioButtonElement = nativeElement.querySelector('#adjourned');
    secondRadioButtonElement.click();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#adjourned-reason')).toBeDefined();
    expect(nativeElement.querySelector('#cancelled-reason')).toBeNull();

    const thirdRadioButtonElement = nativeElement.querySelector('#cancelled');
    thirdRadioButtonElement.click();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#adjourned-reason')).toBeNull();
    expect(nativeElement.querySelector('#cancelled-reason')).toBeDefined();
  });

  it('should update hearing outcome details on submit', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.hearingResult = HearingResult.COMPLETED;
    component.onSubmit();
    expect(component.submitted).toEqual(true);
    expect(storeDispatchSpy).toHaveBeenCalled();
  });

  it('should fail validation if hearing result type not selected', () => {
    component.hearingResult = null;
    component.hearingStageResultForm.get('hearingResult').setValue('');
    fixture.detectChanges();
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.onSubmit();
    expect(component.formControls.hearingResult.valid).toEqual(false);
    expect(component.validationErrors.length).toEqual(1);
    expect(storeDispatchSpy).toHaveBeenCalledTimes(0);
  });

  it('should fail validation if adjourned reason not selected', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.hearingResult = HearingResult.ADJOURNED;
    component.onSubmit();
    component.adjournHearingErrorMessage = 'Select a reason for the hearing result';
    expect(component.validationErrors.length).toEqual(1);
    expect(storeDispatchSpy).toHaveBeenCalledTimes(0);
  });

  it('should fail validation if cancelled reason not selected', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.hearingResult = HearingResult.CANCELLED;
    component.hearingStageResultForm.get('cancelledReason').setValue('');
    fixture.detectChanges();
    component.onSubmit();
    component.cancelHearingErrorMessage = 'Select a reason for the hearing result';
    expect(component.validationErrors.length).toEqual(1);
    expect(storeDispatchSpy).toHaveBeenCalledTimes(0);
  });

  it('should be able to submit if the form is valid', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.actualCancellationReasonCodes = actualCancellationReasonCodes;
    component.hearingStageResultForm.get('cancelledReason').setValue('reasoneTwo');
    fixture.detectChanges();
    component.hearingResult = HearingResult.CANCELLED;
    const nativeElement = fixture.debugElement.nativeElement;
    nativeElement.querySelector('#cancelled').click();
    fixture.detectChanges();
    const cancelledReasonElement: HTMLSelectElement = nativeElement.querySelector('#cancelled-reason');
    cancelledReasonElement.selectedIndex = 2;
    nativeElement.querySelector('.govuk-button').click();
    expect(storeDispatchSpy).toHaveBeenCalled();
  });
});
