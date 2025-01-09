import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { JudicialUserModel } from '../models/judicialUser.model';
import { JudicialRefDataService } from '../services/judicial-ref-data.service';
import * as fromHearingStore from '../store';

@Injectable({
  providedIn: 'root'
})
export class PanelMemberSearchResponseResolver {
  constructor(
    protected readonly judicialRefDataService: JudicialRefDataService,
    protected readonly hearingStore: Store<fromHearingStore.State>
  ) {}

  public resolve(): Observable<JudicialUserModel[]> {
    return this.getUsersByPanelRequirements$()
      .pipe(
        switchMap((panelMemberIds) => {
          return of(panelMemberIds);
        }), take(1),
        switchMap((panelMemberIds) => {
          return panelMemberIds && panelMemberIds.length ? this.getUsersData$(panelMemberIds) : of([]);
        })
      );
  }

  public getUsersByPanelRequirements$(): Observable<string[]> {
    return this.hearingStore.pipe(select(fromHearingStore.getHearingRequest)).pipe(
      map((hearingRequest) => {
        let panelMemberIds: string[] = [];
        if (hearingRequest.hearingRequestMainModel && hearingRequest.hearingRequestMainModel.hearingResponse
          && hearingRequest.hearingRequestMainModel.hearingResponse.hearingDaySchedule
          && hearingRequest.hearingRequestMainModel.hearingResponse.hearingDaySchedule.length === 1) {
          panelMemberIds = hearingRequest.hearingRequestMainModel.hearingResponse.hearingDaySchedule[0].panelMemberIds || [];
        }
        return panelMemberIds;
      })
    );
  }

  public getUsersData$(panelMemberIds: string[]): Observable<JudicialUserModel[]> {
    return this.judicialRefDataService.searchJudicialUserByPersonalCodes(panelMemberIds).pipe(
      catchError(() => {
        return [];
      })
    );
  }
}
