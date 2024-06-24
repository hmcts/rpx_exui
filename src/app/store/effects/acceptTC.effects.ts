import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AcceptTermsService } from '../../../app/services/acceptTerms/acceptTerms.service';
import * as fromRoot from '../../store';
import * as acceptTandCActions from '../actions';

@Injectable()
export class AcceptTcEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly acceptTcService: AcceptTermsService
  ) {}

  public loadHasAccepted$ = createEffect(() => this.actions$.pipe(
    ofType(acceptTandCActions.LOAD_HAS_ACCEPTED_TC),
    switchMap((action: any) => {
      return this.acceptTcService.getIsUserAccepted(action.payload).pipe(
        map((userId) => {
          return new acceptTandCActions.LoadHasAcceptedTCSuccess(userId);
        }),
        catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
      );
    })
  ));

  public userHasAccepted$ = createEffect(() => this.actions$.pipe(
    ofType(acceptTandCActions.ACCEPT_T_AND_C),
    switchMap((action: any) => {
      return this.acceptTcService.postUserAccepted(action.payload).pipe(
        map((accepted) => {
          return new acceptTandCActions.AcceptTandCSuccess(accepted);
        }),
        catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
      );
    })
  ));
}
