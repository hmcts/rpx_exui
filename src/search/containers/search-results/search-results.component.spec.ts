import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Jurisdiction } from '@hmcts/ccd-case-ui-toolkit';
import { PaginationComponent } from '@hmcts/rpx-xui-common-lib';
import { Observable, of } from 'rxjs';
import { JurisdictionService } from '../../../app/services/jurisdiction/jurisdiction.service';
import { SearchResult } from '../../../search/models';
import { NoResultsMessageId, ProcessForAccessType } from '../../enums';
import { SearchService } from '../../services/search.service';
import { SearchResultsComponent } from './search-results.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import createSpyObj = jasmine.createSpyObj;

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  const formBuilder = new FormBuilder();
  let searchService: jasmine.SpyObj<SearchService>;
  let jurisdictionService: jasmine.SpyObj<JurisdictionService>;
  let router: Router;
  let route: ActivatedRoute;

  const jurisdictions: Jurisdiction[] = [
    {
      id: 'BEFTA_MASTER',
      caseTypes: [
        {
          id: 'FT_GlobalSearch',
          states: [
            {
              id: 'CaseCreated',
              name: 'Create case',
              description: null,
              order: 1
            }
          ],
          description: null,
          events: null,
          name: 'Global Search'
        }
      ],
      description: null,
      name: 'BEFTA Master'
    }
  ];

  const searchResultWithNoCases: SearchResult = {
    resultInfo: {
      caseStartRecord: 1,
      casesReturned: 0,
      moreResultsToGo: false
    },
    results: []
  };

  const searchResultWithCaseList: SearchResult = {
    resultInfo: {
      caseStartRecord: 1,
      casesReturned: 2,
      moreResultsToGo: false
    },
    results: [
      {
        CCDCaseTypeId: 'FT_GlobalSearch',
        CCDCaseTypeName: null,
        CCDJurisdictionId: 'BEFTA_MASTER',
        CCDJurisdictionName: 'BEFTA Master',
        HMCTSServiceId: null,
        HMCTSServiceShortDescription: null,
        baseLocationId: null,
        baseLocationName: null,
        caseManagementCategoryId: null,
        caseManagementCategoryName: null,
        caseNameHmctsInternal: 'Derrick Rega',
        caseReference: '8771-7857-4127-5065',
        otherReferences: null,
        processForAccess: ProcessForAccessType.SPECIFIC,
        regionId: null,
        regionName: null,
        stateId: 'CaseCreated'
      },
      {
        CCDCaseTypeId: 'FT_GlobalSearch',
        CCDCaseTypeName: null,
        CCDJurisdictionId: 'BEFTA_MASTER',
        CCDJurisdictionName: 'BEFTA Master',
        HMCTSServiceId: null,
        HMCTSServiceShortDescription: null,
        baseLocationId: null,
        baseLocationName: null,
        caseManagementCategoryId: null,
        caseManagementCategoryName: null,
        caseNameHmctsInternal: 'Lea Mangan',
        caseReference: '0598-5385-1020-1905',
        otherReferences: null,
        processForAccess: ProcessForAccessType.CHALLENGED,
        regionId: null,
        regionName: null,
        stateId: 'CaseCreated'
      }
    ]
  };

  const searchResultWithMoreResultsToGo: SearchResult = {
    resultInfo: {
      caseStartRecord: 1,
      casesReturned: 1,
      moreResultsToGo: true
    },
    results: [
      {
        CCDCaseTypeId: 'FT_GlobalSearch',
        CCDCaseTypeName: null,
        CCDJurisdictionId: 'BEFTA_MASTER',
        CCDJurisdictionName: 'BEFTA Master',
        HMCTSServiceId: null,
        HMCTSServiceShortDescription: null,
        baseLocationId: null,
        baseLocationName: null,
        caseManagementCategoryId: null,
        caseManagementCategoryName: null,
        caseNameHmctsInternal: 'Derrick Rega',
        caseReference: '8771-7857-4127-5065',
        otherReferences: null,
        processForAccess: ProcessForAccessType.SPECIFIC,
        regionId: null,
        regionName: null,
        stateId: 'CaseCreated'
      }
    ]
  };

  beforeEach(waitForAsync(() => {
    searchService = createSpyObj<SearchService>(
      'searchService', ['getResults', 'decrementStartRecord', 'incrementStartRecord']);
    searchService.getResults.and.returnValue(of(searchResultWithCaseList));
    searchService.decrementStartRecord.and.returnValue(1);
    searchService.incrementStartRecord.and.returnValue(2);
    jurisdictionService = createSpyObj<JurisdictionService>('jurisdictionService', ['getJurisdictions']);
    jurisdictionService.getJurisdictions.and.returnValue(of(jurisdictions));
    TestBed.configureTestingModule({
    declarations: [SearchResultsComponent, PaginationComponent, RpxTranslateMockPipe],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterTestingModule],
    providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: SearchService, useValue: searchService },
        { provide: JurisdictionService, useValue: jurisdictionService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called ngOnInit', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.searchSubscription$).toBeTruthy();
    expect(searchService.getResults).toHaveBeenCalled();
    expect(jurisdictionService.getJurisdictions).toHaveBeenCalled();
  });

  it('should unsubscribe subscriptions onDestroy', () => {
    component.searchSubscription$ = new Observable().subscribe();
    spyOn(component.searchSubscription$, 'unsubscribe').and.callThrough();

    component.ngOnDestroy();
    expect(component.searchSubscription$.unsubscribe).toHaveBeenCalled();
  });

  it('should populate search records to display if search result is not empty', () => {
    component.onSearchSubscriptionHandler([searchResultWithCaseList, jurisdictions]);
    expect(searchResultWithCaseList.resultInfo.casesReturned).toBeGreaterThan(0);
    expect(component.searchResultDisplay.length).toEqual(2);
  });

  it('should verify process for access links', () => {
    const nodes = fixture.debugElement.nativeElement.querySelectorAll('td > a');
    expect(nodes[0].innerText).toContain('Specific access');
    expect(nodes[1].innerText).toContain('Challenged access');
  });

  it('should display change search link', () => {
    const changeSearchLink = fixture.debugElement.nativeElement.querySelector('p > a');
    expect(changeSearchLink.getAttribute('href')).toEqual('/search');
    expect(changeSearchLink.innerText).toContain('Change search');
  });

  it('should navigate to no results page if search result is empty', () => {
    component.onSearchSubscriptionHandler([searchResultWithNoCases, jurisdictions]);
    expect(router.navigate).toHaveBeenCalledWith(['/search/noresults'], { state: { messageId: NoResultsMessageId.NO_RESULTS }, relativeTo: route });
  });

  it('should set "more results to go" flag correctly', () => {
    component.onSearchSubscriptionHandler([searchResultWithMoreResultsToGo, jurisdictions]);
    expect(component.moreResultsToGo).toBe(true);
  });

  it('should decrement the start record, set its new value on the component, and retrieve the search results', () => {
    spyOn(component, 'getPreviousResultsPage').and.callThrough();
    spyOn(component, 'onSearchSubscriptionHandler').and.callThrough();
    // Ensure that the start record is greater than 1 for the "Previous page" navigation to be displayed
    component.caseStartRecord = 3;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('a.hmcts-pagination__link:first-of-type')).triggerEventHandler('click', null);
    expect(component.getPreviousResultsPage).toHaveBeenCalled();
    expect(searchService.decrementStartRecord).toHaveBeenCalled();
    expect(component.caseStartRecord).toEqual(1);
    expect(searchService.getResults).toHaveBeenCalled();
    expect(jurisdictionService.getJurisdictions).toHaveBeenCalled();
    expect(component.onSearchSubscriptionHandler).toHaveBeenCalled();
    expect(component.showSpinner).toBe(false);
  });

  it('should increment the start record, set its new value on the component, and retrieve the search results', () => {
    spyOn(component, 'getNextResultsPage').and.callThrough();
    spyOn(component, 'onSearchSubscriptionHandler').and.callThrough();
    // Ensure that "more results to go" is true for the "Next page" navigation to be displayed
    component.moreResultsToGo = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('a.hmcts-pagination__link:last-of-type')).triggerEventHandler('click', null);
    expect(component.getNextResultsPage).toHaveBeenCalled();
    expect(searchService.incrementStartRecord).toHaveBeenCalled();
    expect(component.caseStartRecord).toEqual(2);
    expect(searchService.getResults).toHaveBeenCalled();
    expect(jurisdictionService.getJurisdictions).toHaveBeenCalled();
    expect(component.onSearchSubscriptionHandler).toHaveBeenCalled();
    expect(component.showSpinner).toBe(false);
  });

  it('should not display the pagination component if there is only 1 page of data', () => {
    // If there is only 1 page of data, then "more results to go" should be false and the start record should equal 1
    component.moreResultsToGo = false;
    component.caseStartRecord = 1;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('nav.hmcts-pagination'))).toBeFalsy();
  });
});
