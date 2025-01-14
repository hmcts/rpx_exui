import { CdkTableModule } from '@angular/cdk/table';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService, FilterService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { TaskManagerFilterComponent } from '..';
import * as fromStore from '../../../app/store';
import { LocationDataService, WorkAllocationTaskService } from '../../services';
import { ALL_LOCATIONS } from '../constants/locations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  selector: 'xuilib-generic-filter',
  template: '<span></span>'
})
class MockGenericFilterComponent {
  @Input() public config;
}

describe('TaskManagerFilterComponent', () => {
  let component: TaskManagerFilterComponent;
  let fixture: ComponentFixture<TaskManagerFilterComponent>;
  let store: Store<fromStore.State>;
  let storePipeMock: any;
  const mockTaskService = jasmine.createSpyObj('mockTaskService', ['searchTask']);
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
    id: 'locations', fields: [
      { name: 'locations', value: ['231596', '698118'] },
      {
        name: 'types-of-work',
        value: ['types_of_work_all', ...typesOfWork.map((t) => t.key)]
      }]
  };
  const mockFilterService: any = {
    getStream: () => of(SELECTED_LOCATIONS),
    get: jasmine.createSpy(),
    persist: jasmine.createSpy(),
    givenErrors: {
      subscribe: jasmine.createSpy(),
      next: () => null,
      unsubscribe: () => null
    }
  };
  const mockFeatureToggleService = jasmine.createSpyObj('featureToggleService', ['isEnabled', 'getValue']);
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [TaskManagerFilterComponent, MockGenericFilterComponent],
    imports: [CdkTableModule,
        RouterTestingModule,
        RpxTranslationModule.forChild()],
    providers: [
        RpxTranslationService,
        RpxTranslationConfig,
        provideMockStore(),
        { provide: WorkAllocationTaskService, useValue: mockTaskService },
        { provide: LocationDataService, useValue: { getLocations: () => of(ALL_LOCATIONS) } },
        {
            provide: FilterService, useValue: mockFilterService
        },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
    store = TestBed.inject(Store);
    storePipeMock = spyOn(store, 'pipe');

    fixture = TestBed.createComponent(TaskManagerFilterComponent);
    component = fixture.componentInstance;
    storePipeMock.and.returnValue(of(0));
    mockFilterService.get.and.returnValue(null);
    mockFeatureToggleService.getValue.and.returnValue(of({
      configurations: [
        {
          caseTypes: [
            'Asylum'
          ],
          releaseVersion: '3.5',
          serviceName: 'IA'
        },
        {
          caseTypes: [
            'PRIVATELAW',
            'PRLAPPS'
          ],
          releaseVersion: '2.1',
          serviceName: 'PRIVATELAW'
        },
        {
          caseTypes: [
            'CIVIL',
            'GENERALAPPLICATION'
          ],
          releaseVersion: '2.1',
          serviceName: 'CIVIL'
        }
      ]
    }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should subscribe to the store and the filterService', () => {
    expect(storePipeMock).toHaveBeenCalled();
    expect(component.appStoreSub).toBeDefined();
    expect(component.filterSub).toBeDefined();
  });

  afterAll(() => {
    component.ngOnDestroy();
  });
});

