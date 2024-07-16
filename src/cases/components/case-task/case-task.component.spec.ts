import { of, throwError } from 'rxjs';
import { RoleCategory } from '../../../role-access/models';
import { PriorityLimits } from '../../../work-allocation/enums';
import { Caseworker } from '../../../work-allocation/models/dtos';
import { Task } from '../../../work-allocation/models/tasks';
import { getMockTasks } from '../../../work-allocation/tests/utils.spec';
import { CaseTaskComponent } from './case-task.component';

describe('CaseTaskComponent', () => {
  let mockAlertService: any;
  let mockSessionStorage: any;
  let mockRouter: any;
  let mockTaskService: any;
  let mockFeatureToggleService: any;
  let mockWindow: any;
  let component: CaseTaskComponent;

  beforeEach(() => {
    mockAlertService = jasmine.createSpyObj('alertService', ['success', 'warning']);
    mockSessionStorage = jasmine.createSpyObj('mockSessionStorage', ['getItem']);
    mockRouter = jasmine.createSpyObj('router', ['navigate', 'url']);
    mockTaskService = jasmine.createSpyObj('taskService', ['claimTask']);
    mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['getValue']);
    mockRouter.url = '/case-details/123243430403904/tasks';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockRouter.navigate.and.callFake(() => new Promise((resolve, reject) => resolve(true)));
    mockWindow = { location: new URL('https://manage-case.hmcts.platform.net') };
    component = new CaseTaskComponent(mockAlertService, mockRouter, mockSessionStorage, mockTaskService, mockWindow);
    mockFeatureToggleService.getValue.and.returnValue(of({
      configurations: [
        {
          caseTypes: [
            'Asylum'
          ],
          releaseVersion: '3.5',
          serviceName: 'IA'
        },
        {
          caseTypes: [
            'PRIVATELAW',
            'PRLAPPS'
          ],
          releaseVersion: '2.1',
          serviceName: 'PRIVATELAW'
        },
        {
          caseTypes: [
            'CIVIL',
            'GENERALAPPLICATION'
          ],
          releaseVersion: '2.1',
          serviceName: 'CIVIL'
        },
        {
          caseTypes: [
            'Test'
          ],
          releaseVersion: '4',
          serviceName: 'TEST'
        }
      ]
    }));
  });

  it('ngOnInit', () => {
    component.task = {} as Task;
    component.task.actions = [{ id: 'id', title: 'actionName' }];
    component.ngOnInit();
    expect(component.manageOptions[0].id).toEqual('id');
    expect(component.manageOptions[0].title).toEqual('actionName');
  });

  it('isTaskAssignedToCurrentUser when no userDetails in sessionStorage', () => {
    const task: Task = {
      assignee: '3314e308-e83b-4f39-a414-6844e185e5ac',
      assigneeName: 'Some Name',
      permissions: { values: ['Own'] },
      id: null,
      description: null,
      case_id: null,
      caseName: null,
      caseCategory: null,
      location: null,
      taskName: null,
      dueDate: new Date(),
      actions: [],
      warnings: false,
      derivedIcon: null
    };
    const result = component.isTaskAssignedToCurrentUser(task);
    expect(result).toBeFalsy();
  });

  it('isTaskAssignedToCurrentUser when user is assigned to task', () => {
    const task: Task = {
      assignee: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
      assigneeName: 'Some Name',
      permissions: { values: ['Own'] },
      id: null,
      description: null,
      case_id: null,
      caseName: null,
      caseCategory: null,
      location: null,
      taskName: null,
      dueDate: new Date(),
      actions: [],
      warnings: false,
      derivedIcon: null
    };
    let userIdType = 'uid';
    mockSessionStorage.getItem.and.returnValue(`{"sub":"juser8@mailinator.com","${userIdType}":"44d5d2c2-7112-4bef-8d05-baaa610bf463","roles":["caseworker","caseworker-ia","caseworker-ia-iacjudge"],"name":"XUI test Judge","given_name":"XUI test","family_name":"Judge","token":""}`);
    let result = component.isTaskAssignedToCurrentUser(task);
    expect(result).toBeTruthy();
    userIdType = 'id';
    mockSessionStorage.getItem.and.returnValue(`{"sub":"juser8@mailinator.com","${userIdType}":"44d5d2c2-7112-4bef-8d05-baaa610bf463","roles":["caseworker","caseworker-ia","caseworker-ia-iacjudge"],"name":"XUI test Judge","given_name":"XUI test","family_name":"Judge","token":""}`);
    result = component.isTaskAssignedToCurrentUser(task);
    expect(result).toBeTruthy();
  });

  it('getAssigneeName should return correctName', () => {
    const task: Task = {
      assignee: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
      assigneeName: 'Some Name',
      permissions: { values: ['Own'] },
      id: null,
      description: null,
      case_id: null,
      caseName: null,
      caseCategory: null,
      location: null,
      taskName: null,
      dueDate: new Date(),
      actions: [],
      warnings: false,
      derivedIcon: null
    };
    const caseworkers: Caseworker[] = [
      {
        idamId: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
        firstName: 'Some',
        lastName: 'Name',
        email: 'test@test.com',
        roleCategory: RoleCategory.LEGAL_OPERATIONS,
        location: {
          id: '1',
          locationName: 'TestLocation',
          services: null
        }
      }
    ];
    component.caseworkers = caseworkers;
    let name = component.getAssigneeName(task);
    expect(name).toEqual('Some Name');

    task.assignee = null;
    name = component.getAssigneeName(task);
    expect(name).toEqual('Unassigned');
  });

  it('should replace the task variable with the case id', () => {
    const task = {
      actions: [],
      caseCategory: '',
      caseName: '',
      location: '',
      taskName: '',
      assignee: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
      assigneeName: 'Judicial User',
      id: '0d22d838-b25a-11eb-a18c-f2d58a9b7bc1',
      description: '[Link the appeal](/cases/case-details/${[CASE_REFERENCE]}/trigger/linkAppeal/linkAppealreasonForLinkAppealPageId)',
      task_title: 'Link the appeal',
      dueDate: new Date(),
      location_name: 'Birmingham',
      location_id: '231596',
      case_id: '1620409659381330',
      case_category: 'EEA',
      case_name: 'William Priest',
      warnings: true,
      permissions: ['Own', 'Execute', 'Manage']
    };
    const result = CaseTaskComponent.replaceVariablesWithRealValues(task);
    expect(result).toBe(`[Link the appeal](/cases/case-details/1620409659381330/trigger/linkAppeal/linkAppealreasonForLinkAppealPageId?tid=${task.id})`);
  });

  it('should set isTaskUrgent based on the task priority', () => {
    component.task = {
      assignee: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
      assigneeName: 'Some Name',
      permissions: { values: ['Own'] },
      id: null,
      description: null,
      case_id: null,
      caseName: null,
      caseCategory: null,
      location: null,
      taskName: null,
      dueDate: new Date(),
      actions: [],
      warnings: false,
      derivedIcon: null,
      major_priority: PriorityLimits.Urgent
    };
    expect(component.isTaskUrgent).toBe(true);
    component.task = {
      assignee: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
      assigneeName: 'Some Name',
      permissions: { values: ['Own'] },
      id: null,
      description: null,
      case_id: null,
      caseName: null,
      caseCategory: null,
      location: null,
      taskName: null,
      dueDate: new Date(),
      actions: [],
      warnings: false,
      derivedIcon: null,
      major_priority: PriorityLimits.High
    };
    expect(component.isTaskUrgent).toBe(false);
  });

  it('should get the correct returnUrl', () => {
    expect(component.returnUrl).toEqual(mockRouter.url);
    mockRouter = null;
    component = new CaseTaskComponent(mockAlertService, mockRouter, mockSessionStorage, mockTaskService, mockWindow);
    component.task = {
      assignee: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
      assigneeName: 'Some Name',
      permissions: { values: ['Own'] },
      id: null,
      description: null,
      case_id: '1111222233334444',
      caseName: null,
      caseCategory: null,
      location: null,
      taskName: null,
      dueDate: new Date(),
      actions: [],
      warnings: false,
      derivedIcon: null
    };
    expect(component.returnUrl).toEqual('case-details/1111222233334444/tasks');
  });

  it('getDueDateTitle should be Task created', () => {
    component.isUserJudicial = true;
    expect(component.getDueDateTitle()).toEqual('Task created');
  });

  it('getDueDateTitle should be Due date', () => {
    component.isUserJudicial = false;
    expect(component.getDueDateTitle()).toEqual('Due date');
  });

  describe('onActionHandler()', () => {
    const exampleTask = getMockTasks()[0];
    const firstOption = { id: 'claim' };
    const secondOption = { id: 'unclaim' };

    it('should handle a claim action', () => {
      mockTaskService.claimTask.and.returnValue(of(null));
      const refreshTasksSpy = spyOn(component.taskRefreshRequired, 'emit');
      // need to check that navigate has not been called
      component.onActionHandler(exampleTask, firstOption);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(mockTaskService.claimTask).toHaveBeenCalledWith(exampleTask.id);
      expect(refreshTasksSpy).toHaveBeenCalled();
      expect(mockAlertService.success).toHaveBeenCalled();
    });

    it('should handle a claim action failure', () => {
      mockTaskService.claimTask.and.returnValue(throwError(() => new Error('Error')));
      const refreshTasksSpy = spyOn(component.taskRefreshRequired, 'emit');
      spyOn(component, 'claimTaskErrors');
      // need to check that navigate has not been called
      component.onActionHandler(exampleTask, firstOption);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(mockTaskService.claimTask).toHaveBeenCalledWith(exampleTask.id);
      expect(refreshTasksSpy).not.toHaveBeenCalled();
      expect(mockAlertService.success).not.toHaveBeenCalled();
      expect(component.claimTaskErrors).toHaveBeenCalled();
    });

    it('should handle an action that redirects', () => {
      const state = { returnUrl: '/case-details/123243430403904/tasks', keepUrl: true, showAssigneeColumn: true };
      const queryParams = { service: 'IA' };

      // need to check that navigate has been called
      component.onActionHandler(exampleTask, secondOption);
      expect(mockRouter.navigate).toHaveBeenCalled();

      // need to verify correct properties were called
      expect(mockRouter.navigate).toHaveBeenCalledWith([`/work/${exampleTask.id}/${secondOption.id}`], { queryParams, state });
      expect(component.returnUrl).toBe('/case-details/123243430403904/tasks');
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
      const refreshTasksSpy = spyOn(component.taskRefreshRequired, 'emit');
      component.claimTaskErrors(400);
      expect(refreshTasksSpy).toHaveBeenCalled();
      expect(mockAlertService.warning).toHaveBeenCalled();
    });
  });

  describe('toDate()', () => {
    it('should return null if there is no value', () => {
      expect(component.toDate(undefined)).toBe(null);
      expect(component.toDate(null)).toBe(null);
    });

    it('should return null if there is no date value', () => {
      expect(component.toDate('')).toBe(null);
    });

    it('should return null if the date string is not valid', () => {
      expect(component.toDate('abc')).toBe(null);
    });

    it('should return a date if there is a date value', () => {
      const firstDate = new Date('01-01-2000');
      const secondDate = new Date('03-12-2020');
      expect(component.toDate('01-01-2000').toDateString()).toBe(firstDate.toDateString());
      expect(component.toDate(new Date('03-12-2020')).toDateString()).toEqual(secondDate.toDateString());
    });
  });

  describe('onClick() with no tid', () => {
    it('should navigate correctly on click', () => {
      component.onClick('exampleUrl(http://firsturlpart/?foo=fooparam)end');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['http://firsturlpart/?foo=fooparam'], { queryParams: {} });
    });
  });
  describe('onClick() with tid', () => {
    it('should navigate correctly on click', () => {
      component.onClick('exampleUrl(http://firsturlpart/?tid=1234)end');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['http://firsturlpart/'], { queryParams: { tid: '1234' } });
    });
  });
  describe('onClick() with relative URL and tid', () => {
    it('should navigate correctly on click', () => {
      component.onClick('exampleUrl(/firsturlpart/?tid=1234)end');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['https://manage-case.hmcts.platform.net/firsturlpart/'], { queryParams: { tid: '1234' } });
    });
  });
});
