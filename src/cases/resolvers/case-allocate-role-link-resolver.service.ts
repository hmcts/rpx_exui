import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { handleFatalErrors, WILDCARD_SERVICE_DOWN } from '../../work-allocation/utils';

@Injectable({
  providedIn: 'root'
})
export class CaseAllocateRoleLinkResolverService {
  private static readonly CASE_ALLOCATE_ROLE_LINK_URL: string = '/workallocation/roles';
  private caseId: string = null;
  private showAllocateRoleLink: boolean = null;

  constructor(private readonly http: HttpClient,
    private readonly router: Router) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const caseId = route.paramMap.get('cid');
    if (caseId !== null && this.caseId === caseId) {
      return of(this.showAllocateRoleLink);
    }
    this.caseId = caseId;
    return this.http.get<boolean>(`${CaseAllocateRoleLinkResolverService.CASE_ALLOCATE_ROLE_LINK_URL}/${caseId}/show-allocate-role-link`)
      .pipe(
        first(),
        tap((value) => this.showAllocateRoleLink = value),
        catchError((error) => {
          handleFatalErrors(error.status, this.router, WILDCARD_SERVICE_DOWN);
          return EMPTY;
        })
      );
  }
}
