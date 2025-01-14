import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TermsConditionsService } from '../../../app/services/terms-and-conditions/terms-and-conditions.service';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const storeMock = {
  pipe: () => of(null),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {}
};
let pipeSpy: jasmine.Spy;
let dispatchSpy: jasmine.Spy;

describe('TermsAndConditionsComponent', () => {
  @Component({
    selector: 'exui-app-host-dummy-component',
    template: '<exui-terms-and-conditions></exui-terms-and-conditions>'
  })
  class TestDummyHostComponent {
    @ViewChild(TermsAndConditionsComponent, { static: false })
    public footerComponent: TermsAndConditionsComponent;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let testHostComponent: TestDummyHostComponent;
  let testHostFixture: ComponentFixture<TestDummyHostComponent>;
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let element: DebugElement;
  let termsConditionsService: TermsConditionsService;

  beforeEach(waitForAsync(() => {
    pipeSpy = spyOn(storeMock, 'pipe');
    dispatchSpy = spyOn(storeMock, 'dispatch');
    TestBed.configureTestingModule({
    declarations: [TermsAndConditionsComponent, TestDummyHostComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [RouterTestingModule],
    providers: [{
            provide: Store,
            useValue: storeMock
        },
        TermsConditionsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestDummyHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    termsConditionsService = fixture.debugElement.injector.get(TermsConditionsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });

  it('should dispatch LoadTermsConditions', () => {
    spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(true));
    pipeSpy.and.returnValue(of(null));
    component.ngOnInit();
    expect(pipeSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should not dispatch when document is available', () => {
    spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(true));
    pipeSpy.and.returnValue(of(true));
    component.ngOnInit();
    expect(pipeSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should display old legacy terms and conditions when feature is not enabled', () => {
    spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(false));
    component.ngOnInit();
    fixture.detectChanges();
    const legacy = fixture.debugElement.query(By.css('#content'));
    expect(legacy).toBeTruthy();
  });
});
