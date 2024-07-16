import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AlertService, CaseField, CaseView, LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { of } from 'rxjs';
import { TaskAlertBannerComponent } from '../../../cases/components';
import { AllocateRoleService } from '../../../role-access/services';
import { CaseworkerDataService, WorkAllocationCaseService } from '../../../work-allocation/services';
import { getMockTasks } from '../../../work-allocation/tests/utils.spec';
import { TasksContainerComponent } from './tasks-container.component';

const metadataField = {} as CaseField;
metadataField.id = '[JURISDICTION]';
metadataField.value = 'JUDICIAL';
const CASE_VIEW: CaseView = {
  metadataFields: [metadataField],
  events: [],
  triggers: [],
  case_id: '1234567890123456',
  case_type: {
    id: 'TestAddressBookCase',
    name: 'Test Address Book Case',
    jurisdiction: {
      id: 'TEST',
      name: 'Test'
    },
    printEnabled: true
  },
  channels: [],
  state: {
    id: 'CaseCreated',
    name: 'Case created'
  },
  tabs: [
    {
      id: 'NameTab',
      label: 'Name',
      order: 2,
      fields: [
        Object.assign(new CaseField(), {
          id: 'PersonFirstName',
          label: 'First name',
          display_context: 'OPTIONAL',
          field_type: {
            id: 'Text',
            type: 'Text'
          },
          order: 2,
          value: 'Janet',
          show_condition: '',
          hint_text: ''
        }),
        Object.assign(new CaseField(), {
          id: 'PersonLastName',
          label: 'Last name',
          display_context: 'OPTIONAL',
          field_type: {
            id: 'Text',
            type: 'Text'
          },
          order: 1,
          value: 'Parker',
          show_condition: 'PersonFirstName="Jane*"',
          hint_text: ''
        }),
        Object.assign(new CaseField(), {
          id: 'PersonComplex',
          label: 'Complex field',
          display_context: 'OPTIONAL',
          field_type: {
            id: 'Complex',
            type: 'Complex',
            complex_fields: []
          },
          order: 3,
          show_condition: 'PersonFirstName="Park"',
          hint_text: ''
        })
      ],
      show_condition: 'PersonFirstName="Janet"'
    },
    {
      id: 'HistoryTab',
      label: 'History',
      order: 1,
      fields: [Object.assign(new CaseField(), {
        id: 'CaseHistory',
        label: 'Case History',
        display_context: 'OPTIONAL',
        field_type: {
          id: 'CaseHistoryViewer',
          type: 'CaseHistoryViewer'
        },
        order: 1,
        value: null,
        show_condition: '',
        hint_text: ''
      })],
      show_condition: ''
    },
    {
      id: 'SomeTab',
      label: 'Some Tab',
      order: 3,
      fields: [],
      show_condition: ''
    }
  ]
};

describe('TasksContainerComponent', () => {
  const mockAlertService = jasmine.createSpyObj('alertService', ['success', 'setPreserveAlerts', 'error']);
  const mockWACaseService = jasmine.createSpyObj('waCaseService', ['getTasksByCaseId']);
  const mockCaseworkerService = jasmine.createSpyObj('caseworkerService', ['getUsersFromServices']);
  const mockRoleService = jasmine.createSpyObj('mockRolesService', ['getCaseRolesUserDetails']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockFeatureToggleService', ['isEnabled']);
  const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  let component: TasksContainerComponent;
  let fixture: ComponentFixture<TasksContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskAlertBannerComponent, TasksContainerComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: AlertService, useValue: mockAlertService },
        { provide: WorkAllocationCaseService, useValue: mockWACaseService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerService },
        { provide: AllocateRoleService, useValue: mockRoleService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: LoadingService, useValue: mockLoadingService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                tasks: {
                  tasks: getMockTasks(),
                  caseworkers: null
                },
                case: CASE_VIEW
              },
              paramMap: convertToParamMap({ cId: '1234567890123456' })
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mockFeatureToggleService.isEnabled.and.returnValue(of(false));
    fixture = TestBed.createComponent(TasksContainerComponent);
    component = fixture.componentInstance;
    mockWACaseService.getTasksByCaseId.and.returnValue(of(getMockTasks()));
    mockCaseworkerService.getUsersFromServices.and.returnValue([]);
    mockRoleService.getCaseRolesUserDetails.and.returnValue(of(getMockTasks()));
    fixture.detectChanges();
  });

  it('should correctly show task alert when warnings are present', () => {
    // as the mock tasks include a warning the task alert banner should be displayed
    expect(component.warningIncluded).toBe(true);
  });

  it('should return an empty list if there are no tasks', () => {
    mockWACaseService.getTasksByCaseId.and.returnValue(of([]));
    mockRoleService.getCaseRolesUserDetails.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.tasks.length).toEqual(0);
  });

  it('should return task with corect name when getJudicialNamedTasks called', () => {
    component.tasks = [
      {
        id: '5f677ab6-ee64-11ec-b9f6-fe3569506667',
        name: 'Review the appeal',
        assignee: '09f1f25d-7d7e-4481-b8e3-8624227438ef'
      } as any
    ];
    const judicialUserData = [{
      sidam_id: '09f1f25d-7d7e-4481-b8e3-8624227438ef',
      object_id: 'e97296ca-8182-45ef-82d0-7e4eeb6dab49-test2',
      known_as: 'Joe',
      surname: 'Bloggs',
      full_name: 'Joe Bloggs',
      post_nominals: 'Judge',
      email_id: '4920094EMP-@ejudiciary.net',
      personal_code: '4920094'
    }];
    component.getJudicialNamedTasks(judicialUserData as any).subscribe((task) => {
      expect(task[0].assigneeName).toEqual('Joe Bloggs');
    });
  });

  it('should refresh tasks when requested', () => {
    const firstTask = getMockTasks()[0];
    mockWACaseService.getTasksByCaseId.and.returnValue(of([firstTask]));
    component.onTaskRefreshRequired();
    expect(component.tasks.length).toEqual(1);
  });

  afterEach(() => {
    fixture.destroy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
