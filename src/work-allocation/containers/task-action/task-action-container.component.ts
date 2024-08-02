import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';

import { AppUtils } from '../../../app/app-utils';
import { UserInfo, UserRole } from '../../../app/models';
import { InfoMessage } from '../../../app/shared/enums/info-message';
import { InformationMessage } from '../../../app/shared/models';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import { Actions } from '../../../role-access/models';
import { InfoMessageType } from '../../../role-access/models/enums';
import { AllocateRoleService } from '../../../role-access/services';
import { ConfigConstants } from '../../components/constants';
import { SortOrder, TaskActionType, TaskService } from '../../enums';
import { FieldConfig } from '../../models/common';
import { RouteData } from '../../models/common/route-data';
import { Task, TaskServiceConfig } from '../../models/tasks';
import { WorkAllocationTaskService } from '../../services';
import { ACTION } from '../../services/work-allocation-task.service';
import { getAssigneeName, handleFatalErrors } from '../../utils';

@Component({
  selector: 'exui-task-action-container',
  templateUrl: 'task-action-container.component.html'
})
export class TaskActionContainerComponent implements OnInit {
  public tasks: any[];
  public sortedBy: any;
  public routeData: RouteData;
  protected userDetailsKey: string = 'userDetails';
  public isJudicial: boolean;
  constructor(
    private readonly taskService: WorkAllocationTaskService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: InfoMessageCommService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly roleService: AllocateRoleService,
    private readonly featureToggleService: FeatureToggleService
  ) { }

  public get fields(): FieldConfig[] {
    return this.isJudicial ? ConfigConstants.TaskActionsWithAssigneeForJudicial : ConfigConstants.TaskActionsWithAssigneeForLegalOps;
  }

  private get returnUrl(): string {
    if (window && window.history && window.history.state) {
      const url = window.history.state.returnUrl;
      if (window.history.state.keepUrl) {
        return url;
      }
      return url.split('/').splice(0, 3).join('/');
    }
    return '/work/my-work/list';
  }

  public taskServiceConfig: TaskServiceConfig = {
    service: TaskService.IAC,
    defaultSortDirection: SortOrder.ASC,
    defaultSortFieldName: 'dueDate',
    fields: this.fields
  };

  public ngOnInit(): void {
    this.isJudicial = this.isCurrentUserJudicial();
    // Set up the default sorting.
    this.sortedBy = {
      fieldName: this.taskServiceConfig.defaultSortFieldName,
      order: this.taskServiceConfig.defaultSortDirection
    };

    // Get the task from the route, which will have been put there by the resolver.
    this.tasks = [this.route.snapshot.data.taskAndCaseworkers.task.task];
    this.routeData = this.route.snapshot.data as RouteData;
    if (!this.routeData.actionTitle) {
      this.routeData.actionTitle = `${this.routeData.verb} task`;
    }
    if (this.tasks[0].assignee) {
      this.tasks[0].assigneeName = getAssigneeName(this.route.snapshot.data.taskAndCaseworkers.caseworkers, this.tasks[0].assignee);
      if (!this.tasks[0].assigneeName) {
        this.roleService.getCaseRolesUserDetails([this.tasks[0].assignee], this.tasks[0].jurisdiction).subscribe((judicialDetails) => {
          this.tasks[0].assigneeName = judicialDetails[0].full_name;
        });
      }
    }
  }

  public isCurrentUserJudicial(): boolean {
    const userInfoStr = this.sessionStorageService.getItem(this.userDetailsKey);
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      return AppUtils.getUserRole(userInfo.roles) === UserRole.Judicial;
    }
    return false;
  }

  public performAction(): void {
    let action: ACTION;
    switch (this.routeData.verb) {
      case TaskActionType.Cancel:
        action = ACTION.CANCEL;
        break;
      case TaskActionType.MarkAsDone:
        action = ACTION.COMPLETE;
        break;
      case TaskActionType.Unassign:
        action = ACTION.UNCLAIM;
        const userInfoStr = this.sessionStorageService.getItem(this.userDetailsKey);
        let userId: string;
        if (userInfoStr) {
          const userInfo: UserInfo = JSON.parse(userInfoStr);
          userId = userInfo.id ? userInfo.id : userInfo.uid;
          if (this.tasks[0].assignee !== userId) {
            action = ACTION.UNASSIGN;
          }
        }
        break;
      default:
        // If we get here, something has gone wrong as the only actions that should
        // be possible are the ones above.
        break;
    }
    // add hasNoAssigneeOnComplete - only false if complete action and assignee not present
    const hasNoAssigneeOnComplete = action === Actions.Complete.toString() ? this.isTaskUnAssignedOrReAssigned(this.tasks[0]) : false;
    if (action) {
      if (action === ACTION.UNASSIGN) {
        this.taskService.assignTask(this.tasks[0].id, { userId: null }).subscribe({
          next: () => this.reportSuccessAndReturn(),
          error: (error: any) => {
            const handledStatus = handleFatalErrors(error.status, this.router);
            if (handledStatus > 0) {
              this.reportUnavailableErrorAndReturn();
            }
          }
        });
      } else {
        this.taskService.performActionOnTask(this.tasks[0].id, action, hasNoAssigneeOnComplete).subscribe(() => {
          this.reportSuccessAndReturn();
        }, (error) => {
          const handledStatus = handleFatalErrors(error.status, this.router);
          if (handledStatus > 0) {
            this.reportUnavailableErrorAndReturn();
          }
        });
      }
    }
  }

  public isTaskUnAssignedOrReAssigned(currentTask: Task): boolean {
    if (!currentTask.assignee) {
      return true;
    }
    const userInfoStr = this.sessionStorageService.getItem(this.userDetailsKey);
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      const id = userInfo.id ? userInfo.id : userInfo.uid;
      return id !== currentTask.assignee;
    }
  }

  public cancel(): void {
    this.returnWithMessage(null, {});
  }

  private reportSuccessAndReturn(): void {
    const message = this.routeData.successMessage;
    this.returnWithMessage(
      { type: InfoMessageType.SUCCESS, message },
      { badRequest: false }
    );
  }

  private reportUnavailableErrorAndReturn(): void {
    this.returnWithMessage(
      { type: InfoMessageType.WARNING, message: InfoMessage.TASK_NO_LONGER_AVAILABLE },
      { badRequest: true }
    );
  }

  public returnWithMessage(message: InformationMessage, state: any): void {
    if (message) {
      if (this.returnUrl.includes('case-details')) {
        state = {
          showMessage: true,
          messageText: message.message
        };
      } else {
        this.messageService.nextMessage(message);
      }
    }
    this.router.navigateByUrl(this.returnUrl, { state: { ...state, retainMessages: true } });
  }
}
