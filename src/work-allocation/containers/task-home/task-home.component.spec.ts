import { CdkTableModule } from '@angular/cdk/table';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule, FeatureToggleService, FilterService } from '@hmcts/rpx-xui-common-lib';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ErrorMessage } from '../../../app/models';
import { SessionStorageService } from '../../../app/services';
import { initialMockState } from '../../../role-access/testing/app-initial-state.mock';
import { WorkAllocationComponentsModule } from '../../components/work-allocation.components.module';
import { LocationDataService, WorkAllocationTaskService } from '../../services';
import { TaskHomeComponent } from './task-home.component';

@Component({
  template: `
    <exui-task-home></exui-task-home>`
})
class WrapperComponent {
  @ViewChild(TaskHomeComponent, { static: true }) public appComponentRef: TaskHomeComponent;
}

xdescribe('TaskHomeComponent', () => {
  let component: TaskHomeComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;
  const mockTaskService = jasmine.createSpyObj('mockTaskService', ['searchTask', 'getUsersAssignedTasks']);
  mockTaskService.getUsersAssignedTasks.and.returnValue(of([]));
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
  const SELECTED_LOCATIONS = {
    id: 'locations',
    fields: [
      { name: 'locations', value: ['231596', '698118'] },
      {
        name: 'types-of-work',
        value: ['types_of_work_all', ...typesOfWork.map((t) => t.key)]
      }
    ]
  };
  const mockFilterService: any = {
    getStream: () => of(SELECTED_LOCATIONS),
    get: () => SELECTED_LOCATIONS,
    persist: () => null,
    givenErrors: {
      subscribe: () => null,
      next: () => null,
      unsubscribe: () => null
    }
  };
  const sessionStorageService = jasmine.createSpyObj('sessionStorageService', ['getItem']);
  const locationDataService = jasmine.createSpyObj('locationDataService', ['getItem', 'getSpecificLocations']);
  const featureToggleService = jasmine.createSpyObj('featureToggleService', ['getValue']);
  locationDataService.getSpecificLocations.and.returnValue(of([]));
  featureToggleService.getValue.and.returnValue(of(true));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        WorkAllocationComponentsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [TaskHomeComponent, WrapperComponent],
      providers: [
        { provide: WorkAllocationTaskService, useValue: mockTaskService },
        provideMockStore({ initialState: initialMockState }),
        // { provide: LocationDataService, useValue: { getLocations: () => of(ALL_LOCATIONS) } },
        { provide: LocationDataService, useValue: locationDataService },
        {
          provide: FilterService, useValue: mockFilterService
        },
        {
          provide: SessionStorageService, useValue: sessionStorageService
        },
        {
          provide: FeatureToggleService, useValue: featureToggleService
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    router = TestBed.inject(Router);
    spyOn(mockFilterService.givenErrors, 'unsubscribe');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should override locations error message', () => {
    const error: ErrorMessage = {
      description: 'At least one location is required',
      fieldId: 'locations',
      multiple: true,
      title: 'There is a problem',
      errors: [
        { name: 'services', error: 'Select a service' },
        { name: 'locations', error: 'Search for a location by name' },
        { name: 'types-of-work', error: 'Select a type of work' }
      ]
    };

    component.errorChangedHandler(error);
    expect(component.error.errors[1].error).toEqual('Enter a location');
  });

  it('should return null if no error message to display', () => {
    const error: ErrorMessage = null;

    component.errorChangedHandler(error);
    expect(component.error).toBeNull();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
