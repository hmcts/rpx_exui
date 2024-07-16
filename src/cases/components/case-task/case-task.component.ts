import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@hmcts/ccd-case-ui-toolkit';
import { AppUtils } from '../../../app/app-utils';
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
    CaseTaskComponent?.CASE_REFERENCE_VARIABLE,
    CaseTaskComponent?.CASE_ID_VARIABLE,
    CaseTaskComponent?.TASK_ID_VARIABLE
  ];

  public manageOptions: { id: string, title: string }[];
  public isUserJudicial: boolean;
  public isTaskUrgent: boolean;
  private pTask: Task;
  public userRoleCategory: string;

  constructor(private readonly alertService: AlertService,
              private readonly router: Router,
              private readonly sessionStorageService: SessionStorageService,
              protected taskService: WorkAllocationTaskService,
              private readonly window: Window) {
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
      this.taskService.claimTask(task.id).subscribe({
        next: () => {
          this.alertService.success({ phrase: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS });
          this.taskRefreshRequired.emit();
        },
        error: (error) => {
          this.claimTaskErrors(error.status);
        }
      });
      return;
    }
    const state = {
      returnUrl: this.returnUrl,
      keepUrl: true,
      showAssigneeColumn: true
    };
    const actionUrl = `/work/${task.id}/${option.id}`;
    // Had to add then() due to the below Sonarcloud failure
    // "Promises must be awaited, end with a call to .catch, or end with a call to .then with a rejection handler."
    this.router.navigate([actionUrl], { queryParams: { service: task.jurisdiction }, state }).then(undefined, undefined);
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
    let qp = {};
    let base = null;
    if (!url.startsWith('http')) {
      base = this.window.location.origin;
    }
    try {
      const u = base ? new URL(url, base) : new URL(url);
      const tid = u.searchParams.get('tid');
      if (tid) {
        qp = { tid: tid };
        u.searchParams.delete('tid');
      }
      await this.router.navigate([u.toString()], {
        queryParams: qp
      });
    } catch (e) {
      console.log('Invalid url found in task onClick', e);
    }
  }
}
