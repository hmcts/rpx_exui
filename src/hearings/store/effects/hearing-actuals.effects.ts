import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as fromAppStoreActions from '../../../app/store/actions';
import * as hearingActualsActions from '../../../hearings/store/actions/hearing-actuals.action';
import { HttpError } from '../../../models/httpError.model';
import { HearingsService } from '../../services/hearings.service';

@Injectable()
export class HearingActualsEffects {
  public getHearingActuals$ = createEffect(() => this.actions$.pipe(
    ofType(hearingActualsActions.GET_HEARING_ACTUALS),
    switchMap((action: hearingActualsActions.GetHearingActuals) => this.hearingsService.getHearingActuals(action.payload)
      .pipe(
        map((response) => new hearingActualsActions.GetHearingActualsSuccess(response)),
        catchError((error) => HearingActualsEffects.handleError(error))
      ))
  ));

  public updateHearingActualsStage$ = createEffect(() => this.actions$.pipe(
    ofType(hearingActualsActions.UPDATE_HEARING_ACTUALS_STAGE),
    switchMap((action: any) => this.hearingsService.updateHearingActuals(action.payload.hearingId, action.payload.hearingActuals)
      .pipe(
        map(() => new hearingActualsActions.UpdateHearingActualsSuccess(action.payload.hearingActuals)),
        tap(() => this.router.navigate([`/hearings/actuals/${action.payload.hearingId}/hearing-actual-add-edit-summary`])),
        catchError((error) => HearingActualsEffects.handleError(error))
      ))
  ));

  public updateHearingActuals$ = createEffect(() => this.actions$.pipe(
    ofType(hearingActualsActions.UPDATE_HEARING_ACTUALS),
    switchMap((action: any) => this.hearingsService.updateHearingActuals(action.payload.hearingId, action.payload.hearingActuals)
      .pipe(
        map(() => new hearingActualsActions.UpdateHearingActualsSuccess(action.payload.hearingActuals)),
        catchError((error) => HearingActualsEffects.handleError(error))
      ))
  ));

  public submitHearingActuals$ = createEffect(() => this.actions$.pipe(
    ofType(hearingActualsActions.SUBMIT_HEARING_ACTUALS),
    switchMap((action: any) => this.hearingsService.submitHearingActuals(action.payload)
      .pipe(
        map(() => new hearingActualsActions.SubmitHearingActualsSuccess(action.payload)),
        tap(() => this.router.navigate([`/hearings/actuals/${action.payload}/hearing-actuals-confirmation`])),
        catchError((error: HttpError) => of(new hearingActualsActions.SubmitHearingActualsFailure(error)))
      ))
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly hearingsService: HearingsService,
  ) {}

  public static handleError(error: HttpError): Observable<Action> {
    if (error) {
      return of(new fromAppStoreActions.Go({ path: ['/hearings/error'] }));
    }
  }
}
