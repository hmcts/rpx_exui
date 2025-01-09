import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import * as fromHearingStore from '../../../../../hearings/store';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';

@Component({
  selector: 'exui-linked-hearing-section',
  templateUrl: './linked-hearing-section.component.html'
})
export class LinkedHearingSectionComponent {
  @Input() public hearingIsLinkedFlag: boolean;
  @Input() public hearingIsLinkedFlagToCompare: boolean;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public showAmmended: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;

  constructor(protected readonly hearingStore: Store<fromHearingStore.State>) {
  }

  public ngOnInit(): void {
    this.showAmmended = !_.isEqual(
      this.hearingIsLinkedFlagToCompare,
      this.hearingIsLinkedFlag
    );
  }

  public onChange(fragmentId: string): void {
    const changeLink = '/hearings/request/hearing-link#yes';
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }
}
