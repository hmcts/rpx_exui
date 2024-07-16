import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SearchFilterService } from '../../../cases/services';
import * as caselistActions from '../actions/case-list.action';

@Injectable()
export class CaseListEffects {
  public payload: any;
  constructor(
        private readonly actions$: Actions,
        private readonly searchService: SearchFilterService,
  ) {}

  public applyPageMetadata$ = createEffect(() => this.actions$.pipe(
    ofType(caselistActions.FIND_CASELIST_PAGINATION_METADATA),
    map((action: caselistActions.FindCaselistPaginationMetadata) => action.payload),
    switchMap((payload) => {
      this.payload = payload;
      return this.searchService.findPaginationMetadata(payload).pipe(
        map(
          (response) => new caselistActions.FindCaselistPaginationMetadataSuccess(response.json())),
        catchError((error) => of(new caselistActions.ApplyCaselistFilterFail(error)))
      );
    })
  ));

  public applyCaselistFilters$ = createEffect(() => this.actions$.pipe(
    ofType(caselistActions.APPLY_CASELIST_FILTER),
    map((action: caselistActions.ApplyCaselistFilter) => action.payload),
    switchMap((payload) => {
      return this.searchService.search(payload).pipe(
        map((result: Observable<any>) => new caselistActions.ApplyCaselistFilterSuccess(result)),
        catchError((error) => of(new caselistActions.ApplyCaselistFilterFail(error)))
      );
    })));

  public applyCaselistFiltersForES$ = createEffect(() => this.actions$.pipe(
    ofType(caselistActions.APPLY_CASELIST_FILTER_FOR_ES),
    map((action: caselistActions.ApplyCaselistFilterForES) => action.payload),
    switchMap((payload) => {
      return this.searchService.search(payload, true).pipe(
        map((result: Observable<any>) => new caselistActions.ApplyCaselistFilterSuccess(result)),
        catchError((error) => of(new caselistActions.ApplyCaselistFilterFail(error)))
      );
    })));

  public applySearchFilterToggle$ = createEffect(() => this.actions$.pipe(
    ofType(caselistActions.CASE_FILTER_DISPLAY_TOGGLE),
    map((action: caselistActions.CaseFilterToggle) => new caselistActions.CaseFilterToggleSuccess(action.payload)),
    catchError((error) => of(new caselistActions.ApplyCaselistFilterFail(error)))));
}
