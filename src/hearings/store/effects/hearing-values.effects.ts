import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SessionStorageService } from '../../../app/services';
import * as fromAppStoreActions from '../../../app/store/actions';
import * as hearingValuesActions from '../../../hearings/store/actions/hearing-values.action';
import { HttpError } from '../../../models/httpError.model';
import { HearingsService } from '../../services/hearings.service';
import * as fromHearingReducers from '../../store/reducers';

@Injectable()
export class HearingValuesEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly hearingStore: Store<fromHearingReducers.State>,
    private readonly hearingsService: HearingsService,
    private readonly sessionStorage: SessionStorageService,
  ) {}

  public loadHearingValue$ = createEffect(() => this.actions$.pipe(
    ofType(hearingValuesActions.LOAD_HEARING_VALUES),
    map((action: hearingValuesActions.LoadHearingValues) => action.payload),
    switchMap((payload) => {
      const caseInfo = JSON.parse(this.sessionStorage.getItem('caseInfo'));
      const jurisdictionId = caseInfo && caseInfo.jurisdiction;
      return this.hearingsService.loadHearingValues(jurisdictionId, payload).pipe(
        map(
          (response) => new hearingValuesActions.LoadHearingValuesSuccess(response)),
        catchError((error) => {
          this.hearingStore.dispatch(new hearingValuesActions.LoadHearingValuesFailure(error));
          return HearingValuesEffects.handleError(error, payload);
        })
      );
    })
  ));

  public static handleError(error: HttpError, caseId: string): Observable<Action> {
    if (error && error.status) {
      return of(new fromAppStoreActions.Go({ path: [`/cases/case-details/${caseId}/hearings`] }));
    }
  }
}
