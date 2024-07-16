import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, skipWhile, switchMap, tap } from 'rxjs/operators';
import { UserDetails } from '../../../app/models/user-details.model';
import * as fromAppStore from '../../../app/store';
import * as fromNocStore from '../../../noc/store';
import { SearchStatePersistenceKey } from '../../../search/enums';
import { SearchService } from '../../../search/services/search.service';
import { FlagDefinition, NavigationItem, UserNavModel } from '../../models';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'exui-hmcts-global-header',
  templateUrl: './hmcts-global-header.component.html',
  styleUrls: ['./hmcts-global-header.component.scss']
})
export class HmctsGlobalHeaderComponent implements OnInit, OnChanges {
  private static readonly GLOBAL_SEARCH_FEATURE_CONFIG = 'feature-global-search';

  @Input() public set showNavItems(value: boolean) {
    this.showItems = value;
  }

  @Input() public items: NavigationItem[];
  @Input() public logoIsUsed: boolean;
  @Input() public headerTitle: { name: string; url: string };
  @Input() public navigation: UserNavModel;
  @Input() public logo: string;
  @Input() public currentUrl: string;
  @Input() public decorate16DigitCaseReferenceSearchBoxInHeader: boolean;
  @Output() public navigate = new EventEmitter<string>();

  public showItems = false;
  public userValue = true;
  public tab;
  public userDetails$: Observable<UserDetails>;
  public isUserCaseManager$: Observable<boolean>;
  public isGlobalSearchEnabled$: Observable<boolean>;
  public get leftItems(): Observable<NavigationItem[]> {
    return this.menuItems.left.asObservable();
  }

  public get rightItems(): Observable<NavigationItem[]> {
    return this.menuItems.right.asObservable();
  }

  private readonly menuItems = {
    left: new BehaviorSubject<NavigationItem[]>([]),
    right: new BehaviorSubject<NavigationItem[]>([])
  };

  constructor(
    private readonly appStore: Store<fromAppStore.State>,
    private readonly nocStore: Store<fromNocStore.State>,
    private readonly userService: UserService,
    private readonly featureToggleService: FeatureToggleService,
    private readonly searchService: SearchService
  ) {}

  public ngOnInit(): void {
    this.userDetails$ = this.appStore.pipe(select(fromAppStore.getUserDetails));
    this.isUserCaseManager$ = this.userDetails$.pipe(
      skipWhile((details) => !('userInfo' in details)),
      map((details) => details?.userInfo?.roles),
      map((roles) => {
        const givenRoles = ['pui-case-manager', 'caseworker-ia-legalrep-solicitor', 'caseworker-ia-homeofficeapc', 'caseworker-ia-respondentofficer', 'caseworker-ia-homeofficelart', 'caseworker-ia-homeofficepou'];
        return givenRoles.filter((x) => roles.includes(x)).length > 0;
      })
    );
    this.isGlobalSearchEnabled$ = this.featureToggleService.isEnabled(HmctsGlobalHeaderComponent.GLOBAL_SEARCH_FEATURE_CONFIG);
    this.splitAndFilterNavItems(this.items);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.items.currentValue !== changes.items.previousValue) {
      this.splitAndFilterNavItems(this.items);
    }
  }

  public onEmitEvent(index: number): void {
    this.navigate.emit(this.navigation.items[index].emit);
  }

  public onEmitSubMenu(menuItem: any): void {
    // New menu item page load, do not decorate 16-digit case reference search box with error class
    this.appStore.dispatch(new fromAppStore.Decorate16DigitCaseReferenceSearchBoxInHeader(false));

    // Clear the search parameters from session
    this.searchService.storeState(SearchStatePersistenceKey.SEARCH_PARAMS, null);

    if (menuItem.href === '/noc') {
      this.nocStore.dispatch(new fromNocStore.Reset());
    }
  }

  private splitAndFilterNavItems(items: NavigationItem[]): void {
    items = items || [];
    of(items).pipe(
      switchMap((unfilteredItems) => this.filterNavItemsOnRole(unfilteredItems)),
      switchMap((roleFilteredItems) => this.filterNavItemsOnFlag(roleFilteredItems)),
      map((filteredItems) => this.splitNavItems(filteredItems))
    ).subscribe((sortedItems) => {
      this.menuItems.left.next(sortedItems.left);
      this.menuItems.right.next(sortedItems.right);
    });
  }

  private splitNavItems(items: NavigationItem[]): { right: NavigationItem[], left: NavigationItem[] } {
    items = items || [];
    return {
      right: items.filter((item) => item.align && item.align === 'right'),
      left: items.filter((item) => !item.align || item.align !== 'right')
    };
  }

  private filterNavItemsOnRole(items: NavigationItem[]): Observable<NavigationItem[]> {
    items = items || [];
    return this.userService.getUserDetails().pipe(
      skipWhile((details) => !('userInfo' in details)),
      map((details) => details?.userInfo?.roles),
      map((roles) => {
        const i = items.filter((item) => (item.roles && item.roles.length > 0 ? item.roles.some((role) => roles.includes(role)) : true));
        return i.filter((item) => (item.notRoles && item.notRoles.length > 0 ? item.notRoles.every((role) => !roles.includes(role)) : true));
      })
    );
  }

  private filterNavItemsOnFlag(items: NavigationItem[]): Observable<NavigationItem[]> {
    items = items || [];
    const flags: { [flag: string]: boolean | string } = {};
    const obs: Observable<boolean>[] = [];
    items.forEach(
      (item) => (item.flags || []).concat(item.notFlags || []).forEach(
        (flag) => {
          const flagName = this.isPlainFlag(flag) ? flag : flag.flagName;
          obs.push(
            this.featureToggleService.isEnabled(flagName).pipe(
              tap((state) => flags[flagName] = state)
            )
          );
        }
      )
    );

    if (obs.length === 0) {
      return of(items);
    }
    return ((obs.length > 1 ? combineLatest([obs[0], combineLatest(obs.slice(1))]) : obs[0]) as Observable<any>).pipe(
      map(() => {
        let i = items.filter((item) => item.flags && item.flags.length > 0 ? item.flags.every((flag) => this.isPlainFlag(flag) ? (flags[flag] as boolean) : (flags[flag.flagName] as string) === flag.value) : true);
        i = i || [];
        return i.filter((item) => item.notFlags && item.notFlags.length > 0 ? item.notFlags.every((flag) => this.isPlainFlag(flag) ? !(flags[flag] as boolean) : (flags[flag.flagName] as string) !== flag.value) : true);
      })
    );
  }

  private isPlainFlag(flag: FlagDefinition): flag is string {
    return !flag.hasOwnProperty('flagName');
  }
}
