import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HearingConditions } from '../../models/hearingConditions';
import { HearingListMainModel } from '../../models/hearingListMain.model';
import { HearingRequestMainModel } from '../../models/hearingRequestMain.model';
import { ACTION } from '../../models/hearings.enum';
import { ServiceHearingValuesModel } from '../../models/serviceHearingValues.model';
import { HearingsService } from '../../services/hearings.service';
import * as fromHearingStore from '../../store';

export abstract class RequestHearingPageFlow {
  public navigationSub: Subscription;
  public hearingStateSub: Subscription;
  public hearingListMainModel: HearingListMainModel;
  public serviceHearingValuesModel: ServiceHearingValuesModel;
  public hearingRequestMainModel: HearingRequestMainModel;
  public hearingRequestToCompareMainModel: HearingRequestMainModel;
  public hearingCondition: HearingConditions;

  public constructor(protected readonly hearingStore: Store<fromHearingStore.State>,
                     protected readonly hearingsService: HearingsService,
                     protected readonly featureToggleService: FeatureToggleService,
                     protected readonly route?: ActivatedRoute) {
    this.navigationSub = this.hearingsService.navigateAction$.subscribe(
      (action: ACTION) => this.executeAction(action)
    );
    this.hearingStateSub = this.hearingStore.pipe(select(fromHearingStore.getHearingsFeatureState)).subscribe(
      (hearingState) => {
        this.hearingListMainModel = hearingState.hearingList.hearingListMainModel;
        this.serviceHearingValuesModel = { ...hearingState.hearingValues.serviceHearingValuesModel };
        this.hearingRequestMainModel = { ...hearingState.hearingRequest.hearingRequestMainModel };
        this.hearingRequestToCompareMainModel = { ...hearingState.hearingRequestToCompare.hearingRequestMainModel };
        this.hearingCondition = hearingState.hearingConditions;
      });
  }

  public fragmentFocus(): void {
    this.route.fragment.subscribe((frag) => {
      const element = document.getElementById(frag);
      if (element) {
        element.scrollIntoView();
        element.focus();
      }
    });
  }

  public navigateAction(action: ACTION): void {
    switch (action) {
      case ACTION.BACK:
        this.hearingStore.dispatch(new fromHearingStore.NavigateBackHearingRequest());
        break;
      case ACTION.CONTINUE:
        this.hearingStore.dispatch(new fromHearingStore.UpdateHearingRequest(this.hearingRequestMainModel, this.hearingCondition));
        break;
      case ACTION.SUBMIT:
        this.hearingStore.dispatch(new fromHearingStore.SubmitHearingRequest(this.hearingRequestMainModel));
        break;
      case ACTION.VIEW_EDIT_REASON:
        this.hearingStore.dispatch(new fromHearingStore.ViewEditSubmitHearingReason(this.hearingRequestMainModel));
        break;
      case ACTION.VIEW_EDIT_SUBMIT:
        this.hearingStore.dispatch(new fromHearingStore.ViewEditSubmitHearingRequest(this.hearingRequestMainModel));
        break;
      default:
        throw new Error('Invalid navigate action');
    }
  }

  public unsubscribe(): void {
    this.navigationSub?.unsubscribe();
    this.hearingStateSub?.unsubscribe();
  }

  protected abstract executeAction(action: ACTION): void;
}
