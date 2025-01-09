import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { HearingLocationModel } from '../models/hearingLocation.model';
import { LocationByEPIMMSModel } from '../models/location.model';
import { LocationsDataService } from '../services/locations-data.service';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class VenueAnswerConverter implements AnswerConverter {
  constructor(protected readonly locationsDataService: LocationsDataService) {}

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      take(1),
      switchMap((state) => {
        const hearingLocations = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.hearingLocations
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingLocations;
        const locationIds = hearingLocations.map((hearingLocationModel: HearingLocationModel) => hearingLocationModel.locationId).join(',');
        return this.locationsDataService.getLocationById(locationIds).pipe(
          map((locationByEPIMMSModels: LocationByEPIMMSModel[]) => {
            let result = '<ul>';
            locationByEPIMMSModels.forEach((locationByEPIMMSModel: LocationByEPIMMSModel) =>
              result += `<li>${locationByEPIMMSModel.court_name}</li>`);
            result += '</ul>';
            return result;
          }));
      }));
  }
}
