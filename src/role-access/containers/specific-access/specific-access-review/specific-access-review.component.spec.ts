import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@hmcts/ccd-case-ui-toolkit';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { WASupportedJurisdictionsService } from '../../../../work-allocation/services';
import { RoleCategory, SpecificAccessNavigationEvent, SpecificAccessState, SpecificAccessStateData } from '../../../models';
import { AccessReason, SpecificAccessText } from '../../../models/enums';
import { DecideSpecificAccessAndGo } from '../../../store';
import { SpecificAccessReviewComponent } from './specific-access-review.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SpecificAccessReviewComponent', () => {
  let component: SpecificAccessReviewComponent;
  let fixture: ComponentFixture<SpecificAccessReviewComponent>;
  let mockStore: any;
  const FORM_GROUP: FormGroup = new FormGroup({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let spyOnPipeToStore = jasmine.createSpy();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let spyOnStoreDispatch = jasmine.createSpy();

  const mockSupportedJurisdictionsService = jasmine.createSpyObj('WASupportedJurisdictionsService', ['getWASupportedJurisdictions']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [SpecificAccessReviewComponent],
    imports: [ReactiveFormsModule, PipesModule],
    providers: [
        provideMockStore(),
        FormBuilder,
        { provide: WASupportedJurisdictionsService, useValue: mockSupportedJurisdictionsService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    mockStore = TestBed.inject(Store);
    const mockSpecificAccessStateData: SpecificAccessStateData = {
      state: SpecificAccessState.SPECIFIC_ACCESS_REVIEW,
      caseId: 'caseId',
      caseName: 'Example case name',
      taskId: 'taskId',
      actorId: 'actorId',
      jurisdiction: 'IA',
      roleCategory: RoleCategory.JUDICIAL,
      requestedRole: 'specific-access-judicial',
      requestCreated: '01-01-2001',
      accessReason: null,
      period: { startDate: new Date('01-01-2001'), endDate: null },
      person: null,
      requestId: 'requestId'
    };
    spyOnPipeToStore = spyOn(mockStore, 'pipe').and.returnValue(
      of(mockSpecificAccessStateData)
    );
    spyOnStoreDispatch = spyOn(mockStore, 'dispatch');
    fixture = TestBed.createComponent(SpecificAccessReviewComponent);
    component = fixture.componentInstance;
    component.formGroup = FORM_GROUP;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    component = null;
    fixture.destroy();
  });

  describe('navigation', () => {
    it('should create component and show the "review access" info message banner', () => {
      const headingElement = fixture.debugElement.nativeElement.querySelector(
        '.govuk-fieldset__heading'
      );
      expect(headingElement.textContent).toContain(
        SpecificAccessText.TITLE
      );
      const hintElement = fixture.debugElement.nativeElement.querySelector(
        '.govuk-fieldset__legend--m'
      );
      expect(hintElement.textContent).toContain(
        SpecificAccessText.HINT
      );
    });

    it('should show validation error when any radio button selected and the form submitted', () => {
      spyOn(component, 'dispatchEvent');
      component.submitted = true;
      component.navigationHandler(SpecificAccessNavigationEvent.CONTINUE);
      expect(component.formGroup.invalid).toBe(true);
      expect(component.dispatchEvent).not.toHaveBeenCalled();
    });

    it('should clear validation error when a radio button selected and the form submitted', () => {
      spyOn(component, 'dispatchEvent');
      component.submitted = false;
      component.reviewOptionControl.setValue(AccessReason.APPROVE_REQUEST);
      component.navigationHandler(SpecificAccessNavigationEvent.CONTINUE);
      expect(component.formGroup.invalid).toBe(false);
      expect(component.dispatchEvent).toHaveBeenCalled();
    });

    it('should correctly navigate on click of continue button for approve request', () => {
      component.reviewOptionControl.setValue(AccessReason.APPROVE_REQUEST);
      component.navigationHandler(SpecificAccessNavigationEvent.CONTINUE);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new DecideSpecificAccessAndGo({ accessReason: AccessReason.APPROVE_REQUEST, specificAccessState: SpecificAccessState.SPECIFIC_ACCESS_DURATION }));
    });

    it('should correctly navigate on click of continue button for reject request', () => {
      component.reviewOptionControl.setValue(AccessReason.REJECT_REQUEST);
      component.navigationHandler(SpecificAccessNavigationEvent.CONTINUE);
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it('should correctly navigate on click of continue button for request more information', () => {
      component.reviewOptionControl.setValue(AccessReason.REQUEST_MORE_INFORMATION);
      component.navigationHandler(SpecificAccessNavigationEvent.CONTINUE);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new DecideSpecificAccessAndGo({ accessReason: AccessReason.REQUEST_MORE_INFORMATION, specificAccessState: SpecificAccessState.SPECIFIC_ACCESS_INFORMATION }));
    });
  });

  describe('onDestroy()', () => {
    it('should unsubscribe', () => {
      component.specificAccessStateDataSub = new Observable().subscribe();
      spyOn(component.specificAccessStateDataSub, 'unsubscribe').and.callThrough();
      component.ngOnDestroy();
      expect(component.specificAccessStateDataSub.unsubscribe).toHaveBeenCalled();
    });
  });
});
