import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { Go } from '../../../app/store';
import * as routeAction from '../../../app/store/index';
import { Actions, AllocateRoleState, AllocateTo, DurationOfRole } from '../../models';
import { RoleAllocationMessageText } from '../../models/enums/allocation-text';
import { AllocateRoleService } from '../../services';
import * as allocateRoleAction from '../actions/allocate-role.action';
import { AllocateRoleEffects } from './allocate-role.effects';
import { StoreModule } from '@ngrx/store';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app/store';

describe('Allocate Role Effects', () => {
  let actions$;
  let effects: AllocateRoleEffects;
  const allocateRoleServiceMock = jasmine.createSpyObj('AllocateRoleService', [
    'confirmAllocation', 'backUrl'
  ]);
  let store: Store;
  let dispatchSpy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        {
          provide: AllocateRoleService,
          useValue: allocateRoleServiceMock
        },
        AllocateRoleEffects,
        provideMockActions(() => actions$)
      ]
    });
    store = TestBed.inject(Store);
    dispatchSpy = spyOn(store, 'dispatch');
    allocateRoleServiceMock.backUrl = 'work/my-work/cases';
    effects = TestBed.inject(AllocateRoleEffects);
  });

  describe('confirmAllocation$', () => {
    it('should return CreateCaseGo action with correct message text when allocate', () => {
      const STATE_DATA = {
        caseId: '111111',
        jurisdiction: 'IA',
        state: AllocateRoleState.CHOOSE_ROLE,
        typeOfRole: null,
        allocateTo: AllocateTo.ALLOCATE_TO_ME,
        person: null,
        durationOfRole: DurationOfRole.SEVEN_DAYS,
        action: Actions.Allocate,
        period: null
      };
      allocateRoleServiceMock.confirmAllocation.and.returnValue(of({}));
      const action = new allocateRoleAction.ConfirmAllocation(STATE_DATA);
      const completion = new routeAction.CreateCaseGo({
        path: [allocateRoleServiceMock.backUrl],
        caseId: '111111',
        extras: {
          state: {
            showMessage: true,
            retainMessages: true,
            message: {
              type: 'success',
              message: RoleAllocationMessageText.Add
            },
            messageText: RoleAllocationMessageText.Add
          }
        }
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.confirmAllocation$).toBeObservable(expected);
      expect(dispatchSpy).toHaveBeenCalledWith(new fromRoot.LoadUserDetails(true));
    });

    it('should return CreateCaseGo action with correct message text when reallocate', () => {
      const STATE_DATA = {
        caseId: '111111',
        jurisdiction: 'IA',
        state: AllocateRoleState.CHOOSE_ROLE,
        typeOfRole: null,
        allocateTo: AllocateTo.ALLOCATE_TO_ME,
        person: null,
        durationOfRole: DurationOfRole.SEVEN_DAYS,
        action: Actions.Reallocate,
        period: null
      };
      allocateRoleServiceMock.confirmAllocation.and.returnValue(of({}));
      const action = new allocateRoleAction.ConfirmAllocation(STATE_DATA);
      const completion = new routeAction.CreateCaseGo({
        path: [allocateRoleServiceMock.backUrl],
        caseId: '111111',
        extras: {
          state: {
            showMessage: true,
            retainMessages: true,
            message: {
              type: 'success',
              message: RoleAllocationMessageText.Reallocate
            },
            messageText: RoleAllocationMessageText.Reallocate
          }
        }
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.confirmAllocation$).toBeObservable(expected);
      expect(dispatchSpy).toHaveBeenCalledWith(new fromRoot.LoadUserDetails(true));
    });
  });

  describe('handleError', () => {
    it('should handle 500', () => {
      const action$ = AllocateRoleEffects.handleError({ status: 500, message: 'error' });
      action$.subscribe((action) => expect(action).toEqual(new Go({ path: ['/service-down'] })));
    });

    it('should handle 422', () => {
      const action$ = AllocateRoleEffects.handleError({ status: 422, message: 'error' });
      action$.subscribe((action) => expect(action).toEqual(new Go({ path: ['/role-access/user-not-assignable'] })));
    });
  });
});
