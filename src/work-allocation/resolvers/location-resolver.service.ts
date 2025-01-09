import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocationModel } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { EMPTY } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, first, map, mergeMap } from 'rxjs/operators';
import { RoleAssignmentInfo, UserDetails } from '../../app/models';
import { SessionStorageService } from '../../app/services';
import { UserService } from '../../app/services/user/user.service';
import * as fromRoot from '../../app/store';
import * as fromCaseList from '../../app/store/reducers';
import { Booking } from '../../booking/models';
import { Location, LocationsByRegion, LocationsByService } from '../models/dtos';
import { LocationDataService } from '../services';
import { WILDCARD_SERVICE_DOWN, addLocationToLocationsByService, handleFatalErrors, locationWithinRegion } from '../utils';

@Injectable({
  providedIn: 'root'
})
// Note: used before my work and booking screens
export class LocationResolver {
  private userRole: string;
  // Note that bookableServices only used for ease of use
  // - i.e. removing non-bookable services from booking ui functionality
  private readonly bookableServices: string[] = [];
  private userId: string;
  private locations: Location[] = [];
  private feePaidLocations: Location[] = [];
  private locationServices = new Set<string>();
  private feePaidLocationServices = new Set<string>();
  private allLocationServices = [];
  private allFeePaidLocationServices = [];

  constructor(
    private readonly store: Store<fromCaseList.State>,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly sessionStorageService: SessionStorageService,
    private readonly locationService: LocationDataService,
    private readonly userService: UserService
  ) { }

  public resolve(): Observable<LocationModel[]> {
    return this.userDetails()
      .pipe(
        first(),
        mergeMap((userDetails: UserDetails) => this.getRegionLocations(userDetails)
          .pipe(
            map((regionLocations) => this.getJudicialWorkersOrCaseWorkers(regionLocations, userDetails))
          )
        ),
        mergeMap((locations: Location[]) => this.getLocations(locations)),
        catchError((error) => {
          handleFatalErrors(error.status, this.router, WILDCARD_SERVICE_DOWN);
          return EMPTY;
        })
      );
  }

  private userDetails(): Observable<UserDetails> {
    const newBookingCreated = (this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.newBooking === true);
    return newBookingCreated ? this.updateAndGetUserDetails() : this.store.pipe(select(fromRoot.getUserDetails));
  }

  private updateAndGetUserDetails(): Observable<UserDetails> {
    this.store.dispatch(new fromRoot.LoadUserDetails(true));
    return this.store.pipe(select(fromRoot.getUserDetails));
  }

  // Will call location service API with list of derived possible services to get locations by region
  public getRegionLocations(userDetails: UserDetails): Observable<LocationsByRegion[]> {
    const possibleServices = [];
    // simple loop as idea is just to get list of possible services to check
    userDetails.roleAssignmentInfo.forEach((roleAssignment) => {
      if (roleAssignment.jurisdiction && !possibleServices.includes(roleAssignment.jurisdiction)) {
        possibleServices.push(roleAssignment.jurisdiction);
      }
    });
    return this.locationService.getLocationsByRegion(possibleServices);
  }

  public getJudicialWorkersOrCaseWorkers(regionLocations: LocationsByRegion[], userDetails: UserDetails): Location[] {
    this.userId = userDetails.userInfo.id ? userDetails.userInfo.id : userDetails.userInfo.uid;
    let userLocationsByService: LocationsByService[] = [];
    let feePaidUserLocationsByService: LocationsByService[] = [];
    userDetails.roleAssignmentInfo.forEach((roleAssignment) => {
      const roleJurisdiction = roleAssignment.jurisdiction;
      if (roleJurisdiction && !this.bookableServices.includes(roleJurisdiction) && roleAssignment.roleType === 'ORGANISATION'
        && (roleAssignment.bookable === true || roleAssignment.bookable === 'true')
      ) {
        this.bookableServices.push(roleJurisdiction);
      }
      if (roleJurisdiction && !this.allLocationServices.includes(roleJurisdiction) && roleAssignment.roleType === 'ORGANISATION'
        && roleAssignment.substantive.toLocaleLowerCase() === 'y' && this.checkDatesValid(roleAssignment)
        // temporary fix as fee-paid-jedge-roles currently substantive
        && roleAssignment.roleName !== 'fee-paid-judge') {
        this.setRegionsAndBaseLocations(roleAssignment, roleJurisdiction, regionLocations, false);
      } else if (roleJurisdiction && !this.allFeePaidLocationServices.includes(roleJurisdiction) && roleAssignment.roleType === 'ORGANISATION'
        && (roleAssignment.bookable === true || roleAssignment.bookable === 'true') && this.checkDatesValid(roleAssignment)) {
        this.setRegionsAndBaseLocations(roleAssignment, roleJurisdiction, regionLocations, true);
      }
    });
    this.locations.forEach((location) => {
      location.services.map((service) => {
        userLocationsByService = addLocationToLocationsByService(userLocationsByService, location, service, this.allLocationServices);
      });
    });
    this.feePaidLocations.forEach((location) => {
      location.services.map((service) => {
        feePaidUserLocationsByService = addLocationToLocationsByService(feePaidUserLocationsByService, location, service, this.allFeePaidLocationServices);
      });
    });
    this.sessionStorageService.setItem('userLocations', JSON.stringify(userLocationsByService));
    this.sessionStorageService.setItem('bookableUserLocations', JSON.stringify(feePaidUserLocationsByService));
    this.sessionStorageService.setItem('bookableServices', JSON.stringify(this.bookableServices));
    return this.locations;
  }

  public addBookingLocations(locations: Location[], bookings: Booking[]): Location[] {
    // TODO: Check if user still has valid bookable role assignment for service
    const bookingLocations: string[] = [];
    bookings.forEach((booking) => {
      // if this is an active booking
      if (moment(new Date()).isSameOrAfter(booking.beginTime) && moment(new Date()).isSameOrBefore(booking.endTime)) {
        bookingLocations.push(booking.locationId);
      } else {
        locations = locations.filter((location) => location.id !== booking.locationId);
      }
    });
    this.saveBookingLocation(bookingLocations);
    return locations;
  }

  private setRegionsAndBaseLocations(roleAssignment: RoleAssignmentInfo, roleJurisdiction: string, regionLocations: LocationsByRegion[], feePaid: boolean): void {
    if (!roleAssignment.region && !roleAssignment.baseLocation) {
      // if there are no restrictions, via union logic, all locations selectable
      if (feePaid) {
        this.allFeePaidLocationServices.push(roleJurisdiction);
      } else {
        this.allLocationServices.push(roleJurisdiction);
      }
    } else if (roleAssignment.region && roleAssignment.baseLocation) {
      if (locationWithinRegion(regionLocations, roleAssignment.region, roleAssignment.baseLocation)) {
        this.setBaseLocationForAdding(roleAssignment, roleJurisdiction, feePaid);
      } else {
        if (!this.locations.find((location) => location.services.includes(roleJurisdiction))) {
          const location =
          {
            id: null,
            userId: this.userId,
            locationId: null,
            locationName: '',
            services: [roleAssignment.jurisdiction]
          };
          this.setAllLocations(location, roleAssignment, feePaid);
        }
      }
    } else if (roleAssignment.region) {
      if (!this.locations.find((location) => location.regionId === roleAssignment.region && location.services.includes(roleJurisdiction))) {
        const location =
        {
          id: undefined,
          userId: this.userId,
          locationId: undefined,
          locationName: '',
          services: [roleAssignment.jurisdiction],
          regionId: roleAssignment.region
        };
        this.setAllLocations(location, roleAssignment, feePaid);
      }
    } else {
      this.setBaseLocationForAdding(roleAssignment, roleJurisdiction, feePaid);
    }
  }

  private setAllLocations(location: Location, roleAssignment: RoleAssignmentInfo, feePaid: boolean): void {
    if (!feePaid) {
      this.locations.push(location);
      this.locationServices.add(roleAssignment.jurisdiction);
    } else {
      this.feePaidLocations.push(location);
      this.feePaidLocationServices.add(roleAssignment.jurisdiction);
    }
  }

  private saveBookingLocation(newBookingLocations: string[]) {
    // Since bookings are given without service data we just need record of locations to match against
    const stored: string = this.sessionStorageService.getItem('bookingLocations');
    let bookingLocations = new Set<string>();
    if (stored) {
      bookingLocations = new Set(JSON.parse(stored));
    }
    newBookingLocations.forEach((location) => {
      bookingLocations.add(location);
    });

    // Note: currently we do not immediately show booking locations - the only way to automatically show booking locations currently
    // is to navigate via the booking screens. We can add them (if necessary in this)
    this.sessionStorageService.setItem('bookingLocations', JSON.stringify(Array.from(bookingLocations)));
  }

  private setBaseLocationForAdding(roleAssignment: RoleAssignmentInfo, service: string, feePaid: boolean): void {
    // check to see if the location is a new location
    const newLocation = feePaid ? !this.feePaidLocations.find((location) => location.id === roleAssignment.baseLocation && location.services.includes(service))
      : !this.locations.find((location) => location.id === roleAssignment.baseLocation && location.services.includes(service));
    if (newLocation) {
      const location =
      {
        id: roleAssignment.baseLocation,
        userId: this.userId,
        locationId: roleAssignment.baseLocation,
        locationName: '',
        services: [roleAssignment.jurisdiction]
      };
      this.setAllLocations(location, roleAssignment, feePaid);
    }
  }

  private getLocations(locations: Location[]): Observable<LocationModel[]> {
    locations = locations.filter((location) => !!location.id);
    if (!locations || locations.length === 0) {
      return of(null);
    }
    return this.http.post<LocationModel[]>('api/locations/getLocationsById', { locations });
  }

  // check that the role assignment is within the begin and end times
  private checkDatesValid(roleAssignment: RoleAssignmentInfo): boolean {
    const notBeforeBegin = !roleAssignment.beginTime || moment(new Date()).isSameOrAfter(roleAssignment.beginTime);
    const notAfterEnd = !roleAssignment.endTime || moment(new Date()).isSameOrBefore(roleAssignment.endTime);
    return notBeforeBegin && notAfterEnd;
  }
}
