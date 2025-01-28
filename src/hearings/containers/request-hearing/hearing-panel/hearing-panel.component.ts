import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { HearingJudgeNamesListComponent } from '../../../components';
import {
  ACTION,
  ControlTypeEnum,
  HearingPanelSelectionEnum,
  MemberType,
  RadioOptions,
  RequirementType
} from '../../../models/hearings.enum';
import { JudicialUserModel } from '../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { PanelPreferenceModel } from '../../../models/panelPreference.model';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-panel',
  templateUrl: './hearing-panel.component.html'
})
export class HearingPanelComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public panelJudgeForm: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];
  public includedJudgeList: JudicialUserModel[] = [];
  public excludedJudgeList: JudicialUserModel[] = [];
  public selectedPanelRoles: JudicialUserModel[] = [];
  public panelSelection: string;
  public multiLevelSelections: LovRefDataModel[] = [];
  public panelSelectionError: string;
  public hasValidationRequested: boolean = false;
  public childNodesValidationError: string;
  public personalCodejudgeList: JudicialUserModel[] = [];
  public configLevels: { level: number, controlType: ControlTypeEnum }[];
  public serviceId: string;
  @ViewChild('includedJudge', { static: false }) public includedJudge: HearingJudgeNamesListComponent;
  @ViewChild('excludedJudge', { static: false }) public excludedJudge: HearingJudgeNamesListComponent;

  constructor(
    private readonly formBuilder: FormBuilder,
    protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly hearingsService: HearingsService,
    protected readonly featureToggleService: FeatureToggleService,
    protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);
    this.multiLevelSelections = this.route.snapshot.data.otherPanelRoles;
    this.personalCodejudgeList = this.route.snapshot.data.judicialUsers;
    this.setExtraChildNode();
    this.configLevels = [
      {
        controlType: ControlTypeEnum.CHECK_BOX,
        level: 1
      },
      {
        controlType: ControlTypeEnum.SELECT,
        level: 2
      }
    ];
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public childNodesValidation(): boolean {
    let childNodeValid: boolean = true;
    const panelRoles = this.convertArrayToRefDataModel(this.panelJudgeForm.controls.multiLevelSelect as FormArray);
    panelRoles.filter((panelRole) => panelRole.selected && panelRole.child_nodes?.length)
      .forEach((selectedPanelRole) => {
        if (selectedPanelRole.child_nodes.filter((node) => node.selected).length === 0) {
          childNodeValid = false;
        }
      });
    return childNodeValid;
  }

  public initForm(): void {
    this.panelJudgeForm = this.formBuilder.group({
      specificPanel: ['', Validators.required],
      multiLevelSelect: this.formBuilder.array([])
    });
    this.excludedJudgeList = this.getPanelMemberList(RequirementType.EXCLUDE);
    this.includedJudgeList = this.getPanelMemberList(RequirementType.MUSTINC);
    this.multiLevelSelections = this.multiLevelSelections.filter((mls: { key: string; }) => mls?.key && mls?.key!== '');
    this.loadHearingPanels();
    this.panelJudgeForm.controls.multiLevelSelect = this.convertRefDataModelToArray(this.multiLevelSelections);
    this.serviceId = this.serviceHearingValuesModel.hmctsServiceID;
  }

  public getPanelMemberList(panelRequirementType: string): JudicialUserModel[] {
    const selectedPanelList: JudicialUserModel[] = [];
    const panelRequirements = this.hearingRequestMainModel.hearingDetails.panelRequirements;
    const panelMemberIDs = panelRequirements?.panelPreferences?.filter((preferences) => preferences.memberType === MemberType.PANEL_MEMBER && preferences.requirementType === panelRequirementType).map((preferences) => preferences.memberID);
    if (panelMemberIDs.length) {
      this.personalCodejudgeList.forEach((judgeInfo) => {
        if (panelMemberIDs.includes(judgeInfo.personalCode)) {
          selectedPanelList.push(judgeInfo);
        }
      });
    }
    return selectedPanelList;
  }

  public loadPanel(multi: LovRefDataModel, panelSpecialism: string): boolean {
    let skip = false;
    if (multi.child_nodes && multi.child_nodes.length) {
      multi.child_nodes.forEach((node) => {
        if (node.key.toLowerCase().trim() === panelSpecialism.toLocaleLowerCase().trim() && !skip && !multi.selected) {
          node.selected = multi.selected = true;
          node.child_nodes && node.child_nodes.length ? skip = this.loadPanel(node, panelSpecialism) : skip = true;
        }
      });
    } else {
      if (multi.key === panelSpecialism) {
        multi.selected = true;
        skip = true;
      }
    }
    return skip;
  }

  public setExtraChildNode() {
    const refDataWithChildNodes = _.cloneDeep({
      ...this.multiLevelSelections.find((lov) => lov.child_nodes && lov.child_nodes.length > 0)
    });
    this.multiLevelSelections = _.orderBy([...this.multiLevelSelections, ...[refDataWithChildNodes]], ['key']);
  }

  public loadHearingPanels(): void {
    let selectedPanelRoles: string[];
    this.panelSelection = '';
    if (
      this.multiLevelSelections?.length &&
      this.hearingRequestMainModel.hearingDetails?.panelRequirements?.roleType) {
      selectedPanelRoles = this.hearingRequestMainModel.hearingDetails?.panelRequirements.roleType.filter((roleKey) => this.multiLevelSelections.map((role) => role.key).includes(roleKey));
      selectedPanelRoles.forEach((selectedPanelRole) => {
        let skipRoleSelection = false;
        if (this.multiLevelSelections?.length) {
          this.multiLevelSelections.forEach((role) => {
            if (role.key?.toLowerCase().trim() === selectedPanelRole?.toLocaleLowerCase().trim() && !skipRoleSelection && !role.selected) {
              role.selected = true;
              skipRoleSelection = true;
            }
          });
        }
      });
      const panelSpecialisms = this.hearingRequestMainModel.hearingDetails.panelRequirements.panelSpecialisms || [];
      this.setPanelSpecialisms(panelSpecialisms);
    }
    if (selectedPanelRoles && selectedPanelRoles.length || this.excludedJudgeList.length || this.includedJudgeList.length) {
      this.showSpecificPanel(RadioOptions.YES);
    } else {
      this.showSpecificPanel(RadioOptions.NO);
    }
  }

  public setPanelSpecialisms(panelSpecialisms: string[]): void {
    panelSpecialisms.forEach((panelSpecialism) => {
      let skipSpecialismSelection = false;
      this.multiLevelSelections.forEach((role) => {
        if (role.child_nodes && role.child_nodes.length && role.selected && !skipSpecialismSelection) {
          const isSpecialisNotSelected = role.child_nodes.every((value) => !value.selected);
          if (isSpecialisNotSelected) {
            role.child_nodes.forEach((node) => {
              if (node.key.toLowerCase().trim() === panelSpecialism.toLocaleLowerCase().trim()) {
                skipSpecialismSelection = true;
                node.selected = true;
              }
            });
          }
        }
      });
    });
  }

  public preparePanelSpecialism(panelRoles: LovRefDataModel[], accummulation: string[]) {
    if (panelRoles) {
      panelRoles.forEach((panelRole) => {
        if (panelRole.selected && panelRole.child_nodes && panelRole.child_nodes.length) {
          const selectedChildNode = panelRole.child_nodes.find((role) => role.selected);
          accummulation.push(selectedChildNode && selectedChildNode.key);
        }
      });
    }
  }

  public prepareData(): void {
    const panelRoles: LovRefDataModel[] = this.convertArrayToRefDataModel(this.panelJudgeForm.controls.multiLevelSelect as FormArray);
    const panelSpecialismsSelected: string[] = [];
    const selectedPanelMembers: PanelPreferenceModel[] = [] as PanelPreferenceModel[];
    let selectedPanelRoles: string[] = [];
    const hearingPanelRequiredFlag = this.panelJudgeForm.controls.specificPanel.value === RadioOptions.YES;
    if (hearingPanelRequiredFlag) {
      this.includedJudge.judgeList.forEach((judgeInfo) => {
        const panelPreference: PanelPreferenceModel = {
          memberID: judgeInfo.personalCode,
          memberType: MemberType.PANEL_MEMBER,
          requirementType: RequirementType.MUSTINC
        };
        selectedPanelMembers.push(panelPreference);
      });
      this.excludedJudge.judgeList.forEach((judgeInfo) => {
        const panelPreference: PanelPreferenceModel = {
          memberID: judgeInfo.personalCode,
          memberType: MemberType.PANEL_MEMBER,
          requirementType: RequirementType.EXCLUDE
        };
        selectedPanelMembers.push(panelPreference);
      });
      this.preparePanelSpecialism(panelRoles, panelSpecialismsSelected);
      selectedPanelRoles = panelRoles && panelRoles.filter((role) => role.selected).map((role) => role.selected && role.key) || [];
    }
    const panelRequirements = this.hearingRequestMainModel.hearingDetails.panelRequirements;
    const preSelectedPanelRoles = panelRequirements?.roleType?.filter((roleKey) => !panelRoles.map((role) => role.key).includes(roleKey));
    const selectedPanelJudges: PanelPreferenceModel[] = panelRequirements?.panelPreferences?.filter((preferences) => preferences.memberType === MemberType.JUDGE) || [];
    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        panelRequirements: {
          ...this.hearingRequestMainModel.hearingDetails.panelRequirements,
          roleType: [...preSelectedPanelRoles, ...selectedPanelRoles],
          panelPreferences: [...selectedPanelMembers, ...selectedPanelJudges],
          panelSpecialisms: [...panelSpecialismsSelected]
        }
      }
    };
  }

  public convertArrayToRefDataModel(array: FormArray): LovRefDataModel[] {
    const panelRoles: LovRefDataModel[] = [];
    array.controls.forEach((control) => {
      const refDataModel: LovRefDataModel = {
        key: control.value.key,
        value_en: control.value.value_en,
        value_cy: control.value.value_cy,
        hint_text_en: control.value.hint_text_en,
        hint_text_cy: control.value.hint_text_cy,
        lov_order: control.value.lov_order,
        parent_key: control.value.parent_key,
        category_key: control.value.category_key,
        parent_category: control.value.parent_category,
        active_flag: control.value.active_flag,
        child_nodes: control.value && control.value.child_nodes ? control.value.child_nodes : [],
        selected: control.value.selected
      };
      panelRoles.push(refDataModel);
    });
    return panelRoles;
  }

  public convertRefDataModelToArray(dataSource: LovRefDataModel[]): FormArray {
    const dataSourceArray = this.formBuilder.array([]);
    if (dataSource && dataSource.length) {
      dataSource.forEach((otherPanelRoles) => {
        dataSourceArray.push(this.patchValues({
          key: otherPanelRoles.key,
          value_en: otherPanelRoles.value_en,
          value_cy: otherPanelRoles.value_cy,
          hint_text_en: otherPanelRoles.hint_text_en,
          hint_text_cy: otherPanelRoles.hint_text_cy,
          lov_order: otherPanelRoles.lov_order,
          parent_key: otherPanelRoles.parent_key,
          category_key: otherPanelRoles.category_key,
          parent_category: otherPanelRoles.parent_category,
          active_flag: otherPanelRoles.active_flag,
          child_nodes: otherPanelRoles.child_nodes,
          selected: !!otherPanelRoles.selected
        } as LovRefDataModel) as FormGroup as any);
      });
    }
    return dataSourceArray;
  }

  public patchValues(refDataModel: LovRefDataModel): FormGroup {
    return this.formBuilder.group({
      key: [refDataModel.key],
      value_en: [refDataModel.value_en],
      value_cy: [refDataModel.value_cy],
      hint_text_en: [refDataModel.hint_text_en],
      hint_text_cy: [refDataModel.hint_text_cy],
      lov_order: [refDataModel.lov_order],
      parent_key: [refDataModel.parent_key],
      category_key: [refDataModel.category_key],
      parent_category: [refDataModel.parent_category],
      active_flag: [refDataModel.active_flag],
      selected: [refDataModel.selected, Validators.required],
      child_nodes: refDataModel.child_nodes && refDataModel.child_nodes.length > 0 ? this.convertRefDataModelToArray(refDataModel.child_nodes) : []
    });
  }

  public showSpecificPanel(judgeSelection: string): void {
    this.panelSelection = judgeSelection;
    this.panelJudgeForm.controls.specificPanel.setValue(this.panelSelection);
  }

  public executeAction(action: ACTION): void {
    if (action === ACTION.CONTINUE) {
      if (this.isFormValid()) {
        this.prepareData();
        super.navigateAction(action);
      }
    } else if (action === ACTION.BACK) {
      super.navigateAction(action);
    }
  }

  public isFormValid(): boolean {
    this.validationErrors = [];
    this.childNodesValidationError = null;
    this.panelSelectionError = null;
    const panelRequiredFlag = this.panelJudgeForm.controls.specificPanel.value === RadioOptions.YES;
    if (panelRequiredFlag) {
      const selectedPanelRoles: LovRefDataModel[] = this.convertArrayToRefDataModel(this.panelJudgeForm.controls.multiLevelSelect as FormArray).filter((role) => role.selected);
      const panelRolesValid = this.childNodesValidation();
      const validIncludeOrExcludeSelection = this.includedJudge.judgeList.length > 0 || this.excludedJudge.judgeList.length > 0;
      if (panelRolesValid) {
        if (!selectedPanelRoles.length) {
          if (!validIncludeOrExcludeSelection) {
            this.panelSelectionError = HearingPanelSelectionEnum.SelectionError;
            this.validationErrors.push({
              id: 'specific-panel-selection',
              message: HearingPanelSelectionEnum.SelectionError
            });
            return false;
          }
        }
      } else {
        this.hasValidationRequested = true;
        this.childNodesValidationError = HearingPanelSelectionEnum.PanelRowChildError;
        this.validationErrors.push({ id: 'panel-role-selector', message: HearingPanelSelectionEnum.PanelRowChildError });
        return false;
      }
    }
    return this.panelJudgeForm.valid;
  }

  public ngAfterViewInit(): void {
    this.fragmentFocus();
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
  }
}
