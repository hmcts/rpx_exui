import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearings/hearing.test.data';
import * as fromHearingStore from '../../store';
import { ErrorPageComponent } from './error-page.component';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorPageComponent, MockRpxTranslatePipe],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    mockStore = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnInit reset last errors', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingValuesLastError()));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingRequestLastError()));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining(new fromHearingStore.ResetHearingActualsLastError()));
  });

  it('should unsubscribe', () => {
    component.sub = new Observable().subscribe();
    spyOn(component.sub, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.sub.unsubscribe).toHaveBeenCalled();
  });

  it('should set the case id', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const headingElement = nativeElement.querySelector('.govuk-heading-xl');
    expect(headingElement.textContent).toEqual('There was a system error and your request could not be processed.');
    const hrefElement = nativeElement.querySelector('.govuk-link');
    expect(hrefElement.getAttribute('href')).toEqual('/cases/case-details/1111222233334444/hearings');
    expect(component.caseId).toEqual('1111222233334444');
  });
});
