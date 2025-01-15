import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as fromContainers from '../../containers';
import { NocNavigationEvent, NocState } from '../../models';
import * as fromNocStore from '../../store';
import { UtilsModule } from '../noc-field/utils/utils.module';
import { NocHomeComponent } from './noc-home.component';
import { LoggerService } from '../../../app/services/logger/logger.service';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('NocHomeComponent', () => {
  let fixture: ComponentFixture<NocHomeComponent>;
  let component: NocHomeComponent;
  let store;
  let storePipeMock: any;
  let storeDispatchMock: any;

  const routerMock = jasmine.createSpyObj('Router', [
    'navigateByUrl'
  ]);

  const loggerServiceMock = jasmine.createSpyObj('loggerService', ['error']);

  const locationMock = jasmine.createSpyObj('Location', ['back']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        UtilsModule,
        RouterTestingModule
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      declarations: [
        ...fromContainers.containers,
        RpxTranslateMockPipe
      ],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: routerMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        { provide: Location, useValue: locationMock }
      ]
    }).compileComponents();

    store = TestBed.inject(Store);

    storePipeMock = spyOn(store, 'pipe');
    storeDispatchMock = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(NocHomeComponent);
    component = fixture.componentInstance;
  });

  describe('onNavEvent', () => {
    beforeEach(() => {
      storePipeMock.and.returnValue(of(0));
      fixture.detectChanges();
    });

    it('should set navEvent', () => {
      // Need to set a valid NoC navigation state on the component
      component.nocNavigationCurrentState = NocState.QUESTION;

      // Using the NocNavigationEvent.BACK event here because NocNavigationEvent.CONTINUE isn't handled by noc-home
      // component at present
      component.onNavEvent(NocNavigationEvent.BACK);
      expect(component.navEvent.event).toEqual(NocNavigationEvent.BACK);
    });

    it('should determine visibility true', () => {
      const expected = component.isComponentVisible(NocState.START, [NocState.START, NocState.QUESTION]);
      expect(expected).toBeTruthy();
    });

    it('should determine visibility false', () => {
      const expected = component.isComponentVisible(NocState.START, [NocState.CHECK_ANSWERS, NocState.QUESTION]);
      expect(expected).toBeFalsy();
    });

    it('should navigate back on BACK event and START state', () => {
      component.navigationHandler(NocNavigationEvent.BACK);
      component.nocNavigationCurrentState = NocState.START;

      expect(locationMock.back).toHaveBeenCalled();
      expect(loggerServiceMock.error).not.toHaveBeenCalled();
      expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should navigate to fallback route if Location back fails', () => {
      component.nocNavigationCurrentState = NocState.START;
      locationMock.back.and.throwError('Back navigation failed');
      routerMock.navigateByUrl.and.returnValue(Promise.resolve(true));

      component.navigationHandler(NocNavigationEvent.BACK);

      expect(locationMock.back).toHaveBeenCalled();
      expect(loggerServiceMock.error).toHaveBeenCalledWith(
        'Error navigating back, trying fallback route.',
        jasmine.any(Error)
      );
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('');
    });

    it('should log an error if fallback route navigation fails', async () => {
      component.nocNavigationCurrentState = NocState.START;
      locationMock.back.and.throwError('Back navigation failed');
      routerMock.navigateByUrl.and.returnValue(Promise.reject('Navigation failed'));

      await component.navigationHandler(NocNavigationEvent.BACK);

      expect(locationMock.back).toHaveBeenCalled();
      expect(loggerServiceMock.error).toHaveBeenCalledWith(
        'Error navigating back, trying fallback route.',
        jasmine.any(Error)
      );
      expect(loggerServiceMock.error).toHaveBeenCalledWith(
        'Error navigating to \'\' ',
        'Navigation failed'
      );
    });

    it('should navigate to case ref page when click back button if on question page', () => {
      component.nocNavigationCurrentState = NocState.QUESTION;
      component.navigationHandler(NocNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalled();
    });

    it('should navigate to question page when click back button if on check answer page', () => {
      component.nocNavigationCurrentState = NocState.CHECK_ANSWERS;
      component.navigationHandler(NocNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromNocStore.ChangeNavigation(NocState.QUESTION));
    });

    it('should navigate to case ref page when click back button if on submission successful page', () => {
      component.nocNavigationCurrentState = NocState.SUBMISSION_SUCCESS_APPROVED;
      component.navigationHandler(NocNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromNocStore.Reset());
    });

    it('should navigate to case ref page when click back button if on submission successful page', () => {
      component.nocNavigationCurrentState = NocState.SUBMISSION_SUCCESS_PENDING;
      component.navigationHandler(NocNavigationEvent.BACK);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromNocStore.Reset());
    });

    it('should throw error Invalid NoC state', () => {
      component.nocNavigationCurrentState = NocState.AFFIRMATION_NOT_AGREED;
      expect(() => {
        component.navigationHandler(NocNavigationEvent.BACK);
      }).toThrow(new Error('Invalid NoC state'));
    });

    it('should navigate to question page when click continue button if on case ref page', () => {
      spyOn(component.nocCaseRefComponent, 'navigationHandler');
      component.nocNavigationCurrentState = NocState.START;
      component.navigationHandler(NocNavigationEvent.CONTINUE);
      expect(component.nocCaseRefComponent.navigationHandler).toHaveBeenCalled();
    });

    it('should navigate to question page when click continue button if on case ref failure page', () => {
      spyOn(component.nocCaseRefComponent, 'navigationHandler');
      component.nocNavigationCurrentState = NocState.CASE_REF_VALIDATION_FAILURE;
      component.navigationHandler(NocNavigationEvent.CONTINUE);
      expect(component.nocCaseRefComponent.navigationHandler).toHaveBeenCalled();
    });

    it('should throw error Invalid NoC state', () => {
      component.nocNavigationCurrentState = NocState.CHECK_ANSWERS;
      expect(() => {
        component.navigationHandler(NocNavigationEvent.CONTINUE);
      }).toThrow(new Error('Invalid NoC state'));
    });

    afterEach(() => {
      fixture.destroy();
    });
  });

  describe('NocNavigationEvent.CHECK_ANSWERS', () => {
    beforeEach(() => {
      component.nocNavigationCurrentState = NocState.CHECK_ANSWERS;
      storePipeMock.and.returnValue(of(6));
      fixture.detectChanges();
    });

    it('should navigate to answer page when click continue button if on QUESTION page', () => {
      spyOn(component.nocCheckAndSubmitComponent, 'navigationHandler');
      component.navigationHandler(NocNavigationEvent.CHECK_ANSWERS);
      expect(component.nocCheckAndSubmitComponent.navigationHandler).toHaveBeenCalled();
    });

    it('should throw error Invalid NoC state', () => {
      component.nocNavigationCurrentState = null;
      expect(() => {
        component.navigationHandler(NocNavigationEvent.CHECK_ANSWERS);
      }).toThrow(new Error('Invalid NoC state'));
    });

    afterEach(() => {
      fixture.destroy();
    });
  });
});
