import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterError, FilterService, FilterSetting } from '@hmcts/rpx-xui-common-lib';
import { BehaviorSubject } from 'rxjs';
import { StaffDataAccessService } from '../../../services/staff-data-access/staff-data-access.service';
import { StaffDataFilterService } from '../services/staff-data-filter/staff-data-filter.service';
import { StaffSearchComponent } from './staff-search.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StaffSearchComponent', () => {
  let component: StaffSearchComponent;
  let fixture: ComponentFixture<StaffSearchComponent>;

  let mockStaffDataAccessService: jasmine.SpyObj<StaffDataAccessService>;
  let mockStaffDataFilterService: jasmine.SpyObj<StaffDataFilterService>;
  const mockFilterServiceResponse = {
    id: 'staff-advanced-filters',
    fields: [
      {
        name: 'user-partial-name',
        value: ['Pat']
      }
    ],
    reset: false
  };
  let mockFilterStreamSubject: BehaviorSubject<FilterSetting>;
  let mockFilterErrorsSubject: BehaviorSubject<FilterError[]>;

  beforeEach(waitForAsync(() => {
    mockFilterStreamSubject = new BehaviorSubject(mockFilterServiceResponse);
    mockFilterErrorsSubject = new BehaviorSubject(null);

    const mockFilterService = {
      getStream: () => mockFilterStreamSubject,
      get: jasmine.createSpy(),
      persist: jasmine.createSpy(),
      givenErrors: mockFilterErrorsSubject,
      clearSessionAndLocalPersistance: jasmine.createSpy()
    };

    mockStaffDataAccessService = jasmine.createSpyObj<StaffDataAccessService>('mockStaffDataAccessService',
      ['getUsersByPartialName']
    );
    mockStaffDataFilterService = jasmine.createSpyObj<StaffDataFilterService>('mockStaffDataFilterService',
      ['search', 'changePage', 'setErrors']);
    mockStaffDataFilterService.search.and.callThrough();
    TestBed.configureTestingModule({
    declarations: [StaffSearchComponent],
    imports: [ReactiveFormsModule],
    providers: [
        { provide: StaffDataAccessService, useValue: mockStaffDataAccessService },
        { provide: StaffDataFilterService, useValue: mockStaffDataFilterService },
        { provide: FilterService, useValue: mockFilterService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    mockFilterStreamSubject = new BehaviorSubject(mockFilterServiceResponse);
    mockFilterErrorsSubject = new BehaviorSubject(null);

    fixture = TestBed.createComponent(StaffSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.filterConfig).toBeTruthy();
  });

  describe('onDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      // @ts-expect-error -- private property
      spyOn(component.filterSub, 'unsubscribe');
      // @ts-expect-error -- private property
      spyOn(component.filterErrorsSub, 'unsubscribe');

      component.ngOnDestroy();
      // @ts-expect-error -- private property
      expect(component.filterSub.unsubscribe).toHaveBeenCalled();
      // @ts-expect-error -- private property
      expect(component.filterErrorsSub.unsubscribe).toHaveBeenCalled();
    });
  });
});
