import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { JudicialUserModel } from '../models/judicialUser.model';
import { JudicialRefDataService } from '../services/judicial-ref-data.service';
import * as fromHearingStore from '../store';
import { getHearingJudgeIds } from '../store/selectors/hearing-judges.selectors';

@Injectable({
  providedIn: 'root'
})
export class JudicialUserSearchResponseResolver {
  constructor(
    protected readonly judicialRefDataService: JudicialRefDataService,
    protected readonly hearingStore: Store<fromHearingStore.State>
  ) {}

  public resolve(): Observable<JudicialUserModel[]> {
    return this.getUsersByPanelRequirements$()
      .pipe(
        switchMap((judicialMemberIds) => {
          return of(judicialMemberIds);
        }), take(1),
        switchMap((judicialMemberIds) => {
          return judicialMemberIds && judicialMemberIds.length && judicialMemberIds[0] ? this.getUsersData$(judicialMemberIds) : of([]);
        })
      );
  }

  public getUsersByPanelRequirements$(): Observable<string[]> {
    return this.hearingStore.select(getHearingJudgeIds);
  }

  public getUsersData$(judgePersonalCodesList: string[]): Observable<JudicialUserModel[]> {
    return this.judicialRefDataService.searchJudicialUserByPersonalCodes(judgePersonalCodesList).pipe(
      catchError((error) => {
        this.hearingStore.dispatch(new fromHearingStore.GetHearingJudicialUsersFailure(error.error));
        return of([]);
      })
    );
  }
}
