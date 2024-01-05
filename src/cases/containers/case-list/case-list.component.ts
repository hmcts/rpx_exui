import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  CaseState,
  CaseType,
  DefinitionsService,
  Jurisdiction,
  PaginationMetadata,
  SearchResultComponent,
  SearchResultView,
  SearchResultViewItem,
  WindowService
} from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest, of } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { AppConfig } from '../../../app/services/ccd-config/ccd-case.config';
import * as fromRoot from '../../../app/store';
import { OrganisationDetails } from '../../../organisation/models';
import * as fromStore from '../../../organisation/store';
import * as converters from '../../converters/case-converter';
import { ActionBindingModel } from '../../models/create-case-actions.model';
import * as fromCasesFeature from '../../store';
import * as fromCaseList from '../../store/reducers';

/**
 * Entry component wrapper for Case List
 * Smart Component
 * param TBC
 */
@Component({
  selector: 'exui-case-list',
  templateUrl: 'case-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['case-list.component.scss']
})
export class CaseListComponent implements OnInit, OnDestroy {
  @ViewChild('ccdSearchResult', { static: false }) public ccdSearchResult: SearchResultComponent; // EUI-2906
  public defaults: any;
  public caseListFilterEventsBindings: ActionBindingModel[];
  public fromCasesFeature: any;

  public jurisdiction$: Observable<Jurisdiction>;
  public caseType$: Observable<CaseType>;
  public caseState$: Observable<CaseState>;
  public resultView$: Observable<SearchResultView>;
  public paginationMetadata$: Observable<PaginationMetadata>;
  public metadataFields$: Observable<string[]>;
  public caseFilterToggle$: Observable<boolean>;
  public jurisdictionsBehaviourSubject$: BehaviorSubject<Jurisdiction[]> = new BehaviorSubject<Jurisdiction[]>([]);
  public shareCases$: Observable<SharedCase[]>;
  public shareableJurisdictions$: Observable<string[]>;
  private pIsCaseShareVisible$: Observable<boolean>;
  public get isCaseShareVisible$(): Observable<boolean> {
    // This is a getter simply because some unit tests rely on being
    // able to spy on it for mocking.
    return this.pIsCaseShareVisible$;
  }

  public fg: FormGroup;

  public jurisdiction: Jurisdiction;
  public caseType: CaseType;
  public caseState: CaseState;
  public resultView: SearchResultView;
  public paginationMetadata: PaginationMetadata = new PaginationMetadata();
  public metadataFields: string[];

  public filterSubscription: Subscription;
  public resultSubscription: Subscription;
  public caseFilterToggleSubscription: Subscription;

  public resultsArr: any[] = [];

  public paginationSize: number;
  public selected: any;
  public showFilter: boolean;
  public toggleButtonName: string;
  public state: any;
  public savedQueryParams: any;
  public page: number;
  public paginationSubscription: Subscription;
  public isVisible: boolean;
  public jurisdictions: Jurisdiction[];
  public selectedCases: SearchResultViewItem[] = [];

  public elasticSearchFlag: boolean = false;
  public elasticSearchFlagSubsription: Subscription;

  public sortParameters;

  public userDetails: Observable<any>;
  public organisationDetails: Partial<OrganisationDetails>;

  public resultViewIsReady: boolean = false;

  private readonly unsubscribe$ = new Subject();

  constructor(
    public store: Store<fromCaseList.State>,
    private readonly orgStore: Store<fromStore.OrganisationState>,
    private readonly appConfig: AppConfig,
    private readonly definitionsService: DefinitionsService,
    private readonly windowService: WindowService,
    private readonly featureToggleService: FeatureToggleService,
    private readonly cd: ChangeDetectorRef
  ) { }

  public async ngOnInit() {
    this.isVisible = false;
    this.page = 1;
    this.resultView = null;
    this.definitionsService.getJurisdictions('read').subscribe(this.jurisdictionsBehaviourSubject$);

    this.jurisdictionsBehaviourSubject$.pipe(takeUntil(this.unsubscribe$)).subscribe((jurisdictions) => {
      this.isVisible = jurisdictions.length > 0;
      this.jurisdictions = jurisdictions;
    });

    this.shareableJurisdictions$ = this.featureToggleService.getValue('shareable-jurisdictions', []);

    this.setCaseListFilterDefaults();

    this.fromCasesFeature = fromCasesFeature;
    this.caseListFilterEventsBindings = [
      { type: 'onApply', action: 'FindCaselistPaginationMetadata' },
      { type: 'onReset', action: 'CaseListReset' }
    ];

    this.paginationSize = this.appConfig.getPaginationPageSize();

    this.jurisdiction$ = this.store.pipe(select(fromCasesFeature.caselistFilterJurisdiction)) as unknown as Observable<any>;
    this.caseType$ = this.store.pipe(select(fromCasesFeature.caselistFilterCaseType)) as unknown as Observable<any>;
    this.caseState$ = this.store.pipe(select(fromCasesFeature.caselistFilterCaseState)) as unknown as Observable<any>;
    this.metadataFields$ = this.store.pipe(select(fromCasesFeature.caselistFilterMetadataFields)) as unknown as Observable<any>;
    this.filterSubscription = combineLatest([
      this.jurisdiction$,
      this.caseType$,
      this.caseState$,
      this.metadataFields$
    ]).subscribe((result) => this.onFilterSubscriptionHandler(result));

    this.caseFilterToggle$ = this.store.pipe(select(fromCasesFeature.getCaselistFilterToggle)) as unknown as Observable<any>;
    this.caseFilterToggleSubscription = this.caseFilterToggle$.pipe(takeUntil(this.unsubscribe$)).subscribe((result: boolean) => this.onToggleHandler(result));

    this.listenToPaginationMetadata();

    this.resultView$ = this.store.pipe(select(fromCasesFeature.caselistFilterResultView)) as unknown as Observable<any>;
    this.resultSubscription = this.resultView$.subscribe((resultView) =>
      this.onResultsViewHandler(resultView));

    this.triggerQuery();

    this.elasticSearchFlagSubsription = this.featureToggleService.isEnabled('elastic-search').subscribe((value) => this.elasticSearchFlag = value);
    this.userDetails = this.store.pipe(select(fromRoot.getUserDetails)) as unknown as Observable<any>;
    this.pIsCaseShareVisible$ = combineLatest([
      this.userDetails, this.shareableJurisdictions$, this.jurisdiction$
    ]).pipe(mergeMap((project) => {
      this.cd.detectChanges();
      return of(this.caseShareIsVisible(project));
    }));

    this.shareCases$ = this.store.pipe(select(fromCasesFeature.getShareCaseListState)) as unknown as Observable<any>;
    this.shareCases$.pipe(takeUntil(this.unsubscribe$)).subscribe((shareCases) => this.selectedCases = converters.toSearchResultViewItemConverter(shareCases));
    this.getOrganisationDetailsFromStore();
  }

  public listenToPaginationMetadata = () => {
    this.paginationMetadata$ = this.store.pipe(select(fromCasesFeature.getCaselistFilterPaginationMetadata)) as unknown as Observable<any>;
    this.paginationSubscription = this.paginationMetadata$.subscribe((paginationMetadata) =>
      this.onPaginationSubscribeHandler(paginationMetadata));
  };

  public doesIdExist(arr = [], id): boolean {
    return arr.some((element) => element.id === id);
  }

  public setCaseListFilterDefaults = () => {
    this.jurisdictionsBehaviourSubject$.asObservable()
      .subscribe((jurisdictions) => {
        if (jurisdictions.length > 0) {
          this.savedQueryParams = JSON.parse(localStorage.getItem('savedQueryParams'));
          if (this.savedQueryParams && this.savedQueryParams.jurisdiction && !this.doesIdExist(this.jurisdictions, this.savedQueryParams.jurisdiction)) {
            this.windowService.removeLocalStorage('savedQueryParams');
          }
          if (this.savedQueryParams) {
            this.defaults = {
              jurisdiction_id: this.savedQueryParams.jurisdiction,
              case_type_id: this.savedQueryParams['case-type'],
              state_id: null
            };
          } else if (jurisdictions[0] && jurisdictions[0].id && jurisdictions[0].caseTypes[0] && jurisdictions[0].caseTypes[0].states[0]) {
            this.defaults = {
              jurisdiction_id: jurisdictions[0].id,
              case_type_id: jurisdictions[0].caseTypes[0].id,
              state_id: null
            };
          }
        }
      });
  };

  /**
   * result
   * @param result - [
   * { id: 'PROBATE' },
   * { id: 'GrantOfRepresentation' },
   * { id: 'SolAppUpdated' },
   * ['[CASE_REFERENCE]']
   * ]
   */
  public onFilterSubscriptionHandler = (result) => {
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
  };

  public onToggleHandler = (showFilter) => {
    this.showFilter = showFilter;
    this.toggleButtonName = this.getToggleButtonName(this.showFilter);
  };

  public onResultsViewHandler = (resultView) => {
    if (this.elasticSearchFlag) {
      const paginationDataFromResult: PaginationMetadata = {
        totalResultsCount: resultView.total,
        totalPagesCount: Math.ceil(resultView.total / this.appConfig.getPaginationPageSize())
      };
      this.onPaginationSubscribeHandler(paginationDataFromResult);
    }

    if (typeof resultView.results !== 'undefined') {
      this.resultViewIsReady = true;
    }

    this.resultsArr = resultView.results;
    this.resultView = {
      ...resultView,
      columns: resultView.columns ? resultView.columns : [],
      results: resultView.results ? resultView.results.map((item) => {
        return {
          ...item,
          hydrated_case_fields: null
        };
      }) : [],
      hasDrafts: resultView.hasDrafts ? resultView.hasDrafts : () => false
    };
  };

  /**
   * Handles the return of Pagination Metadata.
   *
   * @param paginationMetadata - {totalPagesCount: 33, totalResultsCount: 811}
   */
  public onPaginationSubscribeHandler = (paginationMetadata) => {
    if (typeof paginationMetadata !== 'undefined' && typeof paginationMetadata.totalPagesCount !== 'undefined') {
      this.paginationMetadata.totalPagesCount = paginationMetadata.totalPagesCount;
      this.paginationMetadata.totalResultsCount = paginationMetadata.totalResultsCount;

      const event = this.getEvent();
      if (event !== null && !this.elasticSearchFlag) {
        this.store.dispatch(new fromCasesFeature.ApplyCaselistFilter(event));
      }
    }
  };

  public getEvent() {
    let formGroupFromLS = null;
    let jurisdictionFromLS = null;
    let caseStateGroupFromLS = null;
    let caseTypeGroupFromLS = null;
    this.setCaseListFilterDefaults();
    if (this.selected) {
      formGroupFromLS = this.selected.formGroup ? (this.selected.formGroup.value ? this.selected.formGroup.value : this.selected.formGroup) : null;
      jurisdictionFromLS = { id: this.selected.jurisdiction.id };
      caseTypeGroupFromLS = { id: this.selected.caseType.id };
      caseStateGroupFromLS = { id: this.selected.caseState ? this.selected.caseState.id : null };
    } else if (this.savedQueryParams) {
      this.savedQueryParams = JSON.parse(localStorage.getItem('savedQueryParams'));
      formGroupFromLS = JSON.parse(localStorage.getItem('workbasket-filter-form-group-value'));
      jurisdictionFromLS = { id: this.savedQueryParams.jurisdiction };
      caseTypeGroupFromLS = { id: this.savedQueryParams['case-type'] };
      caseStateGroupFromLS = { id: this.savedQueryParams['case-state'] };
    }

    const metadataFieldsGroupFromLS = ['[CASE_REFERENCE]', '[CREATED_DATE]'];

    if (jurisdictionFromLS && caseTypeGroupFromLS && caseStateGroupFromLS && metadataFieldsGroupFromLS) {
      return this.createEvent(jurisdictionFromLS, caseTypeGroupFromLS, caseStateGroupFromLS, metadataFieldsGroupFromLS,
        formGroupFromLS, this.page, this.sortParameters);
    }

    return null;
  }

  /**
   * createEvent
   *
   * We should think about calling this function makePaginationMetadataQuery as it looks like it's only being used to construct the
   * Case List Pagination Metadata payload?
   */
  public createEvent = (jurisdiction, caseType, caseState, metadataFields, formGroupValues, page, sortParameters) => {
    return {
      selected: {
        jurisdiction,
        caseType,
        caseState,
        metadataFields,
        formGroup: {
          value: formGroupValues ? formGroupValues : {}
        },
        page,
        view: 'WORKBASKET'
      },
      sortParameters
    };
  };

  /**
   * Display the name seen on the toggle button.
   */
  public getToggleButtonName = (showFilter: boolean): string => showFilter ? 'Hide Filter' : 'Show Filter';

  public findCaseListPaginationMetadata(event) {
    if (event !== null) {
      this.store.dispatch(new fromCasesFeature.FindCaselistPaginationMetadata(event));
    }
  }

  public getElasticSearchResults(event) {
    if (event !== null) {
      this.store.dispatch(new fromCasesFeature.ApplyCaselistFilterForES(event));
    }
  }

  /**
   * applyChangePage
   *
   * Change the page number and call findCaseListPaginationMetadata()
   * to dispatch an Action to get the Pagination Metadata for the next page.
   */
  public applyChangePage(event) {
    this.page = event.selected.page;
    this.triggerQuery();
  }

  /**
   * applyFilter
   *
   * Change the page number and call findCaseListPaginationMetadata()
   * to dispatch an Action to get the Pagination Metadata for the filter selection.
   */
  public applyFilter(event) {
    this.page = event.selected.page;
    this.selected = event.selected;
    // EUI-2906. Reset the sort order when changing the filter.
    this.sortParameters = undefined;
    if (this.ccdSearchResult) {
      // EUI-2906. We also need to reset the sort parameters on the SearchResultComponent.
      this.ccdSearchResult.consumerSortParameters = { column: null, order: null, type: null };
    }
    this.triggerQuery();
  }

  public toggleFilter() {
    this.store.dispatch(new fromCasesFeature.CaseFilterToggle(!this.showFilter));
  }

  public caseShareIsVisible(project: any[]): boolean {
    const [userDetails, shareableJurisdictions, jurisdiction] = project;
    if (userDetails && shareableJurisdictions && jurisdiction) {
      return userDetails.canShareCases && shareableJurisdictions.includes(jurisdiction.id);
    }
    return false;
  }

  /**
   * getShareableJurisdictions()
   * Gets shareable Jurisdictions observable
   *
   */
  public getShareableJurisdictions(): Observable<string[]> {
    return this.featureToggleService.getValue('shareable-jurisdictions', []);
  }

  public retrieveSelections(event) {
    this.selectedCases = event;
    this.store.dispatch(new fromCasesFeature.SynchronizeStateToStore(
      converters.toShareCaseConverter(this.selectedCases)
    ));
  }

  public checkIfButtonDisabled(): boolean {
    return this.selectedCases.length === 0;
  }

  public shareCaseSubmit() {
    this.store.dispatch(new fromCasesFeature.AddShareCases({
      sharedCases: converters.toShareCaseConverter(this.selectedCases)
    }));
  }

  public hasResults(): boolean {
    // With the adjusted change detection mechanism, we need to check that
    // we actually have a result view and it has results.
    return this.resultView && (this.resultView.results || []).length > 0;
  }

  public sort(sortParameters) {
    this.sortParameters = {
      ...this.sortParameters,
      column: sortParameters.column,
      order: sortParameters.order,
      type: sortParameters.type
    };
    this.getElasticSearchResults(this.getEvent());
  }

  private triggerQuery() {
    if (!this.elasticSearchFlag) {
      this.findCaseListPaginationMetadata(this.getEvent());
    } else {
      this.getElasticSearchResults(this.getEvent());
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

    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  public getOrganisationDetailsFromStore(): void {
    this.store.dispatch(new fromStore.LoadOrganisation());
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe((response) => {
      this.organisationDetails = response;
      if (this.organisationDetails && this.organisationDetails.organisationIdentifier) {
        sessionStorage.setItem('organisationDetails', JSON.stringify(this.organisationDetails));
      }
    });
  }
}
