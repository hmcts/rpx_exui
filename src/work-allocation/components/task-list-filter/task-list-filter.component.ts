import { Location as AngularLocation } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { SessionStorageService } from '@hmcts/ccd-case-ui-toolkit';
import {
  BookingCheckType,
  FilterConfig,
  FilterError,
  FilterFieldConfig,
  FilterPersistence,
  FilterService,
  FilterSetting
} from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as _ from 'underscore';
import { ErrorMessage } from '../../../app/models';
import * as fromAppStore from '../../../app/store';
import { Location, LocationByEPIMMSModel } from '../../models/dtos';
import Task from '../../models/tasks/task.model';
import { LocationDataService, WASupportedJurisdictionsService, WorkAllocationTaskService } from '../../services';
import { TaskTypesService } from '../../services/task-types.service';
import { locationWithinRegion, servicesMap } from '../../utils';

export const LOCATION_ERROR: ErrorMessage = {
  title: 'There is a problem',
  description: 'At least one location is required',
  fieldId: 'myWork'
};

@Component({
  selector: 'exui-task-list-filter',
  templateUrl: './task-list-filter.component.html',
  styleUrls: ['task-list-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskListFilterComponent implements OnInit, OnDestroy {
  public static readonly FILTER_NAME = 'my-work-tasks-filter';
  @Input() public persistence: FilterPersistence;
  @Output() public errorChanged: EventEmitter<ErrorMessage> = new EventEmitter();
  public allowTypesOfWorkFilter = true;
  public appStoreSub: Subscription;
  public showFilteredText = false;
  public noDefaultLocationMessage = 'Use the work filter to show tasks and cases based on service, work type and location';
  public error: ErrorMessage;
  public fieldsConfig: FilterConfig = {
    persistence: 'session',
    id: TaskListFilterComponent.FILTER_NAME,
    fields: [],
    cancelButtonText: 'Reset to default',
    applyButtonText: 'Apply',
    cancelSetting: null,
    showCancelFilterButton: false
  };

  public allLocations: string[] = [];
  public defaultLocations: any[] = null;
  public baseLocations: string[] = [];
  public baseLocationServices: string[] = [];
  public defaultTypesOfWork: string[] = [];
  public fieldsSettings: FilterSetting = {
    id: TaskListFilterComponent.FILTER_NAME,
    fields: []
  };

  public selectedLocations: string[] = [];
  public bookingLocations: string[] = [];
  public toggleFilter = false;
  public errorSubscription: Subscription;
  private routeSubscription: Subscription;
  private subscription: Subscription;
  private selectedLocationsSubscription: Subscription;
  public hideFilter: boolean;

  /**
   * Accept the SessionStorageService for adding to and retrieving from sessionStorage.
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: AngularLocation,
    private readonly filterService: FilterService,
    private readonly locationService: LocationDataService,
    private readonly router: Router,
    private readonly taskService: WorkAllocationTaskService,
    private readonly service: WASupportedJurisdictionsService,
    private readonly taskTypesService: TaskTypesService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly appStore: Store<fromAppStore.State>) {
    if (this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.location) {
      this.bookingLocations = this.router.getCurrentNavigation().extras.state.location.ids;
    }
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.route.snapshot),
      map((activatedRoute: ActivatedRouteSnapshot) => {
        while (activatedRoute.firstChild) {
          activatedRoute = activatedRoute.firstChild;
        }
        return activatedRoute;
      })
    )
      .subscribe((activatedRouteSnapshot: ActivatedRouteSnapshot) => {
        this.hideFilter = activatedRouteSnapshot.url[0].path && activatedRouteSnapshot.url[0].path.includes('my-access');
        if (this.hideFilter) {
          this.toggleFilter = false;
          this.onToggleFilter(this.toggleFilter);
        }
      });
  }

  private static hasBeenFiltered(f: FilterSetting, cancelSetting: FilterSetting, assignedTasks: Task[], currentTasks: Task[], pathname): boolean {
    const baseLocations = cancelSetting.fields.find((field) => field.name === 'locations');
    const locations = f.fields.find((field) => field.name === 'locations');
    const fieldsNoLocations = f.fields.filter((field) => field.name !== 'locations');
    const cancelFieldsNoLocations = cancelSetting.fields.filter((field) => field.name !== 'locations');
    if (pathname.includes('work/my-work/list')) {
      return assignedTasks.length !== currentTasks.length;
    }
    return !_.isEqual(fieldsNoLocations, cancelFieldsNoLocations) || !TaskListFilterComponent.hasBaseLocations(locations, baseLocations);
  }

  private static hasBaseLocations(locations, baseLocations): boolean {
    if (!(locations.value && locations.value.length > 0)) {
      return false;
    }
    const result = locations.value.filter((location) => baseLocations.value.find((baseLocation) => _.isEqual(location, baseLocation)));
    return result.length >= baseLocations.value.length;
  }

  // TODO: CAM_BOOKING - remove this
  // public subscribeToSelectedLocations(): void {
  //   this.selectedLocationsSubscription = this.filterService.getStream(TaskListFilterComponent.FILTER_NAME)
  //     .pipe(
  //       filter((f: FilterSetting) => f && f.hasOwnProperty('fields'))
  //     )
  //     .subscribe((f: FilterSetting) => {
  //       this.selectedLocations = this.bookingLocations && this.bookingLocations.length > 0 ? this.bookingLocations :  f.fields.find((field) => field.name === TaskListFilterComponent.FILTER_NAME).value;
  //       this.showFilteredText = this.hasBeenFiltered(f, this.getDefaultLocations());
  //       this.toggleFilter = false;
  //     });
  // }

  public ngOnInit(): void {
    // Clear Fileds to prevent duplication of filter
    this.fieldsConfig.fields = [];

    this.setPersistenceAndDefaultLocations();
    // TODO: CAM_BOOKING - are both subscriptions still needed, check this
    // MASTER
    this.subscription = combineLatest([
      this.taskTypesService.getTypesOfWork(),
      this.service.getWASupportedJurisdictions(),
      this.taskService.getUsersAssignedTasks(),
      this.locationService.getSpecificLocations(this.defaultLocations, this.baseLocationServices)
    ]).subscribe(([typesOfWork, services, assignedTasks, locations]: [any[], string[], Task[], LocationByEPIMMSModel[]]) => {
      this.setUpServicesFilter(services);
      this.setUpLocationFilter(locations);
      this.setUpTypesOfWorkFilter(typesOfWork);
      this.persistFirstSetting();
      this.subscribeToFilters(assignedTasks);
    });

    // TODO: CAM_BOOKING - remove this
    // 4347 - BOOKINGS-UI
    // this.locationSubscription = this.locationService.getLocations().subscribe((locations: Location[]) => {
    //   locations.forEach((location) => this.allLocations.push(location.id.toString()));
    //   this.setUpLocationFilter(locations);
    //   this.persistFirstSetting();
    // });
    //

    this.setErrors();
    this.setAllowTypesOfWorkFilter(this.router.url);
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setAllowTypesOfWorkFilter(this.router.url);
        this.toggleFilter = false;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.appStoreSub && !this.appStoreSub.closed) {
      this.appStoreSub.unsubscribe();
    }

    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    if (this.selectedLocationsSubscription && !this.selectedLocationsSubscription.closed) {
      this.selectedLocationsSubscription.unsubscribe();
    }

    if (this.errorSubscription && !this.errorSubscription.closed) {
      this.errorSubscription.unsubscribe();
    }

    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private subscribeToFilters(assignedTasks: Task[]): void {
    this.selectedLocationsSubscription = combineLatest([
      this.filterService.getStream(TaskListFilterComponent.FILTER_NAME),
      this.taskService.currentTasks$
    ])
      .pipe(
        map(([f, tasks]: [FilterSetting, Task[]]) => {
          if (!f) {
            f = {
              id: TaskListFilterComponent.FILTER_NAME,
              reset: false,
              fields: this.fieldsConfig.cancelSetting.fields
            };
          }
          return [f, tasks];
        }),
        filter(([f]: [FilterSetting, Task[]]) => f && f.hasOwnProperty('fields'))
      )
      .subscribe(([f, currentTasks]: [FilterSetting, Task[]]) => {
        this.showFilteredText = TaskListFilterComponent.hasBeenFiltered(f, this.fieldsConfig.cancelSetting, assignedTasks, currentTasks, this.location.path());
        this.toggleFilter = false;
      });
  }

  private setPersistenceAndDefaultLocations(): void {
    this.fieldsConfig.persistence = this.persistence || 'session';
    const filterService = this.filterService.get(TaskListFilterComponent.FILTER_NAME);
    const availableLocations = filterService && filterService.fields && filterService.fields.find((field) => field.name === 'locations');
    const isLocationsAvailable: boolean = availableLocations && availableLocations.value && availableLocations.value.length > 0;
    const regionLocations = JSON.parse(this.sessionStorageService.getItem('regionLocations'));
    const bookableServices = JSON.parse(this.sessionStorageService.getItem('bookableServices'));
    // get booking locations
    if (this.bookingLocations && this.bookingLocations.length > 0) {
      this.defaultLocations = this.bookingLocations;
    } else if (history.state && history.state.location && history.state.location.id) {
      const location: Location = history.state.location;
      this.defaultLocations = [location.id];
    }
    this.appStoreSub = this.appStore.pipe(select(fromAppStore.getUserDetails)).subscribe(
      (userDetails) => {
        const isFeePaidJudgeWithNoBooking: boolean = this.bookingLocations.length === 0
         && userDetails.roleAssignmentInfo.filter((p) => p.roleType && p.roleType === 'ORGANISATION'
          && !p.bookable).length === 0;
        if (isFeePaidJudgeWithNoBooking) {
          localStorage.removeItem(TaskListFilterComponent.FILTER_NAME);
        } else if (!isLocationsAvailable) {
          const baseLocations: string[] = [];
          userDetails.roleAssignmentInfo.forEach((roleAssignment) => {
            const roleJurisdiction = roleAssignment.jurisdiction;
            if (roleJurisdiction && roleAssignment.roleType === 'ORGANISATION' && !bookableServices.includes(roleAssignment.jurisdiction)
              && roleAssignment.baseLocation && roleAssignment.substantive.toLocaleLowerCase() === 'y') {
              // EUI-7339 - Added to ensure default locations are actually selectable
              if (!roleAssignment.region || locationWithinRegion(regionLocations, roleAssignment.region, roleAssignment.baseLocation)) {
                baseLocations.push(roleAssignment.baseLocation);
                this.baseLocationServices = [...this.baseLocationServices, roleAssignment.jurisdiction];
              }
            }
          });
          this.baseLocationServices = Array.from(new Set(this.baseLocationServices));
          this.defaultLocations = this.defaultLocations && this.defaultLocations.length > 0
            ? this.defaultLocations : Array.from(new Set(baseLocations));
        }
      });
  }

  private persistFirstSetting(): void {
    const savedFilterSetting = this.filterService.get(TaskListFilterComponent.FILTER_NAME);
    // if there are bookings we have been led to this by or if there is no saved filter
    if ((this.defaultLocations && this.defaultLocations.length > 0) || !savedFilterSetting) {
      this.filterService.persist(this.fieldsSettings, this.fieldsConfig.persistence);
      this.filterService.isInitialSetting = true;
    }
  }

  private setErrors(): void {
    this.errorSubscription = this.filterService.givenErrors.subscribe((errors: FilterError[]) => {
      if (errors) {
        this.error = LOCATION_ERROR;
        this.error.multiple = true;
        this.error.errors = errors;
      } else {
        this.error = null;
      }
      this.errorChanged.emit(this.error);
    });
  }

  private setUpLocationFilter(locations: LocationByEPIMMSModel[]): void {
    const field: FilterFieldConfig = {
      name: 'locations',
      options: [],
      title: 'Search for a location by name',
      titleHint: '(optional)',
      locationTitle: 'Leave blank to return all locations available to you.',
      minSelected: null,
      maxSelected: null,
      lineBreakBefore: true,
      findLocationField: 'services',
      displayMinSelectedError: true,
      type: 'find-location',
      enableAddButton: true,
      bookingCheckType: BookingCheckType.BOOKINGS_AND_BASE
    };
    let baseLocation = null;
    // if there are no booking locations selected then check for base location for salary judge
    if ((locations.length === 0) && this.route.snapshot.data && this.route.snapshot.data.locations) {
      baseLocation = this.route.snapshot.data.locations;
    }

    this.fieldsSettings.fields = [...this.fieldsSettings.fields, {
      name: 'locations',
      value: baseLocation ? baseLocation : locations
    }];
    this.fieldsConfig.cancelSetting = JSON.parse(JSON.stringify(this.fieldsSettings));
    this.fieldsConfig.fields.push(field);
  }

  private setUpTypesOfWorkFilter(typesOfWork: any[]): void {
    if (!typesOfWork.length) {
      return;
    }
    const field: FilterFieldConfig = {
      name: 'types-of-work',
      options: [
        {
          key: 'types_of_work_all',
          label: 'All work types',
          selectAll: true
        },
        ...typesOfWork
      ],
      minSelected: 1,
      maxSelected: null,
      lineBreakBefore: true,
      displayMinSelectedError: true,
      minSelectedError: 'Select a type of work',
      title: 'Types of work',
      type: 'checkbox'
    };
    const defaultFields = typesOfWork.map((typeOfWork) => typeOfWork.key);
    this.fieldsSettings.fields = [...this.fieldsSettings.fields, {
      name: 'types-of-work',
      value: ['types_of_work_all', ...defaultFields]
    }];
    this.fieldsConfig.cancelSetting = JSON.parse(JSON.stringify(this.fieldsSettings));
    this.fieldsConfig.fields.push(field);
  }

  private setUpServicesFilter(services: any[]): void {
    // Available services need to be added to work-allocation-utils.ts -> servicesMap
    this.appStoreSub = this.appStore.pipe(select(fromAppStore.getUserDetails)).subscribe(
      (userDetails) => {
        if (!services.length) {
          return;
        }
        if (!userDetails.roleAssignmentInfo || !userDetails.roleAssignmentInfo.some((p) => p.jurisdiction !== undefined)) {
          return;
        }
        const filteredServices = _.intersection.apply(_, [
          userDetails.roleAssignmentInfo
            .filter((p) => p.roleType && p.roleType === 'ORGANISATION')
            .map((item) => item.jurisdiction)
            .filter((value, index, self) => self.indexOf(value) === index && value !== undefined),
          services
        ]);
        const field: FilterFieldConfig = {
          name: 'services',
          options: [
            {
              key: 'services_all',
              label: 'Select all',
              selectAll: true
            },
            ...filteredServices
              .sort()
              .map((service) => {
                return {
                  key: service,
                  label: servicesMap[service]? servicesMap[service] : service
                };
              })
          ],
          minSelected: 1,
          maxSelected: null,
          lineBreakBefore: false,
          displayMinSelectedError: true,
          minSelectedError: 'Select a service',
          title: 'Services',
          type: 'checkbox-large'
        };

        const fieldSetting = this.fieldsSettings.fields.find((f) => f.name === 'services');
        if (fieldSetting) {
          fieldSetting.value = ['services_all', ...filteredServices];
        } else {
          this.fieldsSettings.fields = [...this.fieldsSettings.fields, {
            name: 'services',
            value: ['services_all', ...filteredServices]
          }];
        }

        this.fieldsConfig.cancelSetting = JSON.parse(JSON.stringify(this.fieldsSettings));
        const fieldConfig = this.fieldsConfig.fields.find((f) => f.name === 'services');
        if (!fieldConfig) {
          this.fieldsConfig.fields.push(field);
        }
      });
  }

  /**
   * Sets the value of the allowTypesOfWorkFilter boolean determined by provided params
   *
   * @param url - the url string to check against
   * @param myCaseUrl - the string to search for in the url
   */
  private setAllowTypesOfWorkFilter(url: string, myCasesUrl = 'my-work/my-cases'): void {
    this.allowTypesOfWorkFilter = !url.includes(myCasesUrl);
  }

  /**
   * Toggles the filter state
   *
   * @param showTypesOfWorkFilter - used to determine whether the types-of-work filters will be displayed
   */
  public onToggleFilter(showTypesOfWorkFilter: boolean): void {
    this.toggleFilter = !this.toggleFilter;
    if (this.toggleFilter) {
      setTimeout(() => {
        const typesOfWorkParentElem = document.getElementById('types-of-work')?.closest('.contain-classes');
        if (typesOfWorkParentElem) {
          (typesOfWorkParentElem as HTMLElement).style.display = showTypesOfWorkFilter ? 'block' : 'none';
        }
      }, 0);
    }
  }
}
