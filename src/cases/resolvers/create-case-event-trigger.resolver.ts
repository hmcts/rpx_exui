import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CaseEventTrigger, CasesService, Draft, DRAFT_QUERY_PARAM } from '@hmcts/ccd-case-ui-toolkit';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CreateCaseEventTriggerResolver {
  public static readonly PARAM_JURISDICTION_ID = 'jid';
  public static readonly PARAM_CASE_TYPE_ID = 'ctid';
  public static readonly PARAM_EVENT_ID = 'eid';
  public static readonly QUERY_PARAM_IGNORE_WARNING = 'ignoreWarning';
  private static readonly IGNORE_WARNING_VALUES = ['true', 'false'];

  public cachedEventTrigger: CaseEventTrigger;

  constructor(
    private readonly casesService: CasesService,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<CaseEventTrigger> {
    return this.isRootCreateRoute(route) ? this.getAndCacheEventTrigger(route)
      : this.cachedEventTrigger ? of(this.cachedEventTrigger)
        : this.getAndCacheEventTrigger(route);
  }

  public getAndCacheEventTrigger(route: ActivatedRouteSnapshot): Observable<CaseEventTrigger> {
    const caseTypeId = route.paramMap.get(CreateCaseEventTriggerResolver.PARAM_CASE_TYPE_ID);
    const eventTriggerId = route.paramMap.get(CreateCaseEventTriggerResolver.PARAM_EVENT_ID);
    let ignoreWarning = route.queryParamMap.get(CreateCaseEventTriggerResolver.QUERY_PARAM_IGNORE_WARNING);
    const draftId = route.queryParamMap.get(DRAFT_QUERY_PARAM);
    let caseId;

    if (-1 === CreateCaseEventTriggerResolver.IGNORE_WARNING_VALUES.indexOf(ignoreWarning)) {
      ignoreWarning = 'false';
    }
    if (draftId && Draft.isDraft(draftId)) {
      caseId = draftId;
    }

    return ((this.casesService.getEventTrigger(caseTypeId, eventTriggerId, caseId, ignoreWarning) as any) as Observable<CaseEventTrigger>).pipe(
      tap((eventTrigger) => this.cachedEventTrigger = eventTrigger)
    );
  }

  private isRootCreateRoute(route: ActivatedRouteSnapshot) {
    // if route is ':jid/:ctid/:eid'
    return !route.firstChild || !route.firstChild.url.length;
  }
}
