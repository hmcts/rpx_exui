import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CaseState, CaseType, Jurisdiction, PaginationMetadata, SearchResultView } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { decompressFromUTF16 } from 'lz-string';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { AppConfig } from '../../../app/services/ccd-config/ccd-case.config';
import { ActionBindingModel } from '../../../cases/models/create-case-actions.model';
import * as fromCasesFeature from '../../store';

/**
 * Entry component wrapper for ccd-search-filters-wrapper ccd-search-result
 * Smart Component
 * param TBC
 */
@Component({
  selector: 'exui-search-case',
  templateUrl: 'case-search.component.html',
  styleUrls: ['case-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CaseSearchComponent implements OnInit, OnDestroy {
  public caseSearchFilterEventsBindings: ActionBindingModel[];
  public fromCasesFeature; public any;

  public jurisdiction$: Observable<Jurisdiction>;
  public caseType$: Observable<CaseType>;
  public caseState$: Observable<CaseState>;
  public resultView$: Observable<SearchResultView>;
  public paginationMetadata$: Observable<PaginationMetadata>;
  public metadataFields$: Observable<string[]>;
  public caseFilterToggle$: Observable<boolean>;

  public fg: FormGroup;

  public jurisdiction: Jurisdiction;
  public caseType: CaseType;
  public caseState: CaseState;
  public resultView: SearchResultView;
  public paginationMetadata: PaginationMetadata = new PaginationMetadata();
  public metadataFields: string[];

  public filterSubscription: Subscription;
  public resultSubscription: Subscription;
  public paginationSubscription: Subscription;
  public caseFilterToggleSubscription: Subscription;

  public resultsArr: any[] = [];

  public paginationSize: number;
  public page: number;
  public showFilter: boolean;
  public state: any;
  public toggleButtonName: string;

  public elasticSearchFlag: boolean = false;
  public elasticSearchFlagSubsription: Subscription;

  public sortParameters;

  public resultViewIsReady: boolean = false;

  constructor(
    public store: Store<fromCasesFeature.State>,
    private readonly appConfig: AppConfig,
    private readonly featureToggleService: FeatureToggleService,
  ) {}

  public ngOnInit(): void {
    this.page = 1;
    this.resultView = null;
    this.fromCasesFeature = fromCasesFeature;
    this.caseSearchFilterEventsBindings = [
      { type: 'onReset', action: 'Reset' }
    ];

    this.paginationSize = this.appConfig.getPaginationPageSize();

    this.jurisdiction$ = this.store.pipe(select(fromCasesFeature.searchFilterJurisdiction));
    this.caseType$ = this.store.pipe(select(fromCasesFeature.searchFilterCaseType));
    this.caseState$ = this.store.pipe(select(fromCasesFeature.searchFilterCaseState));
    this.resultView$ = this.store.pipe(select(fromCasesFeature.searchFilterResultView));
    this.metadataFields$ = this.store.pipe(select(fromCasesFeature.searchFilterMetadataFields));
    this.caseFilterToggle$ = this.store.pipe(select(fromCasesFeature.getSearchFilterToggle));
    this.filterSubscription = combineLatest([
      this.jurisdiction$,
      this.caseType$,
      this.caseState$,
      this.metadataFields$
    ]).subscribe((result) => {
      this.jurisdiction = {
        ...result[0]
      };
      this.caseType = {
        ...result[1]
      };
      this.caseState = {
        ...result[2]
      };
      this.metadataFields = {
        ...result[3]
      };
    });

    this.caseFilterToggleSubscription = this.caseFilterToggle$.subscribe((result: boolean) => {
      this.showFilter = result;
      this.toggleButtonName = this.getToggleButtonName(this.showFilter);
    });

    this.listenToPaginationMetadata();

    this.resultSubscription = this.resultView$.subscribe((resultView) => this.onResultsViewHandler(resultView));

    this.elasticSearchFlagSubsription = this.featureToggleService.isEnabled('elastic-search').subscribe((value) => {
      this.elasticSearchFlag = value;
      this.triggerQuery();
    });
  }

  public listenToPaginationMetadata = () => {
    this.paginationMetadata$ = this.store.pipe(select(fromCasesFeature.getSearchFilterPaginationMetadata));
    this.paginationSubscription = this.paginationMetadata$.subscribe((paginationMetadata) =>
      this.onPaginationSubscribeHandler(paginationMetadata));
  };

  /**
   * Handles the return of Pagination Metadata.
   *
   * @param result - {totalPagesCount: 33, totalResultsCount: 811}
   */
  public onPaginationSubscribeHandler = (paginationMetadata) => {
    if (typeof paginationMetadata !== 'undefined' && typeof paginationMetadata.totalPagesCount !== 'undefined') {
      this.paginationMetadata.totalPagesCount = paginationMetadata.totalPagesCount;
      this.paginationMetadata.totalResultsCount = paginationMetadata.totalResultsCount;
      const event = this.getEvent();
      if (event !== null && !this.elasticSearchFlag) {
        this.store.dispatch(new fromCasesFeature.ApplySearchFilter(event));
      }
    }
  };

  public onResultsViewHandler = (resultViewForCaseSearch) => {
    // If elastic search flag is set then initialise pagination meta data
    // and call onPaginationSubscribeHandler method
    if (this.elasticSearchFlag) {
      const paginationDataFromResult: PaginationMetadata = {
        totalResultsCount: resultViewForCaseSearch.total,
        totalPagesCount: Math.ceil(resultViewForCaseSearch.total / this.appConfig.getPaginationPageSize())
      };
      this.onPaginationSubscribeHandler(paginationDataFromResult);
    }
    // Set resultViewIsReady to true if resultView results is defined
    if (typeof resultViewForCaseSearch.results !== 'undefined') {
      this.resultViewIsReady = true;
    }
    this.resultsArr = resultViewForCaseSearch.results;
    // Initialise resultView
    this.resultView = {
      ...resultViewForCaseSearch,
      columns: resultViewForCaseSearch.columns ? resultViewForCaseSearch.columns : [],
      results: resultViewForCaseSearch.results ? resultViewForCaseSearch.results.map((item) => {
        return {
          ...item,
          hydrated_case_fields: null
        };
      }) : [],
      hasDrafts: resultViewForCaseSearch.hasDrafts ? resultViewForCaseSearch.hasDrafts : () => false
    };
  };

  private getCompressedLSItem(key: string): string {
    const item = localStorage.getItem(key);
    if (item && item.length > 0) {
      if (item.startsWith('{')) { // probably not compressed
        return item;
      }
      try {
        const decomp = decompressFromUTF16(item);
        return JSON.parse(decomp);
      } catch (e) {
        console.log('error decompressing data of length' + item.length, e);
      }
    }
    return null;
  }

  public getEvent() {
    let event = null;
    const formGroupFromLS = JSON.parse(localStorage.getItem('search-form-group-value'));
    const jurisdictionFromLS = this.getCompressedLSItem('search-jurisdiction');
    const caseTypeGroupFromLS = JSON.parse(localStorage.getItem('search-caseType'));
    const metadataFieldsGroupFromLS = JSON.parse(localStorage.getItem('search-metadata-fields'));

    if (formGroupFromLS && jurisdictionFromLS && caseTypeGroupFromLS && metadataFieldsGroupFromLS) {
      event = {
        selected: {
          jurisdiction: jurisdictionFromLS,
          caseType: caseTypeGroupFromLS,
          metadataFields: metadataFieldsGroupFromLS,
          formGroup: {
            value: formGroupFromLS
          },
          page: this.page,
          view: 'SEARCH'
        },
        sortParameters: this.sortParameters
      };
    }
    return event;
  }

  public getToggleButtonName(showFilter: boolean): string {
    return showFilter ? 'Hide Filter' : 'Show Filter';
  }

  public findCaseListPaginationMetadata() {
    const event = this.getEvent();
    if (event !== null) {
      this.store.dispatch(new fromCasesFeature.FindSearchPaginationMetadata(event));
    }
  }

  public getElasticSearchResults() {
    const event = this.getEvent();
    if (event !== null) {
      this.store.dispatch(new fromCasesFeature.ApplySearchFilterForES(event));
    }
  }

  public toggleFilter() {
    this.store.dispatch(new fromCasesFeature.SearchFilterToggle(!this.showFilter));
  }

  public applyChangePage(event) {
    this.page = event.selected.page;
    this.triggerQuery();
  }

  public applyFilter(event) {
    this.page = event.selected.page;
    this.triggerQuery();
  }

  public sort(sortParameters) {
    this.sortParameters = {
      ...this.sortParameters,
      column: sortParameters.column,
      order: sortParameters.order,
      type: sortParameters.type
    };
    this.getElasticSearchResults();
  }

  private triggerQuery() {
    if (!this.elasticSearchFlag) {
      this.findCaseListPaginationMetadata();
    } else {
      this.getElasticSearchResults();
    }
  }

  public ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
    if (this.caseFilterToggleSubscription) {
      this.caseFilterToggleSubscription.unsubscribe();
    }
    if (this.elasticSearchFlagSubsription) {
      this.elasticSearchFlagSubsription.unsubscribe();
    }
  }
}
