import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { initialState } from '../hearing.test.data';
import { JudicialUserModel } from '../models/judicialUser.model';
import { JudicialRefDataService } from '../services/judicial-ref-data.service';
import { JudicialUserSearchResponseResolver } from './judicial-user-search-response-resolver.resolve';
import * as fromHearingStore from '../store';

describe('Ref Data Resolver', () => {
  let judicialRefDataService: JudicialRefDataService;
  const testJudge1 = {
    title: 'Mr',
    knownAs: 'Test Judge1',
    surname: 'Judge1',
    fullName: 'Test Judge1',
    emailId: '',
    idamId: '123456789',
    initials: 'TJ1',
    postNominals: '',
    personalCode: 'p100001',
    isJudge: 'YES',
    isMagistrate: 'Yes',
    isPanelMember: 'Yes'
  } as JudicialUserModel;
  const testJudge2 = {
    title: 'Mr',
    knownAs: 'Test Judge2',
    surname: 'Judge2',
    fullName: 'Test Judge2',
    emailId: '',
    idamId: '123456789',
    initials: 'TJ2',
    postNominals: '',
    personalCode: 'p100002',
    isJudge: 'YES',
    isMagistrate: 'Yes',
    isPanelMember: 'Yes'
  } as JudicialUserModel;
  const judicialUsers: JudicialUserModel[] = [testJudge1, testJudge2];
  const judgePersonalCodes = ['p100001', 'p100002'];
  let mockStore: Store<fromHearingStore.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      providers: [
        provideMockStore({ initialState }),
        JudicialUserSearchResponseResolver,
        JudicialRefDataService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }
    );
    mockStore = TestBed.inject(Store);
    judicialRefDataService = TestBed.inject(JudicialRefDataService) as JudicialRefDataService;
  });

  it('should be created', () => {
    const resolver: JudicialUserSearchResponseResolver = TestBed.inject(JudicialUserSearchResponseResolver);
    expect(resolver).toBeTruthy();
  });

  it('should resolve judicial user data when panel requirements are set', inject([JudicialUserSearchResponseResolver], (service: JudicialUserSearchResponseResolver) => {
    spyOn(judicialRefDataService, 'searchJudicialUserByPersonalCodes').withArgs(judgePersonalCodes).and.returnValue(of(judicialUsers));
    spyOn(service, 'getUsersByPanelRequirements$').and.returnValue(of(judgePersonalCodes));
    spyOn(service, 'getUsersData$').withArgs(judgePersonalCodes).and.returnValue(of(judicialUsers));
    service.resolve().subscribe((refData: JudicialUserModel[]) => {
      expect(service.getUsersByPanelRequirements$).toHaveBeenCalled();
      expect(service.getUsersData$).toHaveBeenCalled();
      expect(judicialRefDataService.searchJudicialUserByPersonalCodes).not.toHaveBeenCalled();
      expect(refData).toEqual([testJudge1, testJudge2]);
    });
  }));

  it('should resolve judicial user data when panel requirements are not set', inject([JudicialUserSearchResponseResolver], (service: JudicialUserSearchResponseResolver) => {
    spyOn(judicialRefDataService, 'searchJudicialUserByPersonalCodes').and.returnValue(of([]));
    spyOn(service, 'getUsersByPanelRequirements$').and.returnValue(of([]));
    spyOn(service, 'getUsersData$').and.returnValue(of([]));
    service.resolve().subscribe((refData: JudicialUserModel[]) => {
      expect(service.getUsersByPanelRequirements$).toHaveBeenCalled();
      expect(service.getUsersData$).not.toHaveBeenCalled();
      expect(judicialRefDataService.searchJudicialUserByPersonalCodes).not.toHaveBeenCalled();
      expect(refData).toEqual([]);
    });
  }));

  it('should return empty array if judicialMemberIds is null', inject([JudicialUserSearchResponseResolver], (service: JudicialUserSearchResponseResolver) => {
    spyOn(service, 'getUsersByPanelRequirements$').and.returnValue(of(null));
    service.resolve().subscribe((refData: JudicialUserModel[]) => {
      expect(refData).toEqual([]);
    });
  }));

  it('should return empty array if judicialMemberIds is undefined', inject([JudicialUserSearchResponseResolver], (service: JudicialUserSearchResponseResolver) => {
    spyOn(service, 'getUsersByPanelRequirements$').and.returnValue(of(undefined));
    service.resolve().subscribe((refData: JudicialUserModel[]) => {
      expect(refData).toEqual([]);
    });
  }));

  it('should return empty array if judicialMemberIds length is 0', inject([JudicialUserSearchResponseResolver], (service: JudicialUserSearchResponseResolver) => {
    spyOn(service, 'getUsersByPanelRequirements$').and.returnValue(of([]));
    service.resolve().subscribe((refData: JudicialUserModel[]) => {
      expect(refData).toEqual([]);
    });
  }));

  it('should return empty array if judicialMemberIds is a list containing null', inject([JudicialUserSearchResponseResolver], (service: JudicialUserSearchResponseResolver) => {
    spyOn(service, 'getUsersByPanelRequirements$').and.returnValue(of([null]));
    service.resolve().subscribe((refData: JudicialUserModel[]) => {
      expect(refData).toEqual([]);
    });
  }));

  it('should return empty array if judicialMemberIds is a list containing an empty string', inject([JudicialUserSearchResponseResolver], (service: JudicialUserSearchResponseResolver) => {
    spyOn(service, 'getUsersByPanelRequirements$').and.returnValue(of(['']));
    service.resolve().subscribe((refData: JudicialUserModel[]) => {
      expect(refData).toEqual([]);
    });
  }));

  it('should handle getUsersData$ error', inject([JudicialUserSearchResponseResolver], (service: JudicialUserSearchResponseResolver) => {
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
