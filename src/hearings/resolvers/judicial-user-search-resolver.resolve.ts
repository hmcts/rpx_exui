import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { JudicialUserModel } from '../models/judicialUser.model';
import { PanelPreferenceModel } from '../models/panelPreference.model';
import { PanelRequirementsModel } from '../models/panelRequirements.model';
import { JudicialRefDataService } from '../services/judicial-ref-data.service';
import * as fromHearingStore from '../store';

@Injectable({
  providedIn: 'root'
})
export class JudicialUserSearchResolver {
  constructor(
    protected readonly judicialRefDataService: JudicialRefDataService,
    protected readonly hearingStore: Store<fromHearingStore.State>
  ) {}

  public resolve(route?: ActivatedRouteSnapshot): Observable<JudicialUserModel[]> {
    return this.getUsersByPanelRequirements$()
      .pipe(
        switchMap((panelRequirements) => {
          return of(
            panelRequirements && panelRequirements.panelPreferences && panelRequirements.panelPreferences.filter((preferences) => this.checkMemberType(preferences, route)).map((preferences) => preferences.memberID)
          );
        }), take(1),
        switchMap((personalCodes) => {
          return personalCodes && personalCodes.length ? this.getUsersData$(personalCodes) : of([]);
        })
      );
  }

  private checkMemberType(preferences: PanelPreferenceModel, route: ActivatedRouteSnapshot): boolean {
    if (route.data.memberType) {
      return preferences.memberType === route.data.memberType;
    }
    return true;
  }

  public getUsersByPanelRequirements$(): Observable<PanelRequirementsModel> {
    return this.hearingStore.pipe(select(fromHearingStore.getHearingsFeatureState)).pipe(
      map((hearingState) => hearingState.hearingRequest && hearingState.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements)
    );
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
