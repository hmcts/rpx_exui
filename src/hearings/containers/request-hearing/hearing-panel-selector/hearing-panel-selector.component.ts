import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { HearingJudgeNamesListComponent } from '../../../components';
import {
  ACTION,
  ControlTypeEnum,
  HearingPanelSelectionEnum,
  MemberType,
  RequirementType
} from '../../../models/hearings.enum';
import { JudicialUserModel } from '../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { PanelPreferenceModel } from '../../../models/panelPreference.model';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';

@Component({
  selector: 'exui-hearing-panel-selector',
  templateUrl: './hearing-panel-selector.component.html'
})
export class HearingPanelSelectorComponent extends RequestHearingPageFlow implements OnInit, AfterViewInit, OnDestroy {
  public panelJudgeForm: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];
  public includedJudgeList: JudicialUserModel[] = [];
  public excludedJudgeList: JudicialUserModel[] = [];

  public selectedPanelRoles: JudicialUserModel[] = [];

  public panelSelectionError: string;
  public personalCodejudgeList: JudicialUserModel[] = [];
  public configLevels: { level: number, controlType: ControlTypeEnum }[];
  public serviceId: string;

  public panelListCollection: LovRefDataModel[] = [];
  public otherPanelRoles: LovRefDataModel[] = [];
  @ViewChild('includedJudge', { static: false }) public includedJudge: HearingJudgeNamesListComponent;
  @ViewChild('excludedJudge', { static: false }) public excludedJudge: HearingJudgeNamesListComponent;

  constructor(
    private readonly formBuilder: FormBuilder,
    protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly hearingsService: HearingsService,
    protected readonly featureToggleService: FeatureToggleService,
    protected readonly route: ActivatedRoute) {
    super(hearingStore, hearingsService, featureToggleService, route);

    this.otherPanelRoles = this.route.snapshot.data.otherPanelRoles;

    this.personalCodejudgeList = this.route.snapshot.data.judicialUsers;
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

  public initForm(): void {
    this.panelJudgeForm = this.formBuilder.group({});
    this.excludedJudgeList = this.getPanelMemberList(RequirementType.EXCLUDE);
    this.includedJudgeList = this.getPanelMemberList(RequirementType.MUSTINC);
    this.panelListCollection = this.buildModelFromValues();
    this.serviceId = this.serviceHearingValuesModel.hmctsServiceID;
  }

  public buildModelFromValues(): LovRefDataModel[] {
    // Create a copy of panelSpecialisms to track unprocessed child IDs
    const panelSpecialismsClone = [...this.hearingRequestMainModel.hearingDetails.panelRequirements.panelSpecialisms];
    // Loop through each item in roleType
    return this.hearingRequestMainModel.hearingDetails.panelRequirements.roleType
      .map((id) => {
        // Find the corresponding node
        const node = this.otherPanelRoles.find((item) => item.key === id);
        // If node is not found, return null
        if (!node) {
          return null;
        }
        // Filter out child nodes belonging to this main node
        const childNodes = node.child_nodes?.filter((child) => {
          const index = panelSpecialismsClone.indexOf(child.key);
          if (index !== -1) {
            panelSpecialismsClone[index] = null; // Mark as processed
            return true;
          }
          return false;
        }) || [];
        // Return the rebuilt LovRefDataModel with filtered child nodes
        return { ...node, child_nodes: childNodes.length ? childNodes : null };
      })
      .filter((item) => item !== null) as LovRefDataModel[];
  }

  public extractValuesFromModel(model: LovRefDataModel[]): { roleType: string[], panelSpecialisms: (string | null)[] } {
    const roleType: string[] = [];
    const panelSpecialisms: (string | null)[] = [];
    model.forEach((item) => {
      roleType.push(item.key);
      if (item.child_nodes && item.child_nodes.length > 0) {
        panelSpecialisms.push(item.child_nodes[0].key);
      } else {
        panelSpecialisms.push(null);
      }
    });
    return { roleType, panelSpecialisms };
  }

  public getPanelMemberList(panelRequirementType: string): JudicialUserModel[] {
    const selectedPanelList: JudicialUserModel[] = [];
    const panelRequirements = this.hearingRequestMainModel.hearingDetails.panelRequirements;
    const panelMemberIDs = panelRequirements?.panelPreferences?.filter((preferences) => preferences.memberType === MemberType.PANEL_MEMBER && preferences.requirementType === panelRequirementType).map((preferences) => preferences.memberID);
    if (panelMemberIDs && panelMemberIDs.length) {
      this.personalCodejudgeList.forEach((judgeInfo) => {
        if (panelMemberIDs.includes(judgeInfo.personalCode)) {
          selectedPanelList.push(judgeInfo);
        }
      });
    }
    return selectedPanelList;
  }

  public prepareData(): void {
    const { roleType, panelSpecialisms } = this.extractValuesFromModel(this.panelListCollection);
    const selectedPanelMembers: PanelPreferenceModel[] = [] as PanelPreferenceModel[];

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

    const panelRequirements = this.hearingRequestMainModel.hearingDetails.panelRequirements;

    const selectedPanelJudges: PanelPreferenceModel[] = panelRequirements?.panelPreferences?.filter((preferences) => preferences.memberType === MemberType.JUDGE) || [];

    this.hearingRequestMainModel = {
      ...this.hearingRequestMainModel,
      hearingDetails: {
        ...this.hearingRequestMainModel.hearingDetails,
        panelRequirements: {
          ...this.hearingRequestMainModel.hearingDetails.panelRequirements,
          roleType: [...roleType],
          panelPreferences: [...selectedPanelMembers, ...selectedPanelJudges],
          panelSpecialisms: [...panelSpecialisms]
        }
      }
    };
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

  public onModelChange(updatedModel: LovRefDataModel[]): void {
    this.panelListCollection = updatedModel;
  }

  public isFormValid(): boolean {
    this.validationErrors = [];
    this.panelSelectionError = null;

    const validIncludeOrExcludeSelection = this.includedJudge.judgeList.length > 0 || this.excludedJudge.judgeList.length > 0;

    if (!this.panelListCollection.length) {
      if (!validIncludeOrExcludeSelection) {
        this.panelSelectionError = HearingPanelSelectionEnum.SelectionError;
        this.validationErrors.push({
          id: 'specific-panel-selection',
          message: HearingPanelSelectionEnum.SelectionError
        });
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
