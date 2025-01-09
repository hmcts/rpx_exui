import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AmendmentLabelStatus } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import * as fromHearingStore from '../../../../../hearings/store';
import { EditHearingChangeConfig } from '../../../../models/editHearingChangeConfig.model';
import { HearingRequestMainModel } from '../../../../models/hearingRequestMain.model';
import { LovRefDataModel } from '../../../../models/lovRefData.model';

@Component({
  selector: 'exui-hearing-stage-section',
  templateUrl: './hearing-stage-section.component.html'
})
export class HearingStageSectionComponent implements OnInit {
  @Input() public hearingStageOptionsRefData: LovRefDataModel[];
  @Input() public hearingRequestMainModel: HearingRequestMainModel;
  @Input() public hearingRequestToCompareMainModel: HearingRequestMainModel;
  @Output() public changeEditHearing = new EventEmitter<EditHearingChangeConfig>();

  public hearingStage: string;
  public hearingState$: Observable<fromHearingStore.State>;
  public showAmmended: boolean;
  public amendmentLabelEnum = AmendmentLabelStatus;

  public ngOnInit(): void {
    const hearingType = this.hearingRequestMainModel.hearingDetails.hearingType;
    const hearingStageFromRefData = this.hearingStageOptionsRefData.find((stage) => stage.key === hearingType);
    this.hearingStage = hearingStageFromRefData
      ? hearingStageFromRefData.value_en
      : '';
    this.showAmmended = !_.isEqual(
      this.hearingRequestToCompareMainModel.hearingDetails.hearingType,
      hearingType
    );
  }

  public onChange(fragmentId: string): void {
    const changeLink = '/hearings/request/hearing-stage#initial';
    this.changeEditHearing.emit({ fragmentId, changeLink });
  }
}
