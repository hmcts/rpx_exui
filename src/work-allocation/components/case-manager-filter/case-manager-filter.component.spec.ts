import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { CaseManagerFilterComponent } from '..';
import * as fromStore from '../../../app/store';
import { LocationDataService, WorkAllocationCaseService } from '../../services';
import { ALL_LOCATIONS } from '../constants/locations';

@Component({
  selector: 'xuilib-generic-filter',
  template: '<span></span>'
})
class MockGenericFilterComponent {
  @Input() public config;
}

describe('CaseManagerFilterComponent', () => {
  let component: CaseManagerFilterComponent;
  let fixture: ComponentFixture<CaseManagerFilterComponent>;
  let store: Store<fromStore.State>;
  let storePipeMock: any;
  const mockCaseService = jasmine.createSpyObj('mockCaseService', ['searchCase']);
  const SELECTED_LOCATIONS = { id: 'locations', fields: [{ name: 'locations', value: ['231596', '698118'] }] };
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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        HttpClientTestingModule,
        RouterTestingModule,
        RpxTranslationModule.forChild()
      ],
      declarations: [CaseManagerFilterComponent, MockGenericFilterComponent],
      providers: [
        RpxTranslationService, RpxTranslationConfig,
        provideMockStore(),
        { provide: WorkAllocationCaseService, useValue: mockCaseService },
        { provide: LocationDataService, useValue: { getLocations: () => of(ALL_LOCATIONS) } },
        {
          provide: FilterService, useValue: mockFilterService
        }
      ]
    }).compileComponents();
    store = TestBed.inject(Store);
    storePipeMock = spyOn(store, 'pipe');

    fixture = TestBed.createComponent(CaseManagerFilterComponent);
    component = fixture.componentInstance;
    storePipeMock.and.returnValue(of(0));
    mockFilterService.get.and.returnValue(null);
    fixture.detectChanges();
    spyOn(component.appStoreSub, 'unsubscribe');
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should subscribe to the store and the filterService', () => {
    expect(storePipeMock).toHaveBeenCalled();
    expect(component.appStoreSub).toBeDefined();
    expect(component.filterConfig.fields.length).toBe(5);
  });

  afterAll(() => {
    component.ngOnDestroy();
  });
});
