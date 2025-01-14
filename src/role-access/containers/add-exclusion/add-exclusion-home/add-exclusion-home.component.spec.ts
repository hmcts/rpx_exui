import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { UtilsModule } from '../../../../noc/containers/noc-field/utils/utils.module';
import { ExcludeOption, ExclusionNavigationEvent, ExclusionState } from '../../../models';
import * as fromFeature from '../../../store';
import * as fromContainers from '../../add-exclusion';
import { AddExclusionHomeComponent } from './add-exclusion-home.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ExclusionHomeComponent', () => {
  let component: AddExclusionHomeComponent;
  let fixture: ComponentFixture<AddExclusionHomeComponent>;
  const routerMock = jasmine.createSpyObj('Router', [
    'navigateByUrl'
  ]);
  let store;
  let storePipeMock: any;
  let storeDispatchMock: any;

  const exclusionStateData = {
    caseId: '111111',
    jurisdiction: 'IA',
    state: ExclusionState.CHOOSE_PERSON_ROLE,
    exclusionOption: ExcludeOption.EXCLUDE_ANOTHER_PERSON,
    personRole: null,
    person: null,
    exclusionDescription: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    declarations: [
        ...fromContainers.containers
    ],
    imports: [ReactiveFormsModule,
        UtilsModule,
        RouterTestingModule],
    providers: [
        provideMockStore(),
        {
            provide: Router,
            useValue: routerMock
        },
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    queryParams: {
                        caseId: '111111'
                    }
                }
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
    store = TestBed.inject(Store);

    storePipeMock = spyOn(store, 'pipe');
    storeDispatchMock = spyOn(store, 'dispatch');
    storePipeMock.and.returnValue(of(exclusionStateData));

    fixture = TestBed.createComponent(AddExclusionHomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Click back button', () => {
    it('on choose person role page click back button', () => {
      component.navigationCurrentState = ExclusionState.CHOOSE_PERSON_ROLE;
      component.navigationHandler(ExclusionNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromFeature.ChangeNavigation(ExclusionState.CHOOSE_EXCLUSION));
    });

    it('on find person page click back button', () => {
      component.navigationCurrentState = ExclusionState.FIND_PERSON;
      component.navigationHandler(ExclusionNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromFeature.ChangeNavigation(ExclusionState.CHOOSE_PERSON_ROLE));
    });

    it('on describe exclusion page click back button when exclude me', () => {
      component.navigationCurrentState = ExclusionState.DESCRIBE_EXCLUSION;
      component.exclusionOption = ExcludeOption.EXCLUDE_ME;
      component.navigationHandler(ExclusionNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromFeature.ChangeNavigation(ExclusionState.CHOOSE_EXCLUSION));
    });

    it('on describe exclusion page click back button when exclude other person', () => {
      component.navigationCurrentState = ExclusionState.DESCRIBE_EXCLUSION;
      component.exclusionOption = ExcludeOption.EXCLUDE_ANOTHER_PERSON;
      component.navigationHandler(ExclusionNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromFeature.ChangeNavigation(ExclusionState.FIND_PERSON));
    });

    it('on check answer page click back button', () => {
      component.navigationCurrentState = ExclusionState.CHECK_ANSWERS;
      component.navigationHandler(ExclusionNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromFeature.ChangeNavigation(ExclusionState.DESCRIBE_EXCLUSION));
    });

    it('on choose exclusion page click back button', () => {
      component.navigationCurrentState = ExclusionState.CHECK_ANSWERS;
      component.navigationHandler(ExclusionNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromFeature.ChangeNavigation(ExclusionState.DESCRIBE_EXCLUSION));
    });
  });

  describe('Click continue button', () => {
    it('on choose exclusion page click continue button', () => {
      component.navigationCurrentState = ExclusionState.CHOOSE_EXCLUSION;
      fixture.detectChanges();
      spyOn(component.chooseExclusionComponent, 'navigationHandler');
      component.navigationHandler(ExclusionNavigationEvent.CONTINUE);
      expect(component.chooseExclusionComponent.navigationHandler).toHaveBeenCalled();
    });

    it('on choose person role page click continue button', () => {
      component.navigationCurrentState = ExclusionState.CHOOSE_PERSON_ROLE;
      fixture.detectChanges();
      spyOn(component.choosePersonRoleComponent, 'navigationHandler');
      component.navigationHandler(ExclusionNavigationEvent.CONTINUE);
      expect(component.choosePersonRoleComponent.navigationHandler).toHaveBeenCalled();
    });

    it('on find person page click continue button', () => {
      component.navigationCurrentState = ExclusionState.FIND_PERSON;
      fixture.detectChanges();
      spyOn(component.findPersonComponent, 'navigationHandler');
      component.navigationHandler(ExclusionNavigationEvent.CONTINUE);
      expect(component.findPersonComponent.navigationHandler).toHaveBeenCalled();
    });

    it('on describe exclusion page click continue button', () => {
      component.navigationCurrentState = ExclusionState.DESCRIBE_EXCLUSION;
      fixture.detectChanges();
      spyOn(component.describeExclusionComponent, 'navigationHandler');
      component.navigationHandler(ExclusionNavigationEvent.CONTINUE);
      expect(component.describeExclusionComponent.navigationHandler).toHaveBeenCalled();
    });
  });

  describe('Click confirm exclusion button', () => {
    it('on choose exclusion page click continue button', () => {
      component.navigationCurrentState = ExclusionState.CHECK_ANSWERS;
      fixture.detectChanges();
      spyOn(component.checkAnswersComponent, 'navigationHandler');
      component.navigationHandler(ExclusionNavigationEvent.CONFIRM_EXCLUSION);
      expect(component.checkAnswersComponent.navigationHandler).toHaveBeenCalled();
    });

    it('on choose exclusion page click continue button state set incorrectly', () => {
      component.navigationCurrentState = ExclusionState.FIND_PERSON;
      fixture.detectChanges();
      expect(() => {
        component.navigationHandler(ExclusionNavigationEvent.CONFIRM_EXCLUSION);
      }).toThrow(new Error('Invalid exclusion state'));
      expect(component.showSpinner).toBe(false);
    });
  });

  describe('Click cancel button', () => {
    it('should navigate to role and access tab when click cancel button', () => {
      component.navigationHandler(ExclusionNavigationEvent.CANCEL);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('cases/case-details/111111/roles-and-access');
    });
  });

  describe('Unidentified state', () => {
    it('should stop showing spinner and throw error', () => {
      expect(() => {
        component.navigationHandler(null);
      }).toThrow(new Error('Invalid exclusion navigation event'));
      expect(component.showSpinner).toBe(false);
    });
  });

  describe('showSpinner', () => {
    it('should default to false', () => {
      expect(component.showSpinner).toBeFalsy();
    });

    it('should be true when exclusion is confirmed', () => {
      component.navigationCurrentState = ExclusionState.CHECK_ANSWERS;
      fixture.detectChanges();
      spyOn(component.checkAnswersComponent, 'navigationHandler');
      component.navigationHandler(ExclusionNavigationEvent.CONFIRM_EXCLUSION);
      expect(component.showSpinner).toBeTruthy();
    });

    it('should be false when exclusion navigation is not handled', () => {
      component.navigationCurrentState = ExclusionState.CHECK_ANSWERS;
      fixture.detectChanges();
      component.navigationHandler(ExclusionNavigationEvent.BACK);
      expect(component.showSpinner).toBeFalsy();
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
