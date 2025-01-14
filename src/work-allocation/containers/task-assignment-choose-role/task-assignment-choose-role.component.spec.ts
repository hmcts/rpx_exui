import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionStorageService } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { TASK_ROLES } from '../../../../api/workAllocation/constants/task-roles.mock.data';
import { ChooseRadioOptionComponent } from '../../../role-access/components';
import { TaskAssignmentChooseRoleComponent } from './task-assignment-choose-role.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TaskAssignmentChooseRoleComponent', () => {
  let component: TaskAssignmentChooseRoleComponent;
  let fixture: ComponentFixture<TaskAssignmentChooseRoleComponent>;
  const mockSessionStorageService = jasmine.createSpyObj('SessionStorageService', ['getItem']);

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  mockSessionStorageService.getItem.and.returnValue('' +
    '{"id":"db17f6f7-1abf-4223-8b5e-1eece04ee5d8","forename":"Case","surname":"Officer","email":' +
    '"CRD_func_test_demo_user@justice.gov.uk","active":true,"roles":["case-allocator","caseworker","caseworker-ia",' +
    '"caseworker-ia-caseofficer","cwd-user","hmcts-legal-operations",' +
    '"task-supervisor","tribunal-caseworker"],"roleCategory":"LEGAL_OPERATIONS"}');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [TaskAssignmentChooseRoleComponent, ChooseRadioOptionComponent],
    imports: [ReactiveFormsModule, ExuiCommonLibModule, RouterTestingModule.withRoutes([])],
    providers: [
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {
                        verb: 'Reassign',
                        roles: TASK_ROLES
                    },
                    paramMap: convertToParamMap({ taskId: 'db17f6f7-1abf-4223-8b5e-1eece04ee5d8' }),
                    queryParamMap: convertToParamMap({ taskId: 'db17f6f7-1abf-4223-8b5e-1eece04ee5d8' })
                }
            }
        },
        { provide: Router, useValue: router },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAssignmentChooseRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select legal ops role', () => {
    const nativeElement = fixture.debugElement.nativeElement as HTMLElement;
    const radios: any = nativeElement.querySelectorAll('.govuk-radios__item');
    const input = radios[1].firstChild;
    expect(input.checked).toBeFalsy();
  });

  it('should set the caption to reassign', () => {
    expect(component.caption).toEqual('Reassign task');
    expect(component.description).toEqual('Which role type are you reassigning the task to?');
  });

  it('should send user to find person', () => {
    window.history.pushState({ returnUrl: '/case-details/123243430403904/tasks' }, 'state');
    const state = window.history.state;
    component.submit(component.form.value, component.form.valid);
    expect(router.navigate).toHaveBeenCalledWith(
      ['work', 'db17f6f7-1abf-4223-8b5e-1eece04ee5d8', 'reassign', 'person'],
      { queryParams: { role: 'LEGAL_OPERATIONS', service: null }, state }
    );
  });
});
