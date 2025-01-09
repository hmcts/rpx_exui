import { AnswerSource, IsHiddenSource } from '../models/hearings.enum';
import { Section } from '../models/section';

export const HEARING_CREATE_EDIT_SUMMARY_TEMPLATE: Section[] = [
  {
    sectionHTMLTitle: '<h1 class="govuk-heading-l">Check your answers before sending your request</h1>',
    screenName: 'check-answers',
    answers: [
      {
        id: 'caseName',
        answerTitle: 'Case name',
        answerSource: AnswerSource.CASE_NAME
      },
      {
        id: 'caseNumber',
        answerTitle: 'Case number',
        answerSource: AnswerSource.CASE_NUMBER
      },
      {
        id: 'type',
        answerTitle: 'Type',
        answerSource: AnswerSource.Type
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing requirements</h2>',
    screenName: 'hearing-requirements',
    answers: [
      {
        id: 'caseFlags',
        answerTitle: 'Reasonable adjustments',
        answerSource: AnswerSource.CASE_FLAGS,
        changeLink: '/hearings/request/hearing-requirements#linkAmendFlags'
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
        changeLink: '/hearings/request/hearing-facilities#additionalSecurityYes'
      },
      {
        id: 'additionalFacilitiesRequired',
        answerTitle: 'Select any additional facilities required',
        answerSource: AnswerSource.ADDITIONAL_FACILITIES_REQUIRED,
        changeLink: '/hearings/request/hearing-facilities#immigrationDetentionCentre'
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
        changeLink: '/hearings/request/hearing-stage#initial'
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
        changeLink: '/hearings/request/hearing-attendance#paperHearingYes'
      },
      {
        id: 'howParticipantsAttendant',
        answerTitle: 'What will be the methods of attendance for this hearing?',
        answerSource: AnswerSource.HOW_PARTICIPANTS_ATTEND,
        isHiddenSource: IsHiddenSource.PAPER_HEARING,
        changeLink: '/hearings/request/hearing-attendance#hearingLevelChannelList'
      },
      {
        id: 'howAttendant',
        answerTitle: 'How will each participant attend the hearing?',
        answerSource: AnswerSource.HOW_ATTENDANT,
        isHiddenSource: IsHiddenSource.PAPER_HEARING,
        changeLink: '/hearings/request/hearing-attendance#partyChannel0'
      },
      {
        id: 'attendantPersonAmount',
        answerTitle: 'How many people will attend the hearing in person?',
        answerSource: AnswerSource.ATTENDANT_PERSON_AMOUNT,
        isHiddenSource: IsHiddenSource.PAPER_HEARING,
        changeLink: '/hearings/request/hearing-attendance#attendance-number'
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
        changeLink: '/hearings/request/hearing-venue#inputLocationSearch'
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
        changeLink: '/hearings/request/hearing-welsh#welsh_hearing_yes'
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
        changeLink: '/hearings/request/hearing-judge#specificJudgeName'
      },
      {
        id: 'judgeName',
        answerTitle: 'Name of the judge',
        answerSource: AnswerSource.JUDGE_NAME,
        changeLink: '/hearings/request/hearing-judge#inputSelectPerson',
        isHiddenSource: IsHiddenSource.JUDGE_NAME
      },
      {
        id: 'judgeTypes',
        answerTitle: 'Select all judge types that apply',
        answerSource: AnswerSource.JUDGE_TYPES,
        changeLink: '/hearings/request/hearing-judge#judgeTypes',
        isHiddenSource: IsHiddenSource.JUDGE_TYPES
      },
      {
        id: 'judgeExclusion',
        answerTitle: 'Exclude a judge',
        answerSource: AnswerSource.JUDGE_EXCLUSION,
        changeLink: '/hearings/request/hearing-judge#inputSelectPersonExclude',
        isHiddenSource: IsHiddenSource.JUDGE_EXCLUSION
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
        changeLink: '/hearings/request/hearing-panel#specificPanelSelection'
      },
      {
        id: 'panelInclusion',
        answerTitle: 'Include specific panel members',
        answerSource: AnswerSource.PANEL_INCLUSION,
        changeLink: '/hearings/request/hearing-panel#inputSelectPersonInclude',
        isHiddenSource: IsHiddenSource.PANEL_INCLUSION
      },
      {
        id: 'panelExclusion',
        answerTitle: 'Exclude specific panel members',
        answerSource: AnswerSource.PANEL_EXCLUSION,
        changeLink: '/hearings/request/hearing-panel#inputSelectPersonExclude',
        isHiddenSource: IsHiddenSource.PANEL_EXCLUSION
      },
      {
        id: 'panelRoles',
        answerTitle: 'Select any other panel roles required',
        answerSource: AnswerSource.PANEL_ROLES,
        changeLink: '/hearings/request/hearing-panel#specificPanelSelection',
        isHiddenSource: IsHiddenSource.PANEL_ROLES
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
        changeLink: '/hearings/request/hearing-timing#durationhours'
      },
      {
        id: 'hearingSpecificDate',
        answerTitle: 'Does the hearing need to take place on a specific date?',
        answerSource: AnswerSource.HEARING_SPECIFIC_DATE,
        changeLink: '/hearings/request/hearing-timing#noSpecificDate'
      },
      {
        id: 'hearingPriority',
        answerTitle: 'What is the priority of this hearing?',
        answerSource: AnswerSource.HEARING_PRIORITY,
        changeLink: '/hearings/request/hearing-timing#urgent'
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
        changeLink: '/hearings/request/hearing-link#yes'
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
        changeLink: '/hearings/request/hearing-additional-instructions#additionalInstructionsTextarea'
      }
    ]
  }
];
