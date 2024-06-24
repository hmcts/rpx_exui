import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  HearingLinkedSelectionEnum,
  HearingSummaryEnum,
  Mode
} from '../../../models/hearings.enum';
import {
  HearingDetailModel,
  LinkedHearingGroupMainModel,
  ServiceLinkedCasesModel,
  ServiceLinkedCasesWithHearingsModel
} from '../../../models/linkHearings.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import * as fromHearingStore from '../../../store';
import { ValidatorsUtils } from '../../../utils/validators.utils';

@Component({
  selector: 'exui-linked-hearings-with-case',
  templateUrl: './linked-hearings-with-case.component.html',
  styleUrls: ['./linked-hearings-with-case.component.scss']
})
export class LinkedHearingsWithCaseComponent implements OnInit, OnDestroy {
  public isManageLink: boolean;
  public isHearingsPreSelected: boolean;
  public caseId: string;
  public hearingGroupRequestId: string;
  public hearingId: string;
  public caseName: string;
  public linkedHearingSelectionError: string;
  public errors: { id: string, message: string }[] = [];
  public linkedCases: ServiceLinkedCasesWithHearingsModel[] = [];
  public linkedCasesWithNoAccessToLoggedInUser: ServiceLinkedCasesModel[];
  public linkedHearingGroup: LinkedHearingGroupMainModel;
  public sub: Subscription;
  public linkHearingForm: FormGroup;
  public caseTitle: string;
  public caseReference: string;
  public isHearingsAvailable: boolean;
  public linkedHearingEnum = HearingLinkedSelectionEnum;
  public mode: Mode;
  public showSpinner: boolean = true;
  public hearingStageOptions: LovRefDataModel[];

  public message: string = 'Hearings may be unavailable due to their status, or if they are already linked to another hearing.\nOnly hearings from cases linked to this case will appear in this list.';

  constructor(private readonly hearingStore: Store<fromHearingStore.State>,
              private readonly validators: ValidatorsUtils,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly fb: FormBuilder) {
    this.isManageLink = this.route.snapshot.data.mode === Mode.MANAGE_HEARINGS;
    this.mode = this.route.snapshot.data.mode;
    this.caseId = this.route.snapshot.params.caseId;
    this.hearingGroupRequestId = this.route.snapshot.params.hearingGroupRequestId;
    this.hearingId = this.route.snapshot.params.hearingId;
    this.hearingStageOptions = this.route.snapshot.data.hearingStageOptions;
  }

  public ngOnInit(): void {
    this.sub = this.hearingStore.pipe(select(fromHearingStore.getHearingsFeatureState)).subscribe(
      (state) => {
        this.caseName = state.hearingValues.serviceHearingValuesModel ? state.hearingValues.serviceHearingValuesModel.publicCaseName : '';
        if (state.hearingLinks && state.hearingLinks.serviceLinkedCasesWithHearings) {
          this.isHearingsSelected(state.hearingLinks.serviceLinkedCasesWithHearings);
          this.linkedCases = state.hearingLinks.serviceLinkedCasesWithHearings;
          this.linkedCasesWithNoAccessToLoggedInUser = this.linkedCases &&
            state.hearingLinks.serviceLinkedCases?.filter((linkedCase) => !this.linkedCases.map((x) => x.caseRef).includes(linkedCase.caseReference));
          this.linkedHearingGroup = state.hearingLinks.linkedHearingGroup;
          if (state.hearingLinks.lastError) {
            this.errors.push({ id: 'httpError', message: HearingSummaryEnum.BackendError });
          }
          this.initForm();
          this.getHearingsAvailable();
          this.showSpinner = false;
        }
      }
    );
  }

  public get pageMode(): typeof Mode {
    return Mode;
  }

  public get getCasesFormValue(): FormArray {
    return (this.linkHearingForm.get('linkedCasesWithHearings') as FormArray);
  }

  public isHearingsSelected(linkedCases: ServiceLinkedCasesWithHearingsModel[]) {
    linkedCases.forEach((caseInfo) => {
      if (caseInfo.caseHearings && caseInfo.caseHearings.find((hearingInfo) => hearingInfo.isSelected === true)) {
        this.isHearingsPreSelected = true;
      }
    });
  }

  public get getCasesFormArray(): FormArray {
    if (this.linkedCases && this.linkedCases.length) {
      return this.fb.array(this.linkedCases.map((caseInfo: ServiceLinkedCasesWithHearingsModel) => this.fb.group({
        caseRef: caseInfo.caseRef,
        caseName: caseInfo.caseName,
        reasonsForLink: this.fb.array(caseInfo.reasonsForLink),
        caseHearings: this.getHearingsFormArray(caseInfo.caseHearings)
      })));
    }
    return null;
  }

  public getHearingsFormArray(hearings: HearingDetailModel[]): FormArray {
    return this.fb.array(hearings.map((hearingInfo: HearingDetailModel) => this.fb.group({
      hearingID: hearingInfo.hearingID,
      hearingRequestDateTime: hearingInfo.hearingRequestDateTime,
      hearingType: hearingInfo.hearingType,
      hmcStatus: hearingInfo.hmcStatus,
      lastResponseReceivedDateTime: hearingInfo.lastResponseReceivedDateTime,
      responseVersion: hearingInfo.responseVersion,
      hearingListingStatus: hearingInfo.hearingListingStatus,
      listAssistCaseStatus: hearingInfo.listAssistCaseStatus,
      hearingIsLinkedFlag: hearingInfo.hearingIsLinkedFlag,
      hearingGroupRequestId: hearingInfo.hearingGroupRequestId,
      hearingDaySchedule: hearingInfo.hearingDaySchedule,
      exuiSectionStatus: hearingInfo.exuiSectionStatus,
      exuiDisplayStatus: hearingInfo.exuiDisplayStatus,
      isSelected: this.shouldSelected(hearingInfo)
    })));
  }

  public shouldSelected(hearingInfo): boolean {
    return this.isManageLink ? !!this.linkedHearingGroup.hearingsInGroup
      && this.linkedHearingGroup.hearingsInGroup.some((x) => x.hearingId === hearingInfo.hearingID) : hearingInfo.isSelected;
  }

  public initForm(): void {
    this.linkHearingForm = this.fb.group({
      linkedCasesWithHearings: this.getCasesFormArray
    }, { validator: this.validators.validateLinkedHearings() });
  }

  public getHearingsAvailable() {
    this.linkedCases.forEach((caseInfo) => {
      if (caseInfo.caseRef !== this.caseId && caseInfo.caseHearings?.length > 0) {
        this.isHearingsAvailable = true;
      }
    });
    // No hearings available for linking, do not display the current case
    if (!this.isHearingsAvailable) {
      this.linkedCases = this.linkedCases?.filter((linkedCase) => linkedCase.caseRef !== this.caseId);
    }
  }

  public getHearingsFormValue(casePos: number, hearingPos?: number): FormArray {
    const formArray: FormArray = this.getCasesFormValue.controls[casePos].get('caseHearings') as FormArray;
    if (String(hearingPos && formArray.controls[hearingPos].get('hearingID').value) === this.hearingId) {
      this.updateLinkedCase(casePos, hearingPos);
    }
    return formArray;
  }

  public updateLinkedCase(casePos: number, hearingPos: number) {
    this.clearHearings(casePos);
    this.getHearingsFormValue(casePos).controls[hearingPos].get('isSelected').setValue(true);
  }

  public saveLinkedHearingInfo(): void {
    this.hearingStore.dispatch(new fromHearingStore.LoadServiceLinkedCasesWithHearingsSuccess(this.linkHearingForm.value.linkedCasesWithHearings));
    this.navigate();
  }

  public onUnlinkHearings(): void {
    this.hearingStore.dispatch(new fromHearingStore.ManageLinkedHearingGroup({
      linkedHearingGroup: null,
      caseId: this.caseId,
      hearingGroupRequestId: this.hearingGroupRequestId,
      hearingId: this.hearingId
    }));
  }

  public isGetHearingsSelected(): boolean {
    let isHearingsSelected = false;
    this.linkHearingForm.value.linkedCasesWithHearings.forEach((caseInfo) => {
      if (caseInfo.caseHearings && caseInfo.caseHearings.find((hearingInfo) => hearingInfo.isSelected === true)) {
        isHearingsSelected = true;
      }
    });
    return isHearingsSelected;
  }

  public onSubmit() {
    if (this.isManageLink) {
      if (this.isGetHearingsSelected()) {
        this.saveLinkedHearingInfo();
      } else {
        this.onUnlinkHearings();
      }
    } else {
      this.errors = [];
      this.linkedHearingSelectionError = null;
      if (this.linkHearingForm.valid) {
        this.saveLinkedHearingInfo();
      } else {
        this.linkedHearingSelectionError = this.linkedHearingEnum.ValidSelectionError;
        this.errors.push({ id: 'linked-form', message: this.linkedHearingEnum.ValidSelectionError });
      }
    }
  }

  public clearHearings(casePos: number): void {
    this.linkedCases[casePos].caseHearings.forEach((hearingInfo, pos) => {
      this.getHearingsFormValue(casePos).controls[pos].get('isSelected').setValue(false);
    });
  }

  public isSelectable(hearing: HearingDetailModel): boolean {
    const isLinkable = hearing.hearingIsLinkedFlag && !hearing.hearingGroupRequestId;
    if (this.isManageLink) {
      return this.hearingGroupRequestId === hearing.hearingGroupRequestId || isLinkable;
    }
    return isLinkable;
  }

  public navigate(): void {
    if (this.mode === this.pageMode.MANAGE_HEARINGS) {
      if (this.linkHearingForm.valid) {
        this.router.navigate(['/', 'hearings', 'manage-links', this.caseId, this.hearingGroupRequestId, this.hearingId, 'group-selection']);
      } else {
        this.router.navigate(['/', 'hearings', 'manage-links', this.caseId, this.hearingGroupRequestId, this.hearingId, 'check-your-answers']);
      }
    } else {
      this.router.navigate(['/', 'hearings', 'link', this.caseId, this.hearingId, 'group-selection']);
    }
  }

  public navigateToCaseHearing(caseId: string): void {
    this.router.navigate(['/', 'cases', 'case-details', caseId, 'hearings']);
  }

  public onBack(): void {
    if (this.isManageLink) {
      this.router.navigate(['/', 'hearings', 'manage-links', this.caseId, this.hearingGroupRequestId, this.hearingId]);
    } else {
      this.router.navigate(['/', 'cases', 'case-details', this.caseId, 'hearings']);
    }
  }

  public onCancel(): void {
    this.router.navigate(['/', 'cases', 'case-details', this.caseId, 'hearings']);
  }

  public ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
