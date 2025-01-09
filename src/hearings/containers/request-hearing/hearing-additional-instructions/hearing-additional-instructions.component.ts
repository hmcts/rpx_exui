import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { ACTION, HearingInstructionsEnum } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-additional-instructions',
  templateUrl: './hearing-additional-instructions.component.html'
})
export class HearingAdditionalInstructionsComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public instructionsForm: FormGroup;
  public instructionLength: number = HearingInstructionsEnum.InstructionLength;

  constructor(private readonly formBuilder: FormBuilder,
              protected readonly hearingStore: Store<fromHearingStore.State>,
              protected readonly hearingsService: HearingsService,
              protected readonly featureToggleService: FeatureToggleService,
              protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.instructionsForm = this.formBuilder.group({
      instructions: [this.hearingRequestMainModel.hearingDetails.listingComments]
    });
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
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
        listingComments: this.santiseHTML(this.instructionsForm.value.instructions),
        autolistFlag: this.getAutoListFlag(),
        listingAutoChangeReasonCode: this.getListingAutoChangeReasonCode()
      }
    };
  }

  public santiseHTML(string: string) {
    const tempDivElement = document.createElement('div');
    tempDivElement.innerHTML = string;
    return tempDivElement.textContent || tempDivElement.innerText || '';
  }

  public getAutoListFlag(): boolean {
    return this.instructionsForm.value.instructions ? false : this.serviceHearingValuesModel.autoListFlag;
  }

  public getListingAutoChangeReasonCode(): string {
    return this.instructionsForm.value.instructions ? 'user-added-comments' : null;
  }

  public isFormValid(): boolean {
    return this.instructionsForm.valid;
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }
}
