import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LovRefDataModel } from '../models/lovRefData.model';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class AdditionalFacilitiesAnswerConverter implements AnswerConverter {
  constructor(protected readonly route: ActivatedRoute) {}

  private static getFacilityValue(hearingFacilities: LovRefDataModel[], key: string): string {
    const lovData: LovRefDataModel = hearingFacilities.find((facility) => facility.key === key);
    return lovData ? lovData.value_en : '';
  }

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        let result = '<ul>';
        const facilities = this.route.snapshot.data.additionFacilitiesOptions;
        const facilitiesRequired = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails?.facilitiesRequired
          : state.hearingRequest.hearingRequestMainModel.hearingDetails?.facilitiesRequired;
        facilitiesRequired?.forEach(
          (facility: string) => result += `<li>${AdditionalFacilitiesAnswerConverter.getFacilityValue(facilities, facility)}</li>`
        );
        result += '</ul>';
        return result;
      })
    );
  }
}
