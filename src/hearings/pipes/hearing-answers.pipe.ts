import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AdditionalFacilitiesAnswerConverter } from '../converters/additional-facilities.answer.converter';
import { AdditionalInstructionsAnswerConverter } from '../converters/additional-instructions.answer.converter';
import { AdditionalSecurityAnswerConverter } from '../converters/additional-security.answer.converter';
import { AnswerConverter } from '../converters/answer.converter';
import { CaseFlagAnswerConverter } from '../converters/case-flag.answer.converter';
import { CaseNameAnswerConverter } from '../converters/case-name.answer.converter';
import { CaseNumberAnswerConverter } from '../converters/case-number.answer.converter';
import { CaseRestrictedAnswerConverter } from '../converters/case-restriction.converter';
import { CourtLocationAnswerConverter } from '../converters/court-location.answer.converter';
import { DateRequestFailedAnswerConverter } from '../converters/date-request-failed.answer.converter';
import { DateRequestSubmittedAnswerConverter } from '../converters/date-request-submitted.answer.converter';
import { DateResponseReceivedAnswerConverter } from '../converters/date-response-received.answer.converter';
import { DateResponseSubmittedMultiDayAnswerConverter } from '../converters/date-response-submitted-multi-day.answer.converter';
import { DateResponseSubmittedTimeAnswerConverter } from '../converters/date-response-submitted-time.answer.converter';
import { DateResponseSubmittedAnswerConverter } from '../converters/date-response-submitted.answer.converter';
import { DefaultAnswerConverter } from '../converters/default.answer.converter';
import { HearingLengthAnswerConverter } from '../converters/hearing-length.answer.converter';
import { HearingPanelAnswerConverter } from '../converters/hearing-panel.answer.converter';
import { HearingPriorityAnswerConverter } from '../converters/hearing-priority.answer.converter';
import { HearingResponseLengthAnswerConverter } from '../converters/hearing-response-length.answer.converter';
import { HearingResponseStatusAnswerConverter } from '../converters/hearing-response-status.answer.converter';
import { HearingSpecificDateAnswerConverter } from '../converters/hearing-specific-date.answer.converter';
import { IsPaperHearingAnswerConverter } from '../converters/is-paper-hearing.answer.converter';
import { JudgeExclusionAnswerConverter } from '../converters/judge-exclusion.answer.converter';
import { JudgeNameAnswerConverter } from '../converters/judge-name.answer.converter';
import { JudgeTypesAnswerConverter } from '../converters/judge-types.answer.converter';
import { JudicialMembersAnswerConverter } from '../converters/judicial-members.answer.converter';
import { LinkedHearingsAnswerConverter } from '../converters/linked-hearings.answer.converter';
import { NeedJudgeAnswerConverter } from '../converters/need-judge.answer.converter';
import { NeedWelshAnswerConverter } from '../converters/need-welsh.answer.converter';
import { NumberOfAttendancesAnswerConverter } from '../converters/number-of-attendances-answer.converter';
import { PanelExclusionAnswerConverter } from '../converters/panel-exclusion.answer.converter';
import { PanelInclusionAnswerConverter } from '../converters/panel-inclusion.answer.converter';
import { PanelMembersAnswerConverter } from '../converters/panel-members.answer.converter';
import { PanelRolesAnswerConverter } from '../converters/panel-roles.answer.converter';
import { ParticipantAttendenceAnswerConverter } from '../converters/participant-attendence.answer.converter';
import { ParticipantChannelAttendenceAnswerConverter } from '../converters/participant-channel-attendance.converter';
import { PartyChannelsAnswerConverter } from '../converters/party-channels-answer.converter';
import { PrivateHearingAnswerConverter } from '../converters/private-hearing-required.converter';
import { PublicCaseNameAnswerConverter } from '../converters/public-case-name.answer.converter';
import { ReasonForActualCancellationAnswerConverter } from '../converters/reason-for-actual-cancellation.answer.converter';
import { ReasonForRequestCancellationAnswerConverter } from '../converters/reason-for-request-cancellation.answer.converter';
import { ReasonableAdjustmentFlagsAnswerConverter } from '../converters/reasonable-adjustment-flags.answer.converter';
import { RoomIdAnswerConverter } from '../converters/room-id.answer.converter';
import { StageAnswerConverter } from '../converters/stage.answer.converter';
import { StatusAnswerConverter } from '../converters/status.answer.converter';
import { TypeFromRequestAnswerConverter } from '../converters/type-from-request.answer.converter';
import { TypeAnswerConverter } from '../converters/type.answer.converter';
import { VenueAnswerConverter } from '../converters/venue.answer.converter';
import { AnswerSource } from '../models/hearings.enum';
import { LocationsDataService } from '../services/locations-data.service';
import { State } from '../store';

@Pipe({
  name: 'transformAnswer'
})
export class HearingAnswersPipe implements PipeTransform {
  constructor(protected readonly route: ActivatedRoute,
              protected readonly locationsDataService: LocationsDataService) {}

  public transform(answerSource: AnswerSource, hearingState$: Observable<State>, index?: number): Observable<string> {
    let converter: AnswerConverter = new DefaultAnswerConverter();
    switch (answerSource) {
      case AnswerSource.CASE_NAME:
        converter = new CaseNameAnswerConverter();
        break;
      case AnswerSource.CASE_NUMBER:
        converter = new CaseNumberAnswerConverter();
        break;
      case AnswerSource.Type:
        converter = new TypeAnswerConverter(this.route);
        break;
      case AnswerSource.TYPE_FROM_REQUEST:
        converter = new TypeFromRequestAnswerConverter(this.route);
        break;
      case AnswerSource.STATUS:
        converter = new StatusAnswerConverter();
        break;
      case AnswerSource.DATE_REQUEST_SUBMITTED:
        converter = new DateRequestSubmittedAnswerConverter();
        break;
      case AnswerSource.DATE_RESPONSE_SUBMITTED_TIME:
        converter = new DateResponseSubmittedTimeAnswerConverter();
        break;
      case AnswerSource.DATE_RESPONSE_SUBMITTED:
        converter = new DateResponseSubmittedAnswerConverter();
        break;
      case AnswerSource.DATE_RESPONSE_SUBMITTED_MULTI_DAY:
        converter = new DateResponseSubmittedMultiDayAnswerConverter();
        break;
      case AnswerSource.DATE_RESPONSE_RECEIVED:
        converter = new DateResponseReceivedAnswerConverter();
        break;
      case AnswerSource.ERROR_TIME_STAMP:
        converter = new DateRequestFailedAnswerConverter();
        break;
      case AnswerSource.CASE_FLAGS:
        converter = new CaseFlagAnswerConverter(this.route);
        break;
      case AnswerSource.REASONABLE_ADJUSTMENT_FLAGS:
        converter = new ReasonableAdjustmentFlagsAnswerConverter(this.route);
        break;
      case AnswerSource.ADDITIONAL_SECURITY_REQUIRED:
        converter = new AdditionalSecurityAnswerConverter();
        break;
      case AnswerSource.ADDITIONAL_FACILITIES_REQUIRED:
        converter = new AdditionalFacilitiesAnswerConverter(this.route);
        break;
      case AnswerSource.VENUE:
        converter = new VenueAnswerConverter(this.locationsDataService);
        break;
      case AnswerSource.COURT_LOCATION:
        converter = new CourtLocationAnswerConverter(this.route);
        break;
      case AnswerSource.HOW_ATTENDANT:
        converter = new PartyChannelsAnswerConverter(this.route);
        break;
      case AnswerSource.HOW_PARTICIPANTS_ATTEND:
        converter = new ParticipantChannelAttendenceAnswerConverter(this.route);
        break;
      case AnswerSource.IS_PAPER_HEARING:
        converter = new IsPaperHearingAnswerConverter();
        break;
      case AnswerSource.PARTICIPANT_ATTENDENCE:
        converter = new ParticipantAttendenceAnswerConverter(this.route);
        break;
      case AnswerSource.ATTENDANT_PERSON_AMOUNT:
        converter = new NumberOfAttendancesAnswerConverter();
        break;
      case AnswerSource.NEED_WELSH:
        converter = new NeedWelshAnswerConverter();
        break;
      case AnswerSource.ADDITIONAL_INSTRUCTION:
        converter = new AdditionalInstructionsAnswerConverter();
        break;
      case AnswerSource.STAGE:
        converter = new StageAnswerConverter(this.route);
        break;
      case AnswerSource.HEARING_RESPONSE_STATUS:
        converter = new HearingResponseStatusAnswerConverter();
        break;
      case AnswerSource.HEARING_LENGTH:
        converter = new HearingLengthAnswerConverter();
        break;
      case AnswerSource.HEARING_RESPONSE_LENGTH:
        converter = new HearingResponseLengthAnswerConverter();
        break;
      case AnswerSource.HEARING_SPECIFIC_DATE:
        converter = new HearingSpecificDateAnswerConverter();
        break;
      case AnswerSource.HEARING_PRIORITY:
        converter = new HearingPriorityAnswerConverter(this.route);
        break;
      case AnswerSource.ROOM_ID:
        converter = new RoomIdAnswerConverter();
        break;
      case AnswerSource.JUDICIAL_MEMBERS:
        converter = new JudicialMembersAnswerConverter(this.route);
        break;
      case AnswerSource.NEED_JUDGE:
        converter = new NeedJudgeAnswerConverter();
        break;
      case AnswerSource.JUDGE_NAME:
        converter = new JudgeNameAnswerConverter(this.route);
        break;
      case AnswerSource.JUDGE_TYPES:
        converter = new JudgeTypesAnswerConverter(this.route);
        break;
      case AnswerSource.JUDGE_EXCLUSION:
        converter = new JudgeExclusionAnswerConverter(this.route);
        break;
      case AnswerSource.HEARING_PANEL:
        converter = new HearingPanelAnswerConverter();
        break;
      case AnswerSource.PANEL_INCLUSION:
        converter = new PanelInclusionAnswerConverter(this.route);
        break;
      case AnswerSource.PANEL_EXCLUSION:
        converter = new PanelExclusionAnswerConverter(this.route);
        break;
      case AnswerSource.PANEL_MEMBERS:
        converter = new PanelMembersAnswerConverter(this.route);
        break;
      case AnswerSource.PANEL_ROLES:
        converter = new PanelRolesAnswerConverter(this.route);
        break;
      case AnswerSource.REASON_FOR_ACTUAL_CANCELLATION:
        converter = new ReasonForActualCancellationAnswerConverter(this.route);
        break;
      case AnswerSource.REASON_FOR_REQUEST_CANCELLATION:
        converter = new ReasonForRequestCancellationAnswerConverter(this.route);
        break;
      case AnswerSource.LINKED_HEARINGS:
        converter = new LinkedHearingsAnswerConverter();
        break;
      case AnswerSource.PRIVATE_HEARING_REQUIRED:
        converter = new PrivateHearingAnswerConverter();
        break;
      case AnswerSource.PUBLIC_CASE_NAME:
        converter = new PublicCaseNameAnswerConverter();
        break;
      case AnswerSource.CASE_RESTRICTION:
        converter = new CaseRestrictedAnswerConverter();
        break;
      default:
        break;
    }
    return converter.transformAnswer(hearingState$, index);
  }
}
