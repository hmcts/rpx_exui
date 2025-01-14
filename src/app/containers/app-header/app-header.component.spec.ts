import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, StoreModule } from '@ngrx/store';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { AppConstants } from '../../app.constants';
import { ApplicationThemeLogo } from '../../enums';
import { LoggerService } from '../../services/logger/logger.service';
import * as fromActions from '../../store';
import { AppHeaderComponent } from './app-header.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const storeMock = {
  pipe: () => of([]),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
  select: () => of(null) // Mocking select method
};

const loggerServiceMock = jasmine.createSpyObj('loggerService', ['error']);

let dispatchSpy: jasmine.Spy;
let subscribeSpy: jasmine.Spy;

describe('AppHeaderComponent', () => {
  let featureToggleServiceSpy: jasmine.SpyObj<FeatureToggleService>;

  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<fromActions.State>;
  const subscriptionMock: Subscription = new Subscription();
  const eventsSub = new BehaviorSubject<any>(null);
  const featureToggleServiceMock = jasmine.createSpyObj('FeatureToggleService', ['getValue']);
  let stateStoreMock: Store<fromActions.State>;

  beforeEach(async () => {
    dispatchSpy = spyOn(storeMock, 'dispatch');
    subscribeSpy = spyOn(subscriptionMock, 'unsubscribe');

    TestBed.configureTestingModule({
    declarations: [
        AppHeaderComponent
    ],
    imports: [StoreModule.forRoot({})],
    providers: [
        {
            provide: Store,
            useValue: storeMock
        },
        {
            provide: FeatureToggleService,
            useValue: featureToggleServiceMock
        },
        {
            provide: Router,
            useValue: {
                events: eventsSub,
                url: '/something-or-other'
            }
        },
        {
            provide: LoggerService,
            useValue: loggerServiceMock
        },
        {
            provide: Window,
            useValue: window
        },
        AppHeaderComponent,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();

    store = TestBed.inject(Store);

    // Reset spies
    dispatchSpy.calls.reset();
    subscribeSpy.calls.reset();

    featureToggleServiceSpy = TestBed.inject(FeatureToggleService) as jasmine.SpyObj<FeatureToggleService>;
    stateStoreMock = TestBed.inject(Store);
    featureToggleServiceSpy.getValue.and.returnValue(of(AppConstants.DEFAULT_MENU_ITEMS));
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('deserialiseUserRoles()', () => {
    it('should take in serialised roles, and deserialise them into an array.', () => {
      const serialisedRoles = 'j:["pui-organisation-manager","caseworker-publiclaw","caseworker-divorce-financialremedy-solicitor","caseworker"]';
      expect(component.deserialiseUserRoles(serialisedRoles)).toEqual([
        'pui-organisation-manager',
        'caseworker-publiclaw',
        'caseworker-divorce-financialremedy-solicitor',
        'caseworker'
      ]);
    });
  });

  describe('setAppHeaderProperties()', () => {
    it('should take a theme and update the app header properties.', () => {
      component.userRoles = ['testrole'];
      component.setApplicationThemeForUser();

      expect(component.appHeaderTitle).toEqual(AppConstants.DEFAULT_USER_THEME.appTitle);
      expect(component.navItems).toEqual(AppConstants.DEFAULT_MENU_ITEMS);
      expect(component.backgroundColor).toBe(AppConstants.DEFAULT_USER_THEME.backgroundColor);
      expect(component.logo).toBe(AppConstants.DEFAULT_USER_THEME.logo);
      expect(component.logoIsUsed).toBe(AppConstants.DEFAULT_USER_THEME.logo !== ApplicationThemeLogo.NONE);
    });

    it('should take a theme and update the app header properties with role judge.', () => {
      component.userRoles = ['judge'];
      component.setApplicationThemeForUser();

      expect(component.appHeaderTitle).toEqual({ name: 'Judicial Case Manager', url: '/' });
      expect(component.backgroundColor).toBe('#8d0f0e');
      expect(component.logo).toBe('judicial');
      expect(component.logoIsUsed).toBe(true);
    });

    it('should set app header content', async () => {
      const themeSpy = spyOn(component, 'setApplicationThemeForUser').and.returnValue();

      const userDetails = {
        userInfo: ['pui-organisation-manager', 'caseworker-publiclaw', 'caseworker-divorce-financialremedy-solicitor', 'caseworker']
      };
      component.setHeaderContent(userDetails);
      expect(themeSpy).toHaveBeenCalled();
    });

    it('should update theme app header properties.', () => {
      const menuItems = AppConstants.DEFAULT_MENU_ITEMS;
      component.setAppHeaderNavItems(menuItems);
      expect(component.navItems).toEqual(AppConstants.DEFAULT_MENU_ITEMS);
    });

    it('should update navItems app header properties.', () => {
      component.userRoles = ['testrole'];
      component.setApplicationThemeForUser();

      expect(component.appHeaderTitle).toEqual(AppConstants.DEFAULT_USER_THEME.appTitle);
      expect(component.backgroundColor).toBe(AppConstants.DEFAULT_USER_THEME.backgroundColor);
      expect(component.logo).toBe(AppConstants.DEFAULT_USER_THEME.logo);
      expect(component.logoIsUsed).toBe(AppConstants.DEFAULT_USER_THEME.logo !== ApplicationThemeLogo.NONE);
    });
  });

  describe('setNavigationEnd()', () => {
    it('should set the navigation items once the navigation has ended', () => {
      // set the navigation end and original navigation items (note that active set to false)
      const endNav = new NavigationEnd(1, '/something-or-other', '/something-or-other');
      component.navItems = [{ text: 'example', href: '/something-or-other', active: false }];

      // start evaluating the url and navigation items and run setNavigationEnd
      expect(component.router.url).toBe(component.navItems[0].href);
      eventsSub.next(endNav);
      component.setNavigationEnd(eventsSub);
      fixture.detectChanges();

      // the expectation is that active should now be true
      expect(component.router.url).toBe(component.navItems[0].href);
      expect(component.navItems[0].active).toBe(true);
    });
  });

  describe('onNavigate()', () => {
    it('should logout when onNavigate sign-out is called ', () => {
      component.onNavigate('anything');
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
      component.onNavigate('sign-out');
      expect(dispatchSpy).toHaveBeenCalledWith(new fromActions.Logout());
    });
  });

  describe('subscribe()', async () => {
    it('should allow subscribing to an observable', () => {
      // ensure that the component's subscribe method runs with mock data
      const url = '/tasks/list';
      const exObservable$ = of(url);
      expect(component.subscribe(exObservable$)).toBeTruthy();
    });
  });

  describe('unsubscribe()', async () => {
    it('should allow unsubscribing from a subscription', () => {
      component.unsubscribe(subscriptionMock);
      expect(subscribeSpy).toHaveBeenCalled();
    });
  });

  describe('getObservable()', async () => {
    it('should allow getting an observable from the store', () => {
      const observable = component.getObservable(stateStoreMock);
      expect(observable).not.toBe(undefined);
    });
  });

  describe('hideNavigationListener()', async () => {
    it('should be able to set a subscription', () => {
      // the internal methods of the hideNavigationListener has been tested so we want to make sure this runs without issue
      const subscription = component.hideNavigationListener(stateStoreMock);
      // will be undefined as Observable not returned from the store
      expect(subscription).toBeUndefined();
    });
  });
});
