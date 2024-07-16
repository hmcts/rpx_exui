import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskRole } from '../models/tasks';
import { WorkAllocationTaskService } from '../services';
import { handleFatalErrors, WILDCARD_SERVICE_DOWN } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class TaskRoleResolverService {
  constructor(private readonly service: WorkAllocationTaskService,
              private readonly router: Router) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<TaskRole[]> {
    return this.service.getTaskRoles(route.paramMap.get('taskId')).pipe(
      catchError((error) => {
        handleFatalErrors(error.status, this.router, WILDCARD_SERVICE_DOWN);
        return EMPTY;
      })
    );
  }
}
