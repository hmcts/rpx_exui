import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import { PanelRequirementsModel } from '../../../../../hearings/models/panelRequirements.model';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';
import { MemberType, RadioOptions, RequirementType } from '../../../../models/hearings.enum';
import { JudicialUserModel } from '../../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../../models/lovRefData.model';

@Component({
  selector: 'exui-judge-details-section',
  templateUrl: './judge-details-section.component.html'
})
export class JudgeDetailsSectionComponent implements OnInit {
  @Input() public panelRequirements: PanelRequirementsModel;
  @Input() public panelRequirementsToCompare: PanelRequirementsModel;
  @Input() public judgeTypesRefData: LovRefDataModel[];
  @Input() public judicialUsers: JudicialUserModel[];
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public needJudge: string;
  public judgeName: string;
  public judgeTypes: string;
  public excludedJudgeNames: string;
  public showAmendedLabelForPageTitle: boolean;
  public showAmmendedForNeedJudge: boolean;
  public showAmmendedForJudgeName: boolean;
  public showAmmendedForJudgeType: boolean;
  public showAmmendedForExcludedJudgeNames: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;

  public ngOnInit(): void {
    this.needJudge = this.getNeedJudge();
    this.judgeName = this.getJudgeName();
    this.judgeTypes = this.getJudgeTypes();
    this.excludedJudgeNames = this.getExcludedJudgeNames();
    this.setAmendmentLabels();
  }

  public onChange(fragmentId: string): void {
    let changeLink = '';
    switch (fragmentId) {
      case 'needJudge':
        changeLink = '/hearings/request/hearing-judge#specificJudgeName';
        break;
      case 'judgeName':
        changeLink = '/hearings/request/hearing-judge#inputSelectPerson';
        break;
      case 'judgeTypes':
        changeLink = '/hearings/request/hearing-judge#judgeTypes';
        break;
      case 'judgeExclusion':
        changeLink = '/hearings/request/hearing-judge#inputSelectPersonExclude';
        break;
    }
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }

  private getNeedJudge(): string {
    const hasJudgeDetails = this.panelRequirements?.panelPreferences?.filter((panel) => panel.memberType === MemberType.JUDGE);
    if (hasJudgeDetails?.length > 0) {
      return RadioOptions.YES;
    }
    if (this.panelRequirements?.roleType?.length > 0) {
      return RadioOptions.NO;
    }
    return '';
  }

  private getJudgeName(): string {
    const includedJudgeMemberIds = this.panelRequirements?.panelPreferences?.filter(
      (panelPreference) => panelPreference.memberType === MemberType.JUDGE
        && panelPreference.requirementType === RequirementType.MUSTINC
    ).map((panelPreference) => panelPreference.memberID);

    const includedJudge = this.judicialUsers?.find((judgeInfo) => includedJudgeMemberIds?.includes(judgeInfo.personalCode));
    return includedJudge?.fullName || '';
  }

  private getJudgeTypes(): string {
    const selectedJudgeTypes: string[] = [];
    this.judgeTypesRefData.forEach((judgeType) => {
      if (this.panelRequirements?.roleType?.includes(judgeType.key)) {
        selectedJudgeTypes.push(judgeType.value_en);
      }
    });
    return selectedJudgeTypes.length > 0
      ? selectedJudgeTypes.join(', ')
      : '';
  }

  private getExcludedJudgeNames(): string {
    const excludedJudges = this.panelRequirements?.panelPreferences?.filter(
      (preference) => preference.memberType === MemberType.JUDGE && preference.requirementType === RequirementType.EXCLUDE
    ).map((preference) => preference.memberID);

    const excludedJudgeNames: string[] = [];
    this.judicialUsers.forEach((judgeInfo) => {
      if (excludedJudges?.includes(judgeInfo.personalCode)) {
        excludedJudgeNames.push(judgeInfo.fullName);
      }
    });
    return excludedJudgeNames.length > 0
      ? excludedJudgeNames.join(', ')
      : '';
  }

  private setAmendmentLabels(): void {
    this.showAmmendedForNeedJudge = !_.isEqual(
      this.panelRequirementsToCompare?.roleType.length > 0,
      this.panelRequirements?.roleType.length > 0
    );

    this.showAmmendedForJudgeName = !_.isEqual(
      this.panelRequirementsToCompare?.panelPreferences.filter(
        (panel) => panel.memberType === MemberType.JUDGE && panel.requirementType === RequirementType.MUSTINC
      ),
      this.panelRequirements?.panelPreferences.filter(
        (panel) => panel.memberType === MemberType.JUDGE && panel.requirementType === RequirementType.MUSTINC
      )
    );

    const memberIdsToCompare = this.panelRequirementsToCompare?.panelPreferences?.map(
      (panelPreference) => panelPreference.memberID
    )?.sort((a, b) => {
      return a > b ? 1 : (a === b ? 0 : -1);
    });
    const memberIds = this.panelRequirements?.panelPreferences?.map(
      (panelPreference) => panelPreference.memberID
    )?.sort((a, b) => {
      return a > b ? 1 : (a === b ? 0 : -1);
    });
    this.showAmmendedForExcludedJudgeNames = !_.isEqual(
      memberIdsToCompare,
      memberIds
    );

    if (this.panelRequirementsToCompare?.roleType && this.panelRequirements?.roleType) {
      this.showAmmendedForJudgeType = !_.isEqual(
        [...this.panelRequirementsToCompare.roleType].sort((a, b) => a.localeCompare(b)),
        [...this.panelRequirements.roleType].sort((a, b) => a.localeCompare(b))
      );
    }

    this.showAmendedLabelForPageTitle = this.showAmmendedForNeedJudge ||
      this.showAmmendedForJudgeName ||
      this.showAmmendedForExcludedJudgeNames ||
      this.showAmmendedForJudgeType;
  }
}
