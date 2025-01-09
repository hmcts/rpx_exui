import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import * as fromHearingStore from '../../../../hearings/store';
import { ACTION, HearingStageEnum } from '../../../models/hearings.enum';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-stage',
  templateUrl: './hearing-stage.component.html'
})
export class HearingStageComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public hearingStageOptions: LovRefDataModel[];
  public stageForm: FormGroup;
  public hearingType: string;
  public hearingStageSelectionError: string;
  public validationErrors: { id: string, message: string }[] = [];

  constructor(private readonly fb: FormBuilder,
              protected readonly hearingStore: Store<fromHearingStore.State>,
              protected readonly hearingsService: HearingsService,
              protected readonly featureToggleService: FeatureToggleService,
              protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
  }

  public ngOnInit() {
    this.hearingType = this.hearingRequestMainModel.hearingDetails ?
      this.hearingRequestMainModel.hearingDetails.hearingType : this.hearingType;
    this.hearingStageOptions = this.route.snapshot.data.hearingStages;
    this.stageForm = this.fb.group({
      'stage-option': ['', Validators.required]
    });
    this.stageForm.controls['stage-option'].setValue(this.hearingType);
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
      this.checkFormData();
      if (this.isFormValid()) {
        this.prepareHearingRequestData();
        super.navigateAction(action);
      }
    } else if (action === ACTION.BACK) {
      super.navigateAction(action);
    }
  }

  public prepareHearingRequestData(): void {
    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        hearingType: this.stageForm.value['stage-option']
      }
    };
  }

  public isFormValid(): boolean {
    return this.stageForm.valid;
  }

  public checkFormData(): void {
    this.hearingStageSelectionError = null;
    this.validationErrors = [];
    if (!this.stageForm.valid) {
      this.hearingStageSelectionError = HearingStageEnum.SelectHearingStageError;
      this.validationErrors.push({
        id: this.hearingStageOptions[0].key,
        message: HearingStageEnum.SelectHearingStageError
      });
    }
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }
}
