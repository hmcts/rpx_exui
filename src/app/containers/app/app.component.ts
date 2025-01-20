import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router, RoutesRecognized } from '@angular/router';
import { CookieService, FeatureToggleService, FeatureUser, GoogleTagManagerService, TimeoutNotificationsService } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { propsExist } from '../../../../api/lib/objectUtilities';
import { SessionStorageService } from '../../services';
import { environment as config } from '../../../environments/environment';
import { UserDetails, UserInfo } from '../../models';
import { LoggerService } from '../../services/logger/logger.service';
import { EnvironmentService } from '../../shared/services/environment.service';
import * as fromRoot from '../../store';
import { InitialisationSyncService } from '../../services/ccd-config/initialisation-sync-service';

@Component({
  selector: 'exui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  public timeoutModalConfig = {
    countdown: '0 seconds',
    isVisible: false
  };

  private userId: string = null;
  public cookieName;
  public isCookieBannerVisible: boolean = false;
  private cookieBannerEnabledSubscription: Subscription;
  private cookieBannerEnabled: boolean = false;
  public subscription: Subscription;
  private pageReloading: boolean = false;
  private timeoutNotificationServiceInitialised: boolean = false;
  private idleModalDisplayTimeInMilliseconds: number;
  private totalIdleTimeInMilliseconds: number;

  constructor(
    private readonly store: Store<fromRoot.State>,
    private readonly googleTagManagerService: GoogleTagManagerService,
    private readonly timeoutNotificationsService: TimeoutNotificationsService,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly featureService: FeatureToggleService,
    private readonly loggerService: LoggerService,
    private readonly cookieService: CookieService,
    private readonly environmentService: EnvironmentService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly initialisationSyncService: InitialisationSyncService
  ) {
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        let child = data.state.root;
        do {
          child = child.firstChild;
        } while (child.firstChild);
        const d = child.data;
        if (d.title) {
          this.titleService.setTitle(`${d.title} - HM Courts & Tribunals Service - GOV.UK`);
        }
      }
    });

    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.pageReloading = !router.navigated;
        this.sessionStorageService.setItem('isPageRefreshed', this.pageReloading.toString());
      }
    });
  }

  public ngOnInit() {
    this.store.pipe(select(fromRoot.getUseIdleSessionTimeout)).subscribe((useIdleTimeout) => {
      if (useIdleTimeout) {
        this.loadAndListenForUserDetails();
      }
    });

    // Moved here from CaseHomeComponent as this needs to be app-wide, and
    // not just happening for the Case view. Moreover, it has an impact on
    // the rendering of the menu as it triggers an action that gets hold of
    // the user's profile.
    this.store.dispatch(new fromRoot.StartIdleSessionTimeout());

    this.handleCookieBannerFeatureToggle();
  }

  public ngOnDestroy() {
    if (this.cookieBannerEnabledSubscription) {
      this.cookieBannerEnabledSubscription.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public handleCookieBannerFeatureToggle(): void {
    this.cookieBannerEnabledSubscription = this.featureService.isEnabled('mc-cookie-banner-enabled')
      .subscribe((flag) => {
        this.cookieBannerEnabled = flag;
        this.setCookieBannerVisibility();
      });
  }

  /**
   * Load and Listen for User Details
   */
  public loadAndListenForUserDetails() {
    this.store.dispatch(new fromRoot.LoadUserDetails());
    const userDetails$ = this.store.pipe(select(fromRoot.getUserDetails));
    const envConfigAndUserDetails$ = combineLatest([this.environmentService.config$, userDetails$]);
    envConfigAndUserDetails$.subscribe((envConfigAndUserDetails) => {
      this.userDetailsHandler(envConfigAndUserDetails[0].launchDarklyClientId, envConfigAndUserDetails[1]);
    });
  }

  /**
   * User Details Handler
   *
   * If the sessionTimeout exists on the userDetails object we add the Timeout Notification Service Listeners,
   * and initialise the Timeout Notification Service.
   *
   * @param userDetails - {
   *  "sessionTimeout": {
   *  "idleModalDisplayTime": 10,
   *  "pattern": "-solicitor",
   *  "totalIdleTime": 50
   *  }
   * }
   */
  public userDetailsHandler(ldClientId: string, userDetails: UserDetails) {
    if (userDetails?.userInfo) {
      this.initializeFeature(userDetails.userInfo, ldClientId);
      console.log('userDetailsHandler initialiseFeature is complete for user ' + userDetails.userInfo?.email);
      this.initialisationSyncService.initialisationComplete();
      if (propsExist(userDetails, ['sessionTimeout']) && userDetails.sessionTimeout.totalIdleTime > 0) {
        const { idleModalDisplayTime, totalIdleTime } = userDetails.sessionTimeout;
        /**
         * Fix for EUI-4469 Live Defect - Google Tag Manager broken
         *
         * I've changed the order of execution in order to make the cookie banner
         * visible in production.
         *
         * TODO: The "TypeError: Cannot read properties of undefined (reading 'setIdleName')"
         * issue will need to be fixed as part of EUI-4482. Remove comment once EUI-4482 is done.
         */
        const uid = userDetails.userInfo.id ? userDetails.userInfo.id : userDetails.userInfo.uid;
        this.setUserAndCheckCookie(uid);
        this.initTimeoutNotificationService(idleModalDisplayTime, totalIdleTime);
      }
    }
  }

  public initializeFeature(userInfo: UserInfo, ldClientId: string) {
    if (userInfo) {
      const featureUser: FeatureUser = {
        key: userInfo.id || userInfo.uid,
        roles: userInfo?.roles,
        orgId: '-1'
      };
      console.log(`LD Client: ${ldClientId}`);
      this.featureService.initialize(featureUser, ldClientId);
    } else {
      console.error('Cannot initialise featureService, no userInfo');
    }
  }

  public setUserAndCheckCookie(userId) {
    this.userId = userId;
    if (this.userId) { // check if cookie selection has been made *after* user id is available
      this.cookieName = `hmcts-exui-cookies-${this.userId}-mc-accepted`;
      this.setCookieBannerVisibility();
    }
  }

  public notifyAcceptance() {
    this.loggerService.enableCookies();
    this.googleTagManagerService.init(config.googleTagManagerKey);
  }

  public notifyRejection() {
    // AppInsights
    this.cookieService.deleteCookieByPartialMatch('ai_');
    // Google Analytics
    this.cookieService.deleteCookieByPartialMatch('_ga');
    this.cookieService.deleteCookieByPartialMatch('_gid');
    // DynaTrace
    this.cookieService.deleteCookieByPartialMatch('rxVisitor');
    this.cookieService.deleteCookieByPartialMatch('dt');
    const domainElements = window.location.hostname.split('.');
    for (let i = 0; i < domainElements.length; i++) {
      const domainName = domainElements.slice(i).join('.');
      this.cookieService.deleteCookieByPartialMatch('_ga', '/', domainName);
      this.cookieService.deleteCookieByPartialMatch('_gid', '/', domainName);
      this.cookieService.deleteCookieByPartialMatch('_ga', '/', `.${domainName}`);
      this.cookieService.deleteCookieByPartialMatch('_gid', '/', `.${domainName}`);

      this.cookieService.deleteCookieByPartialMatch('rxVisitor', '/', domainName);
      this.cookieService.deleteCookieByPartialMatch('dt', '/', domainName);
      this.cookieService.deleteCookieByPartialMatch('rxVisitor', '/', `.${domainName}`);
      this.cookieService.deleteCookieByPartialMatch('dt', '/', `.${domainName}`);
    }
  }

  /**
   * Timeout Notification Event Handler
   *
   * The Timeout Notification Service currently has three events that we can handle. These are:
   *
   * The 'countdown' event. This event dispatches a readable countdown timer in it's event payload. the countdown
   * timer is a readable version of the countdown time ie. '10 seconds' or '1 minute'. Note that this dispatches
   * once per second when the timer has reached less than 60 seconds till the 'sign-out' event is fired.
   *
   * If the 'countdown' timer is above a minute this event is dispatched every minute.
   *
   * The 'keep-alive' event dispatches when the User has interacted with the page again.
   *
   * The 'sign-out' event dispatches when the countdown timer has come to an end - when the User
   * should be signed out.
   *
   * @param event - {
   *  eventType: 'countdown'
   *  readableCountdown: '42 seconds',
   * }
   */
  public timeoutNotificationEventHandler(event) {
    switch (event.eventType) {
      case 'countdown': {
        this.updateTimeoutModal(event.readableCountdown, true);
        return;
      }
      case 'sign-out': {
        this.updateTimeoutModal('0 seconds', false);
        this.signOutHandler();
        return;
      }
      case 'keep-alive': {
        this.updateTimeoutModal('0 seconds', false);
        return;
      }
      default: {
        throw new Error('Invalid Timeout Notification Event');
      }
    }
  }

  /**
   * Set Modal
   *
   * Set the modal countdown, and if the modal is visible to the User.
   */
  public updateTimeoutModal(countdown: string, isVisible: boolean): void {
    this.timeoutModalConfig = {
      countdown,
      isVisible
    };
  }

  /**
   * Stay Signed in Handler
   */
  public staySignedInHandler() {
    this.updateTimeoutModal(undefined, false);
    this.timeoutNotificationsService.reset();
  }

  public signOutHandler() {
    this.timeoutNotificationsService.close();
    this.store.dispatch(new fromRoot.StopIdleSessionTimeout());
    this.store.dispatch(new fromRoot.Logout());
  }

  /**
   * Initialise Timeout Notification Service
   *
   * We initialise the Idle Notification Service which is part of the common lib.
   *
   * Why do we use minutes up to this point over seconds, or milliseconds?
   *
   * i. Easy to see in the configuration how many minutes each User group's modal
   * and session timeout lasts.
   * ii. Less zero's mean less human mistakes.
   * iii. Discussed with BA minutes makes sense.
   *
   * <code>totalIdleTime</code> is the total amount of time in minutes that the User is idle for.
   * The Users total idle time, includes the time in which we show the Session Timeout Modal to the User
   *
   * <code>idleModalDisplayTime</code> is the total amount of time in minutes to display the Session Timeout Modal.
   *
   * Important note: The idleModalDisplayTime IS PART of the totalIdleTime. The idleModalDisplayTime does not get added to the end of
   * the totalIdleTime.
   *
   * We convert idleModalDisplayTime and totalIdleTime which reaches here in minutes to seconds.
   *
   * @param idleModalDisplayTime - Should reach here in minutes
   * @param totalIdleTime - Should reach here in minutes
   */
  public initTimeoutNotificationService(idleModalDisplayTime, totalIdleTime) {
    if (this.timeoutNotificationServiceInitialised) {
      return;
    }

    const idleModalDisplayTimeInSeconds = idleModalDisplayTime * 60;

    this.idleModalDisplayTimeInMilliseconds = idleModalDisplayTimeInSeconds * 1000;
    this.totalIdleTimeInMilliseconds = (totalIdleTime * 60) * 1000;

    this.setupTimeoutNotificationService();
  }

  private setupTimeoutNotificationService(): void {
    const timeoutNotificationConfig: any = {
      idleModalDisplayTime: this.idleModalDisplayTimeInMilliseconds,
      totalIdleTime: this.totalIdleTimeInMilliseconds,
      idleServiceName: 'idleSession'
    };

    this.timeoutNotificationsService.notificationOnChange().subscribe((event) => {
      this.timeoutNotificationEventHandler(event);
    });
    this.loggerService.log('Initialising TimeoutNotificationService');
    this.timeoutNotificationsService.initialise(timeoutNotificationConfig);
    this.timeoutNotificationServiceInitialised = true;
  }

  public setCookieBannerVisibility(): void {
    this.isCookieBannerVisible = this.cookieBannerEnabled && !!this.userId;
  }
}
