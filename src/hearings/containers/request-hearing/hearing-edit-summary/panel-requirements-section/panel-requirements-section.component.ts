import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import * as fromHearingStore from '../../../../../hearings/store';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';

@Component({
  selector: 'exui-panel-requirements-section',
  templateUrl: './panel-requirements-section.component.html'
})
export class PanelRequirementsSectionComponent {
  @Input() public isAPanelFlag: boolean;
  @Input() public isAPanelFlagToCompare: boolean;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public showAmmended: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;

  constructor(protected readonly hearingStore: Store<fromHearingStore.State>) {
    console.log('PanelRequirementsSectionComponent constructor');
  }

  public ngOnInit(): void {
    console.log('PanelRequirementsSectionComponent ngoninit');
    this.showAmmended = !_.isEqual(
      this.isAPanelFlagToCompare,
      this.isAPanelFlag
    );
  }

  public onChange(fragmentId: string): void {
    const changeLink = '/hearings/request/hearing-panel-required#hearingPanelRequired';
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }
}
