import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';
import { HearingRequestMainModel } from '../../../../models/hearingRequestMain.model';

@Component({
  selector: 'exui-additional-instructions-section',
  templateUrl: './additional-instructions-section.component.html'
})
export class AdditionalInstructionsSectionComponent implements OnInit {
  @Input() public hearingRequestMainModel: HearingRequestMainModel;
  @Input() public hearingRequestToCompareMainModel: HearingRequestMainModel;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public additionalInstructions: string;
  public showAmmended: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;

  public ngOnInit(): void {
    this.showAmmended = !_.isEqual(
      this.hearingRequestToCompareMainModel.hearingDetails.listingComments,
      this.hearingRequestMainModel.hearingDetails.listingComments
    );
    this.additionalInstructions = this.hearingRequestMainModel.hearingDetails.listingComments?.replace(/(?:\r\n|\r|\n)/g, '<br>') || '';
  }

  public onChange(fragmentId: string): void {
    const changeLink = '/hearings/request/hearing-additional-instructions#additionalInstructionsTextarea';
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }
}
