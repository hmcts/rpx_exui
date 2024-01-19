import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AdditionalFacilitiesAmendedConverter } from '../converters/additional-facilities.amended.converter';
import { AdditionalInstructionsAmendedConverter } from '../converters/additional-instructions.amended.converter';
import { AdditionalSecurityAmendedConverter } from '../converters/additional-security.amended.converter';
import { CaseFlagAmendedConverter } from '../converters/case-flag.amended.converter';
import { DefaultAmendedConverter } from '../converters/default.amended.converter';
import { HearingLengthAmendedConverter } from '../converters/hearing-length.amended.converter';
import { HearingPanelAmendedConverter } from '../converters/hearing-panel.amended.converter';
import { HearingPriorityAmendedConverter } from '../converters/hearing-priority.amended.converter';
import { HearingSpecificDateAmendedConverter } from '../converters/hearing-specific-date.amended.converter';
import { HowManyPeopleAttendAmendedConverter } from '../converters/how-many-people-attend.amended.converter';
import { HowPartyAttendAmendedConverter } from '../converters/how-party-attend.amended.converter';
import { IsAmendedConverter } from '../converters/is-amended.converter';
import { IsPaperHearingAmendedConverter } from '../converters/is-paper-hearing.amended.converter';
import { JudgeExclusionAmendedConverter } from '../converters/judge-exclusion.amended.converter';
import { JudgeNameAmendedConverter } from '../converters/judge-name.amended.converter';
import { JudgeTypesAmendedConverter } from '../converters/judge-types.amended.converter';
import { LinkedHearingsAmendedConverter } from '../converters/linked-hearings.amended.converter';
import { NeedJudgeAmendedConverter } from '../converters/need-judge.amended.converter';
import { NeedWelshAmendedConverter } from '../converters/need-welsh.amended.converter';
import { PanelExclusionAmendedConverter } from '../converters/panel-exclusion.amended.converter';
import { PanelInclusionAmendedConverter } from '../converters/panel-inclusion.amended.converter';
import { PanelRolesAmendedConverter } from '../converters/panel-roles.amended.converter';
import { ParticipantChannelAttendenceAmendedConverter } from '../converters/participant-channel-attendence.amended.converter';
import { StageAmendedConverter } from '../converters/stage.amended.converter';
import { VenueAmendedConverter } from '../converters/venue.amended.converter';
import { AnswerSource } from '../models/hearings.enum';
import { State } from '../store';
import { ReasonableAdjustmentsAmendedConverter } from '../converters/reasonable-adjustments.amended.converter';

@Pipe({
  name: 'isAmended'
})
export class IsAmendedPipe implements PipeTransform {
  constructor(protected readonly route: ActivatedRoute) {}

  public transform(answerSource: AnswerSource, hearingState$: Observable<State>): Observable<boolean> {
    let converter: IsAmendedConverter = new DefaultAmendedConverter();
    switch (answerSource) {
      case AnswerSource.CASE_FLAGS:
        converter = new CaseFlagAmendedConverter(this.route);
        break;
      case AnswerSource.VENUE:
        converter = new VenueAmendedConverter();
        break;
      case AnswerSource.ADDITIONAL_SECURITY_REQUIRED:
        converter = new AdditionalSecurityAmendedConverter();
        break;
      case AnswerSource.ADDITIONAL_FACILITIES_REQUIRED:
        converter = new AdditionalFacilitiesAmendedConverter();
        break;
      case AnswerSource.HOW_ATTENDANT:
        converter = new HowPartyAttendAmendedConverter();
        break;
      case AnswerSource.HOW_PARTICIPANTS_ATTEND:
        converter = new ParticipantChannelAttendenceAmendedConverter();
        break;
      case AnswerSource.IS_PAPER_HEARING:
        converter = new IsPaperHearingAmendedConverter();
        break;
      case AnswerSource.ATTENDANT_PERSON_AMOUNT:
        converter = new HowManyPeopleAttendAmendedConverter();
        break;
      case AnswerSource.STAGE:
        converter = new StageAmendedConverter();
        break;
      case AnswerSource.NEED_WELSH:
        converter = new NeedWelshAmendedConverter();
        break;
      case AnswerSource.NEED_JUDGE:
        converter = new NeedJudgeAmendedConverter();
        break;
      case AnswerSource.JUDGE_NAME:
        converter = new JudgeNameAmendedConverter();
        break;
      case AnswerSource.JUDGE_TYPES:
        converter = new JudgeTypesAmendedConverter();
        break;
      case AnswerSource.JUDGE_EXCLUSION:
        converter = new JudgeExclusionAmendedConverter();
        break;
      case AnswerSource.HEARING_LENGTH:
        converter = new HearingLengthAmendedConverter();
        break;
      case AnswerSource.HEARING_SPECIFIC_DATE:
        converter = new HearingSpecificDateAmendedConverter();
        break;
      case AnswerSource.HEARING_PRIORITY:
        converter = new HearingPriorityAmendedConverter();
        break;
      case AnswerSource.HEARING_PANEL:
        converter = new HearingPanelAmendedConverter();
        break;
      case AnswerSource.PANEL_INCLUSION:
        converter = new PanelInclusionAmendedConverter();
        break;
      case AnswerSource.PANEL_EXCLUSION:
        converter = new PanelExclusionAmendedConverter();
        break;
      case AnswerSource.PANEL_ROLES:
        converter = new PanelRolesAmendedConverter();
        break;
      case AnswerSource.ADDITIONAL_INSTRUCTION:
        converter = new AdditionalInstructionsAmendedConverter();
        break;
      case AnswerSource.LINKED_HEARINGS:
        converter = new LinkedHearingsAmendedConverter();
        break;
      case AnswerSource.REASONABLE_ADJUSTMENTS:
        converter = new ReasonableAdjustmentsAmendedConverter();
        break;
      default:
        break;
    }
    return converter.transformIsAmended(hearingState$);
  }
}
