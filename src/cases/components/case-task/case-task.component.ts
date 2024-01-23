import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { first } from 'rxjs/operators';
import { AppUtils } from '../../../app/app-utils';
import { AppConstants } from '../../../app/app.constants';
import { UserInfo, UserRole } from '../../../app/models';
import { SessionStorageService } from '../../../app/services';
import { InfoMessage } from '../../../app/shared/enums/info-message';
import { Utils } from '../../../cases/utils/utils';
import { PriorityLimits } from '../../../work-allocation/enums';
import { Caseworker } from '../../../work-allocation/models/dtos';
import { Task } from '../../../work-allocation/models/tasks';
import { WorkAllocationTaskService } from '../../../work-allocation/services';
import { REDIRECTS, handleTasksFatalErrors } from '../../../work-allocation/utils';
import { appendTaskIdAsQueryStringToTaskDescription } from './case-task.util';

@Component({
  selector: 'exui-case-task',
  templateUrl: './case-task.component.html',
  styleUrls: ['./case-task.component.scss']
})
export class CaseTaskComponent implements OnInit {
  private static readonly CASE_REFERENCE_VARIABLE = '${[CASE_REFERENCE]}';
  private static readonly CASE_ID_VARIABLE = '${[case_id]}';
  private static readonly TASK_ID_VARIABLE = '${[id]}';
  private static readonly VARIABLES: string[] = [
    CaseTaskComponent.CASE_REFERENCE_VARIABLE,
    CaseTaskComponent.CASE_ID_VARIABLE,
    CaseTaskComponent.TASK_ID_VARIABLE
  ];

  public manageOptions: { id: string, title: string }[];
  public isUserJudicial: boolean;
  public isTaskUrgent: boolean;
  private pTask: Task;
  public isRelease4: boolean;
  public userRoleCategory: string;

  constructor(private readonly alertService: AlertService,
              private readonly router: Router,
              private readonly sessionStorageService: SessionStorageService,
              protected taskService: WorkAllocationTaskService,
              private featureToggleService: FeatureToggleService) {
  }

  public get returnUrl(): string {
    return this.router ? this.router.url : `case-details/${this.task.case_id}/tasks`;
  }

  public get task(): Task {
    return this.pTask;
  }

  @Input()
  public set task(value: Task) {
    value.description = CaseTaskComponent.replaceVariablesWithRealValues(value);
    this.pTask = value;
    this.isTaskUrgent = this.pTask.major_priority <= PriorityLimits.Urgent ? true : false;
  }

  @Input()
  public caseworkers: Caseworker[] = [];

  /**
   * Emit an event to refresh tasks
   */
  @Output() public taskRefreshRequired: EventEmitter<void>
    = new EventEmitter();

  public static replaceVariablesWithRealValues(task: Task): string {
    if (!task.description) {
      return '';
    }

    // Append task id as querystring to task description markdown
    task.description = appendTaskIdAsQueryStringToTaskDescription(task);

    return CaseTaskComponent.VARIABLES.reduce((description: string, variable: string) => {
      if (variable === CaseTaskComponent.TASK_ID_VARIABLE) {
        return Utils.replaceAll(description, variable, task.id);
      }
      return Utils.replaceAll(description, variable, task.case_id);
    }, task.description);
  }

  public async ngOnInit(): Promise<void> {
    this.manageOptions = this.task.actions;
    await this.setReleaseVersion();
  }

  public getAssigneeName(task: Task): string {
    return task.assignee ? task.assigneeName : 'Unassigned';
  }

  public isTaskAssignedToCurrentUser(task: Task): boolean {
    const userInfoStr = this.sessionStorageService.getItem('userDetails');
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      const userId = userInfo.id ? userInfo.id : userInfo.uid;
      this.userRoleCategory = userInfo.roleCategory;
      this.isUserJudicial = AppUtils.getUserRole(userInfo.roles) === UserRole.Judicial;
      return task.assignee && task.assignee === userId;
    }
    return false;
  }

  public getDueDateTitle(): string {
    return this.isUserJudicial ? 'Task created' : 'Due date';
  }

  public onActionHandler(task: Task, option: any): void {
    if (option.id === 'claim') {
      this.taskService.claimTask(task.id).subscribe(() => {
        this.alertService.success({ phrase: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS });
        this.taskRefreshRequired.emit();
      }, (error) => {
        this.claimTaskErrors(error.status);
      });
      return;
    }
    const state = {
      returnUrl: this.returnUrl,
      keepUrl: true,
      showAssigneeColumn: true
    };
    const actionUrl = `/work/${task.id}/${option.id}`;
    this.router.navigate([actionUrl], { queryParams: { service: task.jurisdiction }, state });
  }

  /**
   * Navigate the User to the correct error page, or throw an on page warning
   * that the Task is no longer available.
   */
  public claimTaskErrors(status: number): void {
    const REDIRECT_404 = [{ status: 404, redirectTo: REDIRECTS.ServiceDown }];
    const handledStatus = handleTasksFatalErrors(status, this.router, REDIRECT_404);
    if (handledStatus > 0) {
      this.alertService.warning({ phrase: InfoMessage.TASK_NO_LONGER_AVAILABLE });
      if (handledStatus === 400) {
        this.taskRefreshRequired.emit();
      }
    }
  }

  public toDate(value: string | number | Date): Date {
    if (value) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  public async onClick(event: string) {
    const url = event.substring(event.indexOf('(') + 1, event.indexOf(')'));
    const urls = url.split('?');
    await this.router.navigate([urls[0]], {
      queryParams: {
        tid: urls[1].split('=')[1]
      }
    });
  }

  public async setReleaseVersion(): Promise<void> {
    const featureConfigurations = await this.featureToggleService
      .getValue(AppConstants.FEATURE_NAMES.waServiceConfig, null)
      .pipe(first())
      .toPromise();
    const jurisdictionConfiguration = featureConfigurations?.configurations
      .find((serviceConfig) => serviceConfig.serviceName === this.task.jurisdiction);
    this.isRelease4 = jurisdictionConfiguration?.releaseVersion === '4';
  }
}
