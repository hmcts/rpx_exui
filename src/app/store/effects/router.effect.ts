import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RouterActions from '../actions/router.action';

import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import * as fromCases from '../../../cases/store/index';
import { from } from 'rxjs';

@Injectable()
export class RouterEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly location: Location,
    private readonly store: Store<fromCases.State>
  ) {}

  public navigate$ = createEffect(() => this.actions$.pipe(
    ofType(RouterActions.GO),
    map((action: RouterActions.Go) => action.payload),
    mergeMap(({ path, query: queryParams, extras, callback, errorHandler }) =>
      from(
        this.router.navigate(path, { queryParams, ...extras })
          .then(() => callback ? callback() : false)
          .catch((error) => errorHandler ? errorHandler(error) : false)
      )
    )
  ), { dispatch: false });

  public navigateNewCase$ = createEffect(() => this.actions$.pipe(
    ofType(RouterActions.CREATE_CASE_GO),
    map((action: RouterActions.CreateCaseGo) => action.payload),
    mergeMap(({ path, query: queryParams, extras, caseId }) =>
      from(
        this.router.navigate(path, { queryParams, ...extras }).then(() => {
          this.store.dispatch(new fromCases.CreateCaseLoaded(caseId));
        })
      )
    )
  ), { dispatch: false });

  public navigateBack$ = createEffect(() => this.actions$.pipe(
    ofType(RouterActions.BACK),
    tap(() => this.location.back())
  ), { dispatch: false });

  public navigateForward$ = createEffect(() => this.actions$.pipe(
    ofType(RouterActions.FORWARD),
    tap(() => this.location.forward())
  ), { dispatch: false });
}
