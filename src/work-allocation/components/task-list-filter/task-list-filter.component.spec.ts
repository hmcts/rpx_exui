import { CdkTableModule } from '@angular/cdk/table';
import { Location as AngularLocation } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionStorageService } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule, FeatureToggleService, FilterService } from '@hmcts/rpx-xui-common-lib';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromAppStore from '../../../app/store';
import { LocationDataService, WASupportedJurisdictionsService, WorkAllocationTaskService } from '../../services';
import { TaskTypesService } from '../../services/task-types.service';
import { TaskListFilterComponent } from './task-list-filter.component';
import { servicesMap } from '../../utils';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  template: `
    <exui-task-list-filter></exui-task-list-filter>`
})
class WrapperComponent {
  @ViewChild(TaskListFilterComponent, { static: true }) public appComponentRef: TaskListFilterComponent;
}

describe('TaskListFilterComponent', () => {
  let component: TaskListFilterComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  const typesOfWork = [
    {
      key: 'hearing_work',
      label: 'Hearing work'
    },
    {
      key: 'upper_tribunal',
      label: 'Upper Tribunal'
    },
    {
      key: 'routine_work',
      label: 'Routine work'
    },
    {
      key: 'decision_making_work',
      label: 'Decision-making work'
    },
    {
      key: 'applications',
      label: 'Applications'
    },
    {
      key: 'priority',
      label: 'Priority'
    },
    {
      key: 'access_requests',
      label: 'Access requests'
    },
    {
      key: 'error_management',
      label: 'Error management'
    }
  ];
  const LOCATION = {
    court_venue_id: '100',
    epimms_id: '219164',
    is_hearing_location: 'Y',
    is_case_management_location: 'Y',
    site_name: 'Aberdeen Tribunal Hearing Centre',
    court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
    court_status: 'Open',
    region_id: '9',
    region: 'Scotland',
    court_type_id: '17',
    court_type: 'Employment Tribunal',
    open_for_public: 'Yes',
    court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test1',
    postcode: 'AB11 6LT'
  };
  const mockStore = jasmine.createSpyObj('mockStore', ['pipe']);
  const mockTaskService = jasmine.createSpyObj('mockTaskService', ['searchTask', 'getUsersAssignedTasks', 'currentTasks$']);
  const locationService = jasmine.createSpyObj('locationService', ['path', 'getSpecificLocations']);
  const mockWASupportedJurisdictionService = jasmine.createSpyObj('mockWASupportedJurisdictionService', ['getWASupportedJurisdictions']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  mockWASupportedJurisdictionService.getWASupportedJurisdictions.and.returnValue(of(['IA', 'SSCS']));
  const mockFeatureToggleService = jasmine.createSpyObj('featureToggleService', ['getValue']);
  mockTaskService.getUsersAssignedTasks.and.returnValue(of([]));
  locationService.getSpecificLocations.and.returnValue(of([]));
  mockTaskService.currentTasks$.and.returnValue(of([null]));
  mockStore.pipe.and.returnValue(of({ roleAssignmentInfo: [{ jurisdiction: 'IA', roleType: 'ORGANISATION' }] }));
  const roleAssignmentInfo = [{
    id: '478c83f8-0ed0-4651-b8bf-cd2b1e206ac2',
    actorIdType: 'IDAM',
    actorId: 'c5a983be-ca99-4b8a-97f7-23be33c3fd22',
    roleType: 'CASE',
    roleName: 'SOME_ROLE',
    classification: 'PUBLIC',
    grantType: 'STANDARD',
    roleCategory: 'LEGAL_OPERATIONS',
    readOnly: false,
    created: new Date(2021, 9, 8),
    attributes: {
      primaryLocation: '231596',
      jurisdiction: 'IA'
    }
  }];
  const filterSettings = {
    id: 'locations',
    fields: [
      {
        id: 'services',
        value: ['services_all', 'IA', 'SSCS']
      },
      {
        name: 'locations',
        value: [LOCATION]
      },
      {
        name: 'types-of-work',
        value: ['types_of_work_all', ...typesOfWork.map((t) => t.key)]
      }
    ]
  };
  const mockFilterService: any = {
    getStream: () => of(filterSettings),
    get: jasmine.createSpy(),
    persist: jasmine.createSpy(),
    givenErrors: {
      subscribe: jasmine.createSpy(),
      next: () => null,
      unsubscribe: () => null
    }
  };
  let mockRouter: any;
  let storeMock: jasmine.SpyObj<Store<fromAppStore.State>>;

  beforeEach(() => {
    storeMock = jasmine.createSpyObj<Store<fromAppStore.State>>('store', ['pipe']);
    storeMock.pipe.and.returnValue(of(roleAssignmentInfo));
    TestBed.configureTestingModule({
    declarations: [TaskListFilterComponent, WrapperComponent],
    imports: [CdkTableModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        ExuiCommonLibModule,
        StoreModule],
    providers: [
        { provide: Store, useValue: mockStore },
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {
                        location: LOCATION
                    }
                }
            }
        },
        { provide: AngularLocation, useValue: locationService },
        { provide: WorkAllocationTaskService, useValue: mockTaskService },
        { provide: LocationDataService, useValue: locationService },
        { provide: TaskTypesService, useValue: { getTypesOfWork: () => of(typesOfWork) } },
        { provide: FilterService, useValue: mockFilterService },
        { provide: WASupportedJurisdictionsService, useValue: mockWASupportedJurisdictionService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    component.persistence = 'local';
    mockFilterService.get.and.returnValue(null);
    mockFeatureToggleService.getValue.and.returnValue(of(servicesMap));
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify([{ regionId: '1', locations: ['219164'] }, { regionId: '9', locations: ['123456'] }]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should show the toggle filter button', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('.govuk-button.hmcts-button--secondary'));
    expect(button.nativeElement.innerText).toContain('Show work filter');
  });

  it('should set the persistence to be local storage if the  user is a judicial user', () => {
    expect(component.fieldsConfig.persistence).toBe('local');
  });

  it('should set booking locations', () => {
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'getCurrentNavigation').and.returnValue({ extras: { state: { location: { ids: ['231596', '231596'] } } } });
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    expect(component.bookingLocations.length).toEqual(2);
  });

  it('should show types of work filter with all types of work filters selected', () => {
    expect(component.fieldsSettings.fields.length).toBe(3);
    const typesOfWorkSelectedFields = component.fieldsSettings.fields[2];
    expect(typesOfWorkSelectedFields.value.length).toBe(typesOfWork.length + 1);
  });

  xit('should store default locations from booking navigation', () => {
    component.bookingLocations = ['Location1'];
    locationService.getSpecificLocations.and.returnValue(['Location1']);
    component.ngOnInit();
    expect(component.defaultLocations).toBe(component.bookingLocations);
    expect(locationService.getSpecificLocations).toHaveBeenCalled();
  });

  it('should set allowTypesOfWorkFilter to true by default', () => {
    expect(component.allowTypesOfWorkFilter).toBe(true);
  });

  xit('should not get the base location as default location if not within region', () => {
    mockStore.pipe.and.returnValue(of({ roleAssignmentInfo: [{ jurisdiction: 'IA', roleType: 'ORGANISATION', substantive: 'y', region: '9', baseLocation: '123456' }] }));
    component.ngOnInit();
    expect(component.defaultLocations).toEqual(['123456']);
    component.defaultLocations = [];
    mockStore.pipe.and.returnValue(of({ roleAssignmentInfo: [{ jurisdiction: 'IA', roleType: 'ORGANISATION', substantive: 'y', region: '1', baseLocation: '123456' }] }));
    component.ngOnInit();
    expect(component.defaultLocations).toEqual([]);
  });

  // TODO - as this is integrated with the common-lib it seems as though a fix needs to happen
  // in the common lib GenericFilterComponent component to account for the
  // findLocationField not being present
  xit('should render filter with "Types of work" filter visible', fakeAsync(() => {
    component.onToggleFilter(true);
    fixture.detectChanges();
    tick(500);
    const typesOfWorkParentDivElem = fixture.debugElement.query(By.css('#types-of-work')).parent;
    const styles = getComputedStyle(typesOfWorkParentDivElem.nativeElement);
    const displayProp = styles.getPropertyValue('display');
    expect(displayProp).toEqual('block');
  }));

  // TODO - as this is integrated with the common-lib it seems as though a fix needs to happen
  // in the common lib GenericFilterComponent component to account for the
  // findLocationField not being present
  xit('should render filter with "Types of work" filter NOT visible', fakeAsync(() => {
    component.allowTypesOfWorkFilter = false;
    component.onToggleFilter(false);
    fixture.detectChanges();
    tick(500);
    const typesOfWorkParentDivElem = fixture.debugElement.query(By.css('#types-of-work')).parent;
    const styles = getComputedStyle(typesOfWorkParentDivElem.nativeElement);
    const displayProp = styles.getPropertyValue('display');
    expect(displayProp).toEqual('none');
  }));

  afterAll(() => {
    component.ngOnDestroy();
  });
});
