import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';
import { MemberType, RadioOptions, RequirementType } from '../../../../models/hearings.enum';
import { JudicialUserModel } from '../../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../../models/lovRefData.model';
import { PanelRequirementsModel } from '../../../../models/panelRequirements.model';

@Component({
  selector: 'exui-panel-details-section',
  templateUrl: './panel-details-section.component.html'
})
export class PanelDetailsSectionComponent implements OnInit {
  @Input() public panelRolesRefData: LovRefDataModel[];
  @Input() public panelRequirements: PanelRequirementsModel;
  @Input() public panelMembers: JudicialUserModel[];
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public hearingPanel: string;
  public includedPanelMembers: string;
  public excludedPanelMembers: string;
  public panelRoles: string;

  public ngOnInit(): void {
    this.hearingPanel = this.getHearingPanel();
    this.includedPanelMembers = this.getIncludedPanelMembers();
    this.excludedPanelMembers = this.getExcludedPanelMembers();
    this.panelRoles = this.getPanelRoles();
  }

  public onChange(fragmentId: string): void {
    let changeLink = '';
    switch (fragmentId) {
      case 'hearingPanel':
        changeLink = '/hearings/request/hearing-panel#specificPanelSelection';
        break;
      case 'panelInclusion':
        changeLink = '/hearings/request/hearing-panel#inputSelectPersonInclude';
        break;
      case 'panelExclusion':
        changeLink = '/hearings/request/hearing-panel#inputSelectPersonExclude';
        break;
      case 'panelRoles':
        changeLink = '/hearings/request/hearing-panel#specificPanelSelection';
        break;
    }
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }

  private getHearingPanel(): string {
    const panelMembers = this.panelRequirements?.panelPreferences?.filter((preference) => preference.memberType === MemberType.PANEL_MEMBER).length || 0;
    const panelSpecialisms = this.panelRequirements?.panelSpecialisms?.length || 0;
    if (panelMembers > 0 || panelSpecialisms > 0) {
      return RadioOptions.YES;
    }
    return RadioOptions.NO;
  }

  private getIncludedPanelMembers(): string {
    const includedPanelMembers = this.panelRequirements?.panelPreferences?.filter(
      (preference) => preference.memberType === MemberType.PANEL_MEMBER && preference.requirementType === RequirementType.MUSTINC
    ).map((preference) => preference.memberID);

    const includedPanelMemberNames: string[] = [];
    this.panelMembers?.forEach((panelMemberInfo) => {
      if (includedPanelMembers.includes(panelMemberInfo.personalCode)) {
        includedPanelMemberNames.push(panelMemberInfo.fullName);
      }
    });
    return includedPanelMemberNames.join();
  }

  private getExcludedPanelMembers(): string {
    const excludedJudges = this.panelRequirements?.panelPreferences?.filter(
      (preference) => preference.memberType === MemberType.PANEL_MEMBER && preference.requirementType === RequirementType.EXCLUDE
    ).map((preference) => preference.memberID);

    const excludedJudgeNames: string[] = [];
    this.panelMembers?.forEach((panelMemberInfo) => {
      if (excludedJudges.includes(panelMemberInfo.personalCode)) {
        excludedJudgeNames.push(panelMemberInfo.fullName);
      }
    });
    return excludedJudgeNames.join();
  }

  private getPanelRoles(): string {
    const selectedSpecialisms: string[] = [];
    this.panelRequirements?.panelSpecialisms?.forEach((panelSpecialism) => {
      let selectedSpecialism = '';
      this.panelRolesRefData.forEach((panelRole) => {
        if (panelRole.key === panelSpecialism) {
          selectedSpecialism = panelRole.value_en;
        } else if (panelRole.child_nodes?.length > 0) {
          panelRole.child_nodes.forEach((specialism) => {
            if (panelSpecialism === specialism.key && !selectedSpecialism.length) {
              selectedSpecialism = `${panelRole.value_en} - ${specialism.value_en}`;
            }
          });
        }
      });
      selectedSpecialisms.push(selectedSpecialism);
    });
    return selectedSpecialisms.join('<br>');
  }
}
