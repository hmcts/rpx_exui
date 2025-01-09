import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { AppUtils } from '../../app-utils';
import { AppConstants } from '../../app.constants';
import { ApplicationThemeLogo } from '../../enums';
import { AppTitleModel } from '../../models/app-title.model';
import { ApplicationTheme, NavigationItem } from '../../models/theming.model';
import { UserDetails } from '../../models/user-details.model';
import { UserNavModel } from '../../models/user-nav.model';
import { HeaderConfigService } from '../../services/header-config/header-config.service';
import { LoggerService } from '../../services/logger/logger.service';
import { environment } from '../../../environments/environment';
import * as fromActions from '../../store';

@Component({
  selector: 'exui-app-header',
  templateUrl: './app-header.component.html'
})

/**
 * AppHeaderComponent
 *
 * This application header controls the dynamism of the components it controls.
 *
 * The application header is able to be style dynamically dependent on the User's role.
 *
 * Navigation and Styling update dependent on the Application Theme that have been set
 *
 * @see app.constants.ts for application themes and defaults.
 */
export class AppHeaderComponent implements OnInit, OnDestroy {
  public navItems: NavigationItem[];
  public appHeaderTitle: AppTitleModel;
  public userNav: UserNavModel;
  public backgroundColor: string;
  public logo: string;
  public logoIsUsed: boolean = false;
  public showNavItems: Observable<boolean>;

  public featureToggleKey: string;
  public serviceMessageCookie: string;
  public userRoles: string[] = [];

  private subscription: Subscription;
  public userDetails$: Observable<UserDetails>;
  public defaultTheme: ApplicationTheme = AppConstants.DEFAULT_USER_THEME;
  public defaultMenuItems: NavigationItem[] = AppConstants.DEFAULT_MENU_ITEMS;
  public decorate16DigitCaseReferenceSearchBoxInHeader: boolean;
  private userDetails: UserDetails;

  constructor(
    private readonly store: Store<fromActions.State>,
    private readonly featureToggleService: FeatureToggleService,
    private readonly loggerService: LoggerService,
    private readonly headerConfigService: HeaderConfigService,
    public router: Router
  ) {}

  /**
   * Get User Roles
   *
   * Takes in a string of serialised User Roles, supplied from the Node layer, and deserialises them.
   *
   * @param serialisedUserRoles - 'j:["pui-organisation-manager","caseworker-publiclaw",' +
   * '"caseworker-divorce-financialremedy-solicitor","caseworker"]';
   * @return ["pui-organisation-manager","caseworker-publiclaw","caseworker-divorce-financialremedy-solicitor","caseworker"]
   */
  public deserialiseUserRoles(serialisedUserRoles: string): string[] {
    const serialisedUserRolesWithoutJsonPrefix: string = AppUtils.removeJsonPrefix(serialisedUserRoles);
    return AppUtils.getCookieRolesAsArray(serialisedUserRolesWithoutJsonPrefix);
  }

  /**
   * ngOnInit
   *
   * Get the application theme ie. the navigation and styling for the application header for the logged in User.
   *
   * We then invoke a subscription to listen for if the User is on a page where we need to hide the navigation.
   * ie. on the Terms and Conditions page.
   *
   * We then setup the Application Header accordingly.
   */
  public ngOnInit(): void {
    this.featureToggleKey = AppConstants.SERVICE_MESSAGES_FEATURE_TOGGLE_KEY;
    this.serviceMessageCookie = AppConstants.SERVICE_MESSAGE_COOKIE;

    this.userDetails$ = this.store.pipe(select(fromActions.getUserDetails));
    const decorate16DigitCaseReferenceSearchBoxInHeader$ = this.store.pipe(select(fromActions.getDecorate16digitCaseReferenceSearchBoxInHeader));
    combineLatest([
      this.userDetails$,
      decorate16DigitCaseReferenceSearchBoxInHeader$
    ]).subscribe(([userDetails, decorate16DigitCaseReferenceSearchBoxInHeader]) => {
      this.userDetails = userDetails;
      this.setAppHeaderProperties(this.defaultTheme, this.defaultMenuItems);
      this.setHeaderContent(userDetails);
      this.decorate16DigitCaseReferenceSearchBoxInHeader = decorate16DigitCaseReferenceSearchBoxInHeader;

      // Set up the active link whenever we detect that navigation has completed.
      this.router.events.subscribe((event) => {
        this.setNavigationEnd(event);
      });
    });
  }

  public async setHeaderContent(userDetails) {
    if (userDetails.userInfo) {
      this.userRoles = userDetails.userInfo.roles;
      this.headerConfigService.constructHeaderConfig(this.userRoles).subscribe((menuItems) => {
        this.setAppHeaderNavItems(menuItems);
      });
      this.hideNavigationListener(this.store);
      this.setApplicationThemeForUser();
    }
  }

  public setNavigationEnd(event) {
    if (event instanceof NavigationEnd) {
      this.setupActiveNavLink(this.navItems);
    }
  }

  public setApplicationThemeForUser(): void {
    const availableThemes = environment.themes;
    const userRoles = this.userRoles;
    const userTheme = Object.keys(availableThemes).find((themeRegex) =>
      userRoles.some((role) => new RegExp(themeRegex).test(role))
    );

    const applicationTheme = availableThemes[userTheme] as ApplicationTheme;
    // Set the app header properties based on the retrieved application theme
    this.appHeaderTitle = applicationTheme.appTitle;
    this.userNav = {
      label: 'Account navigation',
      items: this.userRoles.length > 0 ? [{ text: 'Sign out', emit: 'sign-out' }] : []
    };
    this.backgroundColor = applicationTheme.backgroundColor;
    this.logo = applicationTheme.logo;
    this.logoIsUsed = this.logo !== ApplicationThemeLogo.NONE;
  }

  /**
   * Set App Header Properties
   *
   * Set the app header properties, in one function that takes in the application theme.
   */
  public setAppHeaderProperties(applicationTheme: ApplicationTheme, navigationItems: NavigationItem[]): void {
    this.setAppHeaderNavItems(navigationItems);
  }

  public setAppHeaderNavItems(navigationItems: NavigationItem[]): void {
    this.setupActiveNavLink(navigationItems);
  }

  /**
   * Hide Navigation
   *
   * We subscribe to the applications router. When the router url has a certain path we do
   * not show the navigation ie. on the Terms and Conditions page we do not show the navigation,
   * due to business requirements.
   */
  public hideNavigationListener(store): void {
    const observable = this.getObservable(store);
    this.subscription = this.subscribe(observable);
  }

  public getObservable(store: Store<fromActions.State>): Observable<string> {
    return store.pipe(select(fromActions.getRouterUrl));
  }

  /**
   * Check if we should show navigation items.
   *
   * That showNavItems property is a function specifically for the Terms and Conditions page, to not show
   * the Navigation Menu, as this is a business requirement.
   */
  public subscribe(observable: Observable<string>): Subscription {
    return observable.subscribe((url) => {
      this.showNavItems = of(AppUtils.showNavItems(url));
    });
  }

  public ngOnDestroy() {
    this.unsubscribe(this.subscription);
  }

  public unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  public onNavigate(event): void {
    if (event === 'sign-out') {
      this.store.dispatch(new fromActions.StopIdleSessionTimeout());
      return this.store.dispatch(new fromActions.Logout());
    }
  }

  private setupActiveNavLink(items: NavigationItem[]): void {
    if (this.router.url.indexOf('booking') > 0 && AppUtils.isBookableAndJudicialRole(this.userDetails)) {
      this.navItems = [];
    } else {
      this.navItems = AppUtils.setActiveLink(items, this.router.url);
    }
  }
}
