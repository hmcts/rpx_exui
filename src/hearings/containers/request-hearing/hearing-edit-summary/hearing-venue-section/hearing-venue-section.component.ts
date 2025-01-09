import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';
import { HearingRequestMainModel } from '../../../../models/hearingRequestMain.model';
import { LocationByEPIMMSModel } from '../../../../models/location.model';
import { LocationsDataService } from '../../../../services/locations-data.service';

@Component({
  selector: 'exui-hearing-venue-section',
  templateUrl: './hearing-venue-section.component.html'
})
export class HearingVenueSectionComponent implements OnInit {
  @Input() public hearingRequestMainModel: HearingRequestMainModel;
  @Input() public hearingRequestToCompareMainModel: HearingRequestMainModel;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public locations$: Observable<LocationByEPIMMSModel[]>;
  public showAmmendedForHeading: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;
  public hearingLocationIdsToCompare: string[];

  constructor(private readonly locationsDataService: LocationsDataService) {
  }

  public ngOnInit(): void {
    const hearingLocationIds = this.hearingRequestMainModel.hearingDetails.hearingLocations?.map((hearingLocation) => hearingLocation.locationId);
    hearingLocationIds.sort((a: any, b: any) => a - b);
    this.hearingLocationIdsToCompare = this.hearingRequestToCompareMainModel.hearingDetails.hearingLocations.map((loc) => loc.locationId);
    this.hearingLocationIdsToCompare.sort((a: any, b: any) => a - b);
    this.locations$ = this.locationsDataService.getLocationById(hearingLocationIds.join(','));

    this.showAmmendedForHeading = !_.isEqual(
      hearingLocationIds,
      this.hearingLocationIdsToCompare
    );
  }

  public onChange(fragmentId: string): void {
    const changeLink = '/hearings/request/hearing-venue#inputLocationSearch';
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }

  public showAmmended(locationId: string): boolean {
    return !this.hearingLocationIdsToCompare.includes(locationId);
  }
}
