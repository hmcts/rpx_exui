import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SearchFilterService } from '../../../cases/services';
import * as caseSearchActions from '../actions/case-search.action';

@Injectable()
export class SearchFilterEffects {
  public payload: any;
  constructor(
        private readonly actions$: Actions,
        private readonly searchService: SearchFilterService,
  ) {}

  public applyPageMetadata$ = createEffect(() => this.actions$.pipe(
    ofType(caseSearchActions.FIND_SEARCH_PAGINATION_METADATA),
    map((action: caseSearchActions.FindSearchPaginationMetadata) => action.payload),
    switchMap((payload) => {
      this.payload = payload;
      return this.searchService.findPaginationMetadata(payload).pipe(
        map(
          (response) => new caseSearchActions.FindSearchPaginationMetadataSuccess(response.json())),
        catchError((error) => of(new caseSearchActions.ApplySearchFilterFail(error)))
      );
    })
  ));

  public applySearchFilters$ = createEffect(() => this.actions$.pipe(
    ofType(caseSearchActions.APPLY_SEARCH_FILTER),
    map((action: caseSearchActions.ApplySearchFilter) => action.payload),
    switchMap((payload) => {
      return this.searchService.search(payload).pipe(
        map((result: Observable<any>) => new caseSearchActions.ApplySearchFilterSuccess(result)),
        catchError((error) => of(new caseSearchActions.ApplySearchFilterFail(error)))
      );
    })));

  public applySearchFiltersForES$ = createEffect(() => this.actions$.pipe(
    ofType(caseSearchActions.APPLY_SEARCH_FILTER_FOR_ES),
    map((action: caseSearchActions.ApplySearchFilterForES) => action.payload),
    switchMap((payload) => {
      return this.searchService.search(payload, true).pipe(
        map((result: Observable<any>) => new caseSearchActions.ApplySearchFilterSuccess(result)),
        catchError((error) => of(new caseSearchActions.ApplySearchFilterFail(error)))
      );
    })));

  public applySearchFilterToggle$ = createEffect(() => this.actions$.pipe(
    ofType(caseSearchActions.SEARCH_FILTER_DISPLAY_TOGGLE),
    map((action: caseSearchActions.SearchFilterToggle) => new caseSearchActions.SearchFilterToggleSuccess(action.payload)),
    catchError((error) => of(new caseSearchActions.ApplySearchFilterFail(error)))));
}
