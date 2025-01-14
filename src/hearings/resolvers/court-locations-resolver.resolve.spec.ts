import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationByEPIMMSModel, LocationModel } from '@hmcts/rpx-xui-common-lib/lib/models/location.model';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { LocationsDataService } from '../services/locations-data.service';
import { CourtLocationsDataResolver } from './court-locations-resolver.resolve';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CourtLocationsData Resolver', () => {
  let locationsDataService: LocationsDataService;
  const dataRef: LocationModel = {
    court_venue_id: '164',
    epimms_id: '815833',
    is_hearing_location: 'N',
    is_case_management_location: 'Y',
    site_name: 'Birmingham Social Security and Child Support Tribunal',
    court_name: 'BIRMINGHAM SSCS  ',
    court_status: 'Closed',
    region_id: '3',
    region: 'Midlands',
    court_type_id: '31',
    court_type: 'Social Security and Child Support Tribunal',
    cluster_id: '18',
    cluster_name: 'West Midlands and Warwickshire',
    open_for_public: 'No',
    court_address: '54 HAGLEY ROAD, EDGBASTON ',
    postcode: 'B16 8PE'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
        provideMockStore({ initialState }),
        CourtLocationsDataResolver,
        LocationsDataService,
        { provide: APP_BASE_HREF, useValue: '/' },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}
    );
    locationsDataService = TestBed.inject(LocationsDataService) as LocationsDataService;
  });

  it('should be created', () => {
    const service: CourtLocationsDataResolver = TestBed.inject(CourtLocationsDataResolver);
    expect(service).toBeTruthy();
  });

  it('resolves reference data', inject([CourtLocationsDataResolver], (service: CourtLocationsDataResolver) => {
    spyOn(locationsDataService, 'getLocationById').and.returnValue(of(dataRef as unknown as LocationByEPIMMSModel[]));
    spyOn(service, 'getLocationId$').and.returnValue(of('12345'));
    service.resolve().subscribe((refData: LocationModel) => {
      expect(service.getLocationId$).toHaveBeenCalled();
      expect(locationsDataService.getLocationById).toHaveBeenCalled();
      expect(refData).toEqual(dataRef);
    });
  }));

  afterEach(() => {
    locationsDataService = null;
  });
});
