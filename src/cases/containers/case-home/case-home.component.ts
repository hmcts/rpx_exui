import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertService,
  ErrorNotifierService,
  HttpError,
  LoadingService as CCDLoadingService,
  NavigationNotifierService,
  NavigationOrigin
} from '@hmcts/ccd-case-ui-toolkit';
import { LoadingService as CommonLibLoadingService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { GoActionParams } from '../../../cases/models/go-action-params.model';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../../store';

@Component({
  selector: 'exui-case-home',
  templateUrl: 'case-home.component.html',
  styleUrls: ['case-home.component.scss']
})
export class CaseHomeComponent implements OnInit, OnDestroy {
  public static readonly CASE_CREATED_MSG = 'The case has been created successfully';
  public static readonly DRAFT_DELETED_MSG = 'The draft has been successfully deleted';

  public navigationSubscription: Subscription;

  public showSpinner$: Observable<boolean>;

  constructor(
    private readonly alertService: AlertService,
    private readonly errorNotifierService: ErrorNotifierService,
    private readonly navigationNotifier: NavigationNotifierService,
    private readonly store: Store<fromFeature.State>,
    private readonly commonLibLoadingService: CommonLibLoadingService,
    private readonly ccdLibLoadingService: CCDLoadingService,
  ) {}

  /**
   * We dispatch an action to start the idle session timeout. We
   * do this here as this is the first 'authenticated' page the User hits.
   *
   * We do not want to be showing the User a Session Timeout modal, if they
   * have yet to be logged in. ie. Viewing an accessibility page.
   */
  public ngOnInit(): void {
    this.navigationSubscription = this.navigationNotifier.navigation.subscribe((navigation) => {
      if (navigation.action) {
        this.actionDispatcher(this.paramHandler(navigation));
      }
    }) as any;

    const libServices$ = combineLatest([
      this.ccdLibLoadingService.isLoading,
      this.commonLibLoadingService.isLoading
    ]);

    this.showSpinner$ = libServices$.pipe(delay(0), map((states) => states.reduce((c, s) => c || s, false)));
  }

  public ngOnDestroy(): void {
    if (this.navigationSubscription) {
      // When case home is destroyed reset the navigation notifier service observables
      this.navigationNotifier.announceNavigation({});
      this.navigationSubscription.unsubscribe();
    }
  }

  // TODO: please revisit
  public paramHandler(navigation: any): GoActionParams {
    let params: GoActionParams;
    switch (navigation.action) {
      case NavigationOrigin.DRAFT_DELETED:
        params = {
          path: ['cases'],
          callback: () => {
            this.alertService.setPreserveAlerts(true);
            this.alertService.success({ phrase: CaseHomeComponent.DRAFT_DELETED_MSG });
          }
        };
        break;
      case NavigationOrigin.ERROR_DELETING_DRAFT:
        params = {
          path: ['cases']
        };
        break;
      case NavigationOrigin.DRAFT_RESUMED:
        params = {
          path: ['create/case',
            navigation.jid,
            navigation.ctid,
            navigation.etid],
          query: navigation.queryParams,
          errorHandler: (error) => this.handleErrorWithTriggerId(error, navigation.etid)
        };
        break;
      case NavigationOrigin.EVENT_TRIGGERED:
        const query = navigation.queryParams;
        params = {
          path: ['cases',
            'case-details',
            navigation.relativeTo.snapshot.params.cid,
            'trigger',
            navigation.etid],
          query: { ...query },
          errorHandler: (error) => this.handleErrorWithTriggerId(error, navigation.etid)
        };
        break;
      case NavigationOrigin.NO_READ_ACCESS_REDIRECTION:
        params = {
          path: ['cases'],
          callback: () => {
            this.alertService.success({ phrase: CaseHomeComponent.CASE_CREATED_MSG });
          }
        };
        break;
      default:
        params = {
          path: ['cases',
            'case-details',
            navigation.relativeTo.snapshot.params.cid
          ],
          errorHandler: (error) => this.handleCaseViewError(error)
        };
    }
    return params;
  }

  public actionDispatcher(params: GoActionParams): void {
    return this.store.dispatch(new fromRoot.Go(params));
  }

  public handleErrorWithTriggerId(error: HttpError, triggerId: string): void {
    console.error(`Handling error with handleErrorWithTriggerId ${triggerId}`);
    console.error(error);
    if (error.status !== 401 && error.status !== 403) {
      this.errorNotifierService.announceError(error);
      this.alertService.error({ phrase: error.message });
    }
  }

  public handleCaseViewError(error: Error): void {
    console.error('Handling error with handleCaseViewError');
    console.error(error);
    throw error;
  }
}
