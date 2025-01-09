import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActualHearingDayModel, HearingActualsMainModel, PlannedHearingDayModel } from '../../models/hearingActualsMainModel';
import { AnswerSource, HearingChannelEnum, HearingDateEnum, HearingResult } from '../../models/hearings.enum';
import { LovRefDataModel } from '../../models/lovRefData.model';
import * as fromHearingStore from '../../store';
import * as moment from 'moment';

@Component({
  selector: 'exui-hearing-actual-summary',
  templateUrl: './hearing-actual-summary.component.html',
  styleUrls: ['./hearing-actual-summary.component.scss']
})
export class HearingActualSummaryComponent implements OnInit {
  @Input() public hearingState$: Observable<fromHearingStore.State>;
  @Input() public hearingStageOptions: LovRefDataModel[];
  @Input() public hearingActualsMainModel: HearingActualsMainModel;
  @Input() public adjournReasons: LovRefDataModel[];

  public isCompleted: boolean;
  public isAdjourned: boolean;
  public adjournReasonTypeValue: string;
  public isPaperHearing$: Observable<boolean>;
  public hearingDays: { actualHearingDay: ActualHearingDayModel; plannedHearingDay: PlannedHearingDayModel }[] = [];
  public dateFormat = HearingDateEnum;
  public answerSource = AnswerSource;
  public hearingTypeDescription: string;

  public ngOnInit(): void {
    const hearingOutcome = this.hearingActualsMainModel &&
      this.hearingActualsMainModel.hearingActuals &&
      this.hearingActualsMainModel.hearingActuals.hearingOutcome;
    this.isCompleted = hearingOutcome && hearingOutcome.hearingResult === HearingResult.COMPLETED;
    this.isAdjourned = hearingOutcome && hearingOutcome.hearingResult === HearingResult.ADJOURNED;

    if (this.isAdjourned) {
      const adjournReasonType = this.adjournReasons.find((reason) => reason.key === hearingOutcome.hearingResultReasonType);
      this.adjournReasonTypeValue = adjournReasonType ? adjournReasonType.value_en : hearingOutcome.hearingResultReasonType;
    }

    this.isPaperHearing$ = this.hearingState$ && this.hearingState$.pipe(
      map((state) => state.hearingRequest.hearingRequestMainModel.hearingDetails.hearingChannels.includes(HearingChannelEnum.ONPPR))
    );
    this.hearingTypeDescription = hearingOutcome?.hearingType && this.getHearingTypeDescription(hearingOutcome.hearingType);
  }

  private getHearingTypeDescription(hearingType: string): string {
    const hearingTypeFromLookup = this.hearingStageOptions?.find((x) => x.key.toLowerCase() === hearingType.toLowerCase());

    return hearingTypeFromLookup ? hearingTypeFromLookup.value_en : '';
  }

  public get isMultiDayHearing(): boolean {
    return this.hearingActualsMainModel.hearingActuals.actualHearingDays.length > 1;
  }

  public actualHearingDate(): string {
    return this.hearingActualsMainModel?.hearingActuals?.actualHearingDays[0]?.hearingStartTime ?
      this.hearingActualsMainModel?.hearingActuals?.actualHearingDays[0]?.hearingStartTime :
      this.hearingActualsMainModel?.hearingActuals?.actualHearingDays[0]?.hearingDate;
  }

  private convertUTCDateToLocalDate(date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  }

  public actualMultiDaysHearingDates(): string {
    return `${moment.tz(this.convertUTCDateToLocalDate(new Date(this.hearingActualsMainModel?.hearingActuals?.actualHearingDays[0].hearingStartTime)), moment.tz.guess()).format('DD MMM YYYY')} - ${moment.tz(this.convertUTCDateToLocalDate(new Date(this.hearingActualsMainModel?.hearingActuals?.actualHearingDays[this.hearingActualsMainModel?.hearingActuals?.actualHearingDays.length - 1].hearingStartTime)), moment.tz.guess()).format('DD MMM YYYY')}`;
  }
}
