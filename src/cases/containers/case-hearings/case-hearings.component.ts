import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRole } from '../../../app/models';
import * as fromAppStore from '../../../app/store';
import { HearingConditions } from '../../../hearings/models/hearingConditions';
import { HearingListModel } from '../../../hearings/models/hearingList.model';
import { HearingListViewModel } from '../../../hearings/models/hearingListView.model';
import {
  Actions,
  EXUIDisplayStatusEnum,
  EXUISectionStatusEnum,
  HearingCategory,
  HearingSummaryEnum,
  Mode
} from '../../../hearings/models/hearings.enum';
import { LovRefDataModel } from '../../../hearings/models/lovRefData.model';
import { LovRefDataService } from '../../../hearings/services/lov-ref-data.service';
import * as fromHearingStore from '../../../hearings/store';
import { SessionStorageService } from '../../../app/services';

@Component({
  selector: 'exui-case-hearings',
  templateUrl: './case-hearings.component.html',
  styleUrls: ['./case-hearings.component.scss']
})
export class CaseHearingsComponent implements OnInit, OnDestroy {
  public hearingTypesRefData$: Observable<LovRefDataModel[]>;
  public upcomingHearings$: Observable<HearingListViewModel[]>;
  public upcomingStatus: EXUISectionStatusEnum = EXUISectionStatusEnum.UPCOMING;

  public pastAndCancelledHearings$: Observable<HearingListViewModel[]>;
  public pastAndCancelledStatus: EXUISectionStatusEnum = EXUISectionStatusEnum.PAST_OR_CANCELLED;

  public listedHearings$: Observable<HearingListViewModel[]>;

  public hearingState$: Observable<fromHearingStore.State>;
  public hearingsActions: Actions[];
  public hearingListLastErrorState$: Observable<fromHearingStore.State>;
  public hearingValuesLastErrorState$: Observable<fromHearingStore.State>;
  public lastErrorSubscription: Subscription;
  public hasRequestAction: boolean = false;
  public caseId: string = '';
  public serverError: { id: string, message: string } = null;
  public isOgdRole: boolean;
  public showSpinner$: Observable<boolean>;
  public hearingStageOptions: LovRefDataModel[];
  public hearingValuesSubscription: Subscription;
  public refDataSubscription: Subscription;
  private userRoles: string[] = [];

  constructor(private readonly appStore: Store<fromAppStore.State>,
    private readonly hearingStore: Store<fromHearingStore.State>,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly lovRefDataService: LovRefDataService,
    private readonly loadingService: LoadingService,
    private readonly sessionSvc: SessionStorageService) {
    this.caseId = this.activatedRoute.snapshot.params.cid;
    this.hearingStore.dispatch(new fromHearingStore.LoadAllHearings(this.caseId));
    this.hearingListLastErrorState$ = this.hearingStore.pipe(select(fromHearingStore.getHearingListLastError));
    this.hearingValuesLastErrorState$ = this.hearingStore.pipe(select(fromHearingStore.getHearingValuesLastError));
  }

  public reloadHearings() {
    this.hearingStore.dispatch(new fromHearingStore.LoadAllHearings(this.caseId));
    this.hearingStore.dispatch(new fromHearingStore.LoadHearingValues(this.caseId));
  }

  public ngOnInit(): void {
    this.showSpinner$ = this.loadingService.isLoading as any;
    const loadingToken = this.loadingService.register();
    this.hearingStore.dispatch(new fromHearingStore.LoadHearingValues(this.caseId));
    this.hearingValuesSubscription = this.hearingStore.pipe(select(fromHearingStore.getHearingValuesModel)).subscribe((serviceHearingValuesModel) => {
      if (serviceHearingValuesModel && serviceHearingValuesModel.hmctsServiceID) {
        this.refDataSubscription = this.lovRefDataService.getListOfValues(HearingCategory.HearingType, serviceHearingValuesModel.hmctsServiceID, false).subscribe((hearingStageOptions) => {
          this.hearingStageOptions = hearingStageOptions;
        });
      }
    });
    this.lastErrorSubscription = combineLatest([
      this.hearingListLastErrorState$,
      this.hearingValuesLastErrorState$
    ]).subscribe(([hearingListlastError, hearingValuesLastError]: [fromHearingStore.State, fromHearingStore.State]) => {
      if (hearingListlastError || hearingValuesLastError) {
        this.serverError = {
          id: 'backendError', message: HearingSummaryEnum.BackendError
        };
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      } else {
        // Reset the error context if there is no error on subsequent requests
        this.serverError = null;
        this.loadingService.unregister(loadingToken);
      }
    }, () => {
      this.loadingService.unregister(loadingToken);
    });
    this.upcomingHearings$ = this.getHearingListByStatus(EXUISectionStatusEnum.UPCOMING);
    this.pastAndCancelledHearings$ = this.getHearingListByStatus(EXUISectionStatusEnum.PAST_OR_CANCELLED);
    this.listedHearings$ = this.getHearingListByStatus(EXUIDisplayStatusEnum.LISTED);
    this.userRoles = [];
    const detailsStr = this.sessionSvc.getItem('userDetails');
    if (detailsStr) {
      const details = JSON.parse(detailsStr) as object;
      if (details && details.hasOwnProperty('roles')) {
        this.userRoles = details['roles'] as string[]; // eslint-disable-line dot-notation
      }
    }
    this.isOgdRole = false;
    if (this.userRoles && this.userRoles.includes(UserRole.HearingManager)) {
      this.hearingsActions = [Actions.READ, Actions.CREATE, Actions.UPDATE, Actions.DELETE];
      this.hasRequestAction = true;
    } else if (this.userRoles.includes(UserRole.HearingViewer)) {
      this.hearingsActions = [Actions.READ];
    } else if (this.userRoles.includes(UserRole.ListedHearingViewer)) {
      this.hearingsActions = [Actions.READ];
      this.isOgdRole = true;
    } else {
      this.hearingsActions = [];
    }
  }

  public getHearingListByStatus(status: EXUISectionStatusEnum | EXUIDisplayStatusEnum): Observable<HearingListViewModel[]> {
    return this.hearingStore.pipe(select(fromHearingStore.getHearingList)).pipe(
      map((hearingListStateData) => {
        if (hearingListStateData && hearingListStateData.hearingListMainModel && hearingListStateData.hearingListMainModel.caseHearings) {
          let caseHearingModels: HearingListModel[] = [];
          if (Object.values(EXUISectionStatusEnum).includes(status as EXUISectionStatusEnum)) {
            caseHearingModels = hearingListStateData.hearingListMainModel.caseHearings.filter((hearing) =>
              hearing.exuiSectionStatus === status
            );
          }
          if (Object.values(EXUIDisplayStatusEnum).includes(status as EXUIDisplayStatusEnum)) {
            caseHearingModels = hearingListStateData.hearingListMainModel.caseHearings.filter((hearing) =>
              hearing.exuiDisplayStatus === status
            );
          }
          const caseHearingViewModels: HearingListViewModel[] = this.calculateEarliestHearingDate(caseHearingModels);
          return this.sortHearingsByHearingAndRequestDate(caseHearingViewModels);
        }
        return [];
      }
      )
    );
  }

  public calculateEarliestHearingDate(hearings: HearingListModel[]): HearingListViewModel[] {
    const viewModels: HearingListViewModel[] = [];
    hearings.forEach((hearing) => {
      const viewModel = {} as HearingListViewModel;
      viewModel.earliestHearingStartDateTime = null;
      Object.keys(hearing).forEach((key) => viewModel[key] = hearing[key]);
      if (hearing.hearingDaySchedule && hearing.hearingDaySchedule.length) {
        const moments = hearing.hearingDaySchedule.map((d) => d.hearingStartDateTime !== null && moment(d.hearingStartDateTime));
        if (moments.length > 1 || (moments.length === 1 && moments[0])) {
          viewModel.earliestHearingStartDateTime = moment.min(moments).toString();
        }
      }
      viewModels.push(viewModel);
    });
    return viewModels;
  }

  public sortHearingsByHearingAndRequestDate(arrayToBeSorted: HearingListViewModel[]): HearingListViewModel[] {
    return arrayToBeSorted.sort((a, b) => {
      if (a.earliestHearingStartDateTime === b.earliestHearingStartDateTime) {
        return new Date(a.hearingRequestDateTime) > new Date(b.hearingRequestDateTime) ? -1 : 1;
      } else if (a.earliestHearingStartDateTime === null) {
        return -1;
      } else if (b.earliestHearingStartDateTime === null) {
        return 1;
      }
      return new Date(a.earliestHearingStartDateTime) > new Date(b.earliestHearingStartDateTime) ? -1 : 1;
    }
    );
  }

  public createHearingRequest(): void {
    const hearingCondition: HearingConditions = {
      mode: Mode.CREATE,
      isInit: true,
      caseId: this.caseId
    };
    this.hearingStore.dispatch(new fromHearingStore.SaveHearingConditions(hearingCondition));
    this.router.navigate(['/', 'hearings', 'request']);
  }

  public ngOnDestroy(): void {
    if (this.lastErrorSubscription) {
      this.lastErrorSubscription.unsubscribe();
    }
    if (this.hearingValuesSubscription) {
      this.hearingValuesSubscription.unsubscribe();
    }
    if (this.refDataSubscription) {
      this.refDataSubscription.unsubscribe();
    }
  }
}
