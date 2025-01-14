import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { SessionStorageService } from '../../app/services';
import { HearingCategory } from '../models/hearings.enum';
import { LovRefDataModel } from '../models/lovRefData.model';
import { LovRefDataService } from '../services/lov-ref-data.service';
import { RefDataResolver } from './ref-data-resolver.resolve';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Ref Data Resolver', () => {
  let lovRefDataService: LovRefDataService;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  const dataRef: LovRefDataModel[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockStore: any;
  const initialState = {
    hearings: {
      hearingValues: {
        serviceHearingValuesModel: {
          screenFlow: []
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
        provideMockStore({ initialState }),
        RefDataResolver,
        LovRefDataService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useValue: mockRouter },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    lovRefDataService = TestBed.inject(LovRefDataService) as LovRefDataService;
    mockStore = jasmine.createSpyObj('mockStore', ['pipe']);
  });

  it('should be created', () => {
    const service: RefDataResolver = TestBed.inject(RefDataResolver);
    expect(service).toBeTruthy();
  });

  it('resolves reference data', inject([RefDataResolver], (service: RefDataResolver) => {
    spyOn(lovRefDataService, 'getListOfValues').and.returnValue(of(dataRef));
    spyOn(service, 'getReferenceData$').and.callThrough();
    const route = new ActivatedRouteSnapshot();
    route.data = {
      title: 'HMCTS Manage cases | Request Hearing | Date Priority Hearing',
      category: HearingCategory.HearingPriority
    };
    service.resolve(route).subscribe((refData: LovRefDataModel[]) => {
      expect(service.getReferenceData$).toHaveBeenCalled();
      expect(lovRefDataService.getListOfValues).toHaveBeenCalled();
      expect(mockSessionStorageService.setItem).toHaveBeenCalled();
      expect(refData).toEqual([]);
    });
  }));

  it('should return null if panel member type data requested but hearing panel not configured in screen flow', inject([RefDataResolver], (service: RefDataResolver) => {
    spyOn(lovRefDataService, 'getListOfValues').and.returnValue(of(dataRef));
    spyOn(service, 'getReferenceData$').and.callThrough();
    const route = new ActivatedRouteSnapshot();
    route.data = {
      title: 'HMCTS Manage cases | Request Hearing | Date Priority Hearing',
      category: HearingCategory.PanelMemberType
    };
    service.resolve(route).subscribe((refData: LovRefDataModel[]) => {
      expect(service.getReferenceData$).toHaveBeenCalledTimes(0);
      expect(lovRefDataService.getListOfValues).toHaveBeenCalledTimes(0);
      expect(refData).toEqual(null);
    });
  }));

  it('should call router navigate if error', inject([RefDataResolver], (service: RefDataResolver) => {
    spyOn(lovRefDataService, 'getListOfValues').and.returnValue(throwError('mocked api error'));
    spyOn(service, 'getReferenceData$').and.callThrough();
    const route = new ActivatedRouteSnapshot();
    route.data = {
      title: 'HMCTS Manage cases | Request Hearing | Date Priority Hearing',
      category: HearingCategory.HearingPriority
    };
    service.resolve(route).subscribe(() => {
      expect(service.getReferenceData$).toHaveBeenCalled();
      expect(lovRefDataService.getListOfValues).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/hearings/error']);
    });
  }));
});
