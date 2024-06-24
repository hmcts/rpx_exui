import { CdkTableModule } from '@angular/cdk/table';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LoadingService, PaginationModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { TaskListComponent } from '..';
import { SessionStorageService } from '../../../app/services';
import * as fromActions from '../../../app/store';
import { CaseRoleDetails } from '../../../role-access/models';
import { AllocateRoleService } from '../../../role-access/services';
import { TaskContext } from '../../../work-allocation/enums';
import { WorkAllocationComponentsModule } from '../../components/work-allocation.components.module';
import { Task } from '../../models/tasks';
import { CaseworkerDataService, LocationDataService, WASupportedJurisdictionsService, WorkAllocationTaskService } from '../../services';
import { getMockCaseRoles, getMockTasks } from '../../tests/utils.spec';
import { AllWorkTaskComponent } from './all-work-task.component';

@Component({
  template: `
    <exui-all-work-tasks></exui-all-work-tasks>`
})
class WrapperComponent {
  @ViewChild(AllWorkTaskComponent) public appComponentRef: AllWorkTaskComponent;
}
@Component({
  template: '<div>Nothing</div>'
})
class NothingComponent { }
const USER_DETAILS = {
  canShareCases: true,
  userInfo: {
    id: 'someId',
    forename: 'foreName',
    surname: 'surName',
    email: 'email@email.com',
    active: true,
    roles: ['pui-case-manager']
  },
  roleAssignmentInfo: [
    {
      roleName: 'test',
      jurisdiction: 'service',
      roleType: 'type'
    }
  ]
};
xdescribe('AllWorkTaskComponent', () => {
  let component: AllWorkTaskComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  const mockTaskService = jasmine.createSpyObj('mockTaskService', ['searchTask']);
  const mockAlertService = jasmine.createSpyObj('mockAlertService', ['destroy']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  const mockCaseworkerService = jasmine.createSpyObj('mockCaseworkerService', ['getAll']);
  const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  const mockLocationService = jasmine.createSpyObj('mockLocationService', ['getLocations']);
  const mockWASupportedJurisdictionService = jasmine.createSpyObj('mockWASupportedJurisdictionService', ['getWASupportedJurisdictions']);
  const mockRoleService = jasmine.createSpyObj('mockRolesService', ['getCaseRolesUserDetails']);

  let storeMock: jasmine.SpyObj<Store<fromActions.State>>;
  beforeEach(waitForAsync(() => {
    storeMock = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
    storeMock.pipe.and.returnValue(of(USER_DETAILS));
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        WorkAllocationComponentsModule,
        PaginationModule,
        StoreModule.forRoot({ ...fromActions.reducers })
      ],
      declarations: [AllWorkTaskComponent, WrapperComponent, TaskListComponent],
      providers: [
        { provide: WorkAllocationTaskService, useValue: mockTaskService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: LocationDataService, useValue: mockLocationService },
        { provide: WASupportedJurisdictionsService, useValue: mockWASupportedJurisdictionService },
        { provide: AllocateRoleService, useValue: mockRoleService },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    const tasks: Task[] = getMockTasks();
    const caseRoles: CaseRoleDetails[] = getMockCaseRoles();
    mockTaskService.searchTask.and.returnValue(of({ tasks }));
    mockRoleService.getCaseRolesUserDetails.and.returnValue(of(caseRoles));
    mockCaseworkerService.getAll.and.returnValue(of([]));
    component.locations = [{ id: 'loc123', locationName: 'Test', services: [] }];
    mockLocationService.getLocations.and.returnValue(of([{ id: 'loc123', locationName: 'Test', services: [] }]));
    mockWASupportedJurisdictionService.getWASupportedJurisdictions.and.returnValue(of(['IA']));
    fixture.detectChanges();
  });
  it('getSearchTaskRequestPagination caseworker', () => {
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify({
      id: 'someId',
      forename: 'fore',
      surname: 'surName',
      email: 'email',
      active: true,
      roles: ['caseworker-ia-caseofficer'],
      uid: '1233434'
    }));
    const searchRequest = component.getSearchTaskRequestPagination();
    expect(searchRequest.search_by).toEqual('caseworker');
    expect(searchRequest.request_context).toEqual(TaskContext.ALL_WORK);
    expect(searchRequest.pagination_parameters).toEqual({ page_number: 1, page_size: 25 });
  });
  it('getSearchTaskRequestPagination judge', () => {
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify({
      id: 'someId',
      forename: 'fore',
      surname: 'surName',
      email: 'email',
      active: true,
      roles: ['caseworker-ia-iacjudge'],
      uid: '1233434'
    }));
    const searchRequest = component.getSearchTaskRequestPagination();
    expect(searchRequest.search_by).toEqual('judge');
    expect(searchRequest.request_context).toEqual(TaskContext.ALL_WORK);
    expect(searchRequest.pagination_parameters).toEqual({ page_number: 1, page_size: 25 });
  });
  it('should correctly get filter selections', () => {
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify({
      id: 'someId',
      forename: 'fore',
      surname: 'surName',
      email: 'email',
      active: true,
      roles: ['caseworker-ia-caseofficer'],
      uid: '1233434'
    }));
    const selection = { findTaskNameControl: 'Process Application', location: 'exampleLocation', service: 'IA', selectPerson: 'All', person: null, taskType: 'JUDICIAL', priority: 'High', taskName: 'Review Hearing bundle' };
    component.onSelectionChanged(selection);
    const searchRequest = component.getSearchTaskRequestPagination();
    expect(searchRequest.search_parameters).toContain({ key: 'jurisdiction', operator: 'IN', values: ['IA'] });
    expect(searchRequest.search_parameters).toContain({ key: 'location', operator: 'IN', values: ['exampleLocation'] });
    // expect(searchRequest.search_parameters).toContain({key: 'taskCategory', operator: 'IN', values: ['All']});
    // Confirm that person is not searched for when no person available
    expect(searchRequest.search_parameters).not.toContain({ key: 'person', operator: 'IN', values: [] });
    expect(searchRequest.search_parameters).toContain({ key: 'role_category', operator: 'IN', values: ['JUDICIAL'] });
    // expect(searchRequest.search_parameters).toContain({key: 'priority', operator: 'IN', values: ['High']});
  });
  it('should show judicial names when available', () => {
    const firstMockTask = component.tasks[0];
    const secondMockTask = component.tasks[1];
    expect(firstMockTask.assignee).not.toBe(undefined);
    expect(firstMockTask.assigneeName).toBe('Sir Testing');
    expect(secondMockTask.assignee).toBe(null);
    expect(secondMockTask.assigneeName).toBe('Sir Testing');
  });
  afterEach(() => {
    component.ngOnDestroy();
  });
});
[
  { statusCode: 403, routeUrl: '/not-authorised' },
  { statusCode: 401, routeUrl: '/not-authorised' },
  { statusCode: 500, routeUrl: '/service-down' },
  { statusCode: 400, routeUrl: '/service-down' }
].forEach((scr) => {
  xdescribe('AllWorkTaskComponent negative cases', () => {
    let component: AllWorkTaskComponent;
    let wrapper: WrapperComponent;
    let fixture: ComponentFixture<WrapperComponent>;
    let router: Router;
    const mockTaskService = jasmine.createSpyObj('mockTaskService', ['searchTask']);
    const mockAlertService = jasmine.createSpyObj('mockAlertService', ['destroy']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
    const mockCaseworkerService = jasmine.createSpyObj('mockCaseworkerService', ['getAll']);
    const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);

    const mockLocationService = jasmine.createSpyObj('mockLocationService', ['getLocations']);
    const mockWASupportedJurisdictionService = jasmine.createSpyObj('mockWASupportedJurisdictionService', ['getWASupportedJurisdictions']);
    let storeMock: jasmine.SpyObj<Store<fromActions.State>>;
    beforeEach(waitForAsync(() => {
      storeMock = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
      storeMock.pipe.and.returnValue(of(USER_DETAILS));
      mockLocationService.getLocations.and.returnValue(of([{ id: 'loc123', locationName: 'Test', services: [] }]));
      mockTaskService.searchTask.and.returnValue(throwError({ status: scr.statusCode }));
      // mockTaskService.searchTaskWithPagination.and.returnValue(of(throwError({ status: 500 })));
      mockCaseworkerService.getAll.and.returnValue(of([]));
      mockWASupportedJurisdictionService.getWASupportedJurisdictions.and.returnValue(of(['IA']));
      TestBed.configureTestingModule({
        imports: [
          CdkTableModule,
          ExuiCommonLibModule,
          RouterTestingModule,
          WorkAllocationComponentsModule,
          PaginationModule,
          StoreModule.forRoot({ ...fromActions.reducers }),
          RouterTestingModule.withRoutes(
            [
              { path: 'service-down', component: NothingComponent },
              { path: 'not-authorised', component: NothingComponent }
            ]
          )
        ],
        declarations: [AllWorkTaskComponent, WrapperComponent, TaskListComponent, NothingComponent],
        providers: [
          { provide: WorkAllocationTaskService, useValue: mockTaskService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: SessionStorageService, useValue: mockSessionStorageService },
          { provide: CaseworkerDataService, useValue: mockCaseworkerService },
          { provide: LoadingService, useValue: mockLoadingService },
          // FeatureToggleService,
          { provide: LocationDataService, useValue: mockLocationService },
          { provide: WASupportedJurisdictionsService, useValue: mockWASupportedJurisdictionService },
          { provide: Store, useValue: storeMock }
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(WrapperComponent);
      wrapper = fixture.componentInstance;
      component = wrapper.appComponentRef;
      component.locations = [{ id: 'loc123', locationName: 'Test', services: [] }];
      router = TestBed.inject(Router);
      fixture.detectChanges();
    }));

    it(`onPaginationEvent with error response code ${scr.statusCode}`, () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.getSearchTaskRequestPagination();

      expect(navigateSpy).toHaveBeenCalledWith([scr.routeUrl]);
    });
    afterEach(() => {
      fixture.destroy();
    });
  });
});
