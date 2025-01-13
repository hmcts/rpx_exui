import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailedService } from '../../app/models/detailed-service.model';
import { SearchStatePersistenceKey } from '../enums';
import { SearchParameters, SearchRequest, SearchRequestCriteria, SearchResult } from '../models';
import { SearchRequestParty } from '../models/search-request-party.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  public readonly RECORD_PAGE_SIZE = 25;

  constructor(private readonly http: HttpClient) {}

  public getServices(): Observable<DetailedService[]> {
    return this.http.get<DetailedService[]>('/api/globalSearch/services');
  }

  public getResults(): Observable<SearchResult> {
    const searchParameters = this.retrieveState(SearchStatePersistenceKey.SEARCH_PARAMS);
    const searchRequestCriteria = searchParameters ? this.mapSearchParametersToRequestCriteria(searchParameters) : null;
    const startRecord = this.retrieveState(SearchStatePersistenceKey.START_RECORD);
    const searchRequest: SearchRequest = {
      searchCriteria: searchRequestCriteria,
      sortCriteria: null,
      maxReturnRecordCount: this.RECORD_PAGE_SIZE,
      startRecordNumber: startRecord ? parseInt(startRecord, 10) : 1
    };

    return this.http.post<SearchResult>('api/globalsearch/results', searchRequest);
  }

  public storeState(key: string, value: any): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  public retrieveState(key: string): any {
    return window.sessionStorage.getItem(key) ? JSON.parse(window.sessionStorage.getItem(key)) : null;
  }

  public decrementStartRecord(): number {
    const startRecord: number = this.retrieveState(SearchStatePersistenceKey.START_RECORD);
    if (startRecord !== null) {
      // Need to be able to decrement start record even if current value is less than or equal to record page size
      const newStartRecord = Math.max(startRecord - this.RECORD_PAGE_SIZE, 1);
      this.storeState(SearchStatePersistenceKey.START_RECORD, newStartRecord);
      return newStartRecord;
    }
    // Return default value of 1 if start record cannot be retrieved
    return 1;
  }

  public incrementStartRecord(): number {
    const startRecord: number = this.retrieveState(SearchStatePersistenceKey.START_RECORD);
    if (startRecord !== null && startRecord >= 1) {
      const newStartRecord = startRecord + this.RECORD_PAGE_SIZE;
      this.storeState(SearchStatePersistenceKey.START_RECORD, newStartRecord);
      return newStartRecord;
    }
    // Return original start record or 1 as a default, if it cannot be retrieved
    return startRecord !== null ? startRecord : 1;
  }

  private mapSearchParametersToRequestCriteria(searchParameters: SearchParameters): SearchRequestCriteria {
    let parties: SearchRequestParty[] = [];
    const { address, dateOfBirth, dateOfDeath, emailAddress, fullName, postcode } = searchParameters;
    if (address || dateOfBirth || dateOfDeath || emailAddress || fullName || postcode) {
      parties = [{
        addressLine1: address,
        dateOfBirth: dateOfBirth ? dateOfBirth.replace(/\b(\d)\b/g, '0$1') : null,
        dateOfDeath: dateOfDeath ? dateOfDeath.replace(/\b(\d)\b/g, '0$1') : null,
        emailAddress,
        partyName: fullName,
        postCode: postcode
      }];
    }

    return {
      CCDCaseTypeIds: null,
      CCDJurisdictionIds: searchParameters.CCDJurisdictionIds,
      caseManagementBaseLocationIds: null,
      caseManagementRegionIds: null,
      // Ensure case references are sanitised, i.e. have been stripped of separators (spaces and '-' characters)
      caseReferences: searchParameters.caseReferences
        ? searchParameters.caseReferences.map((caseRef) => caseRef.replace(/[\s-]/g, ''))
        : null,
      otherReferences: searchParameters.otherReferences,
      parties,
      stateIds: null
    };
  }
}
