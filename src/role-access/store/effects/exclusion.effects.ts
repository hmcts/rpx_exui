import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { InfoMessageType } from '../../../app/shared/enums/info-message-type';
import * as routeAction from '../../../app/store/index';
import { ExcludeOption, RoleAccessHttpError } from '../../models';
import { ExclusionMessageText } from '../../models/enums';
import { REDIRECTS } from '../../models/enums/redirect-urls';
import { RoleExclusionsService } from '../../services';
import { ConfirmExclusionAction, ExclusionActionTypes } from '../actions';

@Injectable()
export class ExclusionEffects {
  private readonly payload: any;

  constructor(
    private readonly actions$: Actions,
    private readonly roleExclusionsService: RoleExclusionsService
  ) {}

  public confirmExclusion$ = createEffect(() => this.actions$
    .pipe(
      ofType<ConfirmExclusionAction>(ExclusionActionTypes.CONFIRM_EXCLUSION),
      mergeMap(
        (data) => this.roleExclusionsService.confirmExclusion(data.payload)
          .pipe(
            map(() => {
              if (data.payload.exclusionOption === ExcludeOption.EXCLUDE_ME) {
                return new routeAction.Go({
                  path: ['/work/my-work/list'],
                  extras: {
                    state: {
                      showMessage: true,
                      message: { type: InfoMessageType.SUCCESS, message: ExclusionMessageText.ExcludeMe }
                    }
                  }
                });
              }
              // exclude another person
              return new routeAction.CreateCaseGo({
                path: [`/cases/case-details/${data.payload.caseId}/roles-and-access`],
                caseId: data.payload.caseId,
                extras: {
                  state: {
                    showMessage: true,
                    messageText: ExclusionMessageText.ExcludeAnother
                  }
                }
              });
            }),
            catchError((error) => {
              return ExclusionEffects.handleError(error);
            })
          )
      )
    ));

  public static handleError(error: RoleAccessHttpError): Observable<Action> {
    if (error && error.status) {
      switch (error.status) {
        case 401:
        case 403:
          return of(new routeAction.Go({
            path: [REDIRECTS.NotAuthorised]
          }));
        case 400:
        case 500:
        case 503:
          return of(new routeAction.Go({
            path: [REDIRECTS.ServiceDown]
          }));
        default:
          return of(new routeAction.Go({
            path: [REDIRECTS.ServiceDown]
          }));
      }
    }
  }
}
