import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule, FeatureToggleService, FilterService, RoleCategory } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { TaskListComponent } from '..';
import { SessionStorageService } from '../../../app/services';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import * as fromActions from '../../../app/store';
import { WorkAllocationComponentsModule } from '../../components/work-allocation.components.module';
import { TaskActionIds } from '../../enums';
import { Task } from '../../models/tasks';
import { CaseworkerDataService, WASupportedJurisdictionsService, WorkAllocationTaskService } from '../../services';
import { getMockTasks, MockRouter } from '../../tests/utils.spec';
import { TaskListWrapperComponent } from './task-list-wrapper.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('TaskListWrapperComponent', () => {
  let component: TaskListWrapperComponent;
  let fixture: ComponentFixture<TaskListWrapperComponent>;
  const SELECTED_LOCATIONS = { id: 'locations', fields: [{ name: 'locations', value: ['231596', '698118'] }, { name: 'services', value: ['IA', 'CIVIL'] }] };
  const mockRef = jasmine.createSpyObj('mockRef', ['']);
  const mockRouter: MockRouter = new MockRouter();
  const mockWorkAllocationService = jasmine.createSpyObj('mockWorkAllocationService', ['searchTask', 'getTask']);
  const mockInfoMessageCommService = jasmine.createSpyObj('mockInfoMessageCommService', ['']);
  let mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  const mockAlertService = jasmine.createSpyObj('mockAlertService', ['']);
  const mockFeatureService = jasmine.createSpyObj('mockFeatureService', ['getActiveWAFeature']);
  const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['isEnabled', 'getValue']);
  const mockCaseworkerDataService = jasmine.createSpyObj('mockCaseworkerDataService', ['getAll']);
  const mockWASupportedJurisdictionsService = jasmine.createSpyObj('mockWASupportedJurisdictionsService', ['getWASupportedJurisdictions']);

  let storeMock: jasmine.SpyObj<Store<fromActions.State>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<fromActions.State>;
  const mockFilterService: any = {
    getStream: () => of(null),
    get: () => SELECTED_LOCATIONS,
    persist: () => null,
    givenErrors: {
      subscribe: () => null,
      next: () => null,
      unsubscribe: () => null
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const rpxTranslationServiceStub = () => ({ language: 'en', translate: () => { }, getTranslation: (phrase: string) => phrase });

  beforeEach((() => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);
    TestBed.configureTestingModule({
      imports: [
        WorkAllocationComponentsModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        CdkTableModule
      ],
      declarations: [TaskListComponent, TaskListWrapperComponent, RpxTranslationMockPipe],
      providers: [
        { provide: ChangeDetectorRef, useValue: mockRef },
        { provide: WorkAllocationTaskService, useValue: mockWorkAllocationService },
        { provide: Router, useValue: mockRouter },
        { provide: InfoMessageCommService, useValue: mockInfoMessageCommService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerDataService },
        { provide: WASupportedJurisdictionsService, useValue: mockWASupportedJurisdictionsService },
        { provide: Store, useValue: storeMock },
        { provide: RpxTranslationService, useFactory: rpxTranslationServiceStub }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TaskListWrapperComponent);
    component = fixture.componentInstance;
    const tasks: Task[] = getMockTasks();
    mockWorkAllocationService.searchTask.and.returnValue(of({ tasks }));
    mockFeatureService.getActiveWAFeature.and.returnValue(of('WorkAllocationRelease2'));
    mockFeatureToggleService.isEnabled.and.returnValue(of(false));
    mockFeatureToggleService.getValue.and.returnValue(of(true));
    mockCaseworkerDataService.getAll.and.returnValue(of([]));
    mockSessionStorageService.getItem.and.returnValue('1');
    mockWASupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of([]));
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }));

  afterEach((() => {
    component.ngOnDestroy();
    mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  }));

  describe('onActionHandler()', () => {
    const exampleTask = getMockTasks()[0];
    const firstAction = exampleTask.actions[0];
    const secondAction = exampleTask.actions[1];
    const firstTaskAction = { task: exampleTask, action: firstAction };
    const secondTaskAction = { task: exampleTask, action: secondAction };

    it('should handle an action', () => {
      // need to spy on the router and set up the task action
      spyOnProperty(mockRouter, 'url', 'get').and.returnValue('/mywork/list');
      const navigateCallsBefore = mockRouter.navigateCalls.length;

      // need to check that navigate has been called
      component.onActionHandler(firstTaskAction);
      expect(mockRouter.navigateCalls.length).toBeGreaterThan(navigateCallsBefore);

      // need to verify correct properties were called
      const lastNavigateCall = mockRouter.navigateCalls.pop();
      expect(lastNavigateCall.commands).toEqual([`/work/${exampleTask.id}/${firstAction.id}/`]);
      const exampleNavigateCall = { queryParams: { service: 'IA' }, state: { returnUrl: '/mywork/list', showAssigneeColumn: true } };
      expect(lastNavigateCall.extras).toEqual(exampleNavigateCall);
    });

    it('should handle an action returned via the task manager page', () => {
      // need to spy on the router and set up the task action
      spyOnProperty(mockRouter, 'url', 'get').and.returnValue('/mywork/manager');
      const navigateCallsBefore = mockRouter.navigateCalls.length;

      // need to check that navigate has been called
      component.onActionHandler(secondTaskAction);
      expect(mockRouter.navigateCalls.length).toBeGreaterThan(navigateCallsBefore);

      // need to verify correct properties were called
      const lastNavigateCall = mockRouter.navigateCalls.pop();
      expect(lastNavigateCall.commands).toEqual([`/work/${exampleTask.id}/${secondAction.id}/`]);
      const exampleNavigateCall = { queryParams: { service: 'IA' }, state: { returnUrl: '/mywork/manager', showAssigneeColumn: true } };
      expect(lastNavigateCall.extras).toEqual(exampleNavigateCall);
    });

    it('should go to tasks page on GO', () => {
      // need to spy on the router and set up the task action
      spyOnProperty(mockRouter, 'url', 'get').and.returnValue('/mywork/list');
      const navigateCallsBefore = mockRouter.navigateCalls.length;

      secondTaskAction.action.id = TaskActionIds.GO;
      // need to check that navigate has been called
      component.onActionHandler(secondTaskAction);
      expect(mockRouter.navigateCalls.length).toBeGreaterThan(navigateCallsBefore);

      // need to verify correct properties were called
      const lastNavigateCall = mockRouter.navigateCalls.pop();
      expect(lastNavigateCall.commands).toEqual([`/cases/case-details/${secondTaskAction.task.case_id}/tasks`]);
    });

    it('User should be Judicial', () => {
      component.userRoleCategory = RoleCategory.JUDICIAL;
      const isJudicial = component.isCurrentUserJudicial();
      expect(isJudicial).toBeTruthy();
    });

    it('User should not be Judicial', () => {
      component.userRoleCategory = RoleCategory.CASEWORKER;
      const isJudicial = component.isCurrentUserJudicial();
      expect(isJudicial).toBeFalsy();
    });

    it('Judicial role category should be received', () => {
      const userDetails = {
        id: 'id123',
        forename: 'John',
        surname: 'Smith',
        email: 'john.smith@email.com',
        roles: ['caseworker-ia-iacjudge'],
        roleCategory: RoleCategory.JUDICIAL
      };
      mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
      const roleCategory = component.getCurrentUserRoleCategory();
      expect(roleCategory).toBe(RoleCategory.JUDICIAL);
    });

    it('Non-judicial role category should be received', () => {
      const userDetails = {
        id: 'id123',
        forename: 'John',
        surname: 'Smith',
        email: 'john.smith@email.com',
        roles: ['caseworker-ia-iacjudge'],
        roleCategory: RoleCategory.CASEWORKER
      };
      mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
      const roleCategory = component.getCurrentUserRoleCategory();
      expect(roleCategory).not.toBe(RoleCategory.JUDICIAL);
    });
  });

  describe('onPaginationHandler()', () => {
    it('should handle pagination', () => {
      component.pagination = { page_number: 1, page_size: 25 };
      fixture.detectChanges();
      // need to check that pagination has been performed
      component.onPaginationHandler(2);
      expect(component.pagination.page_number).toBe(2);
      expect(mockSessionStorageService.getItem).toHaveBeenCalledWith('pageSessionKey');
    });
  });
});
