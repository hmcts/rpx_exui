import { Injectable } from '@angular/core';

import { LocationModel } from '@hmcts/rpx-xui-common-lib/lib/models/location.model';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { LocationsDataService } from '../services/locations-data.service';
import * as fromHearingStore from '../store';

@Injectable({
  providedIn: 'root'
})
export class CourtLocationsDataResolver {
  constructor(
    protected readonly locationsDataService: LocationsDataService,
    protected readonly hearingStore: Store<fromHearingStore.State>
  ) {}

  public resolve(): Observable<LocationModel> {
    return this.getLocationId$()
      .pipe(
        switchMap((id) => of(id)),
        take(1),
        switchMap((locationId) => {
          return this.getCourtLocationData$(locationId);
        })
      );
  }

  public getLocationId$(): Observable<string> {
    return this.hearingStore.pipe(select(fromHearingStore.getHearingRequest)).pipe(
      map((hearingRequest) =>
        hearingRequest.hearingRequestMainModel
        && hearingRequest.hearingRequestMainModel.hearingResponse
        && hearingRequest.hearingRequestMainModel.hearingResponse.hearingDaySchedule
        && hearingRequest.hearingRequestMainModel.hearingResponse.hearingDaySchedule[0]
        && hearingRequest.hearingRequestMainModel.hearingResponse.hearingDaySchedule[0].hearingVenueId)
    );
  }

  public getCourtLocationData$(locationId: string): Observable<LocationModel> {
    if (locationId) {
      return this.locationsDataService.getLocationById(locationId).pipe(
        catchError(() => {
          return [];
        })
      );
    }
    return of(null);
  }
}
