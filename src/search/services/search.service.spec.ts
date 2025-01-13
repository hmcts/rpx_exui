import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DetailedService } from '../../app/models';
import { SearchStatePersistenceKey } from '../enums';
import { SearchParameters, SearchRequest, SearchResult } from '../models';
import { SearchService } from './search.service';

describe('Search Service', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  let mockSessionStorage: any;

  beforeEach(() => {
    const store = {};
    mockSessionStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      }
    };
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SearchService
      ]
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no HTTP requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get global search services', () => {
    const dummyResponse: DetailedService[] = [
      { serviceId: 'TEST', serviceName: 'Test service' }
    ];
    service.getServices().subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('/api/globalSearch/services');
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should store state in session storage', () => {
    spyOn(window.sessionStorage, 'setItem');
    service.storeState('test', 'state');
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('test', JSON.stringify('state'));
  });

  it('should retrieve state from session storage', () => {
    const item = {
      field1: 'Abc',
      field2: '123'
    };
    mockSessionStorage.setItem('test', JSON.stringify(item));
    spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    const state = service.retrieveState('test');
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith('test');
    expect(state).toEqual(item);
  });

  it('should get results for specified search parameters', () => {
    const searchParameters: SearchParameters = {
      caseReferences: ['1234123412341234'],
      CCDJurisdictionIds: ['TEST'],
      otherReferences: ['Abc'],
      fullName: 'Test test',
      address: '102 Petty France',
      postcode: 'SW1H 9AJ',
      emailAddress: 'test@example.com',
      dateOfBirth: null,
      dateOfDeath: null
    };
    const serviceSpy = spyOn(service, 'retrieveState').and.callFake((key: string) => {
      if (key === SearchStatePersistenceKey.SEARCH_PARAMS) {
        return searchParameters;
      } else if (key === SearchStatePersistenceKey.START_RECORD) {
        return '1';
      }
    });
    const searchRequest: SearchRequest = {
      searchCriteria: {
        CCDCaseTypeIds: null,
        CCDJurisdictionIds: searchParameters.CCDJurisdictionIds,
        caseManagementBaseLocationIds: null,
        caseManagementRegionIds: null,
        caseReferences: searchParameters.caseReferences,
        otherReferences: searchParameters.otherReferences,
        parties: [{
          addressLine1: searchParameters.address,
          dateOfBirth: searchParameters.dateOfBirth,
          dateOfDeath: searchParameters.dateOfDeath,
          emailAddress: searchParameters.emailAddress,
          partyName: searchParameters.fullName,
          postCode: searchParameters.postcode
        }],
        stateIds: null
      },
      sortCriteria: null,
      maxReturnRecordCount: service.RECORD_PAGE_SIZE,
      startRecordNumber: 1
    };
    const dummySearchResult: SearchResult = {
      resultInfo: null,
      results: [null, null]
    };

    service.getResults().subscribe((result) => {
      expect(result).toEqual(dummySearchResult);
    });

    expect(serviceSpy).toHaveBeenCalledTimes(2);
    expect(serviceSpy.calls.all()[0].args[0]).toEqual(SearchStatePersistenceKey.SEARCH_PARAMS);
    expect(serviceSpy.calls.all()[1].args[0]).toEqual(SearchStatePersistenceKey.START_RECORD);

    const req = httpMock.expectOne('api/globalsearch/results');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(searchRequest);
    req.flush(dummySearchResult);
  });

  it('should ensure the case reference is sanitised of any separators (spaces and \'-\' characters) before being sent in a request', () => {
    const searchParameters: SearchParameters = {
      caseReferences: ['1234 1234-1234 -1234'],
      CCDJurisdictionIds: ['TEST'],
      otherReferences: ['Abc'],
      fullName: 'Test test',
      address: '102 Petty France',
      postcode: 'SW1H 9AJ',
      emailAddress: 'test@example.com',
      dateOfBirth: null,
      dateOfDeath: null
    };
    const serviceSpy = spyOn(service, 'retrieveState').and.callFake((key: string) => {
      if (key === SearchStatePersistenceKey.SEARCH_PARAMS) {
        return searchParameters;
      } else if (key === SearchStatePersistenceKey.START_RECORD) {
        return '1';
      }
    });
    const searchRequest: SearchRequest = {
      searchCriteria: {
        CCDCaseTypeIds: null,
        CCDJurisdictionIds: searchParameters.CCDJurisdictionIds,
        caseManagementBaseLocationIds: null,
        caseManagementRegionIds: null,
        // Case references are expected to be sanitised of any separators (spaces and '-' characters)
        caseReferences: searchParameters.caseReferences.map((caseRef) => caseRef.replace(/[\s-]/g, '')),
        otherReferences: searchParameters.otherReferences,
        parties: [{
          addressLine1: searchParameters.address,
          dateOfBirth: searchParameters.dateOfBirth,
          dateOfDeath: searchParameters.dateOfDeath,
          emailAddress: searchParameters.emailAddress,
          partyName: searchParameters.fullName,
          postCode: searchParameters.postcode
        }],
        stateIds: null
      },
      sortCriteria: null,
      maxReturnRecordCount: service.RECORD_PAGE_SIZE,
      startRecordNumber: 1
    };
    const dummySearchResult: SearchResult = {
      resultInfo: null,
      results: [null, null]
    };

    service.getResults().subscribe((result) => {
      expect(result).toEqual(dummySearchResult);
    });

    expect(serviceSpy).toHaveBeenCalledTimes(2);
    expect(serviceSpy.calls.all()[0].args[0]).toEqual(SearchStatePersistenceKey.SEARCH_PARAMS);
    expect(serviceSpy.calls.all()[1].args[0]).toEqual(SearchStatePersistenceKey.START_RECORD);

    const req = httpMock.expectOne('api/globalsearch/results');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(searchRequest);
    req.flush(dummySearchResult);
  });

  it('should ensure any dates have a leading zero where day or month are less than 10, before being sent in a request', () => {
    const searchParameters: SearchParameters = {
      caseReferences: ['1234 1234-1234 -1234'],
      CCDJurisdictionIds: ['TEST'],
      otherReferences: ['Abc'],
      fullName: 'Test test',
      address: '102 Petty France',
      postcode: 'SW1H 9AJ',
      emailAddress: 'test@example.com',
      dateOfBirth: '1980-10-1',
      dateOfDeath: '2020-2-2'
    };
    const serviceSpy = spyOn(service, 'retrieveState').and.callFake((key: string) => {
      if (key === SearchStatePersistenceKey.SEARCH_PARAMS) {
        return searchParameters;
      } else if (key === SearchStatePersistenceKey.START_RECORD) {
        return '1';
      }
    });
    const searchRequest: SearchRequest = {
      searchCriteria: {
        CCDCaseTypeIds: null,
        CCDJurisdictionIds: searchParameters.CCDJurisdictionIds,
        caseManagementBaseLocationIds: null,
        caseManagementRegionIds: null,
        // Case references are expected to be sanitised of any separators (spaces and '-' characters)
        caseReferences: searchParameters.caseReferences.map((caseRef) => caseRef.replace(/[\s-]/g, '')),
        otherReferences: searchParameters.otherReferences,
        parties: [{
          addressLine1: searchParameters.address,
          // Dates are expected to have a leading zero for numbers less than 10
          dateOfBirth: searchParameters.dateOfBirth.replace(/\b(\d)\b/g, '0$1'),
          dateOfDeath: searchParameters.dateOfDeath.replace(/\b(\d)\b/g, '0$1'),
          emailAddress: searchParameters.emailAddress,
          partyName: searchParameters.fullName,
          postCode: searchParameters.postcode
        }],
        stateIds: null
      },
      sortCriteria: null,
      maxReturnRecordCount: service.RECORD_PAGE_SIZE,
      startRecordNumber: 1
    };
    const dummySearchResult: SearchResult = {
      resultInfo: null,
      results: [null, null]
    };

    service.getResults().subscribe((result) => {
      expect(result).toEqual(dummySearchResult);
    });

    expect(serviceSpy).toHaveBeenCalledTimes(2);
    expect(serviceSpy.calls.all()[0].args[0]).toEqual(SearchStatePersistenceKey.SEARCH_PARAMS);
    expect(serviceSpy.calls.all()[1].args[0]).toEqual(SearchStatePersistenceKey.START_RECORD);

    const req = httpMock.expectOne('api/globalsearch/results');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(searchRequest);
    req.flush(dummySearchResult);
  });

  it('should decrement the starting record number if it exists in the session store and is greater than the record page size', () => {
    mockSessionStorage.setItem(SearchStatePersistenceKey.START_RECORD, service.RECORD_PAGE_SIZE + 1);
    spyOn(service, 'retrieveState').and.callThrough();
    spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    spyOn(service, 'storeState').and.callThrough();
    spyOn(window.sessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
    const startRecord = service.decrementStartRecord();
    expect(service.retrieveState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    // The start record is expected to be 1, having been decremented by the record page size
    expect(service.storeState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD, 1);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD, '1');
    expect(startRecord).toEqual(1);
  });

  it('should decrement the starting record number (to 1) even if it is not greater than the record page size', () => {
    mockSessionStorage.setItem(SearchStatePersistenceKey.START_RECORD, service.RECORD_PAGE_SIZE);
    spyOn(service, 'retrieveState').and.callThrough();
    spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    spyOn(service, 'storeState').and.callThrough();
    spyOn(window.sessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
    const startRecord = service.decrementStartRecord();
    expect(service.retrieveState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    // The start record is expected to be 1, having been decremented to 1
    expect(service.storeState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD, 1);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD, '1');
    expect(startRecord).toEqual(1);
  });

  it('should not decrement the starting record number if it does not exist in the session store', () => {
    spyOn(service, 'retrieveState').and.callThrough();
    spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    spyOn(service, 'storeState').and.callThrough();
    const startRecord = service.decrementStartRecord();
    expect(service.retrieveState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(service.storeState).not.toHaveBeenCalled();
    // The start record is expected to default to 1 if it cannot be retrieved
    expect(startRecord).toEqual(1);
  });

  it('should increment the starting record number if it exists in the session store and is greater than or equal to 1', () => {
    mockSessionStorage.setItem(SearchStatePersistenceKey.START_RECORD, 1);
    spyOn(service, 'retrieveState').and.callThrough();
    spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    spyOn(service, 'storeState').and.callThrough();
    spyOn(window.sessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
    const startRecord = service.incrementStartRecord();
    expect(service.retrieveState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    // The start record is expected to be 1 + record page size, having been incremented by the record page size
    const newStartRecord = 1 + service.RECORD_PAGE_SIZE;
    expect(service.storeState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD, newStartRecord);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD, newStartRecord.toString());
    expect(startRecord).toEqual(newStartRecord);
  });

  it('should not increment the starting record number if it is less than 1', () => {
    mockSessionStorage.setItem(SearchStatePersistenceKey.START_RECORD, 0);
    spyOn(service, 'retrieveState').and.callThrough();
    spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    spyOn(service, 'storeState').and.callThrough();
    const startRecord = service.incrementStartRecord();
    expect(service.retrieveState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(service.storeState).not.toHaveBeenCalled();
    // The start record is expected to be whatever the existing value is (i.e. zero, in this case)
    expect(startRecord).toEqual(0);
  });

  it('should not increment the starting record number if it does not exist in the session store', () => {
    spyOn(service, 'retrieveState').and.callThrough();
    spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    spyOn(service, 'storeState').and.callThrough();
    const startRecord = service.incrementStartRecord();
    expect(service.retrieveState).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(SearchStatePersistenceKey.START_RECORD);
    expect(service.storeState).not.toHaveBeenCalled();
    // The start record is expected to default to 1 if it cannot be retrieved
    expect(startRecord).toEqual(1);
  });
});
