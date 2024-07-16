import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { TaskList } from '../../work-allocation/models/dtos';
import { handleFatalErrors, WILDCARD_SERVICE_DOWN } from '../../work-allocation/utils';

@Injectable({
  providedIn: 'root'
})
export class CaseTasksResolverService {
  public static CASE_TASKS_URL: string = '/workallocation/case/task';

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<TaskList> {
    const caseId = route.paramMap.get('cid');
    return this.http.get<TaskList>(`${CaseTasksResolverService.CASE_TASKS_URL}/${caseId}`)
      .pipe(
        first(),
        catchError((error) => {
          handleFatalErrors(error.status, this.router, WILDCARD_SERVICE_DOWN);
          return EMPTY;
        })
      );
  }
}
