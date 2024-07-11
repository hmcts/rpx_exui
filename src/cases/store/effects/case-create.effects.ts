import { Injectable } from '@angular/core';
import { AlertService } from '@hmcts/ccd-case-ui-toolkit';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { LoggerService } from '../../../app/services/logger/logger.service';
import * as fromRoot from '../../../app/store';
import * as fromActions from '../actions';

@Injectable()
export class CaseCreateEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly alertService: AlertService,
    private readonly loggerService: LoggerService
  ) {}

  public applyChangeCaseCreateFilter$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.CREATE_CASE_FILTER_APPLY),
    map((action: fromActions.CaseCreateFilterApply) => action.payload),
    map((param) => {
      return new fromRoot.Go({
        path: [`/cases/case-create/${param.jurisdictionId}/${param.caseTypeId}/${param.eventId}`]
      });
    })
  ));

  public applyCreateCase$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.CREATE_CASE_APPLY),
    map((action: fromActions.ApplyChange) => action.payload),
    map((newCases) => {
      return new fromRoot.CreateCaseGo({
        path: [`/cases/case-details/${newCases.caseId}`],
        caseId: newCases.caseId
      });
    })
  ));

  public cancel$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.CREATE_CASE_RESET),
    map(() => {
      return new fromRoot.Go({
        path: ['/cases']
      });
    })
  ));

  public applyCreatedCaseLoaded$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.CREATED_CASE_LOADED),
    map((payload: any) => {
      const replacements = { CASEID: payload.caseId };
      this.alertService.success({ phrase: 'Case #%CASEID% has been created.', replacements, preserve: true });
      this.loggerService.info('Case created successfully');
      return new fromRoot.NewCaseLoadedSuccessfully();
    }),
  ));
}
