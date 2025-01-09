import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '@hmcts/rpx-xui-common-lib/lib/models/person.model';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { $enum as EnumUtil } from 'ts-enum-util';
import { AppUtils } from '../../../../app/app-utils';
import { UserRole } from '../../../../app/models';
import * as fromAppStore from '../../../../app/store';
import { convertToName } from '../../../../role-access/utils';
import {
  checkAnswersVisibilityStates,
  chooseAllocateToVisibilityStates,
  chooseDurationVisibilityStates,
  chooseRoleVisibilityStates,
  noRolesErrorVisibilityStates,
  searchPersonVisibilityStates
} from '../../../constants/allocate-role-page-visibility-states';
import {
  Actions,
  AllocateRoleNavigation,
  AllocateRoleNavigationEvent,
  AllocateRoleState,
  AllocateRoleStateData,
  AllocateTo,
  DEFINED_ROLES,
  DurationOfRole,
  RoleCategory,
  SpecificRole
} from '../../../models';
import { AllocateRoleService } from '../../../services';
import * as fromFeature from '../../../store';
import { AllocateRoleCheckAnswersComponent } from '../allocate-role-check-answers/allocate-role-check-answers.component';
import { AllocateRoleSearchPersonComponent } from '../allocate-role-search-person/allocate-role-search-person.component';
import { ChooseAllocateToComponent } from '../choose-allocate-to/choose-allocate-to.component';
import { ChooseDurationComponent } from '../choose-duration/choose-duration.component';
import { ChooseRoleComponent } from '../choose-role/choose-role.component';

@Component({
  selector: 'exui-allocate-role-home',
  templateUrl: './allocate-role-home.component.html',
  styleUrls: ['./allocate-role-home.component.scss']
})
export class AllocateRoleHomeComponent implements OnInit, OnDestroy {
  @Input() public existingUsers: string[] = [];
  @ViewChild('chooseRole', { static: false, read: ChooseRoleComponent })
  public chooseRoleComponent: ChooseRoleComponent;

  @ViewChild('chooseAllocateTo', { static: false, read: ChooseAllocateToComponent })
  public chooseAllocateToComponent: ChooseAllocateToComponent;

  @ViewChild('searchPerson', { static: false, read: AllocateRoleSearchPersonComponent })
  public searchPersonComponent: AllocateRoleSearchPersonComponent;

  @ViewChild('chooseDuration', { static: false, read: ChooseDurationComponent })
  public chooseDurationComponent: ChooseDurationComponent;

  @ViewChild('checkAnswers', { static: false, read: AllocateRoleCheckAnswersComponent })
  public checkAnswersComponent: AllocateRoleCheckAnswersComponent;

  public noRolesErrorVisibilityStates = noRolesErrorVisibilityStates;
  public chooseRoleVisibilityStates = chooseRoleVisibilityStates;
  public chooseAllocateToVisibilityStates = chooseAllocateToVisibilityStates;
  public searchPersonVisibilityStates = searchPersonVisibilityStates;
  public chooseDurationVisibilityStates = chooseDurationVisibilityStates;
  public checkAnswersVisibilityStates = checkAnswersVisibilityStates;

  public navEvent: AllocateRoleNavigation;

  public appStoreSub: Subscription;
  public allocateRoleStateDataSub: Subscription;

  public navigationCurrentState: AllocateRoleState;
  public allocateTo: AllocateTo;
  public assignmentId: string | string[];
  public caseId: string;
  public jurisdiction: string;
  public userRole: UserRole;

  public roleCategory: RoleCategory;
  public userIdToBeRemoved: string;
  public userNameToBeRemoved: string;
  public typeOfRole: SpecificRole;
  public action: string;

  public showSpinner: boolean = false;

  constructor(private readonly appStore: Store<fromAppStore.State>,
              private readonly store: Store<fromFeature.State>,
              private readonly allocateRoleService: AllocateRoleService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.appStoreSub = this.appStore.pipe(select(fromAppStore.getUserDetails)).subscribe(
      (userDetails) => {
        this.userRole = AppUtils.getUserRole(userDetails?.userInfo?.roles);
      }
    );
    if (this.route.snapshot.queryParams) {
      const { caseId } = this.route.snapshot.queryParams;
      if (caseId) {
        this.caseId = caseId.replace(/-/g, '');
      }
      this.jurisdiction = this.route.snapshot.queryParams.jurisdiction ? this.route.snapshot.queryParams.jurisdiction : null;
      this.assignmentId = this.route.snapshot.queryParams.assignmentId ? this.route.snapshot.queryParams.assignmentId : null;
      this.roleCategory = this.route.snapshot.queryParams.roleCategory ? this.route.snapshot.queryParams.roleCategory : null;
      this.userIdToBeRemoved = this.route.snapshot.queryParams.actorId ? this.route.snapshot.queryParams.actorId : null;
      this.userNameToBeRemoved = this.route.snapshot.queryParams.userName ? this.route.snapshot.queryParams.userName : null;
      const roleId = this.route.snapshot.queryParams.typeOfRole ? this.route.snapshot.queryParams.typeOfRole : null;
      this.setReallocatedRole(roleId);
      this.action = this.route.snapshot.routeConfig.path ? this.route.snapshot.routeConfig.path : null;
      this.existingUsers = this.route.snapshot.queryParams.existingUsers ? this.route.snapshot.queryParams.existingUsers.split(',') : [];
    }
    if (this.action === Actions.Reallocate) {
      this.instantiateReallocateRoleData();
    } else {
      this.store.dispatch(new fromFeature.AllocateRoleSetInitData({ caseId: this.caseId, jurisdiction: this.jurisdiction, roleCategory: this.roleCategory }));
    }
    const extras = this.router.getCurrentNavigation().extras;
    this.allocateRoleService.backUrl = extras.state && extras.state.backUrl ? extras.state.backUrl : `cases/case-details/${this.caseId}/roles-and-access`;
  }

  private instantiateReallocateRoleData(): void {
    const personToBeRemoved: Person = { id: this.userIdToBeRemoved, name: this.userNameToBeRemoved, domain: this.roleCategory };
    const allocateRoleState: AllocateRoleStateData = {
      caseId: this.caseId,
      jurisdiction: this.jurisdiction,
      assignmentId: this.assignmentId,
      state: this.instantiateState(),
      typeOfRole: this.typeOfRole,
      allocateTo: null,
      personToBeRemoved,
      person: null,
      durationOfRole: DurationOfRole.INDEFINITE,
      roleCategory: RoleCategory[EnumUtil(RoleCategory).getKeyOrDefault(this.roleCategory)],
      action: Actions.Reallocate,
      period: null,
      lastError: null
    };
    this.store.dispatch(new fromFeature.AllocateRoleInstantiate(allocateRoleState));
  }

  private instantiateState(): AllocateRoleState {
    return AllocateRoleState.SEARCH_PERSON;
  }

  public ngOnInit(): void {
    if (this.action !== Actions.Reallocate) {
      this.store.dispatch(new fromFeature.LoadRoles({ jurisdiction: this.jurisdiction, roleCategory: this.roleCategory }));
    }
    this.allocateRoleStateDataSub = this.store.pipe(select(fromFeature.getAllocateRoleState)).subscribe(
      (allocateRoleStateData) => {
        this.navigationCurrentState = allocateRoleStateData.state;
        this.allocateTo = allocateRoleStateData.allocateTo;
        this.action = allocateRoleStateData.action;
      }
    );
  }

  public isComponentVisible(currentNavigationState: AllocateRoleState, requiredNavigationState: AllocateRoleState[]): boolean {
    return requiredNavigationState.includes(currentNavigationState);
  }

  private setReallocatedRole(roleId: string): void {
    if (roleId) {
      const role = DEFINED_ROLES.find((r) => r.id === roleId);
      this.typeOfRole = role && role.name ? role : { id: roleId, name: convertToName(roleId) };
    }
  }

  public onNavEvent(event: AllocateRoleNavigationEvent): void {
    this.navEvent = {
      event,
      timestamp: Date.now()
    };
    this.navigationHandler(event);
  }

  // TODO: Need extra logic when we know admin roles
  public navigationHandler(navEvent: AllocateRoleNavigationEvent): void {
    switch (navEvent) {
      case AllocateRoleNavigationEvent.BACK: {
        switch (this.navigationCurrentState) {
          case AllocateRoleState.CHOOSE_ALLOCATE_TO:
            this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ROLE));
            break;
          case AllocateRoleState.SEARCH_PERSON:
            switch (this.roleCategory) {
              case RoleCategory.JUDICIAL:
                switch (this.userRole) {
                  case UserRole.LegalOps:
                    this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ROLE));
                    break;
                  case UserRole.Judicial:
                    this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
                    break;
                  default:
                    throw new Error('Invalid user role');
                }
                break;
              case RoleCategory.LEGAL_OPERATIONS:
                switch (this.userRole) {
                  case UserRole.LegalOps:
                    this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
                    break;
                  case UserRole.Judicial:
                    this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ROLE));
                    break;
                  default:
                    throw new Error('Invalid user role');
                }
                break;
              case RoleCategory.CTSC:
                switch (this.userRole) {
                  case UserRole.CTSC:
                    this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
                    break;
                  default:
                    throw new Error('Invalid user role');
                }
                break;
              case RoleCategory.ADMIN:
                this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ROLE));
                break;
              default:
                throw new Error('Invalid user type');
            }
            break;
          case AllocateRoleState.CHOOSE_DURATION:
            switch (this.action) {
              case Actions.Reallocate:
                this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
                break;
              case Actions.Allocate:
                switch (this.userRole) {
                  case UserRole.Judicial:
                    switch (this.roleCategory) {
                      case RoleCategory.JUDICIAL:
                        switch (this.allocateTo) {
                          case AllocateTo.ALLOCATE_TO_ME:
                            this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
                            break;
                          case AllocateTo.ALLOCATE_TO_ANOTHER_PERSON:
                            this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
                            break;
                          default:
                            throw new Error('Invalid allocate to');
                        }
                        break;
                      case RoleCategory.LEGAL_OPERATIONS:
                      case RoleCategory.ADMIN:
                        this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
                        break;
                      default:
                        throw new Error('Invalid role category');
                    }
                    break;
                  case UserRole.LegalOps:
                    switch (this.roleCategory) {
                      case RoleCategory.JUDICIAL:
                      case RoleCategory.ADMIN:
                        this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
                        break;
                      case RoleCategory.LEGAL_OPERATIONS:
                        switch (this.allocateTo) {
                          case AllocateTo.ALLOCATE_TO_ME:
                            this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
                            break;
                          case AllocateTo.ALLOCATE_TO_ANOTHER_PERSON:
                            this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
                            break;
                          default:
                            throw new Error('Invalid allocate to');
                        }
                        break;
                      default:
                        throw new Error('Invalid role category');
                    }
                    break;
                  case UserRole.CTSC:
                    switch (this.roleCategory) {
                      case RoleCategory.CTSC:
                        switch (this.allocateTo) {
                          case AllocateTo.ALLOCATE_TO_ME:
                            this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
                            break;
                          case AllocateTo.ALLOCATE_TO_ANOTHER_PERSON:
                            this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
                            break;
                          default:
                            throw new Error('Invalid allocate to');
                        }
                        break;
                      default:
                        throw new Error('Invalid role category');
                    }
                    break;
                  default:
                    throw new Error('invalid user role');
                }
                break;
              default:
                throw new Error('Invalid action');
            }
            break;
          case AllocateRoleState.CHECK_ANSWERS:
            this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_DURATION));
            break;
          default:
            throw new Error('Invalid allocation state');
        }
        break;
      }
      case AllocateRoleNavigationEvent.CONTINUE: {
        switch (this.navigationCurrentState) {
          case AllocateRoleState.CHOOSE_ROLE:
            this.chooseRoleComponent.navigationHandler(navEvent);
            break;
          case AllocateRoleState.CHOOSE_ALLOCATE_TO:
            this.chooseAllocateToComponent.navigationHandler(navEvent);
            break;
          case AllocateRoleState.SEARCH_PERSON:
            this.searchPersonComponent.navigationHandler(navEvent);
            break;
          case AllocateRoleState.CHOOSE_DURATION:
            this.chooseDurationComponent.navigationHandler(navEvent);
            break;
          case AllocateRoleState.CHECK_ANSWERS:
            this.checkAnswersComponent.navigationHandler(navEvent);
            break;
          default:
            throw new Error('Invalid allocation state');
        }
        break;
      }
      case AllocateRoleNavigationEvent.CONFIRM: {
        switch (this.navigationCurrentState) {
          case AllocateRoleState.CHECK_ANSWERS:
            this.showSpinner = true;
            this.checkAnswersComponent.navigationHandler(navEvent);
            break;
          default:
            this.showSpinner = false;
            throw new Error('Invalid allocation state');
        }
        break;
      }
      case AllocateRoleNavigationEvent.CANCEL: {
        this.router.navigateByUrl(this.allocateRoleService.backUrl)
          .then(undefined, undefined);
        break;
      }
      default:
        throw new Error('Invalid allocation navigation event');
    }
  }

  public ngOnDestroy(): void {
    if (this.appStoreSub) {
      this.appStoreSub.unsubscribe();
    }
    if (this.allocateRoleStateDataSub) {
      this.allocateRoleStateDataSub.unsubscribe();
    }
    this.store.dispatch(new fromFeature.AllocateRoleReset());
  }
}
