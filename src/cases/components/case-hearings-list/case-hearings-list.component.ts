import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../app/app.constants';
import { HearingConditions } from '../../../hearings/models/hearingConditions';
import { HearingListViewModel } from '../../../hearings/models/hearingListView.model';
import { Actions, EXUIDisplayStatusEnum, EXUISectionStatusEnum, Mode } from '../../../hearings/models/hearings.enum';
import { LovRefDataModel } from '../../../hearings/models/lovRefData.model';
import { HearingsFeatureService } from '../../../hearings/services/hearings-feature.service';
import { HearingsService } from '../../../hearings/services/hearings.service';
import * as fromHearingStore from '../../../hearings/store';

@Component({
  selector: 'exui-case-hearings-list',
  templateUrl: './case-hearings-list.component.html',
  styleUrls: ['./case-hearings-list.component.scss']
})

export class CaseHearingsListComponent implements OnInit {
  @Input()
  public status: EXUISectionStatusEnum;

  @Input()
  public hearingStageOptions: LovRefDataModel[];

  @Input()
  public hearingList$: Observable<HearingListViewModel[]>;

  @Input()
  public actions: Actions[];

  public caseId: string;
  public hasUpdateAction: boolean = false;
  public hasDeleteAction: boolean = false;
  public hasReadOnlyAction: boolean = false;
  public isHearingAmendmentsEnabled = false;

  constructor(private readonly hearingStore: Store<fromHearingStore.State>,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly hearingsFeatureService: HearingsFeatureService,
    private readonly hearingsService: HearingsService) {
    this.caseId = this.activatedRoute.snapshot.params.cid;
  }

  public ngOnInit(): void {
    if (this.status === EXUISectionStatusEnum.PAST_OR_CANCELLED) {
      this.hasReadOnlyAction = true;
    }
    if (this.status === EXUISectionStatusEnum.UPCOMING) {
      if (this.actions.includes(Actions.UPDATE)) {
        this.hasUpdateAction = true;
      }
      if (this.actions.includes(Actions.DELETE)) {
        this.hasDeleteAction = true;
      }
      if (this.actions.length === 1 && this.actions.includes(Actions.READ)) {
        this.hasReadOnlyAction = true;
      }
    }

    const isHearingAmendmentsEnabled$ = this.hearingsFeatureService.isFeatureEnabled(AppConstants.FEATURE_NAMES.enableHearingAmendments);
    isHearingAmendmentsEnabled$.subscribe((enabled) => {
      this.isHearingAmendmentsEnabled = enabled;
    });
  }

  public isAwaitingActual(exuiDisplayStatus: EXUIDisplayStatusEnum): boolean {
    return exuiDisplayStatus === EXUIDisplayStatusEnum.AWAITING_ACTUALS;
  }

  public isNonCancellable(exuiDisplayStatus: EXUIDisplayStatusEnum): boolean {
    return exuiDisplayStatus === EXUIDisplayStatusEnum.CANCELLATION_REQUESTED
      || exuiDisplayStatus === EXUIDisplayStatusEnum.FAILURE;
  }

  public isManageLinksEnabled(hearingGroupRequestId: string): boolean {
    return !!hearingGroupRequestId;
  }

  public isLinkableStatus(exuiDisplayStatus: EXUIDisplayStatusEnum) {
    return exuiDisplayStatus === EXUIDisplayStatusEnum.AWAITING_LISTING
      || exuiDisplayStatus === EXUIDisplayStatusEnum.UPDATE_REQUESTED
      || exuiDisplayStatus === EXUIDisplayStatusEnum.LISTED;
  }

  public addAndEdit(hearingID: string): void {
    this.router.navigate(['/', 'hearings', 'actuals', hearingID, 'hearing-actual-add-edit-summary']);
  }

  public cancelHearing(hearingID: string): void {
    this.router.navigate(['/', 'hearings', 'cancel', hearingID]);
  }

  public linkHearing(hearingID: string): void {
    this.router.navigate(['/', 'hearings', 'link', this.caseId, hearingID]);
  }

  public manageLinks(hearing: HearingListViewModel): void {
    this.hearingStore.dispatch(new fromHearingStore.LoadServiceLinkedCases({
      caseReference: this.caseId,
      hearingId: hearing.hearingID
    }));
    this.hearingStore.dispatch(new fromHearingStore.LoadLinkedHearingGroup({ groupId: hearing.hearingGroupRequestId }));
    this.router.navigate(['/', 'hearings', 'manage-links', this.caseId, hearing.hearingGroupRequestId, hearing.hearingID]);
  }

  public viewAndEdit(hearingID: string): void {
    const hearingCondition: HearingConditions = {
      mode: Mode.VIEW_EDIT,
      isHearingAmendmentsEnabled: this.isHearingAmendmentsEnabled
    };
    // Clear the in-memory objects for hearing amendments
    this.hearingsService.propertiesUpdatedAutomatically = { pageless: {}, withinPage: {} };
    this.hearingsService.propertiesUpdatedOnPageVisit = null;
    // Save hearing conditions
    this.hearingStore.dispatch(new fromHearingStore.SaveHearingConditions(hearingCondition));
    // If hearing amendments enabled in Launch Darkly, then load the Service Hearing Values to get the latest
    if (this.isHearingAmendmentsEnabled) {
      this.hearingStore.dispatch(new fromHearingStore.LoadHearingValues(this.caseId));
    }
    // Set the navigation url based on the hearing amendments enabled Launch Darkly setting
    const url = this.isHearingAmendmentsEnabled ? '/hearings/request/hearing-view-summary' : '/hearings/request/hearing-view-edit-summary';
    // Load hearing request and navigate
    this.loadHearingRequestAndRedirect(hearingID, url);
  }

  public viewDetails(hearing: HearingListViewModel): void {
    switch (hearing.exuiDisplayStatus) {
      case EXUIDisplayStatusEnum.AWAITING_LISTING:
      case EXUIDisplayStatusEnum.UPDATE_REQUESTED:
      case EXUIDisplayStatusEnum.LISTED:
        this.loadHearingRequestAndRedirect(hearing.hearingID, '/hearings/view/hearing-view-summary');
        break;
      case EXUIDisplayStatusEnum.CANCELLATION_REQUESTED:
        this.loadHearingRequestAndRedirect(hearing.hearingID, '/hearings/view/hearing-cancellation-summary');
        break;
      case EXUIDisplayStatusEnum.CANCELLED:
        this.loadHearingRequestAndRedirect(hearing.hearingID, `/hearings/view/hearing-cancelled-summary/${hearing.hearingID}`);
        break;
      case EXUIDisplayStatusEnum.COMPLETED:
        this.loadHearingRequestAndRedirect(hearing.hearingID, `/hearings/view/hearing-completed-summary/${hearing.hearingID}`);
        break;
      case EXUIDisplayStatusEnum.ADJOURNED:
        this.loadHearingRequestAndRedirect(hearing.hearingID, `/hearings/view/hearing-adjourned-summary/${hearing.hearingID}`);
        break;
      case EXUIDisplayStatusEnum.AWAITING_ACTUALS:
        this.loadHearingRequestAndRedirect(hearing.hearingID, `/hearings/view/hearing-view-actuals-summary/${hearing.hearingID}`);
        break;
      case EXUIDisplayStatusEnum.FAILURE:
        this.loadHearingRequestAndRedirect(hearing.hearingID, `/hearings/view/hearing-request-failed-summary/${hearing.hearingID}`);
        break;
      default:
        this.router.navigate(['/', 'hearings', 'view']);
        break;
    }
  }

  public loadHearingRequestAndRedirect(hearingID: string, targetURL: string) {
    this.hearingStore.dispatch(new fromHearingStore.LoadHearingRequest({ hearingID, targetURL }));
  }
}
