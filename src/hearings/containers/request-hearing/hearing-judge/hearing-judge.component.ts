import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { HearingJudgeNamesListComponent } from '../../../components';
import { ACTION, HearingJudgeSelectionEnum, MemberType, RadioOptions, RequirementType } from '../../../models/hearings.enum';
import { JudicialUserModel } from '../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { PanelPreferenceModel } from '../../../models/panelPreference.model';
import { HearingsService } from '../../../services/hearings.service';
import { JudicialRefDataService } from '../../../services/judicial-ref-data.service';
import * as fromHearingStore from '../../../store';
import { ValidatorsUtils } from '../../../utils/validators.utils';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-judge',
  templateUrl: './hearing-judge.component.html'
})
export class HearingJudgeComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public hearingJudgeForm: FormGroup;
  public specificJudgeSelection: string;
  public excludedJudgeList: JudicialUserModel[] = [];
  public hearingJudgeTypes: LovRefDataModel[];
  public personalCodejudgeList: JudicialUserModel[] = [];
  public validationErrors: { id: string, message: string }[] = [];
  public specificJudgeSelectionError: string;
  public selectJudgeTypesError: string;
  public selectJudgeNameError: string;
  public hearingJudgeFormInfo: { includedJudges: string[], judgeTypes: string[], excludedJudges: string[] };
  public serviceId: string;
  public specificJudgeQuestion: string = 'Do you want a specific judge?';
  @ViewChild('excludedJudge', { static: false }) public excludedJudge: HearingJudgeNamesListComponent;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly validatorsUtils: ValidatorsUtils,
              protected readonly hearingStore: Store<fromHearingStore.State>,
              protected readonly hearingsService: HearingsService,
              protected readonly judicialRefDataService: JudicialRefDataService,
              protected readonly featureToggleService: FeatureToggleService,
              protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
    this.hearingJudgeTypes = this.route.snapshot.data.hearingStages;
    this.personalCodejudgeList = this.route.snapshot.data.judicialUsers;
  }

  public ngOnInit(): void {
    this.getFormData();
    this.initForm();
    this.setFormData();
  }

  public getFormData(): void {
    let judgeTypes: string[];
    let includedJudges: string[] = [];
    const panelRequirements = this.hearingRequestMainModel.hearingDetails.panelRequirements;
    const selectedPanelRequirements = panelRequirements?.roleType?.filter((roleKey) => this.hearingJudgeTypes.map((role) => role.key).includes(roleKey));
    if (selectedPanelRequirements && selectedPanelRequirements.length > 0) {
      this.specificJudgeSelection = RadioOptions.NO;
      judgeTypes = panelRequirements.roleType;
    } else if (panelRequirements?.panelPreferences) {
      this.specificJudgeSelection = RadioOptions.YES;
      includedJudges = panelRequirements.panelPreferences.filter((preferences) => preferences.memberType === MemberType.JUDGE && preferences.requirementType === RequirementType.MUSTINC).map((preferences) => preferences.memberID);
    }
    const excludedJudges: string[] = panelRequirements?.panelPreferences
      ?.filter((preferences) => preferences.memberType === MemberType.JUDGE && preferences.requirementType === RequirementType.EXCLUDE)
      .map((preferences) => preferences.memberID);
    this.hearingJudgeFormInfo = {
      includedJudges, judgeTypes, excludedJudges
    };
    this.serviceId = this.serviceHearingValuesModel.hmctsServiceID;
  }

  public get getJudgeTypeFormArray(): FormArray {
    const preselectedJudgeTypes: string[] = this.hearingJudgeFormInfo.judgeTypes;
    return this.formBuilder.array(this.hearingJudgeTypes.map((val) => this.formBuilder.group({
      key: [val.key],
      value_en: [val.value_en],
      value_cy: [val.value_cy],
      hint_text_en: [val.hint_text_en],
      hint_text_cy: [val.hint_text_cy],
      lov_order: [val.lov_order],
      parent_key: [val.parent_key],
      selected: [!!val.selected || (preselectedJudgeTypes && preselectedJudgeTypes.includes(val.key))]
    })));
  }

  public initForm(): void {
    this.hearingJudgeForm = this.formBuilder.group({
      specificJudge: [this.specificJudgeSelection, Validators.required],
      judgeName: [null],
      judgeType: this.getJudgeTypeFormArray
    });
  }

  public setFormData(): void {
    if (this.specificJudgeSelection) {
      this.showSpecificJudge(this.specificJudgeSelection);
    }
    if (this.specificJudgeSelection === RadioOptions.YES) {
      const includedJudge = this.personalCodejudgeList.find((judgeInfo) => this.hearingJudgeFormInfo.includedJudges.includes(judgeInfo.personalCode));
      this.hearingJudgeForm.controls.judgeName.setValue(includedJudge);
    }

    if (this.hearingJudgeFormInfo.excludedJudges && this.hearingJudgeFormInfo.excludedJudges.length) {
      this.personalCodejudgeList.forEach((judgeInfo) => {
        if (this.hearingJudgeFormInfo.excludedJudges.includes(judgeInfo.personalCode)) {
          this.excludedJudgeList.push(judgeInfo);
        }
      });
    }
  }

  public showSpecificJudge(judgeSelection: string) {
    this.specificJudgeSelection = judgeSelection;
    this.hearingJudgeForm.controls.specificJudge.setValue(this.specificJudgeSelection);
    this.hearingJudgeForm.controls.judgeName.clearValidators();
    this.hearingJudgeForm.controls.judgeType.clearValidators();
    if (this.specificJudgeSelection === RadioOptions.YES) {
      this.hearingJudgeForm.controls.judgeName.setValidators([Validators.required]);
    } else {
      this.hearingJudgeForm.controls.judgeType.setValidators([this.validatorsUtils.formArraySelectedValidator()]);
    }
    this.hearingJudgeForm.controls.judgeName.updateValueAndValidity();
    this.hearingJudgeForm.controls.judgeType.updateValueAndValidity();
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
    const selectedPanelJudges: PanelPreferenceModel[] = [] as PanelPreferenceModel[];
    let selectedPanelRoles: string[] = [];
    if (this.hearingJudgeForm.value.specificJudge === RadioOptions.YES) {
      const panelPreference: PanelPreferenceModel = {
        memberID: (this.hearingJudgeForm.value.judgeName as JudicialUserModel).personalCode,
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.MUSTINC
      };
      selectedPanelJudges.push(panelPreference);
    } else {
      selectedPanelRoles = this.hearingJudgeForm.value.judgeType.filter((judgeType) => judgeType.selected).map((judgeType) => judgeType.key);
    }
    this.excludedJudge.judgeList.forEach((judgeInfo: JudicialUserModel) => {
      const panelPreference: PanelPreferenceModel = {
        memberID: judgeInfo.personalCode,
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      };
      selectedPanelJudges.push(panelPreference);
    });
    const panelRequirements = this.hearingRequestMainModel.hearingDetails.panelRequirements;
    let preSelectedPanelRoles = [];
    if (this.hearingRequestMainModel.hearingDetails.panelRequirements?.roleType) {
      preSelectedPanelRoles = this.hearingRequestMainModel.hearingDetails.panelRequirements.roleType.filter((roleKey) => !this.hearingJudgeTypes.map((role) => role.key).includes(roleKey));
    }
    const selectedPanelMembers = panelRequirements?.panelPreferences?.filter((preferences) => preferences.memberType === MemberType.PANEL_MEMBER) || [];
    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        panelRequirements: {
          ...this.hearingRequestMainModel.hearingDetails.panelRequirements,
          roleType: [...preSelectedPanelRoles, ...selectedPanelRoles],
          panelPreferences: [...selectedPanelMembers, ...selectedPanelJudges]
        }
      }
    };
  }

  public showRadioButtonError(): void {
    if (!this.hearingJudgeForm.controls.specificJudge.valid) {
      this.specificJudgeSelectionError = HearingJudgeSelectionEnum.SelectionError;
      this.validationErrors.push({ id: 'specific-judge-selection', message: HearingJudgeSelectionEnum.SelectionError });
    } else if (this.specificJudgeSelection === RadioOptions.YES && !this.hearingJudgeForm.controls.judgeName.valid) {
      this.selectJudgeNameError = HearingJudgeSelectionEnum.ValidNameError;
      this.validationErrors.push({ id: 'inputSelectPerson', message: HearingJudgeSelectionEnum.ValidNameError });
    } else if (this.hearingJudgeForm.controls.judgeName.valid && this.hearingJudgeForm.controls.judgeName.touched) {
      this.selectJudgeNameError = HearingJudgeSelectionEnum.ExcludeFullNameJudge;
      this.validationErrors.push({ id: 'inputSelectPerson', message: HearingJudgeSelectionEnum.ExcludeFullNameJudge });
    } else if (this.specificJudgeSelection === RadioOptions.NO && !this.hearingJudgeForm.controls.judgeType.valid) {
      this.selectJudgeTypesError = HearingJudgeSelectionEnum.SelectOneJudgeError;
      this.validationErrors.push({ id: 'judgeTypes', message: HearingJudgeSelectionEnum.SelectOneJudgeError });
    }
  }

  public showExcludeJudgeError(): void {
    if (!this.excludedJudge.isExcludeJudgeInputValid()) {
      this.validationErrors.push(this.excludedJudge.validationError);
    }
  }

  public checkSameJudgeSelectionError(): void {
    if (this.isSameJudgeSelected()) {
      this.selectJudgeNameError = HearingJudgeSelectionEnum.SameJudgeInIncludeExcludeList;
      this.validationErrors.push({ id: 'inputSelectPerson', message: HearingJudgeSelectionEnum.SameJudgeInIncludeExcludeList });
    }
  }

  public checkFormData(): void {
    this.validationErrors = [];
    this.selectJudgeTypesError = null;
    this.selectJudgeNameError = null;
    this.specificJudgeSelectionError = null;
    this.showRadioButtonError();
    this.showExcludeJudgeError();
    this.checkSameJudgeSelectionError();
  }

  private isSameJudgeSelected(): boolean {
    if (this.specificJudgeSelection === RadioOptions.YES) {
      const includedJudge = this.hearingJudgeForm.controls?.judgeName?.value?.personalCode;
      return this.excludedJudge.judgeList.map((judge) => judge.personalCode).includes(includedJudge);
    }
    return false;
  }

  public isFormValid(): boolean {
    return this.excludedJudge.isExcludeJudgeInputValid() && this.hearingJudgeForm.valid &&
      !this.hearingJudgeForm.controls.judgeName.touched && !this.isSameJudgeSelected();
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }
}
