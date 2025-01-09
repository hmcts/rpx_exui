import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { ErrorMessage } from '../../../../app/models';
import { ACTION } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-welsh',
  templateUrl: './hearing-welsh.component.html'
})
export class HearingWelshComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public error: ErrorMessage = null;
  public welshForm: FormGroup;
  public hearingInWelshFlag: boolean = false;

  constructor(private readonly formBuilder: FormBuilder,
              protected readonly hearingStore: Store<fromHearingStore.State>,
              protected readonly hearingsService: HearingsService,
              protected readonly featureToggleService: FeatureToggleService) {
    super(hearingStore, hearingsService, featureToggleService);
  }

  public ngOnInit(): void {
    this.hearingInWelshFlag = this.hearingRequestMainModel.hearingDetails ?
      this.hearingRequestMainModel.hearingDetails.hearingInWelshFlag : false;
    this.initForm();
  }

  public ngAfterViewInit(): void {
    this.welshForm.controls.hearingInWelshFlag.setValue(this.hearingInWelshFlag);
  }

  public initForm(): void {
    this.welshForm = this.formBuilder.group({
      hearingInWelshFlag: [false, Validators.required]
    });
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
      this.prepareHearingRequestData();
    }
    super.navigateAction(action);
  }

  public prepareHearingRequestData(): void {
    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        hearingInWelshFlag: this.welshForm.value.hearingInWelshFlag
      }
    };
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }
}
