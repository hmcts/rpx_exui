import { Component } from '@angular/core';
import { InfoMessage } from '../../../app/shared/enums/info-message';
import { AppUtils } from '../../../app/app-utils';
import { UserInfo, UserRole } from '../../../app/models';
import { ConfigConstants, ListConstants, PageConstants, SortConstants } from '../../components/constants';
import { TaskActionIds, TaskContext } from '../../enums';
import { FieldConfig } from '../../models/common';
import { SearchTaskParameter, SearchTaskRequest } from '../../models/dtos';
import { InvokedTaskAction, Task } from '../../models/tasks';
import { handleTasksFatalErrors, REDIRECTS } from '../../utils';
import { TaskListWrapperComponent } from '../task-list-wrapper/task-list-wrapper.component';
import { InfoMessageType } from '../../../role-access/models/enums';

@Component({
  selector: 'exui-available-tasks',
  templateUrl: 'available-tasks.component.html'
})
export class AvailableTasksComponent extends TaskListWrapperComponent {
  public get fields(): FieldConfig[] {
    return this.isCurrentUserJudicial() ? ConfigConstants.AvailableTasksForJudicial : ConfigConstants.AvailableTasksForLegalOps;
  }

  public get sortSessionKey(): string {
    return SortConstants.Session.AvailableTasks;
  }

  public get pageSessionKey(): string {
    return PageConstants.Session.AvailableTasks;
  }

  public get view(): string {
    return ListConstants.View.AvailableTasks;
  }

  public get emptyMessage(): string {
    return ListConstants.EmptyMessage.AvailableTasks;
  }

  /**
   * TODO: When implementing filtering this may need to be changed to get location(s) from filter
   * Override the default.
   */
  public getSearchTaskRequestPagination(): SearchTaskRequest {
    const userInfoStr = this.sessionStorageService.getItem('userDetails');
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      const userRole: UserRole = AppUtils.getUserRole(userInfo.roles);
      const searchParameters: SearchTaskParameter[] = [
        { key: 'jurisdiction', operator: 'IN', values: this.selectedServices }
      ];
      const locationParameter = this.getLocationParameter();
      const typesOfWorkParameter = this.getTypesOfWorkParameter();

      if (locationParameter) {
        searchParameters.push(locationParameter);
      }
      if (typesOfWorkParameter) {
        searchParameters.push(typesOfWorkParameter);
      }
      const searchTaskParameter: SearchTaskRequest = {
        search_parameters: searchParameters,
        sorting_parameters: [...this.getSortParameter()],
        search_by: userRole === UserRole.Judicial ? 'judge' : 'caseworker',
        pagination_parameters: this.getPaginationParameter()
      };
      searchTaskParameter.request_context = TaskContext.AVAILABLE_TASKS;
      return searchTaskParameter;
    }
  }

  /**
   * A User 'Claims' themselves a task aka. 'Assign to me'.
   */
  public claimTask(taskId: string): void {
    this.taskService.claimTask(taskId).subscribe(() => {
      this.infoMessageCommService.nextMessage({
        type: InfoMessageType.SUCCESS,
        message: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS
      });
      this.refreshTasks();
    }, (error) => {
      this.claimTaskErrors(error.status);
    });
  }

  /**
   * A User 'Claims' themselves a task and goes to the case details page for that case aka. 'Assign to me'.
   */
  public claimTaskAndGo(task: Task): void {
    this.taskService.claimTask(task.id).subscribe(() => {
      const goToCaseUrl = `/cases/case-details/${task.case_id}/tasks`;
      // navigates to case details page for specific case id
      this.router.navigate([goToCaseUrl], {
        state: {
          showMessage: true,
          messageText: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS
        }
      });
    }, (error) => {
      this.claimTaskErrors(error.status);
    });
  }

  /**
   * Navigate the User to the correct error page, or throw an on page warning
   * that the Task is no longer available.
   */
  public claimTaskErrors(status: number): void {
    const REDIRECT_404 = [{ status: 404, redirectTo: REDIRECTS.ServiceDown }];
    const handledStatus = handleTasksFatalErrors(status, this.router, REDIRECT_404);
    if (handledStatus > 0) {
      this.infoMessageCommService.nextMessage({
        type: InfoMessageType.WARNING,
        message: InfoMessage.TASK_NO_LONGER_AVAILABLE
      });
      if (handledStatus === 400) {
        this.refreshTasks();
      }
    }
  }

  /**
   * Handle a User Claiming a Task
   */
  public onActionHandler(taskAction: InvokedTaskAction): void {
    switch (taskAction.action.id) {
      case TaskActionIds.CLAIM:
        return this.claimTask(taskAction.task.id);
      case TaskActionIds.CLAIM_AND_GO:
        return this.claimTaskAndGo(taskAction.task);
      default:
        return super.onActionHandler(taskAction);
    }
  }

  /**
   * Handle the paging event
   */
  public onPaginationEvent(pageNumber: number): void {
    this.onPaginationHandler(pageNumber);
  }

  private getLocationParameter(): SearchTaskParameter {
    if (this.selectedLocations && this.selectedLocations.length > 0) {
      return { key: 'location', operator: 'IN', values: this.selectedLocations };
    }

    return null;
  }

  private getTypesOfWorkParameter(): SearchTaskParameter {
    if (this.selectedWorkTypes && this.selectedWorkTypes.length > 0) {
      return { key: 'work_type', operator: 'IN', values: this.selectedWorkTypes };
    }

    return null;
  }
}
