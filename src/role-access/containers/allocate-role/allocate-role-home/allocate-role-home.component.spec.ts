import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { UserRole } from '../../../../app/models';
import { UtilsModule } from '../../../../noc/containers/noc-field/utils/utils.module';
import {
  Actions,
  AllocateRoleNavigationEvent,
  AllocateRoleState,
  AllocateTo,
  DurationOfRole,
  RoleCategory
} from '../../../models';
import { AllocateRoleService } from '../../../services';
import * as fromStore from '../../../store';
import * as fromContainers from '../../allocate-role';
import { AllocateRoleHomeComponent } from './allocate-role-home.component';

const mockRoles = [{ roleId: '1', roleName: 'Role 1' },
  { roleId: '2', roleName: 'Role 2' },
  { roleId: '3', roleName: 'Role 3' }];

describe('AllocateRoleHomeComponent', () => {
  const USER = {
    sessionTimeout: {
      idleModalDisplayTime: 12,
      totalIdleTime: 12
    },
    canShareCases: true,
    userInfo: {
      id: '111111',
      forename: 'test forename',
      surname: 'test surname',
      email: 'test@test.com',
      active: true,
      roles: ['sscs-caseworker']
    }
  };
  const STATE_DATA = {
    caseId: '111111',
    state: AllocateRoleState.CHOOSE_ROLE,
    typeOfRole: null,
    allocateTo: AllocateTo.ALLOCATE_TO_ME,
    person: null,
    durationOfRole: DurationOfRole.SEVEN_DAYS,
    action: Actions.Allocate,
    period: null,
    roleCategory: RoleCategory.ADMIN
  };
  const ROLE_LIST = [
    {
      added: Date.UTC(2021, 6, 1),
      id: '999999999',
      name: 'Judge Rinder',
      notes: 'Test exclusion',
      email: 'user@test.com'
    }
  ];
  let component: AllocateRoleHomeComponent;
  let fixture: ComponentFixture<AllocateRoleHomeComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  const allocateRoleServiceMock = jasmine.createSpyObj('AllocateRoleService', ['getValidRoles']);
  let store: Store<fromStore.State>;
  let storePipeMock: any;
  let storeDispatchMock: any;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', [
      'navigateByUrl', 'getCurrentNavigation'
    ]);
    routerMock.navigateByUrl.and.returnValue(new Promise(() => true));

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
        ...fromContainers.containers
      ],
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
              data: {
                validRoles: mockRoles
              },
              queryParams: {
                caseId: '111111',
                userType: 'Judicial',
                roleCategory: 'JUDICIAL'
              },
              routeConfig: {
                path: 'allocate'
              }
            }
          }
        },
        {
          provide: AllocateRoleService,
          useValue: allocateRoleServiceMock
        }
      ]
    }).compileComponents();

    store = TestBed.inject(Store);

    storePipeMock = spyOn(store, 'pipe');
    storeDispatchMock = spyOn(store, 'dispatch');
    storePipeMock.and.returnValue(of(USER));
    routerMock.getCurrentNavigation.and.returnValue({
      extractedUrl: undefined,
      id: 0,
      initialUrl: undefined,
      previousNavigation: undefined,
      trigger: undefined,
      extras: { state: { backUrl: null } }
    });
    fixture = TestBed.createComponent(AllocateRoleHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigationHandler back', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.BACK;

    it('on CHOOSE_ALLOCATE_TO page', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_ALLOCATE_TO;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ROLE));
    });

    it('on SEARCH_PERSON page legal ops user assign judicial user', () => {
      component.navigationCurrentState = AllocateRoleState.SEARCH_PERSON;
      component.userRole = UserRole.LegalOps;
      component.roleCategory = RoleCategory.JUDICIAL;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ROLE));
    });

    it('on SEARCH_PERSON page CTSC user assign judicial user', () => {
      component.navigationCurrentState = AllocateRoleState.SEARCH_PERSON;
      component.userRole = UserRole.CTSC;
      component.roleCategory = RoleCategory.CTSC;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
    });

    it('on SEARCH_PERSON page judicial user assign judicial user', () => {
      component.navigationCurrentState = AllocateRoleState.SEARCH_PERSON;
      component.userRole = UserRole.Judicial;
      component.roleCategory = RoleCategory.JUDICIAL;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
    });

    it('on SEARCH_PERSON page legal ops user assign legal ops user', () => {
      component.navigationCurrentState = AllocateRoleState.SEARCH_PERSON;
      component.userRole = UserRole.LegalOps;
      component.roleCategory = RoleCategory.LEGAL_OPERATIONS;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
    });

    it('on SEARCH_PERSON page judicial user assign legal ops user', () => {
      component.navigationCurrentState = AllocateRoleState.SEARCH_PERSON;
      component.userRole = UserRole.Judicial;
      component.roleCategory = RoleCategory.LEGAL_OPERATIONS;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ROLE));
    });

    it('on CHOOSE_DURATION page when reallocate user', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Reallocate;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
    });

    it('on CHOOSE_DURATION page when judicial user allocate judicial user if reserve to me', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.Judicial;
      component.roleCategory = RoleCategory.JUDICIAL;
      component.allocateTo = AllocateTo.ALLOCATE_TO_ME;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
    });

    it('on CHOOSE_DURATION page when CTSC user allocate judicial user if reserve to me', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.CTSC;
      component.roleCategory = RoleCategory.CTSC;
      component.allocateTo = AllocateTo.ALLOCATE_TO_ME;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
    });

    it('on CHOOSE_DURATION page when CTSC user allocate judicial user if reserve to me', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.CTSC;
      component.roleCategory = RoleCategory.CTSC;
      component.allocateTo = AllocateTo.ALLOCATE_TO_ANOTHER_PERSON;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
    });

    it('on CHOOSE_DURATION page on invalid details Invalid role category', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.CTSC;
      component.roleCategory = RoleCategory.JUDICIAL;
      component.allocateTo = AllocateTo.ALLOCATE_TO_ANOTHER_PERSON;
      expect(() => {
        component.navigationHandler(navEvent);
      }).toThrow(new Error('Invalid role category'));
    });

    it('on CHOOSE_DURATION page on invalid details Invalid allocate to', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.CTSC;
      component.roleCategory = RoleCategory.CTSC;
      component.allocateTo = AllocateTo.REALLOCATE_TO_ANOTHER_PERSON;
      expect(() => {
        component.navigationHandler(navEvent);
      }).toThrow(new Error('Invalid allocate to'));
    });

    it('on CHOOSE_DURATION page on invalid details invalid user role', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.Ogd;
      component.roleCategory = RoleCategory.CTSC;
      component.allocateTo = AllocateTo.REALLOCATE_TO_ANOTHER_PERSON;
      expect(() => {
        component.navigationHandler(navEvent);
      }).toThrow(new Error('invalid user role'));
    });

    it('on CHOOSE_DURATION page when judicial user allocate judicial user if allocate to another person', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.Judicial;
      component.roleCategory = RoleCategory.JUDICIAL;
      component.allocateTo = AllocateTo.ALLOCATE_TO_ANOTHER_PERSON;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
    });

    it('on CHOOSE_DURATION page when judicial user allocate legalops user', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.Judicial;
      component.roleCategory = RoleCategory.LEGAL_OPERATIONS;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
    });

    it('on CHOOSE_DURATION page when legalops user allocate judicial user', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.LegalOps;
      component.roleCategory = RoleCategory.JUDICIAL;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
    });

    it('on CHOOSE_DURATION page when legalops user allocate legalops user if reserve to me', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.LegalOps;
      component.roleCategory = RoleCategory.LEGAL_OPERATIONS;
      component.allocateTo = AllocateTo.ALLOCATE_TO_ME;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_ALLOCATE_TO));
    });

    it('on CHOOSE_DURATION page when legalops user allocate legalops user if allocate to another person', () => {
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      component.action = Actions.Allocate;
      component.userRole = UserRole.LegalOps;
      component.roleCategory = RoleCategory.JUDICIAL;
      component.allocateTo = AllocateTo.ALLOCATE_TO_ANOTHER_PERSON;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.SEARCH_PERSON));
    });

    it('on CHECK_ANSWERS page', () => {
      component.navigationCurrentState = AllocateRoleState.CHECK_ANSWERS;
      component.navigationHandler(navEvent);
      expect(storeDispatchMock).toHaveBeenCalledWith(new fromStore.AllocateRoleChangeNavigation(AllocateRoleState.CHOOSE_DURATION));
    });

    afterEach(() => {
      fixture.destroy();
    });
  });

  describe('navigationHandler continue', () => {
    beforeEach(() => {
      allocateRoleServiceMock.getValidRoles.and.returnValue(of(ROLE_LIST));
    });

    it('on CHOOSE_ROLE page', () => {
      storePipeMock.and.returnValue(of(STATE_DATA));
      component.navigationCurrentState = AllocateRoleState.CHOOSE_ROLE;
      fixture.detectChanges();
      spyOn(component.chooseRoleComponent, 'navigationHandler').and.callThrough();
      component.navigationHandler(AllocateRoleNavigationEvent.CONTINUE);
      expect(component.chooseRoleComponent.navigationHandler).toHaveBeenCalled();
    });

    it('on CHOOSE_ALLOCATE_TO page', () => {
      const CURRENT_STATE = {
        ...STATE_DATA,
        state: AllocateRoleState.CHOOSE_ALLOCATE_TO
      };
      storePipeMock.and.returnValue(of(CURRENT_STATE));
      component.navigationCurrentState = AllocateRoleState.CHOOSE_ALLOCATE_TO;
      fixture.detectChanges();
      spyOn(component.chooseAllocateToComponent, 'navigationHandler').and.callThrough();
      component.navigationHandler(AllocateRoleNavigationEvent.CONTINUE);
      expect(component.chooseAllocateToComponent.navigationHandler).toHaveBeenCalled();
    });

    it('on SEARCH_PERSON page', () => {
      const CURRENT_STATE = {
        ...STATE_DATA,
        state: AllocateRoleState.SEARCH_PERSON
      };
      storePipeMock.and.returnValue(of(CURRENT_STATE));
      component.navigationCurrentState = AllocateRoleState.SEARCH_PERSON;
      fixture.detectChanges();
      spyOn(component.searchPersonComponent, 'navigationHandler').and.callThrough();
      component.navigationHandler(AllocateRoleNavigationEvent.CONTINUE);
      expect(component.searchPersonComponent.navigationHandler).toHaveBeenCalled();
    });

    it('on CHOOSE_DURATION page', () => {
      const CURRENT_STATE = {
        ...STATE_DATA,
        state: AllocateRoleState.CHOOSE_DURATION
      };
      storePipeMock.and.returnValue(of(CURRENT_STATE));
      component.navigationCurrentState = AllocateRoleState.CHOOSE_DURATION;
      fixture.detectChanges();
      spyOn(component.chooseDurationComponent, 'navigationHandler').and.callThrough();
      component.navigationHandler(AllocateRoleNavigationEvent.CONTINUE);
      expect(component.chooseDurationComponent.navigationHandler).toHaveBeenCalled();
    });

    it('on CHECK_ANSWERS page', () => {
      const CURRENT_STATE = {
        ...STATE_DATA,
        state: AllocateRoleState.CHECK_ANSWERS
      };
      storePipeMock.and.returnValue(of(CURRENT_STATE));
      component.navigationCurrentState = AllocateRoleState.CHECK_ANSWERS;
      fixture.detectChanges();
      spyOn(component.checkAnswersComponent, 'navigationHandler').and.callThrough();
      component.navigationHandler(AllocateRoleNavigationEvent.CONFIRM);
      expect(component.checkAnswersComponent.navigationHandler).toHaveBeenCalled();
    });
  });

  describe('navigationHandler confirm', () => {
    beforeEach(() => {
      allocateRoleServiceMock.getValidRoles.and.returnValue(of(ROLE_LIST));
    });

    it('on CHECK_ANSWERS page', () => {
      const CURRENT_STATE = {
        ...STATE_DATA,
        state: AllocateRoleState.CHECK_ANSWERS
      };
      storePipeMock.and.returnValue(of(CURRENT_STATE));
      component.navigationCurrentState = AllocateRoleState.CHECK_ANSWERS;
      fixture.detectChanges();
      spyOn(component.checkAnswersComponent, 'navigationHandler').and.callThrough();
      component.navigationHandler(AllocateRoleNavigationEvent.CONFIRM);
      expect(component.checkAnswersComponent.navigationHandler).toHaveBeenCalled();
    });

    afterEach(() => {
      fixture.destroy();
    });
  });

  describe('showSpinner', () => {
    it('should default to false', () => {
      expect(component.showSpinner).toBeFalsy();
    });

    it('should be true when allocation is confirmed', () => {
      const CURRENT_STATE = {
        ...STATE_DATA,
        state: AllocateRoleState.CHECK_ANSWERS
      };
      storePipeMock.and.returnValue(of(CURRENT_STATE));
      component.navigationCurrentState = AllocateRoleState.CHECK_ANSWERS;
      fixture.detectChanges();
      spyOn(component.checkAnswersComponent, 'navigationHandler').and.callThrough();
      component.navigationHandler(AllocateRoleNavigationEvent.CONFIRM);
      expect(component.checkAnswersComponent.navigationHandler).toHaveBeenCalled();
      expect(component.showSpinner).toBeTruthy();
    });

    it('should be false if navigation event is unhandled case', () => {
      const CURRENT_STATE = {
        ...STATE_DATA,
        state: AllocateRoleState.CHECK_ANSWERS
      };
      storePipeMock.and.returnValue(of(CURRENT_STATE));
      component.navigationCurrentState = AllocateRoleState.CHECK_ANSWERS;
      fixture.detectChanges();
      spyOn(component.checkAnswersComponent, 'navigationHandler').and.callThrough();
      component.navigationHandler(AllocateRoleNavigationEvent.BACK);
      expect(component.checkAnswersComponent.navigationHandler).not.toHaveBeenCalled();
      expect(component.showSpinner).toBeFalsy();
    });
  });

  describe('navigationHandler cancel', () => {
    beforeEach(() => {
      allocateRoleServiceMock.getValidRoles.and.returnValue(of(ROLE_LIST));
    });

    it('on cancel event', () => {
      const CURRENT_STATE = {
        ...STATE_DATA,
        state: AllocateRoleState.CHECK_ANSWERS
      };
      storePipeMock.and.returnValue(of(CURRENT_STATE));
      component.navigationCurrentState = AllocateRoleState.CHECK_ANSWERS;
      fixture.detectChanges();
      component.navigationHandler(AllocateRoleNavigationEvent.CANCEL);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('cases/case-details/111111/roles-and-access');
    });

    afterEach(() => {
      fixture.destroy();
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
