import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HearingLinksStateData } from '../../../models/hearingLinksStateData.model';
import { ACTION, HearingLinkMessages } from '../../../models/hearings.enum';
import { ServiceLinkedCasesModel } from '../../../models/linkHearings.model';
import { LovRefDataByServiceModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-link',
  templateUrl: './hearing-link.component.html'
})
export class HearingLinkComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  private caseLinkingReasons: LovRefDataByServiceModel;
  public caseId: string;
  public linkedCases: ServiceLinkedCasesModel[];
  public hearingLinkForm: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];
  public caseName: string;
  public showSpinner: boolean = true;
  public hearingLinksSub: Subscription;

  constructor(private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              protected readonly hearingStore: Store<fromHearingStore.State>,
              protected readonly hearingsService: HearingsService,
              protected readonly featureToggleService: FeatureToggleService,
              protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
    this.caseId = this.hearingListMainModel.caseRef || '';
    this.caseName = this.serviceHearingValuesModel.hmctsInternalCaseName || '';
  }

  public ngOnInit(): void {
    this.hearingLinkForm = this.formBuilder.group({
      hearingLink: ['', Validators.required]
    });
    this.initialiseFromHearingValues();
    this.hearingStore.dispatch(new fromHearingStore.LoadServiceLinkedCases({
      caseReference: this.caseId,
      hearingId: ''
    }));
    this.generateLinkedCasesWithReasonDescription();
  }

  public generateLinkedCasesWithReasonDescription(): void {
    this.hearingLinksSub = this.hearingsService.loadCaseLinkingReasonCodes().pipe(
      switchMap((reasons) => {
        this.caseLinkingReasons = reasons;
        return this.hearingStore.pipe(select(fromHearingStore.getHearingLinks));
      })
    ).subscribe({
      next: (hearingLinks: HearingLinksStateData) => {
        if (hearingLinks.serviceLinkedCases) {
          this.linkedCases = [];
          hearingLinks.serviceLinkedCases.forEach((linkedCase) => {
            const caseLinkingReasons = this.caseLinkingReasons.list_of_values.filter((reason) => linkedCase.reasonsForLink.some((reasonCode) => reason.key === reasonCode));
            const caseLinkingReasonsValues = caseLinkingReasons.map((x) => x.value_en);
            if (caseLinkingReasonsValues && caseLinkingReasonsValues.length > 0) {
              this.linkedCases.push({ caseName: linkedCase.caseName, caseReference: linkedCase.caseReference, reasonsForLink: caseLinkingReasonsValues });
            } else {
              this.linkedCases.push(linkedCase);
            }
          });
        }
        this.showSpinner = false;
      },
      error: () => this.router.navigate(['/hearings/error'])
    });
  }

  public initialiseFromHearingValues(): void {
    const hearingLinkDefaultValue = this.hearingRequestMainModel.hearingDetails.hearingIsLinkedFlag ? 'yes' : 'no';
    this.hearingLinkForm.get('hearingLink').setValue(hearingLinkDefaultValue);
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
      if (this.isFormValid()) {
        this.hearingRequestMainModel = {
          ...this.hearingRequestMainModel,
          hearingDetails: {
            ...this.hearingRequestMainModel.hearingDetails,
            hearingIsLinkedFlag: this.hearingLinkForm.get('hearingLink').value === 'yes'
          }
        };
        super.navigateAction(action);
      }
    } else if (action === ACTION.BACK) {
      super.navigateAction(action);
    }
  }

  public isFormValid(): boolean {
    this.validationErrors = [];
    if (!this.hearingLinkForm.controls.hearingLink.valid) {
      this.validationErrors.push({
        id: 'yes',
        message: HearingLinkMessages.SELECT_HEARING_LINK_OPTION
      });
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  }

  public onHearingLink(value: string): void {
    this.hearingLinkForm.get('hearingLink').setValue(value);
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
    if (this.hearingLinksSub) {
      this.hearingLinksSub.unsubscribe();
    }
  }
}
