import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterError, FilterService, FilterSetting } from '@hmcts/rpx-xui-common-lib';
import { filterConfig } from '@stryker-mutator/mocha-runner/src/utils';
import { BehaviorSubject } from 'rxjs';
import { StaffDataAccessService } from '../../../services/staff-data-access/staff-data-access.service';
import { staffFilterOptionsTestData } from '../../../test-data/staff-filter-options.test.data';
import { StaffDataFilterService } from '../services/staff-data-filter/staff-data-filter.service';
import { StaffAdvFilterComponent } from './staff-adv-filter.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// tslint:disable-next-line:component-selector -- this is a stub component -- it is imported from common lib which has a different prefix
@Component({ selector: 'xuilib-generic-filter', template: '' })
class GenericFilterStubComponent {
  public submitted = false;
}

describe('StaffAdvFilterComponent', () => {
  let component: StaffAdvFilterComponent;
  let fixture: ComponentFixture<StaffAdvFilterComponent>;

  let mockStaffDataFilterService: jasmine.SpyObj<StaffDataFilterService>;
  const mockFilterServiceResponse = {
    id: 'staff-advanced-filters',
    fields: [
      {
        value: ['AAA7'],
        name: 'user-services'
      },
      {
        value: [],
        name: 'user-location'
      },
      {
        value: ['All'],
        name: 'user-type'
      },
      {
        value: ['All'],
        name: 'user-job-title'
      },
      {
        value: ['All'],
        name: 'user-skills'
      },
      {
        value: [],
        name: 'user-role'
      }
    ],
    reset: false
  };
  let mockFilterStreamSubject: BehaviorSubject<FilterSetting>;
  let mockFilterErrorsSubject: BehaviorSubject<FilterError[]>;

  beforeEach(() => {
    mockFilterStreamSubject = new BehaviorSubject(mockFilterServiceResponse);
    mockFilterErrorsSubject = new BehaviorSubject(null);

    const mockFilterService = {
      getStream: () => mockFilterStreamSubject,
      get: jasmine.createSpy(),
      persist: jasmine.createSpy(),
      givenErrors: mockFilterErrorsSubject,
      clearSessionAndLocalPersistance: jasmine.createSpy()
    };

    mockStaffDataFilterService = jasmine.createSpyObj<StaffDataFilterService>('mockStaffDataFilterService',
      ['search', 'changePage', 'setErrors']);
    mockStaffDataFilterService.search.and.callThrough();

    TestBed.configureTestingModule({
    declarations: [StaffAdvFilterComponent, GenericFilterStubComponent],
    imports: [RouterTestingModule],
    providers: [
        { provide: StaffDataFilterService, useValue: mockStaffDataFilterService },
        { provide: FilterService, useValue: mockFilterService },
        StaffDataAccessService,
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {
                        userTypes: staffFilterOptionsTestData.userTypes,
                        jobTitles: staffFilterOptionsTestData.jobTitles,
                        skills: staffFilterOptionsTestData.skills,
                        services: staffFilterOptionsTestData.services
                    }
                }
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffAdvFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and set filterConfig', () => {
    expect(component).toBeTruthy();
    expect(filterConfig).toBeTruthy();
  });

  it('should have All by default in job title in filterConfig', () => {
    const field = component.filterConfig.fields.find((f) => f.name === 'user-job-title');
    expect(field.defaultOption.key).toBe('All');
  });

  it('should have All by default in user type', () => {
    const field = component.filterConfig.fields.find((f) => f.name === 'user-type');
    expect(field.defaultOption.key).toBe('All');
  });

  describe('filterSub', () => {
    it('should unsubscribe from filterService on destroy', () => {
      // @ts-expect-error -- private property
      spyOn(component.filterSub, 'unsubscribe');
      component.ngOnDestroy();
      // @ts-expect-error -- private property
      expect(component.filterSub.unsubscribe).toHaveBeenCalled();
    });

    it('should call search on when filterService emits and it contains values', () => {
      const filterSetting = {
        id: 'staff-advanced-filters',
        fields: [
          {
            value: [
              { key: 'AAA7', label: 'Service A' },
              { key: 'BFA1', label: 'Service B' },
              { key: 'CDA3', label: 'Service C' }
            ],
            name: 'user-services'
          },
          {
            value: [],
            name: 'user-location'
          },
          {
            value: ['All'],
            name: 'user-type'
          },
          {
            value: ['All'],
            name: 'user-job-title'
          },
          {
            value: ['All'],
            name: 'user-skills'
          },
          {
            value: [],
            name: 'user-role'
          }
        ],
        reset: false
      };
      mockFilterStreamSubject.next(filterSetting);

      // @ts-expect-error - private property
      expect(component.staffDataFilterService.search).toHaveBeenCalledWith(
        { advancedSearchFilters: { serviceCode: ['AAA7', 'BFA1', 'CDA3'] }, pageNumber: 1, pageSize: 15 }
      );
    });

    describe('when filterService has no setted filters', () => {
      let filterSetting: FilterSetting;

      beforeEach(() => {
        filterSetting = {
          id: 'staff-advanced-filters',
          fields: [
            {
              value: [],
              name: 'user-services'
            },
            {
              value: [],
              name: 'user-location'
            },
            {
              value: ['All'],
              name: 'user-type'
            },
            {
              value: ['All'],
              name: 'user-job-title'
            },
            {
              value: ['All'],
              name: 'user-skills'
            },
            {
              value: [],
              name: 'user-role'
            }
          ],
          reset: false
        };
      });

      it('should call setErrors null initially after subscription', () => {
        // @ts-expect-error - private property
        expect(component.staffDataFilterService.setErrors).toHaveBeenCalledWith([]);
      });

      it('should set an error when filterService emits no values the genericFilter is submitted', () => {
        component.genericFilterComponent.submitted = true;
        fixture.detectChanges();
        mockFilterStreamSubject.next(filterSetting);
        // @ts-expect-error - private property
        expect(component.staffDataFilterService.setErrors).toHaveBeenCalledWith(
          // @ts-expect-error - private property
          [{ name: component.FILTER_NAME, error: component.ERROR_MESSAGE_MIN_ONE_CRITERIA }]
        );
      });
    });
  });

  describe('filterErrorsSub', () => {
    it('should call setErrors on staffDataFilterService when filterService givenErrors emits', () => {
      const errors = [{ name: 'test', error: 'test' }];
      mockFilterErrorsSubject.next(errors);
      // @ts-expect-error - private property
      expect(component.staffDataFilterService.setErrors).toHaveBeenCalledWith(errors);
    });

    it('should unsubscribe from filterService givenErrors on destroy', () => {
      // @ts-expect-error -- private property
      spyOn(component.filterErrorsSub, 'unsubscribe');
      component.ngOnDestroy();
      // @ts-expect-error -- private property
      expect(component.filterErrorsSub.unsubscribe).toHaveBeenCalled();
    });
  });
});
