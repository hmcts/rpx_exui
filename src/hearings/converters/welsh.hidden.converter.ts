import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { LocationByEPIMMSModel } from '../models/location.model';
import { LocationsDataService } from '../services/locations-data.service';
import { State } from '../store';
import { HiddenConverter } from './hidden.converter';

export class WelshHiddenConverter implements HiddenConverter {
  constructor(protected readonly locationsDataService: LocationsDataService) {}

  public transformHidden(hearingState$: Observable<State>): Observable<boolean> {
    return hearingState$.pipe(
      take(1),
      switchMap((state) => {
        const hearingLocations = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingLocations
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingLocations;
        const locationIds = hearingLocations.map((location) => location.locationId).join(',');
        const locations$: Observable<LocationByEPIMMSModel[]> = this.locationsDataService.getLocationById(locationIds);
        return locations$.pipe(map(
          (locations) => {
            return !locations.some((location) => location.region_id === '7');
          })
        );
      }));
  }
}
