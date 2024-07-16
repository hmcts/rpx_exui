import { CdkTableModule } from '@angular/cdk/table';
import { Component, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService, FilterService } from '@hmcts/rpx-xui-common-lib';
import { FilterSetting } from '@hmcts/rpx-xui-common-lib/lib/models/filter.model';
import { Store } from '@ngrx/store';
import { RpxTranslationService } from 'rpx-xui-translation';
import { of, throwError } from 'rxjs';
import { SessionStorageService } from '../../../app/services';
import { InfoMessage } from '../../../app/shared/enums/info-message';
import { InformationMessage } from '../../../app/shared/models';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import * as fromActions from '../../../app/store';
import { InfoMessageType } from '../../../role-access/models/enums';
import { AllocateRoleService } from '../../../role-access/services';
import { TaskActionIds, TaskContext } from '../../enums';
import * as dtos from '../../models/dtos';
import { InvokedTaskAction, Task } from '../../models/tasks';
import { CaseworkerDataService, LocationDataService, WASupportedJurisdictionsService, WorkAllocationTaskService } from '../../services';
import { MockRouter, getMockLocations, getMockTasks } from '../../tests/utils.spec';
import { TaskListComponent } from '../task-list/task-list.component';
import { AvailableTasksComponent } from './available-tasks.component';
@Component({
  template: `
    <exui-available-tasks></exui-available-tasks>`
})
class WrapperComponent {
  @ViewChild(AvailableTasksComponent, { static: true }) public appComponentRef: AvailableTasksComponent;
}

const userInfo =
  `{"id":"exampleId",
    "forename":"Joe",
    "surname":"Bloggs",
    "email":"JoeBloggs@example.com",
    "active":true,
    "roles":["caseworker","caseworker-ia","caseworker-ia-caseofficer"],
    "token":"eXaMpLeToKeN"}`;

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('AvailableTasksComponent', () => {
  let component: AvailableTasksComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  const mockLocationService = jasmine.createSpyObj('mockLocationService', ['getLocations']);
  const mockLocations: dtos.Location[] = getMockLocations();
  const mockTaskService = jasmine.createSpyObj('mockTaskService', ['searchTask', 'claimTask', 'searchTask']);
  const MESSAGE_SERVICE_METHODS = ['addMessage', 'emitMessages', 'getMessages', 'nextMessage', 'removeAllMessages'];
  const mockInfoMessageCommService = jasmine.createSpyObj('mockInfoMessageCommService', MESSAGE_SERVICE_METHODS);
  const mockRouter = new MockRouter();
  const mockAlertService = jasmine.createSpyObj('mockAlertService', ['destroy']);
  const mockFilterService = jasmine.createSpyObj('mockFilterService', ['getStream']);
  const mockCaseworkerDataService = jasmine.createSpyObj('mockCaseworkerDataService', ['getUsersFromServices']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockFeatureToggleService', ['isEnabled', 'getValue']);
  const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  const mockWASupportedJurisdictionsService = jasmine.createSpyObj('mockWASupportedJurisdictionsService', ['getWASupportedJurisdictions']);
  const mockRoleService = jasmine.createSpyObj('mockRolesService', ['getCaseRolesUserDetails']);

  let storeMock: jasmine.SpyObj<Store<fromActions.State>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<fromActions.State>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const rpxTranslationServiceStub = () => ({ language: 'en', translate: () => { }, getTranslation: (phrase: string) => phrase });

  beforeEach(() => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        RouterTestingModule
      ],
      declarations: [
        AvailableTasksComponent,
        WrapperComponent,
        TaskListComponent,
        RpxTranslateMockPipe
      ],
      providers: [
        { provide: WorkAllocationTaskService, useValue: mockTaskService },
        { provide: LocationDataService, useValue: mockLocationService },
        { provide: Router, useValue: mockRouter },
        { provide: InfoMessageCommService, useValue: mockInfoMessageCommService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerDataService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: WASupportedJurisdictionsService, useValue: mockWASupportedJurisdictionsService },
        { provide: AllocateRoleService, useValue: mockRoleService },
        { provide: Store, useValue: storeMock },
        { provide: RpxTranslationService, useFactory: rpxTranslationServiceStub }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WrapperComponent);
    store = TestBed.inject(Store);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    mockLocationService.getLocations.and.returnValue(of(mockLocations));
    const filterFields: FilterSetting = {
      id: 'locations',
      fields: [
        {
          name: 'locations',
          value: ['231596']
        },
        {
          name: 'types-of-work',
          value: ['hearing_work', 'upper_tribunal', 'decision_making_work']
        },
        {
          name: 'services',
          value: ['IA', 'CIVIL']
        }
      ]
    };
    mockCaseworkerDataService.getUsersFromServices.and.returnValue(of([]));
    mockFilterService.getStream.and.returnValue(of(filterFields));
    mockWASupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of(['Service1', 'Service2']));
    const tasks: Task[] = getMockTasks();
    mockTaskService.searchTask.and.returnValue(of({ tasks }));
    mockRoleService.getCaseRolesUserDetails.and.returnValue(of(tasks));
    mockFeatureToggleService.isEnabled.and.returnValue(of(false));
    mockFeatureToggleService.getValue.and.returnValue(of(true));
    mockWASupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of([]));
    spyOn(mockRouter, 'navigate');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should make a call to load tasks using the default search request', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    fixture.detectChanges();
    expect(component.tasks).toBeDefined();
    expect(component.tasks.length).toEqual(2);
  }));

  it('should allow searching via location', () => {
    mockSessionStorageService.getItem.and.returnValue(userInfo);
    const exampleLocations = ['location1', 'location2', 'location3'];
    component.selectedLocations = exampleLocations;
    const searchRequest = component.getSearchTaskRequestPagination();
    expect(searchRequest.request_context).toEqual(TaskContext.AVAILABLE_TASKS);
  });

  it('should allow searching via work types', () => {
    mockSessionStorageService.getItem.and.returnValue(userInfo);
    const workTypes: string[] = ['hearing_work', 'upper_tribunal', 'decision_making_work'];
    component.selectedWorkTypes = workTypes;
    const searchRequest = component.getSearchTaskRequestPagination();
    const searchParameter = searchRequest.search_parameters[2];
    expect(searchRequest.request_context).toEqual(TaskContext.AVAILABLE_TASKS);
    expect(searchParameter.key).toBe('work_type');
    expect(searchParameter.values).toBe(workTypes);
  });

  it('should have all column headers, including "Manage +"', () => {
    const element = fixture.debugElement.nativeElement;
    const headerCells = element.querySelectorAll('.govuk-table__header');
    const fields = component.fields;
    expect(headerCells).toBeDefined();
    expect(headerCells.length).toEqual(fields.length + 1); // Extra one for Manage +;
    for (let i = 0; i < fields.length; i++) {
      // ensure derivedIcon has no header and every other field does
      if (fields[i].columnLabel) {
        if (fields[i].columnLabel !== 'Priority') {
          expect(headerCells[i].textContent).toEqual(fields[i].columnLabel);
        }
      } else {
        expect(headerCells[i].textContent).toEqual('');
      }
    }
    // Make sure Manage + heading is blank.
    expect(headerCells[headerCells.length - 1].textContent.trim()).toEqual('');
  });

  it('should not show the footer when there are tasks', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    fixture.detectChanges();
    const element = fixture.debugElement.nativeElement;
    const footerRow = element.querySelector('.footer-row');
    expect(footerRow).toBeDefined();
    const footerRowClass = footerRow.getAttribute('class');
    expect(footerRowClass).toContain('footer-row');
    expect(footerRowClass).not.toContain('shown');
  }));

  it('should show the footer when there are no tasks', () => {
    spyOnProperty(component, 'tasks').and.returnValue([]);
    fixture.detectChanges();
    const element = fixture.debugElement.nativeElement;
    const footerRow = element.querySelector('.footer-row');
    expect(footerRow).toBeDefined();
    const footerRowClass = footerRow.getAttribute('class');
    expect(footerRowClass).toContain('footer-row');
    expect(footerRowClass).toContain('shown');
    const footerCell = element.querySelector('.cell-footer');
    expect(footerCell).toBeDefined();
    expect(footerCell.textContent.trim()).toEqual(component.emptyMessage);
  });

  describe('claimTask()', () => {
    it('should call claimTask on the taskService with the taskId, so that the User can claim the task.', () => {
      mockTaskService.claimTask.and.returnValue(of({}));

      const taskId = '123456';
      component.claimTask(taskId);

      expect(mockTaskService.claimTask).toHaveBeenCalledWith(taskId);
    });

    it('should emit a Success information message, so that the User can see that they have claimed a task successfully.', () => {
      mockTaskService.claimTask.and.returnValue(of({}));

      const message: InformationMessage = {
        type: InfoMessageType.SUCCESS,
        message: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS
      };

      const taskId = '123456';
      component.claimTask(taskId);

      expect(mockInfoMessageCommService.nextMessage).toHaveBeenCalledWith(message);
    });

    it('should call claimTaskErrors() with the error\'s status code, so that the User can see that the claim of a task has been unsuccessful.', () => {
      const errorStatusCode = 400;

      const claimTaskErrorsSpy = spyOn(component, 'claimTaskErrors');

      mockTaskService.claimTask.and.returnValue(throwError({ status: errorStatusCode }));

      const taskId = '123456';
      component.claimTask(taskId);

      expect(claimTaskErrorsSpy).toHaveBeenCalledWith(errorStatusCode);
    });
  });

  describe('claimTaskAndGo()', () => {
    it('should call claimTask on the taskService with the taskId, so that the User can claim the task.', () => {
      mockTaskService.claimTask.and.returnValue(of({}));

      const firstTask = getMockTasks()[1];
      component.claimTaskAndGo(firstTask);

      expect(mockTaskService.claimTask).toHaveBeenCalledWith(firstTask.id);
    });

    it('should call claimTask on the taskService with the taskId, so that the User can claim the task.', () => {
      const firstTask = getMockTasks()[1];
      component.claimTaskAndGo(firstTask);
      expect(mockRouter.navigate).toHaveBeenCalledWith([`/cases/case-details/${firstTask.id}/tasks`], {
        state: {
          showMessage: true,
          messageText: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS
        }
      });
    });

    it('should call claimTaskErrors() with the error\'s status code, so that the User can see that the claim of a task has been unsuccessful.', () => {
      const errorStatusCode = 400;

      const claimTaskErrorsSpy = spyOn(component, 'claimTaskErrors');

      mockTaskService.claimTask.and.returnValue(throwError({ status: errorStatusCode }));

      const firstTask = getMockTasks()[1];
      component.claimTaskAndGo(firstTask);

      expect(claimTaskErrorsSpy).toHaveBeenCalledWith(errorStatusCode);
    });
  });

  describe('claimTaskErrors()', () => {
    it('should make a call to navigate the user to the /service-down page, if the error status code is 500.', () => {
      component.claimTaskErrors(500);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/service-down']);
    });

    it('should make a call to navigate the user to the /not-authorised page, if the error status code is 401.', () => {
      component.claimTaskErrors(401);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-authorised']);
    });

    it('should make a call to navigate the user to the /not-authorised page, if the error status code is 403.', () => {
      component.claimTaskErrors(403);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-authorised']);
    });

    it('should refresh the tasks if the error status code is 400.', () => {
      const refreshTasksSpy = spyOn(component, 'refreshTasks');
      component.claimTaskErrors(400);
      expect(refreshTasksSpy).toHaveBeenCalled();
    });

    // TODO: Parking for now, for some reason the fixture.destory is not cleaning up
    // calls to functions from other tests.
    // it('should emit the Warning information message, if the error status code is 400.', () => {
    //
    //   const message: InformationMessage = {
    //     type: InfoMessageType.WARNING,
    //     message: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS,
    //   };
    //
    //   component.claimTaskErrors(400);
    //
    //   expect(mockInfoMessageCommService.emitInfoMessageChange).toHaveBeenCalledWith(message);
    // });
  });

  describe('onActionHandler()', () => {
    const TASK_ID = '2345678901234567';
    const taskAction: InvokedTaskAction = {
      action: {
        id: TaskActionIds.CLAIM,
        title: 'Assign to me'
      },
      task: {
        assignee: null,
        description: null,
        assigneeName: null,
        id: TASK_ID,
        case_id: '2345678901234567',
        caseName: 'Mankai Lit',
        caseCategory: 'Revocation',
        location: 'Taylor House',
        taskName: 'Review appellant case',
        dueDate: new Date(1604506789000),
        actions: [{
          id: TaskActionIds.CLAIM,
          title: 'Assign to me'
        }]
      }
    };

    it('should call claimTask with the task id, so that the task can be \'claimed\' by the User.', () => {
      const claimTaskSpy = spyOn(component, 'claimTask');
      component.onActionHandler(taskAction);

      expect(claimTaskSpy).toHaveBeenCalledWith(TASK_ID);
    });

    [
      { statusCode: 403, routeUrl: '/not-authorised' },
      { statusCode: 401, routeUrl: '/not-authorised' },
      { statusCode: 500, routeUrl: '/service-down' },
      { statusCode: 400, routeUrl: '/service-down' }
    ].forEach((scr) => {
      it('should call claimTask with the task id, so that the task can be \'claimed\' by the User.', () => {
        mockTaskService.searchTask.and.returnValue(throwError({ status: scr.statusCode }));

        component.onPaginationEvent(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith([scr.routeUrl]);
      });
    });

    [
      { statusCode: 403, routeUrl: '/not-authorised', action: TaskActionIds.CLAIM },
      { statusCode: 401, routeUrl: '/not-authorised', action: TaskActionIds.CLAIM },
      { statusCode: 500, routeUrl: '/service-down', action: TaskActionIds.CLAIM },
      { statusCode: 400, routeUrl: '/work/my-work/available', action: TaskActionIds.CLAIM },
      { statusCode: 403, routeUrl: '/not-authorised', action: TaskActionIds.CLAIM_AND_GO },
      { statusCode: 401, routeUrl: '/not-authorised', action: TaskActionIds.CLAIM_AND_GO },
      { statusCode: 500, routeUrl: '/service-down', action: TaskActionIds.CLAIM_AND_GO },
      { statusCode: 400, routeUrl: '/work/my-work/available', action: TaskActionIds.CLAIM_AND_GO }
    ].forEach((scr) => {
      it('should call claimTask with the task id, so that the task can be \'claimed\' by the User.', () => {
        mockTaskService.claimTask.and.returnValue(throwError({ status: scr.statusCode }));

        taskAction.action.id = scr.action;
        component.onActionHandler(taskAction);

        expect(mockTaskService.claimTask).toHaveBeenCalledWith(TASK_ID);
        if (scr.statusCode === 400) {
          expect(mockInfoMessageCommService.nextMessage).toHaveBeenCalledWith({
            type: InfoMessageType.WARNING,
            message: InfoMessage.TASK_NO_LONGER_AVAILABLE
          });
        } else {
          expect(mockRouter.navigate).toHaveBeenCalledWith([scr.routeUrl]);
        }
      });
    });
  });
});
