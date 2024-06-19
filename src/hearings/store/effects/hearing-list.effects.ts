import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromAppStoreActions from '../../../app/store/actions';
import * as hearingListActions from '../../../hearings/store/actions/hearing-list.action';
import { HttpError } from '../../../models/httpError.model';
import { HearingsService } from '../../services/hearings.service';
import * as fromHearingReducers from '../../store/reducers';

@Injectable()
export class HearingListEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly hearingsService: HearingsService,
    private readonly hearingStore: Store<fromHearingReducers.State>,
  ) {}

  public loadHearingList$ = createEffect(() => this.actions$.pipe(
    ofType(hearingListActions.LOAD_ALL_HEARINGS),
    map((action: hearingListActions.LoadAllHearings) => action.payload),
    switchMap((payload) => {
      return this.hearingsService.getAllHearings(payload).pipe(
        map(
          (response) => new hearingListActions.LoadAllHearingsSuccess(response)),
        catchError((error: HttpError) => of(new hearingListActions.LoadAllHearingsFailure(error)))
      );
    })
  ));

  public static handleError(error: HttpError): Observable<Action> {
    if (error && error.status && error.status >= 400) {
      return of(new fromAppStoreActions.Go({ path: ['/service-down'] }));
    }
  }
}
