import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppUtils } from '../../app/app-utils';
import { UserInfo, UserRole } from '../../app/models';
import { SearchTaskRequest, TaskNamesResponse, TaskSearchParameters } from '../models/dtos';
import { Task, TaskRole } from '../models/tasks';
import { TaskResponse } from '../models/tasks/task.model';

const BASE_URL: string = '/workallocation/task';

export enum ACTION {
  ASSIGN = 'assign',
  CANCEL = 'cancel',
  CLAIM = 'claim',
  COMPLETE = 'complete',
  UNCLAIM = 'unclaim',
  UNASSIGN = 'unassign'
}

@Injectable({ providedIn: 'root' })
export class WorkAllocationTaskService {
  public currentTasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor(private readonly http: HttpClient) { }

  /**
   * Call the API to complete a task.
   * @param taskId specifies which task should be completed.
   */
  public completeTask(taskId: string, hasNoAssigneeOnComplete: boolean): Observable<Response> {
    return this.performActionOnTask(taskId, ACTION.COMPLETE, hasNoAssigneeOnComplete);
  }

  public cancelTask(taskId: string): Observable<Response> {
    return this.performActionOnTask(taskId, ACTION.CANCEL);
  }

  /**
   * Call the API to assign a task to a user.
   * @param taskId specifies which task should be assigned.
   * @param user specifies who this task should be assigned to.
   */
  public assignTask(taskId: string, user: any): Observable<Response> {
    // Make a POST with the specified assignee in the payload.
    return this.http.post<any>(this.getActionUrl(taskId, ACTION.ASSIGN), user);
  }

  public postTask(task: TaskSearchParameters): Observable<Response> {
    return this.http.post<any>(`${BASE_URL}`, task);
  }

  public searchTask(body: { searchRequest: SearchTaskRequest, view: string, currentUser: string, refined: boolean }): Observable<TaskResponse> {
    return this.http.post<any>(`${BASE_URL}`, body).pipe(
      tap((response) => this.currentTasks$.next(response.tasks)),
    );
  }

  public claimTask(taskId: string): Observable<Response> {
    return this.performActionOnTask(taskId, ACTION.CLAIM);
  }

  public unclaimTask(taskId: string): Observable<Response> {
    return this.performActionOnTask(taskId, ACTION.UNCLAIM);
  }

  public getTask(taskId: string): Observable<Task> {
    const url = `${BASE_URL}/${taskId}`;
    return this.http.get<Task>(url);
  }

  public getTaskRoles(taskId: string): Observable<TaskRole[]> {
    const url = `${BASE_URL}/${taskId}/roles`;
    return this.http.get<TaskRole[]>(url);
  }

  public performActionOnTask(taskId: string, action: ACTION, hasNoAssigneeOnComplete?: boolean): Observable<Response> {
    // Make a POST with an empty payload.
    return this.http.post<any>(this.getActionUrl(taskId, action), { hasNoAssigneeOnComplete });
  }

  public getActionUrl(taskId: string, action: ACTION): string {
    return `${BASE_URL}/${taskId}/${action}`;
  }

  public getUsersAssignedTasks(): Observable<Task[]> {
    const userInfoStr = sessionStorage.getItem('userDetails');
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      const id = userInfo.id ? userInfo.id : userInfo.uid;
      const userRole: UserRole = AppUtils.getUserRole(userInfo.roles);
      const searchParameters = [
        { key: 'user', operator: 'IN', values: [id] },
        { key: 'state', operator: 'IN', values: ['assigned'] }
      ];
      const searchRequest: SearchTaskRequest = {
        search_parameters: searchParameters,
        sorting_parameters: [],
        search_by: userRole === UserRole.Judicial ? 'judge' : 'caseworker'
      };
      return this.http.post<any>(`${BASE_URL}`, { searchRequest, view: 'MyTasks' }).pipe(map((response) => response.tasks));
    }
    return of(null);
  }

  public getTaskTypeNamesFromService(): Observable<TaskNamesResponse[]> {
    return this.http.get<TaskNamesResponse[]>('/workallocation2/taskNames');
  }
}
