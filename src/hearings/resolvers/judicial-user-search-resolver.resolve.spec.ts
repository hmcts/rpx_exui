import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { initialStateImmutable } from '../hearing.test.data';
import { JudicialUserModel } from '../models/judicialUser.model';
import { JudicialRefDataService } from '../services/judicial-ref-data.service';
import { JudicialUserSearchResolver } from './judicial-user-search-resolver.resolve';
import * as fromHearingStore from '../store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Ref Data Resolver', () => {
  let judicialRefDataService: JudicialRefDataService;
  const dataRef: JudicialUserModel[] = [];
  let mockStore: Store<fromHearingStore.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
        provideMockStore({ initialState: initialStateImmutable }),
        JudicialUserSearchResolver,
        JudicialRefDataService,
        { provide: APP_BASE_HREF, useValue: '/' },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    mockStore = TestBed.inject(Store);
    judicialRefDataService = TestBed.inject(JudicialRefDataService) as JudicialRefDataService;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    const service: JudicialUserSearchResolver = TestBed.inject(JudicialUserSearchResolver);
    expect(service).toBeTruthy();
  });

  it('resolves reference data', inject([JudicialUserSearchResolver], (service: JudicialUserSearchResolver) => {
    spyOn(judicialRefDataService, 'searchJudicialUserByPersonalCodes').and.returnValue(of(dataRef));
    spyOn(service, 'getUsersByPanelRequirements$').and.callThrough();
    spyOn(service, 'getUsersData$').and.callThrough();
    service.resolve().subscribe((refData: JudicialUserModel[]) => {
      expect(service.getUsersByPanelRequirements$).toHaveBeenCalled();
      expect(service.getUsersData$).not.toHaveBeenCalled();
      expect(refData).toEqual([]);
      service.getUsersData$([]);
      expect(judicialRefDataService.searchJudicialUserByPersonalCodes).toHaveBeenCalled();
    });
  }));

  it('should handle getUsersData$ error', inject([JudicialUserSearchResolver], (service: JudicialUserSearchResolver) => {
    const judgePersonalCodesList = ['123', '456'];
    const mockError = { error: { errorCode: 404, errorDescription: 'string', errorMessage: 'string', status: 'string', timeStamp: 'string' } };
    spyOn(judicialRefDataService, 'searchJudicialUserByPersonalCodes').and.returnValue(throwError(() => mockError));
    spyOn(mockStore, 'dispatch').and.callThrough();
    service.getUsersData$(judgePersonalCodesList).subscribe((users) => {
      expect(users).toEqual([]);
      expect(judicialRefDataService.searchJudicialUserByPersonalCodes).toHaveBeenCalledWith(judgePersonalCodesList);
      expect(mockStore.dispatch).toHaveBeenCalledWith(new fromHearingStore.GetHearingJudicialUsersFailure(mockError.error));
    });
  }));
});
