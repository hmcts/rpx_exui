import { AnswerSource, HearingTemplate, IsHiddenSource } from '../models/hearings.enum';
import { Section } from '../models/section';

export const HEARING_REQUEST_VIEW_SUMMARY_TEMPLATE: Section[] = [
  {
    sectionHTMLTitle: '<h1 class="govuk-heading-l">View hearing</h1>',
    answers: [
      {
        id: 'caseNumber',
        answerTitle: 'Case number',
        answerSource: AnswerSource.CASE_NUMBER,
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
    sectionHTMLTitle: '<h2 class="govuk-heading-m"></h2>',
    answers: [
      {
        id: 'caseInternalName',
        answerTitle: 'Case internal name',
        answerSource: AnswerSource.CASE_NAME
      },
      {
        id: 'casePublicName',
        answerTitle: 'Case public name',
        answerSource: AnswerSource.CASE_NAME
      },
      {
        id: 'caseType',
        answerTitle: 'Case type',
        answerSource: AnswerSource.TYPE_FROM_REQUEST
      },
      {
        id: 'privateHearingRequired',
        answerTitle: 'Private hearing required',
        answerSource: AnswerSource.PRIVATE_HEARING_REQUIRED
      },
      {
        id: 'caseRestriction',
        answerTitle: 'Case restriction',
        answerSource: AnswerSource.CASE_RESTRICTION
      }
    ]
  },
  {
    sectionHTMLTitle: HearingTemplate.LISTING_INFORMATION,
    isHiddenSource: IsHiddenSource.NOT_LISTED,
    isHiddenMargin: true
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing requirements</h2>',
    answers: [
      {
        id: 'caseFlags',
        answerTitle: 'Reasonable adjustments',
        answerSource: AnswerSource.REASONABLE_ADJUSTMENT_FLAGS
      }
    ],
    isHiddenSource: IsHiddenSource.HEARING_REQUIREMENTS_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Additional facilities</h2>',
    answers: [
      {
        id: 'additionalSecurityRequired',
        answerTitle: 'Will additional security be required?',
        answerSource: AnswerSource.ADDITIONAL_SECURITY_REQUIRED
      },
      {
        id: 'additionalFacilitiesRequired',
        answerTitle: 'Select any additional facilities required',
        answerSource: AnswerSource.ADDITIONAL_FACILITIES_REQUIRED
      }
    ],
    isHiddenSource: IsHiddenSource.HEARING_FACILITIES_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing stage</h2>',
    answers: [
      {
        id: 'stage',
        answerTitle: 'What stage is this hearing at?',
        answerSource: AnswerSource.STAGE
      }
    ],
    isHiddenSource: IsHiddenSource.HEARING_STAGE_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Participant attendance</h2>',
    answers: [
      {
        id: 'paperHearing',
        answerTitle: 'Will this be a paper hearing?',
        answerSource: AnswerSource.IS_PAPER_HEARING
      },
      {
        id: 'howParticipantsAttendant',
        answerTitle: 'What will be the methods of attendance for this hearing?',
        answerSource: AnswerSource.HOW_PARTICIPANTS_ATTEND,
        isHiddenSource: IsHiddenSource.PAPER_HEARING
      },
      {
        id: 'howAttendant',
        answerTitle: 'How will each participant attend the hearing?',
        answerSource: AnswerSource.HOW_ATTENDANT,
        isHiddenSource: IsHiddenSource.PAPER_HEARING
      },
      {
        id: 'attendantPersonAmount',
        answerTitle: 'How many people will attend the hearing in person?',
        answerSource: AnswerSource.ATTENDANT_PERSON_AMOUNT,
        isHiddenSource: IsHiddenSource.PAPER_HEARING
      }
    ],
    isHiddenSource: IsHiddenSource.PARTICIPANT_ATTENDANCE_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing venue</h2>',
    answers: [
      {
        id: 'venue',
        answerTitle: 'What are the hearing venue details?',
        answerSource: AnswerSource.VENUE
      }
    ],
    isHiddenSource: IsHiddenSource.HEARING_VENUE_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Language requirements</h2>',
    answers: [
      {
        id: 'needWelsh',
        answerTitle: 'Does this hearing need to be in Welsh?',
        answerSource: AnswerSource.NEED_WELSH
      }
    ],
    isHiddenSource: IsHiddenSource.WELSH_LOCATION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Judge details</h2>',
    answers: [
      {
        id: 'needJudge',
        answerTitle: 'Do you want a specific judge?',
        answerSource: AnswerSource.NEED_JUDGE
      },
      {
        id: 'judgeName',
        answerTitle: 'Name of the judge',
        answerSource: AnswerSource.JUDGE_NAME,
        isHiddenSource: IsHiddenSource.JUDGE_NAME
      },
      {
        id: 'judgeTypes',
        answerTitle: 'Select all judge types that apply',
        answerSource: AnswerSource.JUDGE_TYPES,
        isHiddenSource: IsHiddenSource.JUDGE_TYPES
      },
      {
        id: 'judgeExclusion',
        answerTitle: 'Exclude a judge',
        answerSource: AnswerSource.JUDGE_EXCLUSION,
        isHiddenSource: IsHiddenSource.JUDGE_EXCLUSION
      }
    ],
    isHiddenSource: IsHiddenSource.JUDGE_DETAILS_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Panel details</h2>',
    answers: [
      {
        id: 'hearingPanel',
        answerTitle: 'Do you require a panel for this hearing?',
        answerSource: AnswerSource.HEARING_PANEL
      },
      {
        id: 'panelInclusion',
        answerTitle: 'Include specific panel members',
        answerSource: AnswerSource.PANEL_INCLUSION,
        isHiddenSource: IsHiddenSource.PANEL_INCLUSION
      },
      {
        id: 'panelExclusion',
        answerTitle: 'Exclude specific panel members',
        answerSource: AnswerSource.PANEL_EXCLUSION,
        isHiddenSource: IsHiddenSource.PANEL_EXCLUSION
      },
      {
        id: 'panelRoles',
        answerTitle: 'Select any other panel roles required',
        answerSource: AnswerSource.PANEL_ROLES,
        isHiddenSource: IsHiddenSource.PANEL_ROLES
      }
    ],
    isHiddenSource: IsHiddenSource.PANEL_DETAILS_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Length, date and priority level of hearing</h2>',
    answers: [
      {
        id: 'hearingLength',
        answerTitle: 'Length of hearing',
        answerSource: AnswerSource.HEARING_LENGTH
      },
      {
        id: 'hearingSpecificDate',
        answerTitle: 'Does the hearing need to take place on a specific date?',
        answerSource: AnswerSource.HEARING_SPECIFIC_DATE
      },
      {
        id: 'hearingPriority',
        answerTitle: 'What is the priority of this hearing?',
        answerSource: AnswerSource.HEARING_PRIORITY
      }
    ],
    isHiddenSource: IsHiddenSource.HEARING_TIMING_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Linked hearings</h2>',
    answers: [
      {
        id: 'linkedHearings',
        answerTitle: 'Will this hearing need to be linked to other hearings?',
        answerSource: AnswerSource.LINKED_HEARINGS
      }
    ],
    isHiddenSource: IsHiddenSource.LINKED_HEARINGS_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Additional instructions</h2>',
    answers: [
      {
        id: 'additionalInstruction',
        answerTitle: 'Enter any additional instructions for the hearing',
        answerSource: AnswerSource.ADDITIONAL_INSTRUCTION
      }
    ],
    isHiddenSource: IsHiddenSource.ADDITIONAL_INSTRUCTION_EXCLUSION
  }
];
