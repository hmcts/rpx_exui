import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HearingLinksStateData } from '../../../models/hearingLinksStateData.model';
import { GroupLinkType, Mode } from '../../../models/hearings.enum';
import {
  GroupDetailsModel,
  HearingDetailModel,
  LinkedHearingGroupMainModel,
  LinkedHearingsDetailModel,
  ServiceLinkedCasesWithHearingsModel
} from '../../../models/linkHearings.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { ValidatorsUtils } from '../../../utils/validators.utils';

@Component({
  selector: 'exui-linked-hearings-how-to-heard',
  templateUrl: './linked-hearings-how-to-heard.component.html',
  styleUrls: ['./linked-hearings-how-to-heard.component.scss']
})
export class HowLinkedHearingsBeHeardComponent implements OnInit, OnDestroy {
  public caseId: string;
  public hearingGroupRequestId: string;
  public hearingId: string;
  public caseName: string;
  public receivedCases: ServiceLinkedCasesWithHearingsModel[];
  public selectedLinkedCases: ServiceLinkedCasesWithHearingsModel[];
  public linkedHearingGroup: LinkedHearingGroupMainModel;
  public validationErrors: { id: string; message: string }[] = [];
  public positionDropdownValues = [];
  public selectedOption: GroupLinkType;
  public selectionValid: boolean = true;
  public form: FormGroup;
  public mode: Mode = Mode.LINK_HEARINGS;
  public hearingLinks: HearingLinksStateData;
  public sub: Subscription;
  public hearingsInGroup: LinkedHearingsDetailModel[];
  public groupDetails: GroupDetailsModel;
  public groupLinkType = GroupLinkType;
  public hearingStageOptions: LovRefDataModel[];

  constructor(
    protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly hearingsService: HearingsService,
    protected readonly route: ActivatedRoute,
    private readonly validators: ValidatorsUtils,
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {
    this.mode = this.route.snapshot.data.mode || Mode.LINK_HEARINGS;
    this.form = this.fb.group({
      hearingGroup: ['', Validators.required],
      hearingOrder: this.fb.array([])
    });
    this.sub = this.hearingStore.pipe(select(fromHearingStore.getHearingsFeatureState)).subscribe(
      (state) => {
        this.receivedCases = state.hearingLinks && state.hearingLinks.serviceLinkedCasesWithHearings;
        this.caseName = state?.hearingValues?.serviceHearingValuesModel ? state.hearingValues.serviceHearingValuesModel.hmctsInternalCaseName : '';
        this.hearingsInGroup = state.hearingLinks && state.hearingLinks.linkedHearingGroup && state.hearingLinks.linkedHearingGroup.hearingsInGroup;
        this.groupDetails = state.hearingLinks && state.hearingLinks.linkedHearingGroup && state.hearingLinks.linkedHearingGroup.groupDetails;
        this.hearingLinks = state.hearingLinks;
        this.selectedOption = this.groupDetails && this.groupDetails.groupLinkType;
        this.form = this.fb.group({
          hearingGroup: [this.groupDetails && this.groupDetails.groupLinkType || '', Validators.required],
          hearingOrder: this.fb.array([])
        });
      }
    );
    this.caseId = this.route.snapshot.params.caseId;
    this.hearingGroupRequestId = this.route.snapshot.params.hearingGroupRequestId;
    this.hearingId = this.route.snapshot.params.hearingId;
    this.hearingStageOptions = this.route.snapshot.data.hearingStageOptions;
  }

  public get hearingOrder(): FormArray {
    return this.form.get('hearingOrder') as FormArray;
  }

  private addRow(linkCase: ServiceLinkedCasesWithHearingsModel): void {
    if (!linkCase || !linkCase.caseHearings) {
      return;
    }

    this.hearingOrder.push(this.fb.group({
      caseReference: [linkCase.caseRef],
      caseName: [linkCase.caseName],
      hearingStage: [linkCase.caseHearings[0] && linkCase.caseHearings[0].hearingType || ''],
      position: [this.getPosition(linkCase.caseHearings[0]), this.validators.mandatory('')]
    }));
  }

  public getPosition(hearing: HearingDetailModel): number {
    const linkedHearings: LinkedHearingsDetailModel[] = this.hearingsInGroup && this.hearingsInGroup.filter((x) => x.hearingId === hearing.hearingID);
    if (linkedHearings && linkedHearings.length > 0) {
      return linkedHearings[0].hearingOrder;
    }
    return null;
  }

  public ngOnInit(): void {
    this.selectedLinkedCases = [];
    this.receivedCases.forEach((linkedCase) => {
      this.mapLinkedCase(linkedCase);
    });
    this.initiateFormCreation();
  }

  private initiateFormCreation() {
    if (this.selectedLinkedCases && this.selectedLinkedCases.length) {
      this.positionDropdownValues = Array.from({ length: this.selectedLinkedCases.length }, (_, i) => i + 1);
      this.createForm();
    }
  }

  private mapLinkedCase(linkedCase: ServiceLinkedCasesWithHearingsModel): void {
    const selectedHearings = linkedCase.caseHearings && linkedCase.caseHearings.filter((hearing) => hearing.isSelected);
    if (selectedHearings && selectedHearings.length) {
      this.selectedLinkedCases.push({
        ...linkedCase,
        caseHearings: selectedHearings
      });
    }
  }

  private createForm(): void {
    this.selectedLinkedCases.forEach((linked) => {
      this.addRow(linked);
    });
  }

  public onSubmit(): void {
    const linkedHearingGroupMainModel: LinkedHearingGroupMainModel = {
      groupDetails: {
        groupLinkType: this.selectedOption
      }, hearingsInGroup: []
    };
    if (this.isFormValid()) {
      this.hearingOrder.value.forEach((formValue) => {
        const hearing = this.selectedLinkedCases.find((linked) => linked.caseRef === formValue.caseReference);
        const selectedHearing = hearing && hearing.caseHearings.find((selected) => selected.isSelected);
        if (selectedHearing) {
          if (this.form.value.hearingGroup === GroupLinkType.SAME_SLOT) {
            linkedHearingGroupMainModel.hearingsInGroup.push({
              hearingId: selectedHearing.hearingID
            });
          } else {
            linkedHearingGroupMainModel.hearingsInGroup.push({
              hearingId: selectedHearing.hearingID,
              hearingOrder: Number(formValue.position)
            });
          }
        }
      });
      this.hearingStore.dispatch(new fromHearingStore.LoadServiceLinkedCasesGroupDetail(linkedHearingGroupMainModel));
      if (this.mode === Mode.MANAGE_HEARINGS) {
        this.router.navigate(['/', 'hearings', 'manage-links', this.caseId, this.hearingGroupRequestId, this.hearingId, 'check-your-answers']);
      } else {
        this.router.navigate(['/', 'hearings', 'link', this.caseId, this.hearingId, 'check-your-answers']);
      }
    }
  }

  public onOrderChange(index: number) {
    const positionSelected = this.hearingOrder.controls[index].get('position').value;
    const hasSamePosSelectedIndex = this.hearingOrder.value.map((val, rowIndex) => val.position === positionSelected && rowIndex !== index);
    hasSamePosSelectedIndex.forEach((val, idx: number) => val && this.hearingOrder.controls[idx].patchValue({ position: '' }));
  }

  public hasPosToBePreSelected(index: number) {
    return this.hearingOrder.controls[index].get('position') && this.hearingOrder.controls[index].get('position').value;
  }

  public hasGroupSelected(groupSelected) {
    return this.form.value.hearingGroup === groupSelected;
  }

  public isFormValid(): boolean {
    this.validationErrors = [];
    if (this.form.value.hearingGroup === GroupLinkType.SAME_SLOT) {
      return true;
    }

    const validSelection = this.hearingOrder.valid && this.form.valid;
    if (!validSelection) {
      this.validationErrors.push({
        id: 'selection-error',
        message: !this.form.value.hearingGroup ? 'Please make a selection' : 'Check the position you have given to each hearing'
      });
      return false;
    }

    return true;
  }

  public highlightRowError(index: number, error: string, formSubmitted: boolean): boolean {
    const controls = (this.hearingOrder.controls[index] as FormGroup).controls;
    return formSubmitted && controls[error].invalid;
  }

  public hasEmptyGroupSelection() {
    return this.validationErrors.length > 0 && this.selectedOption === null;
  }

  public hasInvalidOrderSelection() {
    return this.validationErrors.length > 0 && this.selectedOption !== null && this.selectedLinkedCases && this.selectedLinkedCases.length;
  }

  public onOptionSelection(value: GroupLinkType): void {
    this.validationErrors = [];
    this.selectedOption = value;
  }

  public onBack(): void {
    if (this.mode === Mode.MANAGE_HEARINGS) {
      this.router.navigate(['/', 'hearings', 'manage-links', this.caseId, this.hearingGroupRequestId, this.hearingId, 'selected-hearings']);
    } else {
      this.router.navigate(['/', 'hearings', 'link', this.caseId, this.hearingId]);
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

