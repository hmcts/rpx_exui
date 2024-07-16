import { CdkTableModule } from '@angular/cdk/table';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LoadingService, PaginationModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule, FeatureToggleService, FilterService } from '@hmcts/rpx-xui-common-lib';
import { FilterSetting } from '@hmcts/rpx-xui-common-lib/lib/models/filter.model';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TaskListComponent } from '..';
import { SessionStorageService } from '../../../app/services';
import * as fromActions from '../../../app/store';
import { AllocateRoleService } from '../../../role-access/services';
import { WorkAllocationComponentsModule } from '../../components/work-allocation.components.module';
import { FieldType } from '../../enums';
import { Task } from '../../models/tasks';
import { CaseworkerDataService, WASupportedJurisdictionsService, WorkAllocationTaskService } from '../../services';
import { getMockTasks } from '../../tests/utils.spec';
import { MyTasksComponent } from './my-tasks.component';

@Component({
  template: '<exui-my-tasks></exui-my-tasks>'
})
class WrapperComponent {
  @ViewChild(MyTasksComponent, { static: true }) public appComponentRef: MyTasksComponent;
}

const userInfo =
  `{"id":"exampleId",
    "forename":"Joe",
    "surname":"Bloggs",
    "email":"JoeBloggs@example.com",
    "active":true,
    "roles":["caseworker","caseworker-ia","caseworker-ia-caseofficer"],
    "token":"eXaMpLeToKeN"}`;

const workTypeInfo =
  `[{"key":"hearing_work","label":"Hearing work"},
    {"key":"routine_work","label":"Routine work"},
    {"key":"decision_making_work","label":"Decision-making work"},
    {"key":"applications","label":"Applications"}]`;

xdescribe('MyTasksComponent', () => {
  let component: MyTasksComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  let router: Router;
  const mockTaskService = jasmine.createSpyObj('mockTaskService', ['searchTask']);
  const mockAlertService = jasmine.createSpyObj('mockAlertService', ['destroy']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  const mockCaseworkerService = jasmine.createSpyObj('mockCaseworkerService', ['getUsersFromServices']);
  const mockFeatureService = jasmine.createSpyObj('mockFeatureService', ['getActiveWAFeature']);
  const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockLoadingService', ['isEnabled', 'getValue']);
  const mockFilterService = jasmine.createSpyObj('mockFilterService', ['getStream']);
  const mockWASupportedJurisdictionsService = jasmine.createSpyObj('mockWASupportedJurisdictionsService', ['getWASupportedJurisdictions']);
  const mockRoleService = jasmine.createSpyObj('mockRolesService', ['getCaseRolesUserDetails']);

  let storeMock: jasmine.SpyObj<Store<fromActions.State>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<fromActions.State>;

  beforeEach(waitForAsync(() => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        WorkAllocationComponentsModule,
        PaginationModule
      ],
      declarations: [MyTasksComponent, WrapperComponent, TaskListComponent],
      providers: [
        { provide: WorkAllocationTaskService, useValue: mockTaskService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: WASupportedJurisdictionsService, useValue: mockWASupportedJurisdictionsService },
        { provide: AllocateRoleService, useValue: mockRoleService },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    const tasks: Task[] = getMockTasks();
    mockTaskService.searchTask.and.returnValue(of({ tasks }));
    mockCaseworkerService.getUsersFromServices.and.returnValue(of([]));
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
    mockWASupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of(['Service1', 'Service2']));
    mockFilterService.getStream.and.returnValue(of(filterFields));
    mockFeatureService.getActiveWAFeature.and.returnValue(of('WorkAllocationRelease2'));
    mockFeatureToggleService.isEnabled.and.returnValue(of(false));
    mockFeatureToggleService.getValue.and.returnValue(of(true));
    mockRoleService.getCaseRolesUserDetails.and.returnValue(of(tasks));
    fixture.detectChanges();
  }));

  it('should make a call to load tasks using the default search request', waitForAsync(() => {
    component.ngOnInit();
    // tick(500);
    fixture.detectChanges();
    component.getSearchTaskRequestPagination();
    expect(component.tasks).toBeDefined();
    expect(component.tasks.length).toEqual(2);
  }));

  it('should allow searching via state', () => {
    mockSessionStorageService.getItem.and.returnValue(userInfo);
    const searchParameter = component.getSearchTaskRequestPagination().search_parameters[1];
    expect(searchParameter.key).toBe('state');
    expect(searchParameter.values[0]).toBe('assigned');
  });

  it('should allow searching via location', () => {
    mockSessionStorageService.getItem.and.returnValue(userInfo);
    const exampleLocations = ['location1', 'location2', 'location3'];
    component.selectedLocations = exampleLocations;
    const searchParameter = component.getSearchTaskRequestPagination().search_parameters[3];
    expect(searchParameter.key).toBe('location');
    expect(searchParameter.values).toBe(exampleLocations);
  });

  it('should allow searching via work types', () => {
    mockSessionStorageService.getItem.and.returnValues(userInfo, workTypeInfo, '1');
    const workTypes: string[] = ['hearing_work', 'upper_tribunal', 'decision_making_work'];
    component.selectedWorkTypes = workTypes;
    const searchParameter = component.getSearchTaskRequestPagination().search_parameters[4];
    expect(searchParameter.key).toBe('work_type');
    expect(searchParameter.values).toBe(workTypes);
  });

  it('should not search by work types if all work types are selected', () => {
    mockSessionStorageService.getItem.and.returnValues(userInfo, workTypeInfo, '1');
    component.selectedWorkTypes = ['hearing_work', 'upper_tribunal', 'decision_making_work', 'extra_work_type'];
    for (const search_parameter of component.getSearchTaskRequestPagination().search_parameters) {
      expect(search_parameter.key).not.toBe('work_type');
    }
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

  it('should show the footer when there no tasks', () => {
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

  it('should appropriately handle clicking on a row action', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    fixture.detectChanges();
    const navigateSpy = spyOn(router, 'navigate');
    const element = fixture.debugElement.nativeElement;
    // Use the first task.
    const task = component.tasks[0];
    // Click on the Manage + button.
    const manageButton = element.querySelector(`#manage_${task.id}`);
    manageButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    // Use the first action from that task.
    const actionId = task.actions[0].id;
    const actionLink = element.querySelector(`#action_${actionId}`);
    // Click on the action link.
    actionLink.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    // Ensure the correct attempt has been made to navigate.
    expect(navigateSpy).toHaveBeenCalledWith([`/work/${task.id}/${actionId}/`], jasmine.any(Object));
  }));

  it('should allow setting the release 2 details', () => {
    // verifying fields best way to check as the elements (apart from column names) on page will not change
    mockFeatureService.getActiveWAFeature.and.returnValue(of('WorkAllocationRelease2'));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.fields[0].name).toBe('case_name');
    expect(component.fields[0].type).toBe(FieldType.CASE_NAME);
    expect(component.fields[4].type).toBe(FieldType.TASK_NAME);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
