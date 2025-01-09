import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import * as fromHearingStore from '../../../../../hearings/store';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';

@Component({
  selector: 'exui-language-requirements-section',
  templateUrl: './language-requirements-section.component.html'
})
export class LanguageRequirementsSectionComponent {
  @Input() public hearingInWelshFlag: boolean;
  @Input() public hearingInWelshFlagToCompare: boolean;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public showAmmended: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;

  constructor(protected readonly hearingStore: Store<fromHearingStore.State>) {
  }

  public ngOnInit(): void {
    this.showAmmended = !_.isEqual(
      this.hearingInWelshFlagToCompare,
      this.hearingInWelshFlag
    );
  }

  public onChange(fragmentId: string): void {
    const changeLink = '/hearings/request/hearing-welsh#welsh_hearing_yes';
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }
}
