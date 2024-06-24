import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { Task } from '../../work-allocation/models/tasks';
import { WorkAllocationTaskService } from '../../work-allocation/services';
import { handleFatalErrors, WILDCARD_SERVICE_DOWN } from '../../work-allocation/utils';
import { AllocateRoleService } from '../services';

@Injectable({ providedIn: 'root' })
export class TaskRoleAccessResolver {
  constructor(
    private readonly taskService: WorkAllocationTaskService,
    private readonly router: Router,
    private readonly allocateRoleService: AllocateRoleService
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable< { task: Task; role: any[]; } > {
    const assignmentId = route.paramMap.get('assignmentId');
    const task$ = this.taskService.getTask(route.paramMap.get('taskId')).pipe(
      catchError((error) => {
        handleFatalErrors(error.status, this.router, WILDCARD_SERVICE_DOWN);
        return EMPTY;
      })
    );
    const role$ = task$.pipe(mergeMap((task) => {
      const thisTask: Task = task.task;
      return this.allocateRoleService.getCaseAccessRoles(thisTask.case_id, thisTask.jurisdiction, thisTask.case_type_id, assignmentId);
    }));
    return forkJoin({ task: task$, role: role$ });
  }
}
