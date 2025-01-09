import { AnswerSource, HearingTemplate, IsHiddenSource } from '../models/hearings.enum';
import { Section } from '../models/section';

export const HEARING_VIEW_EDIT_SUMMARY_TEMPLATE: Section[] = [
  {
    sectionHTMLTitle: '<h1 class="govuk-heading-l">View or edit hearing</h1>',
    screenName: 'edit-hearing',
    answers: [
      {
        id: 'caseName',
        answerTitle: 'Case name',
        answerSource: AnswerSource.CASE_NAME,
        isHiddenSource: IsHiddenSource.LISTED
      },
      {
        id: 'caseNumber',
        answerTitle: 'Case number',
        answerSource: AnswerSource.CASE_NUMBER,
        isHiddenSource: IsHiddenSource.LISTED
      },
      {
        id: 'type',
        answerTitle: 'Type',
        answerSource: AnswerSource.TYPE_FROM_REQUEST,
        isHiddenSource: IsHiddenSource.LISTED
      },
      {
        id: 'status',
        answerTitle: 'Status',
        answerSource: AnswerSource.STATUS
      },
      {
        id: 'dateRequestSubmitted',
        answerTitle: 'Date request submitted',
        answerSource: AnswerSource.DATE_REQUEST_SUBMITTED
      },
      {
        id: 'dateResponseReceived',
        answerTitle: 'Date response received',
        answerSource: AnswerSource.DATE_RESPONSE_RECEIVED,
        isHiddenSource: IsHiddenSource.NOT_LISTED
      }
    ]
  },
  {
    sectionHTMLTitle: HearingTemplate.LISTING_INFORMATION,
    screenName: 'hearing-listing-info',
    isHiddenSource: IsHiddenSource.NOT_LISTED,
    isHiddenMargin: true
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing requirements</h2>',
    screenName: 'hearing-requirements',
    insetInfo: 'To update this request, select change in the relevant section on this page then resubmit the request.',
    answers: [
      {
        id: 'caseFlags',
        answerTitle: 'Reasonable adjustments',
        answerSource: AnswerSource.CASE_FLAGS,
        changeLink: '/hearings/request/hearing-requirements#linkAmendFlags',
        isAmendedSource: AnswerSource.REASONABLE_ADJUSTMENTS
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Additional facilities</h2>',
    screenName: 'hearing-facilities',
    answers: [
      {
        id: 'additionalSecurityRequired',
        answerTitle: 'Will additional security be required?',
        answerSource: AnswerSource.ADDITIONAL_SECURITY_REQUIRED,
        changeLink: '/hearings/request/hearing-facilities#additionalSecurityYes',
        isAmendedSource: AnswerSource.ADDITIONAL_SECURITY_REQUIRED
      },
      {
        id: 'additionalFacilitiesRequired',
        answerTitle: 'Select any additional facilities required',
        answerSource: AnswerSource.ADDITIONAL_FACILITIES_REQUIRED,
        changeLink: '/hearings/request/hearing-facilities#immigrationDetentionCentre',
        isAmendedSource: AnswerSource.ADDITIONAL_FACILITIES_REQUIRED
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Stage</h2>',
    screenName: 'hearing-stage',
    answers: [
      {
        id: 'stage',
        answerTitle: 'What stage is this hearing at?',
        answerSource: AnswerSource.STAGE,
        changeLink: '/hearings/request/hearing-stage#initial',
        isAmendedSource: AnswerSource.STAGE
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Participant attendance</h2>',
    screenName: 'hearing-attendance',
    answers: [
      {
        id: 'paperHearing',
        answerTitle: 'Will this be a paper hearing?',
        answerSource: AnswerSource.IS_PAPER_HEARING,
        changeLink: '/hearings/request/hearing-attendance#paperHearingYes',
        isAmendedSource: AnswerSource.IS_PAPER_HEARING
      },
      {
        id: 'howParticipantsAttendant',
        answerTitle: 'What will be the methods of attendance for this hearing?',
        answerSource: AnswerSource.HOW_PARTICIPANTS_ATTEND,
        changeLink: '/hearings/request/hearing-attendance#hearingLevelChannelList',
        isHiddenSource: IsHiddenSource.PAPER_HEARING,
        isAmendedSource: AnswerSource.HOW_PARTICIPANTS_ATTEND
      },
      {
        id: 'howAttendant',
        answerTitle: 'How will each participant attend the hearing?',
        answerSource: AnswerSource.HOW_ATTENDANT,
        changeLink: '/hearings/request/hearing-attendance#partyChannel0',
        isHiddenSource: IsHiddenSource.PAPER_HEARING,
        isAmendedSource: AnswerSource.HOW_ATTENDANT
      },
      {
        id: 'attendantPersonAmount',
        answerTitle: 'How many people will attend the hearing in person?',
        answerSource: AnswerSource.ATTENDANT_PERSON_AMOUNT,
        changeLink: '/hearings/request/hearing-attendance#attendance-number',
        isHiddenSource: IsHiddenSource.PAPER_HEARING,
        isAmendedSource: AnswerSource.ATTENDANT_PERSON_AMOUNT
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing venue</h2>',
    screenName: 'hearing-venue',
    answers: [
      {
        id: 'venue',
        answerTitle: 'What are the hearing venue details?',
        answerSource: AnswerSource.VENUE,
        changeLink: '/hearings/request/hearing-venue#inputLocationSearch',
        isAmendedSource: AnswerSource.VENUE
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Language requirements</h2>',
    screenName: 'hearing-welsh',
    answers: [
      {
        id: 'needWelsh',
        answerTitle: 'Does this hearing need to be in Welsh?',
        answerSource: AnswerSource.NEED_WELSH,
        changeLink: '/hearings/request/hearing-welsh#welsh_hearing_yes',
        isAmendedSource: AnswerSource.NEED_WELSH
      }
    ],
    isHiddenSource: IsHiddenSource.WELSH_LOCATION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Judge details</h2>',
    screenName: 'hearing-judge',
    answers: [
      {
        id: 'needJudge',
        answerTitle: 'Do you want a specific judge?',
        answerSource: AnswerSource.NEED_JUDGE,
        changeLink: '/hearings/request/hearing-judge#specificJudgeName',
        isAmendedSource: AnswerSource.NEED_JUDGE
      },
      {
        id: 'judgeName',
        answerTitle: 'Name of the judge',
        answerSource: AnswerSource.JUDGE_NAME,
        changeLink: '/hearings/request/hearing-judge#inputSelectPerson',
        isHiddenSource: IsHiddenSource.JUDGE_NAME,
        isAmendedSource: AnswerSource.JUDGE_NAME
      },
      {
        id: 'judgeTypes',
        answerTitle: 'Select all judge types that apply',
        answerSource: AnswerSource.JUDGE_TYPES,
        changeLink: '/hearings/request/hearing-judge#judgeTypes',
        isHiddenSource: IsHiddenSource.JUDGE_TYPES,
        isAmendedSource: AnswerSource.JUDGE_TYPES
      },
      {
        id: 'judgeExclusion',
        answerTitle: 'Exclude a judge',
        answerSource: AnswerSource.JUDGE_EXCLUSION,
        changeLink: '/hearings/request/hearing-judge#inputSelectPersonExclude',
        isHiddenSource: IsHiddenSource.JUDGE_EXCLUSION,
        isAmendedSource: AnswerSource.JUDGE_EXCLUSION
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Panel details</h2>',
    screenName: 'hearing-panel',
    answers: [
      {
        id: 'hearingPanel',
        answerTitle: 'Do you require a panel for this hearing?',
        answerSource: AnswerSource.HEARING_PANEL,
        changeLink: '/hearings/request/hearing-panel#specificPanelSelection',
        isAmendedSource: AnswerSource.HEARING_PANEL
      },
      {
        id: 'panelInclusion',
        answerTitle: 'Include specific panel members',
        answerSource: AnswerSource.PANEL_INCLUSION,
        changeLink: '/hearings/request/hearing-panel#inputSelectPersonInclude',
        isHiddenSource: IsHiddenSource.PANEL_INCLUSION,
        isAmendedSource: AnswerSource.PANEL_INCLUSION
      },
      {
        id: 'panelExclusion',
        answerTitle: 'Exclude specific panel members',
        answerSource: AnswerSource.PANEL_EXCLUSION,
        changeLink: '/hearings/request/hearing-panel#inputSelectPersonExclude',
        isHiddenSource: IsHiddenSource.PANEL_EXCLUSION,
        isAmendedSource: AnswerSource.PANEL_EXCLUSION
      },
      {
        id: 'panelRoles',
        answerTitle: 'Select any other panel roles required',
        answerSource: AnswerSource.PANEL_ROLES,
        changeLink: '/hearings/request/hearing-panel#specificPanelSelection',
        isHiddenSource: IsHiddenSource.PANEL_ROLES,
        isAmendedSource: AnswerSource.PANEL_ROLES
      }
    ],
    isHiddenSource: IsHiddenSource.PANEL_DETAILS_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Length, date and priority level of hearing</h2>',
    screenName: 'hearing-timing',
    answers: [
      {
        id: 'hearingLength',
        answerTitle: 'Length of hearing',
        answerSource: AnswerSource.HEARING_LENGTH,
        changeLink: '/hearings/request/hearing-timing#durationdays',
        isAmendedSource: AnswerSource.HEARING_LENGTH
      },
      {
        id: 'hearingSpecificDate',
        answerTitle: 'Does the hearing need to take place on a specific date?',
        answerSource: AnswerSource.HEARING_SPECIFIC_DATE,
        changeLink: '/hearings/request/hearing-timing#noSpecificDate',
        isAmendedSource: AnswerSource.HEARING_SPECIFIC_DATE
      },
      {
        id: 'hearingPriority',
        answerTitle: 'What is the priority of this hearing?',
        answerSource: AnswerSource.HEARING_PRIORITY,
        changeLink: '/hearings/request/hearing-timing#urgent',
        isAmendedSource: AnswerSource.HEARING_PRIORITY
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Linked hearings</h2>',
    screenName: 'hearing-link',
    answers: [
      {
        id: 'linkedHearings',
        answerTitle: 'Will this hearing need to be linked to other hearings?',
        answerSource: AnswerSource.LINKED_HEARINGS,
        changeLink: '/hearings/request/hearing-link#yes',
        isAmendedSource: AnswerSource.LINKED_HEARINGS
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Additional instructions</h2>',
    screenName: 'hearing-additional-instructions',
    answers: [
      {
        id: 'additionalInstruction',
        answerTitle: 'Enter any additional instructions for the hearing',
        answerSource: AnswerSource.ADDITIONAL_INSTRUCTION,
        changeLink: '/hearings/request/hearing-additional-instructions#additionalInstructionsTextarea',
        isAmendedSource: AnswerSource.ADDITIONAL_INSTRUCTION
      }
    ]
  }
];
