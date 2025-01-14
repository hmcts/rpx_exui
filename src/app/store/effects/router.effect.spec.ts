import { Location } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { AppConfigService } from '../../services/config/configuration.services';
import { Back, CreateCaseGo, Forward, Go } from '../actions/router.action';
import * as fromRouterEffects from './router.effect';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Router Effects', () => {
  let actions$;
  let effects: fromRouterEffects.RouterEffects;
  let store;

  const LocationMock = jasmine.createSpyObj('Location', [
    'back', 'forward'
  ]);

  const RouterMock = jasmine.createSpyObj('Router', [
    'navigate'
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let spyOnDispatchToStore = jasmine.createSpy();

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StoreModule.forRoot({})],
    providers: [
        AppConfigService,
        {
            provide: Location,
            useValue: LocationMock
        },
        {
            provide: Router,
            useValue: RouterMock
        },
        fromRouterEffects.RouterEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    store = TestBed.inject(Store);
    spyOnDispatchToStore = spyOn(store, 'dispatch').and.callThrough();

    effects = TestBed.inject(fromRouterEffects.RouterEffects);
  });

  describe('navigate$', () => {
    it('should call Angular\'s router on dispatch of RouterActions.Go and trigger "callback"', () => {
      const payload = {
        path: [],
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback: () => {}
      };

      RouterMock.navigate.and.returnValue(Promise.resolve(true));

      const action = new Go(payload);
      actions$ = hot('-a', { a: action });

      effects.navigate$.subscribe(() => {
        expect(RouterMock.navigate).toHaveBeenCalled();
      });
    });

    it('should call Angular\'s router on dispatch of RouterActions.Go and not trigger "callback"', () => {
      const payload = {
        path: []
      };

      RouterMock.navigate.and.returnValue(Promise.resolve(true));

      const action = new Go(payload);
      actions$ = hot('-a', { a: action });

      effects.navigate$.subscribe(() => {
        expect(RouterMock.navigate).toHaveBeenCalled();
      });
    });

    it('should call Angular\'s router on dispatch of RouterActions.Go and trigger "errorHandler"', () => {
      const payload = {
        path: [],
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        errorHandler: () => {}
      };

      RouterMock.navigate.and.returnValue(Promise.reject(false));

      const action = new Go(payload);
      actions$ = hot('-a', { a: action });

      effects.navigate$.subscribe(() => {
        expect(RouterMock.navigate).toHaveBeenCalled();
      });
    });

    it('should call Angular\'s router on dispatch of RouterActions.Go and not trigger "errorHandler"', () => {
      const payload = {
        path: []
      };

      RouterMock.navigate.and.returnValue(Promise.reject(false));

      const action = new Go(payload);
      actions$ = hot('-a', { a: action });

      effects.navigate$.subscribe(() => {
        expect(RouterMock.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('navigateNewCase$', () => {
    it('should call Angular\'s router on dispatch of RouterActions.CREATE_CASE_GO', () => {
      const payload = {
        path: [],
        caseId: 'dummy'
      };

      RouterMock.navigate.and.returnValue(Promise.resolve(true));

      const action = new CreateCaseGo(payload);
      actions$ = hot('-a', { a: action });

      effects.navigateNewCase$.subscribe(() => {
        expect(RouterMock.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('navigateBack$', () => {
    it('should call Angular\'s Location.back() on dispatch' +
      ' of RouterActions.BACK', () => {
      const action = new Back();
      actions$ = hot('-a', { a: action });
      effects.navigateBack$.subscribe(() => {
        expect(LocationMock.back).toHaveBeenCalled();
      });
    });
  });

  describe('navigateForward$', () => {
    it('should call Angular\'s Location.forward() on dispatch of RouterActions.FORWARD', () => {
      const action = new Forward();
      actions$ = hot('-a', { a: action });
      effects.navigateForward$.subscribe(() => {
        expect(LocationMock.forward).toHaveBeenCalled();
      });
    });
  });
});
