import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SessionStorageService } from '../../../app/services';
import * as fromAppStoreActions from '../../../app/store/actions';
import * as fromHearingReducers from '../../../app/store/reducers';
import * as hearingLinksActions from '../../../hearings/store/actions/hearing-links.action';
import { HttpError } from '../../../models/httpError.model';
import { HearingsService } from '../../services/hearings.service';

@Injectable()
export class HearingLinksEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly hearingStore: Store<fromHearingReducers.State>,
    private readonly hearingsService: HearingsService,
    private readonly router: Router,
    private readonly sessionStorage: SessionStorageService,
  ) {}

  public loadServiceLinkedCases$ = createEffect(() => this.actions$.pipe(
    ofType(hearingLinksActions.LOAD_SERVICE_LINKED_CASES),
    map((action: hearingLinksActions.LoadServiceLinkedCases) => action.payload),
    switchMap((payload) => {
      const caseInfo = JSON.parse(this.sessionStorage.getItem('caseInfo'));
      const jurisdictionId = caseInfo && caseInfo.jurisdiction;
      return this.hearingsService.loadServiceLinkedCases(jurisdictionId, payload.caseReference, payload.hearingId).pipe(
        map((response) => new hearingLinksActions.LoadServiceLinkedCasesSuccess(response)),
        catchError((error: HttpError) => of(new hearingLinksActions.LoadServiceLinkedCasesFailure(error)))
      );
    })
  ));

  public loadServiceLinkedCasesWithHearing$ = createEffect(() => this.actions$.pipe(
    ofType(hearingLinksActions.LOAD_SERVICE_LINKED_CASES_WITH_HEARINGS),
    map((action: hearingLinksActions.LoadServiceLinkedCasesWithHearings) => action.payload),
    switchMap((payload) => {
      const caseInfo = JSON.parse(this.sessionStorage.getItem('caseInfo'));
      const jurisdictionId = caseInfo && caseInfo.jurisdiction;
      return this.hearingsService.loadLinkedCasesWithHearings(jurisdictionId, payload.caseReference, payload.caseName, payload.hearingId).pipe(
        map((response) => new hearingLinksActions.LoadServiceLinkedCasesWithHearingsSuccess(response)),
        catchError((error: HttpError) => of(new hearingLinksActions.LoadServiceLinkedCasesWithHearingsFailure(error)))
      );
    })
  ));

  public loadLinkedHearingGroup$ = createEffect(() => this.actions$.pipe(
    ofType(hearingLinksActions.LOAD_LINKED_HEARING_GROUP),
    map((action: hearingLinksActions.LoadLinkedHearingGroup) => action.payload),
    switchMap((payload) => {
      return this.hearingsService.getLinkedHearingGroup(payload.groupId).pipe(
        map((response) => new hearingLinksActions.LoadLinkedHearingGroupSuccess(response)),
        catchError((error: HttpError) => of(new hearingLinksActions.LoadLinkedHearingGroupFailure(error)))
      );
    })
  ));

  public submitLinkedHearingGroup$ = createEffect(() => this.actions$.pipe(
    ofType(hearingLinksActions.SUBMIT_LINKED_HEARING_GROUP),
    map((action: hearingLinksActions.SubmitLinkedHearingGroup) => action.payload),
    switchMap((payload) => {
      return this.hearingsService.postLinkedHearingGroup(payload.linkedHearingGroup).pipe(
        tap(
          () => {
            if (payload.isManageLink) {
              return this.router.navigate(['/', 'hearings', 'manage-links', payload.caseId, payload.hearingGroupRequestId, payload.hearingId, 'final-confirmation']);
            }
            return this.router.navigate(['/', 'hearings', 'link', payload.caseId, payload.hearingId, 'final-confirmation']);
          }),
        catchError((error) => {
          this.hearingStore.dispatch(new hearingLinksActions.SubmitLinkedHearingGroupFailure(error));
          return of(error);
        })
      );
    })
  ), { dispatch: false });

  public manageLinkedHearingGroup$ = createEffect(() => this.actions$.pipe(
    ofType(hearingLinksActions.MANAGE_LINKED_HEARING_GROUP),
    map((action: hearingLinksActions.ManageLinkedHearingGroup) => action.payload),
    switchMap((payload) => {
      let apiCall: any;
      if (payload.linkedHearingGroup && payload.linkedHearingGroup.hearingsInGroup && payload.linkedHearingGroup.hearingsInGroup.length > 0) {
        apiCall = this.hearingsService.putLinkedHearingGroup(payload.hearingGroupRequestId, payload.linkedHearingGroup);
      } else {
        apiCall = this.hearingsService.deleteLinkedHearingGroup(payload.hearingGroupRequestId);
      }
      return apiCall.pipe(
        tap(
          () => {
            return this.router.navigate(['/', 'hearings', 'manage-links', payload.caseId, payload.hearingGroupRequestId, payload.hearingId, 'final-confirmation']);
          }),
        catchError((error) => {
          this.hearingStore.dispatch(new hearingLinksActions.SubmitLinkedHearingGroupFailure(error));
          return of(error);
        })
      );
    })
  ), { dispatch: false });

  public static handleError(error: HttpError): Observable<Action> {
    if (error && error.status) {
      return of(new fromAppStoreActions.Go({ path: ['/hearings/error'] }));
    }
  }
}
