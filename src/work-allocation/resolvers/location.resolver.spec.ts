import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { metaReducers } from '../../app/app.module';
import { UserDetails } from '../../app/models';
import { SessionStorageService } from '../../app/services';
import { reducers } from '../../app/store';
import * as fromCaseList from '../../app/store/reducers';
import { AllocateRoleService } from '../../role-access/services';
import { LocationsByRegion } from '../models/dtos';
import { LocationDataService } from '../services';
import { LocationResolver } from './location-resolver.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LocationResolver', () => {
  let judicialWorkerDataService: AllocateRoleService;
  let locationService: LocationDataService;
  let sessionStorageService: SessionStorageService;
  let store: Store<fromCaseList.State>;

  const CASE_WORKER: UserDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 10
    },
    canShareCases: true,
    userInfo: {
      id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      forename: 'IAC',
      surname: 'CW1',
      email: 'CWR-func-test-user1-#s@justice.gov.uk',
      active: true,
      roles: [
        'caseworker',
        'caseworker-ia',
        'caseworker-ia-caseofficer',
        'cwd-user'
      ]
    },
    roleAssignmentInfo: [{
      jurisdiction: 'IA',
      isCaseAllocator: false,
      primaryLocation: '54321',
      roleType: 'ORGANISATION',
      substantive: 'y'
    }]
  };

  const CASE_WORKER_WITH_BASE: UserDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 10
    },
    canShareCases: true,
    userInfo: {
      id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      forename: 'IAC',
      surname: 'CW1',
      email: 'CWR-func-test-user1-#s@justice.gov.uk',
      active: true,
      roles: [
        'caseworker',
        'caseworker-ia',
        'caseworker-ia-caseofficer',
        'cwd-user'
      ]
    },
    roleAssignmentInfo: [{
      jurisdiction: 'IA',
      isCaseAllocator: false,
      baseLocation: '12345',
      primaryLocation: '54321',
      roleType: 'ORGANISATION',
      substantive: 'y'
    }]
  };

  const CASE_WORKER_WITH_REGION: UserDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 10
    },
    canShareCases: true,
    userInfo: {
      id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      forename: 'IAC',
      surname: 'CW1',
      email: 'CWR-func-test-user1-#s@justice.gov.uk',
      active: true,
      roles: [
        'caseworker',
        'caseworker-ia',
        'caseworker-ia-caseofficer',
        'cwd-user'
      ]
    },
    roleAssignmentInfo: [{
      jurisdiction: 'IA',
      isCaseAllocator: false,
      primaryLocation: '54321',
      roleType: 'ORGANISATION',
      substantive: 'y',
      region: '3'
    }]
  };

  const CASE_WORKER_WITH_BASE_IN_REGION: UserDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 10
    },
    canShareCases: true,
    userInfo: {
      id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      forename: 'IAC',
      surname: 'CW1',
      email: 'CWR-func-test-user1-#s@justice.gov.uk',
      active: true,
      roles: [
        'caseworker',
        'caseworker-ia',
        'caseworker-ia-caseofficer',
        'cwd-user'
      ]
    },
    roleAssignmentInfo: [{
      jurisdiction: 'IA',
      isCaseAllocator: false,
      primaryLocation: '54321',
      baseLocation: '54321',
      roleType: 'ORGANISATION',
      substantive: 'y',
      region: '3'
    }]
  };

  const CASE_WORKER_WITH_BASE_NOT_IN_REGION: UserDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 10
    },
    canShareCases: true,
    userInfo: {
      id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      forename: 'IAC',
      surname: 'CW1',
      email: 'CWR-func-test-user1-#s@justice.gov.uk',
      active: true,
      roles: [
        'caseworker',
        'caseworker-ia',
        'caseworker-ia-caseofficer',
        'cwd-user'
      ]
    },
    roleAssignmentInfo: [{
      jurisdiction: 'IA',
      isCaseAllocator: false,
      primaryLocation: '54321',
      baseLocation: '2341',
      roleType: 'ORGANISATION',
      substantive: 'y',
      region: '3'
    }]
  };

  const CASE_WORKER_SHOULD_HAVE_ALL_LOCATIONS: UserDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 10
    },
    canShareCases: true,
    userInfo: {
      id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      forename: 'IAC',
      surname: 'CW1',
      email: 'CWR-func-test-user1-#s@justice.gov.uk',
      active: true,
      roles: [
        'caseworker',
        'caseworker-ia',
        'caseworker-ia-caseofficer',
        'cwd-user'
      ]
    },
    roleAssignmentInfo: [{
      jurisdiction: 'IA',
      isCaseAllocator: false,
      primaryLocation: '54321',
      baseLocation: '2341',
      roleType: 'ORGANISATION',
      substantive: 'y',
      region: '3'
    },
    {
      jurisdiction: 'IA',
      isCaseAllocator: false,
      primaryLocation: '54321',
      roleType: 'ORGANISATION',
      substantive: 'y'
    }]
  };

  const JUDICIAL_WORKER: UserDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 10
    },
    canShareCases: true,
    userInfo: {
      id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      forename: 'IAC',
      surname: 'CW1',
      email: 'JWR-func-test-user1-#s@justice.gov.uk',
      active: true,
      roles: [
        'judicialworker'
      ]
    },
    roleAssignmentInfo: [{
      jurisdiction: 'IA',
      isCaseAllocator: false,
      baseLocation: '12345',
      primaryLocation: '54321',
      roleType: 'ORGANISATION',
      substantive: 'y'
    }]
  };

  const JUDICIAL_WORKER_WITH_BOOKABLE: UserDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 10
    },
    canShareCases: true,
    userInfo: {
      id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      forename: 'IAC',
      surname: 'CW1',
      email: 'JWR-func-test-user1-#s@justice.gov.uk',
      active: true,
      roles: [
        'judicialworker'
      ]
    },
    roleAssignmentInfo: [{
      jurisdiction: 'IA',
      isCaseAllocator: false,
      baseLocation: '12345',
      primaryLocation: '54321',
      roleType: 'ORGANISATION',
      substantive: 'n',
      bookable: true
    }]
  };

  const JUDICIAL_WORKERS = [
    {
      email: 'JWR-func-test-user1-#s@justice.gov.uk',
      firstName: 'IAC',
      idamId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      idam_id: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f',
      lastName: 'CW2',
      known_as: null,
      full_name: 'IAC CW2',
      surname: 'CW2',
      sidam_id: null,
      email_id: 'testemail@test.com',
      location: {
        id: 231596,
        locationName: 'Birmingham'
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StoreModule.forRoot(reducers, { metaReducers }),
        RouterTestingModule.withRoutes([])],
    providers: [
        LocationResolver,
        AllocateRoleService,
        LocationDataService,
        SessionStorageService,
        { provide: APP_BASE_HREF, useValue: '/' },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}
    );
    judicialWorkerDataService = TestBed.inject(AllocateRoleService) as AllocateRoleService;
    locationService = TestBed.inject(LocationDataService) as LocationDataService;
    sessionStorageService = TestBed.inject(SessionStorageService) as SessionStorageService;
    store = TestBed.inject(Store) as Store<fromCaseList.State>;
  });

  it('should be created', () => {
    const service: LocationResolver = TestBed.inject(LocationResolver);
    expect(service).toBeTruthy();
  });

  it('should get locations by region', () => {
    const service: LocationResolver = TestBed.inject(LocationResolver);
    spyOn(locationService, 'getLocationsByRegion').and.returnValue(of([]));
    service.getRegionLocations(CASE_WORKER);
    expect(locationService.getLocationsByRegion).toHaveBeenCalledWith(['IA']);
  });

  it('resolves judicialworkers location', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(store, 'pipe').and.returnValue(of(JUDICIAL_WORKER));
    spyOn(judicialWorkerDataService, 'getCaseRolesUserDetails').and.returnValue(of(JUDICIAL_WORKERS));
    service.resolve().subscribe((location: any) => {
      expect(location.court_name).toEqual(JUDICIAL_WORKERS[0].location.locationName);
    });
  }));

  it('should get base location for the user', inject([LocationResolver], (service: LocationResolver) => {
    const expectedLocationList = [{ id: '12345', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '12345', locationName: '', services: ['IA'] }];
    const locationsByRegion: LocationsByRegion = { regionId: '1', locations: [expectedLocationList[0].id] };
    expect(service.getJudicialWorkersOrCaseWorkers([locationsByRegion], CASE_WORKER_WITH_BASE)).toEqual(expectedLocationList);
  }));

  it('should get base location for the judicial user', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    // EUI-7909 - uncomment out code
    /* const expectedLocation = [{id: '12345', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '12345', locationName: '', services: [ 'IA' ]}];
    const locationsByRegion: LocationsByRegion = {regionId: '1', locations: ['12345']};
    const expectedLocationList = [{service: 'IA', locations:
      [{id: '12345', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '12345', locationName: '', services: ['IA']}]}]; */
    // EUI-7909 - next four lines (up to expect)
    const expectedLocation = [{ id: '12345', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '12345', locationName: '', services: ['IA'] }];
    const locationsByRegion: LocationsByRegion = { regionId: '1', locations: ['12345'] };
    const expectedLocationList = [{
      service: 'IA', locations:
        [{ id: '12345', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '12345', locationName: '', services: ['IA'] }]
    }];
    expect(service.getJudicialWorkersOrCaseWorkers([locationsByRegion], JUDICIAL_WORKER)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', JSON.stringify(expectedLocationList));
  }));

  it('should get locations for user within region', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    // EUI-7909 - uncomment out code
    /* const expectedLocation = [{id: undefined, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', regionId: '3', locationName: '', locationId: undefined, services: [ 'IA' ]}];
    const locationsByRegion: LocationsByRegion[] = [{regionId: '4', locations: ['12345']}, {regionId: '3', locations: ['512345']}];
    const expectedLocationList = [{service: 'IA', locations:
      [{userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', services: ['IA'], regionId: '3'}]}]; */
    // EUI-7909 - remove next four lines
    const expectedLocation = [{ id: undefined, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', regionId: '3', locationName: '', locationId: undefined, services: ['IA'] }];
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345'] }, { regionId: '3', locations: ['512345'] }];
    const expectedLocationList = [{
      service: 'IA', locations:
        [{ userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', services: ['IA'], regionId: '3' }]
    }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_WITH_REGION)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', JSON.stringify(expectedLocationList));
  }));

  it('should get base locations for user within region', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    // EUI-7909 - uncomment out code
    /* const expectedLocation = [{id: '54321', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: '54321', services: [ 'IA' ]}];
    const locationsByRegion: LocationsByRegion[] = [{regionId: '4', locations: ['12345']}, {regionId: '3', locations: ['54321']}];
    const expectedLocationList = [{service: 'IA', locations:
      [{id: '54321', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '54321', locationName: '', services: ['IA']}]}]; */
    // EUI-7909 - remove next four lines
    const expectedLocation = [{ id: '54321', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: '54321', services: ['IA'] }];
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345'] }, { regionId: '3', locations: ['54321'] }];
    const expectedLocationList = [{
      service: 'IA', locations:
        [{ id: '54321', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '54321', locationName: '', services: ['IA'] }]
    }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_WITH_BASE_IN_REGION)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', JSON.stringify(expectedLocationList));
  }));

  it('should get base locations for user not in region', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    // EUI-7909 - uncomment out code
    /* const expectedLocation = [{id: null, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: null, services: [ 'IA' ]}];
    const locationsByRegion: LocationsByRegion[] = [{regionId: '4', locations: ['12345', '2341']}, {regionId: '3', locations: ['54321']}];
    const expectedLocationList = [{service: 'IA', locations: []}]; */
    // EUI-7909 - remove next four lines
    const expectedLocation = [{ id: null, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: null, services: ['IA'] }];
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345', '2341'] }, { regionId: '3', locations: ['54321'] }];
    const expectedLocationList = [{ service: 'IA', locations: [] }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_WITH_BASE_NOT_IN_REGION)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', JSON.stringify(expectedLocationList));
  }));

  it('should get all relevant locations for user without location restrictions on role assignment', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345', '2341'] }, { regionId: '3', locations: ['54321'] }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER)).toEqual([]);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', '[]');
  }));

  it('should get all relevant locations for user without location restrictions on individual role assignment', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    // EUI-7909 - uncomment out code
    /*     const locationsByRegion: LocationsByRegion[] = [{regionId: '4', locations: ['12345', '2341']}, {regionId: '3', locations: ['54321']}];
    const expectedLocation = [{id: null, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: null, services: [ 'IA' ]}];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_SHOULD_HAVE_ALL_LOCATIONS)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', '[]');
  }));

  it('should get all relevant locations for fee paid judge user for booking UI', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    const locationsByRegion: LocationsByRegion[] = [{regionId: '4', locations: ['12345', '2341']}, {regionId: '3', locations: ['54321']}];
    const expectedLocationList = [{service: 'IA', locations:
      [{id: '12345', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '12345', locationName: '', services: ['IA']}]}];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, JUDICIAL_WORKER_WITH_BOOKABLE)).toEqual([]);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('bookableUserLocations', JSON.stringify(expectedLocationList));
  }));
 */
    // EUI-7909 - Remove next five lines of code
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345', '2341'] }, { regionId: '3', locations: ['54321'] }];
    const expectedLocation = [{ id: null, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: null, services: ['IA'] }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_SHOULD_HAVE_ALL_LOCATIONS)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', '[]');
  }));

  it('should get locations for user within region', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    const expectedLocation = [{ id: undefined, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', regionId: '3', locationName: '', locationId: undefined, services: ['IA'] }];
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345'] }, { regionId: '3', locations: ['512345'] }];
    const expectedLocationList = [{
      service: 'IA', locations:
        [{ userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', services: ['IA'], regionId: '3' }]
    }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_WITH_REGION)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', JSON.stringify(expectedLocationList));
  }));

  it('should get base locations for user within region', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    const expectedLocation = [{ id: '54321', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: '54321', services: ['IA'] }];
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345'] }, { regionId: '3', locations: ['54321'] }];
    const expectedLocationList = [{
      service: 'IA', locations:
        [{ id: '54321', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '54321', locationName: '', services: ['IA'] }]
    }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_WITH_BASE_IN_REGION)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', JSON.stringify(expectedLocationList));
  }));

  it('should get base locations for user not in region', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    const expectedLocation = [{ id: null, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: null, services: ['IA'] }];
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345', '2341'] }, { regionId: '3', locations: ['54321'] }];
    const expectedLocationList = [{ service: 'IA', locations: [] }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_WITH_BASE_NOT_IN_REGION)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', JSON.stringify(expectedLocationList));
  }));

  it('should get all relevant locations for user without location restrictions on role assignment', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345', '2341'] }, { regionId: '3', locations: ['54321'] }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER)).toEqual([]);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', '[]');
  }));

  it('should get all relevant locations for user without location restrictions on individual role assignment', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345', '2341'] }, { regionId: '3', locations: ['54321'] }];
    const expectedLocation = [{ id: null, userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationName: '', locationId: null, services: ['IA'] }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, CASE_WORKER_SHOULD_HAVE_ALL_LOCATIONS)).toEqual(expectedLocation);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('userLocations', '[]');
  }));

  it('should get all relevant locations for fee paid judge user for booking UI', inject([LocationResolver], (service: LocationResolver) => {
    spyOn(sessionStorageService, 'setItem');
    const locationsByRegion: LocationsByRegion[] = [{ regionId: '4', locations: ['12345', '2341'] }, { regionId: '3', locations: ['54321'] }];
    const expectedLocationList = [{
      service: 'IA', locations:
        [{ id: '12345', userId: '998db99b-08aa-43d4-bc6b-0aabbb0e3c6f', locationId: '12345', locationName: '', services: ['IA'] }]
    }];
    expect(service.getJudicialWorkersOrCaseWorkers(locationsByRegion, JUDICIAL_WORKER_WITH_BOOKABLE)).toEqual([]);
    expect(sessionStorageService.setItem).toHaveBeenCalledWith('bookableUserLocations', JSON.stringify(expectedLocationList));
  }));
});
