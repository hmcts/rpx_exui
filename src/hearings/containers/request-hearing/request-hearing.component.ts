import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ACTION, HearingRequestPageRouteNames } from '../../models/hearings.enum';
import { HearingsService } from '../../services/hearings.service';
import * as fromHearingStore from '../../store';
import { AbstractPageFlow } from '../../utils/abstract-page-flow';
import { HearingsUtils } from '../../utils/hearings.utils';
import { HearingRequestMainModel } from '../../models/hearingRequestMain.model';
import { ServiceHearingValuesModel } from '../../models/serviceHearingValues.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'exui-request-hearing',
  templateUrl: './request-hearing.component.html',
  styleUrls: ['./request-hearing.component.scss']
})
export class RequestHearingComponent implements OnDestroy {
  private readonly reloadMessage = 'The Party IDs for this request appear mismatched, please reload and start the request again.';
  public action = ACTION;
  public caseId: string;
  public hearingStateSub: Subscription;
  public serviceHearingValuesModel: ServiceHearingValuesModel;
  public hearingRequestMainModel: HearingRequestMainModel;
  public showMismatchErrorMessage: boolean;
  public validationErrors: { id: string, message: string };

  constructor(private readonly hearingStore: Store<fromHearingStore.State>,
    private readonly pageFlow: AbstractPageFlow,
    private readonly hearingsService: HearingsService) {
    this.hearingStateSub = this.hearingStore.pipe(select(fromHearingStore.getHearingsFeatureState)).subscribe(
      (hearingState) => {
        this.serviceHearingValuesModel = { ...hearingState.hearingValues.serviceHearingValuesModel };
        this.hearingRequestMainModel = { ...hearingState.hearingRequest.hearingRequestMainModel };
      });
  }

  public onBack(): void {
    this.hearingsService.navigateAction(ACTION.BACK);
  }

  public onContinue(): void {
    this.hearingsService.navigateAction(ACTION.CONTINUE);
  }

  public submitRequest(action: ACTION): void {
    if (action === ACTION.VIEW_EDIT_REASON) {
      this.hearingsService.submitUpdatedRequestClicked = true;
      this.hearingsService.navigateAction(action);
    } else if (action === ACTION.SUBMIT) {
      if (!HearingsUtils.checkHearingPartiesConsistency(this.hearingRequestMainModel, this.serviceHearingValuesModel)) {
        this.showMismatchErrorMessage = true;
        this.validationErrors = { id: 'reload-error-message', message: this.reloadMessage };
      } else {
        this.hearingsService.hearingRequestForSubmitValid = true;
        this.hearingsService.navigateAction(action);
      }
    } else {
      // if we are submitting and awaiting backend process
      this.hearingsService.hearingRequestForSubmitValid = false;
      this.hearingsService.navigateAction(action);
    }
  }

  public buttonDisabled(action: ACTION): boolean {
    if (action === ACTION.VIEW_EDIT_SUBMIT || action === ACTION.SUBMIT) {
      return this.hearingsService.hearingRequestForSubmitValid;
    }
    return false;
  }

  public get isCreateEditSummary(): boolean {
    return this.pageFlow.getCurrentPage() === HearingRequestPageRouteNames.HEARING_CREATE_EDIT_SUMMARY;
  }

  public get isViewEditSummary(): boolean {
    return this.pageFlow.getCurrentPage() === HearingRequestPageRouteNames.HEARING_VIEW_EDIT_SUMMARY;
  }

  public get isViewSummary(): boolean {
    return this.pageFlow.getCurrentPage() === HearingRequestPageRouteNames.HEARING_VIEW_SUMMARY;
  }

  public get isEditSummary(): boolean {
    return this.pageFlow.getCurrentPage() === HearingRequestPageRouteNames.HEARING_EDIT_SUMMARY;
  }

  public get isViewEditReason(): boolean {
    return this.pageFlow.getCurrentPage() === HearingRequestPageRouteNames.HEARING_CHANGE_REASON;
  }

  public get isConfirmationPage(): boolean {
    return this.pageFlow.getCurrentPage() === HearingRequestPageRouteNames.HEARING_CONFIRMATION;
  }

  public get isChildPage(): boolean {
    return !this.isCreateEditSummary &&
      !this.isViewEditSummary &&
      !this.isViewSummary &&
      !this.isEditSummary &&
      !this.isViewEditReason &&
      !this.isConfirmationPage;
  }

  public ngOnDestroy(): void {
    this.hearingStore.dispatch(new fromHearingStore.ResetHearingRequest());
    this.hearingStore.dispatch(new fromHearingStore.ResetHearingValues());
    this.hearingStore.dispatch(new fromHearingStore.ResetHearingConditions());
    this.hearingsService.propertiesUpdatedAutomatically = { pageless: {}, withinPage: {} };
    this.hearingsService.propertiesUpdatedOnPageVisit = null;
  }
}
