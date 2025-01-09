import { Component, OnDestroy, OnInit } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { ACTION, Mode } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { HEARING_CREATE_EDIT_SUMMARY_TEMPLATE } from '../../../templates/hearing-create-edit-summary.template';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';
import { Section } from '../../../../hearings/models/section';
import { ScreenNavigationModel } from 'api/hearings/models/screenNavigation.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'exui-hearing-create-edit-summary',
  templateUrl: './hearing-create-edit-summary.component.html'
})
export class HearingCreateEditSummaryComponent extends RequestHearingPageFlow implements OnDestroy, OnInit {
  public template = HEARING_CREATE_EDIT_SUMMARY_TEMPLATE;
  public mode = Mode.CREATE_EDIT;
  public screenFlow: ScreenNavigationModel[] = [];

  constructor(protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly hearingsService: HearingsService,
    protected readonly featureToggleService: FeatureToggleService) {
    super(hearingStore, hearingsService, featureToggleService);
  }

  ngOnInit(): void {
    this.hearingsService.hearingRequestForSubmitValid = false;
    this.removeUnnecessarySummaryTemplateItems();
  }

  public executeAction(action: ACTION): void {
    super.navigateAction(action);
  }

  public getScreenFlowFromStore(): Observable<any> {
    return this.hearingStore;
  }

  public removeUnnecessarySummaryTemplateItems() {
    this.getScreenFlowFromStore().subscribe((storeData: any) => {
      if (storeData && storeData.hearings) {
        this.screenFlow = storeData?.hearings?.hearingValues?.serviceHearingValuesModel?.screenFlow;
        this.template = this.template.filter((tp: Section) => {
          return this.screenFlow.some((sr: ScreenNavigationModel) => {
            return tp.screenName.includes(sr.screenName) || tp.screenName.includes('check-answers');
          });
        });
      }
    });
    return this.template;
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }
}
