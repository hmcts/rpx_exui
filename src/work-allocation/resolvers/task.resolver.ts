import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Caseworker } from '../models/dtos';

import { Task } from '../models/tasks';
import { CaseworkerDataService, WorkAllocationTaskService } from '../services';
import { handleFatalErrors, WILDCARD_SERVICE_DOWN } from '../utils';

@Injectable({ providedIn: 'root' })
export class TaskResolver {
  constructor(
    private readonly service: WorkAllocationTaskService,
    private readonly router: Router,
    private readonly caseworkerService: CaseworkerDataService
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable< { task: Task; caseworkers: Caseworker[]; } > {
    const task$ = this.service.getTask(route.paramMap.get('taskId')).pipe(
      catchError((error) => {
        handleFatalErrors(error.status, this.router, WILDCARD_SERVICE_DOWN);
        return EMPTY;
      })
    );
    const caseworker$ = task$
      .pipe(
        mergeMap((task) => {
          return this.caseworkerService.getUsersFromServices([task.task.jurisdiction]);
        })
      );
    return forkJoin({ task: task$, caseworkers: caseworker$ });
  }
}
