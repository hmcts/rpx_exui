import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { LovRefDataModel } from '../models/lovRefData.model';
import { LovRefDataService } from '../services/lov-ref-data.service';
import { HearingActualPartyChannelResolverService } from './hearing-actual-party-channel-resolver.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HearingActualPartyChannelResolverService', () => {
  let lovRefDataService: LovRefDataService;
  const dataRef: LovRefDataModel[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
        provideMockStore({ initialState }),
        HearingActualPartyChannelResolverService,
        LovRefDataService,
        { provide: APP_BASE_HREF, useValue: '/' },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}
    );
    lovRefDataService = TestBed.inject(LovRefDataService) as LovRefDataService;
  });

  it('should be created', () => {
    const service: HearingActualPartyChannelResolverService = TestBed.inject(HearingActualPartyChannelResolverService);
    expect(service).toBeTruthy();
  });

  it('resolves reference data for party channels', inject([HearingActualPartyChannelResolverService], (service: HearingActualPartyChannelResolverService) => {
    spyOn(lovRefDataService, 'getListOfValues').and.returnValue(of(dataRef));
    spyOn(service, 'getReferenceData$').and.callThrough();
    const route = new ActivatedRouteSnapshot();
    route.data = {
      title: 'HMCTS Manage cases | Request Hearing | Date Priority Hearing'
    };
    service.resolve(route).subscribe((refData: LovRefDataModel[]) => {
      expect(service.getReferenceData$).toHaveBeenCalled();
      expect(lovRefDataService.getListOfValues).toHaveBeenCalled();
      expect(refData).toEqual([]);
    });
  }));
});
