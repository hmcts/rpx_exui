import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { FeatureToggleService, FilterPersistence, SubNavigation } from '@hmcts/rpx-xui-common-lib';
import { Observable, Subscription } from 'rxjs';
import { of } from 'rxjs';

import { AppConstants } from '../../../app/app.constants';
import { AppUtils } from '../../../app/app-utils';
import { ErrorMessage } from '../../../app/models';
import { AllocateRoleService } from '../../../role-access/services';
import { SortField } from '../../models/common';

@Component({
  selector: 'exui-task-home',
  templateUrl: 'task-home.component.html',
  styleUrls: ['task-home.component.scss']
})
export class TaskHomeComponent implements OnInit, OnDestroy {
  public persistence$: Observable<FilterPersistence> = of('local' as FilterPersistence);
  public sortedBy: SortField;
  public pageTitle: string;
  public error: ErrorMessage = null;
  /**
   * Take in the Router so we can navigate when actions are clicked and
   * to identify which sub-navigation item to highlight.
   */
  private readonly MY_TASKS: SubNavigation = { text: 'My tasks', href: '/work/my-work/list', active: true };
  /**
   * The sub-navigation items.
   */
  public subNavigationItems: SubNavigation[] = [
    this.MY_TASKS,
    { text: 'Available tasks', href: '/work/my-work/available', active: false }
  ];

  private routeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly allocateRoleService: AllocateRoleService,
    private readonly featureToggleService: FeatureToggleService
  ) { }

  public ngOnInit(): void {
    this.subNavigationItems.push({ text: 'My cases', href: '/work/my-work/my-cases', active: false });
    this.featureToggleService.getValue(AppConstants.FEATURE_NAMES.waAccess, null).subscribe((hasMyAccess) => {
      if (hasMyAccess) {
        this.subNavigationItems.push({ text: 'My access', href: '/work/my-work/my-access', active: false });
      }
    });

    this.allocateRoleService.getMyAccessNewCount().subscribe((countOfApproval) => {
      const myAccessNavItem = this.subNavigationItems.find((nav) => nav.text === 'My access');
      if (myAccessNavItem) {
        myAccessNavItem.roundel = countOfApproval.count;
      }
    });

    this.allocateRoleService.getMyAccessNewCount().subscribe((countOfApproval) => {
      const myAccessNavItem = this.subNavigationItems.find((nav) => nav.text === 'My access');
      if (myAccessNavItem) {
        myAccessNavItem.roundel = countOfApproval.count;
      }
    });

    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Set up the active navigation item.
        this.setupActiveSubNavigationItem(this.router.url);
      }
      if (event instanceof RoutesRecognized) {
        // Set up the page data.
        this.setupPageData(event.state.root);
      }
    });
    // Set up the active navigation item.
    this.setupActiveSubNavigationItem(this.router.url);

    // Set up the page data.
    this.setupPageData(this.router.routerState.root.snapshot);
  }

  public ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  /**
   * Set the active sub-navigation item, based on the supplied active url.
   * @param activeUrl The URL considered active.
   */
  public setupActiveSubNavigationItem(activeUrl: string): void {
    if (this.subNavigationItems) {
      for (const item of this.subNavigationItems) {
        item.active = this.isActiveUrl(item.href, activeUrl);
      }
    }
  }

  /**
   * Sets up the page data (the title) for the activated route.
   * @param activatedRoute The activated (parent) route to start with.
   */
  public setupPageData(activatedRoute: ActivatedRouteSnapshot): void {
    const data = AppUtils.getRouteData(activatedRoute);
    this.pageTitle = data ? data.subTitle : 'Task list';
  }

  public isActiveUrl(url: string, currentUrl: string): boolean {
    if (url && currentUrl) {
      return currentUrl.indexOf(url) === 0;
    }
    return false;
  }

  public errorChangedHandler(error: ErrorMessage) {
    // Override location error message
    // https://tools.hmcts.net/jira/browse/EUI-4582
    if (error && error.errors) {
      const locationsErrorIndex = error.errors.findIndex((x) => x.name.toLowerCase() === 'locations');
      if (locationsErrorIndex > -1) {
        error.errors[locationsErrorIndex].error = 'Enter a location';
      }
    }
    this.error = error;
  }
}
