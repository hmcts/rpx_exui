import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../hearing.test.data';
import { ACTION } from '../../models/hearings.enum';
import { HearingsService } from '../../services/hearings.service';
import * as fromHearingStore from '../../store';
import { AbstractPageFlow } from '../../utils/abstract-page-flow';
import { RequestHearingComponent } from './request-hearing.component';

describe('RequestHearingComponent', () => {
  let component: RequestHearingComponent;
  let fixture: ComponentFixture<RequestHearingComponent>;
  let mockStore: any;
  const mockPageFlow = jasmine.createSpyObj('PageFlow', ['getCurrentPage']);
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RequestHearingComponent, MockRpxTranslatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AbstractPageFlow, useValue: mockPageFlow },
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService }
      ]
    })
      .compileComponents();
    mockStore = TestBed.inject(Store);
    fixture = TestBed.createComponent(RequestHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check back method', () => {
    spyOn(hearingsService, 'navigateAction');
    component.onBack();
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.BACK);
  });

  it('should check continue method', () => {
    spyOn(hearingsService, 'navigateAction');
    component.onContinue();
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.CONTINUE);
  });

  it('should check submit method', () => {
    spyOn(hearingsService, 'navigateAction');
    component.submitRequest(ACTION.SUBMIT);
    expect(hearingsService.hearingRequestForSubmitValid).toEqual(true);
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.SUBMIT);
  });

  it('should check submit method and not be able to click submit change request button again', () => {
    spyOn(hearingsService, 'navigateAction');
    component.submitRequest(ACTION.VIEW_EDIT_SUBMIT);
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.VIEW_EDIT_SUBMIT);
  });

  it('should check submitUpdatedRequestClicked set to true for view edit reason', () => {
    spyOn(hearingsService, 'navigateAction');
    component.submitRequest(ACTION.VIEW_EDIT_REASON);
    expect(hearingsService.submitUpdatedRequestClicked).toBe(true);
  });

  it('should check buttonDisabled returns a false for a submit with failed validation', () => {
    spyOn(hearingsService, 'navigateAction');
    hearingsService.hearingRequestForSubmitValid = false;
    component.submitRequest(ACTION.VIEW_EDIT_SUBMIT);
    const buttonDisabled = component.buttonDisabled(ACTION.VIEW_EDIT_SUBMIT);
    expect(buttonDisabled).toEqual(false);
  });

  it('should check buttonDisabled returns a true for a VIEW_EDIT_SUBMIT with successful validation', () => {
    spyOn(hearingsService, 'navigateAction');
    hearingsService.hearingRequestForSubmitValid = true;
    const buttonDisabled = component.buttonDisabled(ACTION.VIEW_EDIT_SUBMIT);
    expect(buttonDisabled).toEqual(true);
  });

  it('should check buttonDisabled returns a false for a submit with successful validation', () => {
    spyOn(hearingsService, 'navigateAction');
    hearingsService.hearingRequestForSubmitValid = true;
    const buttonDisabled = component.buttonDisabled(ACTION.SUBMIT);
    expect(buttonDisabled).toEqual(true);
  });

  it('should check is answer page', () => {
    spyOn(hearingsService, 'navigateAction');
    mockPageFlow.getCurrentPage.and.returnValue('hearing-create-edit-summary');
    expect(component.isCreateEditSummary).toBeTruthy();
  });

  it('should check is confirmation page', () => {
    spyOn(hearingsService, 'navigateAction');
    mockPageFlow.getCurrentPage.and.returnValue('hearing-confirmation');
    expect(component.isConfirmationPage).toBeTruthy();
  });

  it('should check is child page', () => {
    spyOn(hearingsService, 'navigateAction');
    mockPageFlow.getCurrentPage.and.returnValue('hearing-requirements');
    expect(component.isChildPage).toBeTruthy();
  });

  it('should purge data in store and clear hearings service manual amendment properties if page is destroyed', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingRequest()));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingValues()));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingConditions()));
    expect(hearingsService.propertiesUpdatedAutomatically).toEqual({ pageless: {}, withinPage: {} });
    expect(hearingsService.propertiesUpdatedOnPageVisit).toBeNull();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
