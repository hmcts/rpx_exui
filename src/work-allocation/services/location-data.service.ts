import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SessionStorageService } from '../../app/services';
import { Location, LocationByEPIMMSModel, LocationsByRegion, Region } from '../models/dtos';

@Injectable({ providedIn: 'root' })
export class LocationDataService {
  public static locationUrl: string = '/workallocation/location';
  public static fullLocationUrl: string = '/workallocation/full-location';
  public static regionLocationUrl: string = '/workallocation/region-location';
  public static regionUrl: string = '/workallocation/region';
  public static allLocationsKey: string = 'allLocations';
  public static regionLocationsKey: string = 'regionLocations';
  public static regionsKey: string = 'regions';
  public constructor(private readonly http: HttpClient, private readonly sessionStorageService: SessionStorageService) {}

  public getLocations(jurisdictions?: string[]): Observable<Location[]> {
    if (this.sessionStorageService.getItem(LocationDataService.allLocationsKey)) {
      const locations = JSON.parse(this.sessionStorageService.getItem(LocationDataService.allLocationsKey));
      return of(locations as Location[]);
    }
    const options = {
      params: new HttpParams()
        .set('serviceCodes', jurisdictions.join())
    };
    return this.http.get<Location[]>(`${LocationDataService.locationUrl}`, options).pipe(
      tap((allLocations) => this.sessionStorageService.setItem(LocationDataService.allLocationsKey, JSON.stringify(allLocations)))
    );
  }

  public getLocationsByRegion(serviceIds?: string[]): Observable<LocationsByRegion[]> {
    if (this.sessionStorageService.getItem(LocationDataService.regionLocationsKey)) {
      const locationRegions = JSON.parse(this.sessionStorageService.getItem(LocationDataService.regionLocationsKey));
      return of(locationRegions as LocationsByRegion[]);
    }
    return this.http.post<LocationsByRegion[]>(`${LocationDataService.regionLocationUrl}`, { serviceIds }).pipe(
      tap((regionLocations) => this.sessionStorageService.setItem(LocationDataService.regionLocationsKey, JSON.stringify(regionLocations)))
    );
  }

  public getSpecificLocations(locationIds: string[], locationServices: string[]): Observable<LocationByEPIMMSModel[]> {
    if (!locationIds || locationIds.length === 0) {
      return of([]);
    }
    const bookableServices = JSON.parse(this.sessionStorageService.getItem('bookableServices')) || [];
    const serviceCodes: string[] = bookableServices.length ? bookableServices : locationServices;
    const options = {
      params: new HttpParams()
        .set('serviceCodes', serviceCodes.join())
    };
    // note: may be better way of searching by epimms_id in future - previously getting location by epimms id was mocked
    return this.http.get<LocationByEPIMMSModel[]>(`${LocationDataService.fullLocationUrl}`, options).pipe(map(
      (allLocations) => allLocations.filter((location) => locationIds.includes(location.epimms_id))));
  }

  public getRegions(): Observable<Region[]> {
    if (this.sessionStorageService.getItem(LocationDataService.regionsKey)) {
      const regions = JSON.parse(this.sessionStorageService.getItem(LocationDataService.regionsKey));
      return of(regions as Region[]);
    }
    return this.http.get<Region[]>(`${LocationDataService.regionUrl}`).pipe(
      tap((regions) => this.sessionStorageService.setItem(LocationDataService.regionsKey, JSON.stringify(regions)))
    );
  }
}
