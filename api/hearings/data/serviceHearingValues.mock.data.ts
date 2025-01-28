import {
  CategoryType,
  HearingChannelEnum,
  HMCLocationType,
  MemberType,
  PartyType,
  RequirementType
} from '../models/hearings.enum';
import { ServiceHearingValuesModel } from '../models/serviceHearingValues.model';

export const SERVICE_HEARING_VALUES: ServiceHearingValuesModel = {
  hmctsServiceID: 'BBA3',
  hmctsInternalCaseName: 'Jane and Smith vs DWP',
  publicCaseName: 'Jane and Smith vs DWP',
  autoListFlag: false,
  hearingType: 'BBA3-DIR',
  hearingChannels: [HearingChannelEnum.ONPPR],
  hearingLevelParticipantAttendance: [],
  caseCategories: [
    {
      categoryType: CategoryType.CaseType,
      categoryValue: 'BBA3-002'
    }, {
      categoryType: CategoryType.CaseSubType,
      categoryValue: 'BBA3-002CP',
      categoryParent: 'BBA3-002'
    }
  ],
  caseDeepLink: 'https://manage-case.demo.platform.hmcts.net/',
  caserestrictedFlag: false,
  externalCaseReference: '',
  caseManagementLocationCode: '372653',
  caseSLAStartDate: '2021-05-05T09:00:00.000Z',
  hearingWindow: {
    dateRangeStart: '2022-11-23T09:00:00.000Z',
    dateRangeEnd: '2022-11-30T09:00:00.000Z',
    firstDateTimeMustBe: ''
  },
  duration: 45,
  hearingPriorityType: 'Standard',
  numberOfPhysicalAttendees: 2,
  hearingInWelshFlag: false,
  hearingLocations: [{
    locationId: '372653',
    locationType: HMCLocationType.COURT
  }],
  caseAdditionalSecurityFlag: false,
  facilitiesRequired: ['AF-VF'],
  listingComments: '',
  hearingRequester: '',
  privateHearingRequiredFlag: false,
  caseInterpreterRequiredFlag: false,
  leadJudgeContractType: '',
  judiciary: {
    roleType: [''],
    authorisationTypes: [''],
    authorisationSubType: [''],
    panelComposition: [{
      memberType: '',
      count: 1
    }],
    judiciaryPreferences: [
      {
        memberID: 'p1000000',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      }
    ],
    judiciarySpecialisms: ['']
  },
  hearingIsLinkedFlag: false,
  panelRequirements: {
    roleType: [
    ],
    panelPreferences: [],
    panelSpecialisms: [
      'BBA3-DQPM',
      'BBA3-MQPM2-003',
      'BBA3-MQPM2-004',
      'BBA3-FQPM',
      'BBA3-RMM'
    ]
  },
  parties: [
    {
      partyID: 'P1',
      partyType: PartyType.IND,
      partyName: 'Jane and Smith',
      partyRole: 'APP',
      individualDetails: {
        title: 'Miss',
        firstName: 'Jane',
        lastName: 'Smith',
        preferredHearingChannel: 'INTER'
      },
      unavailabilityRanges: [
      ]
    },
    {
      partyID: 'P2',
      partyType: PartyType.IND,
      partyName: 'DWP',
      partyRole: 'DEF',
      individualDetails: {
        title: '',
        firstName: 'DWP',
        lastName: 'Representative',
        preferredHearingChannel: 'INTER'
      },
      unavailabilityRanges: [
      ]
    }],
  caseFlags: {
    flags: [
    ],
    flagAmendURL: '/flag/amend'
  },
  screenFlow: [
    {
      screenName: 'hearing-requirements',
      navigation: [
        {
          resultValue: 'hearing-facilities'
        }
      ]
    },
    {
      screenName: 'hearing-facilities',
      navigation: [
        {
          resultValue: 'hearing-stage'
        }
      ]
    },
    {
      screenName: 'hearing-stage',
      navigation: [
        {
          resultValue: 'hearing-attendance'
        }
      ]
    },
    {
      screenName: 'hearing-attendance',
      navigation: [
        {
          resultValue: 'hearing-venue'
        }
      ]
    },
    {
      screenName: 'hearing-venue',
      conditionKey: 'regionId',
      navigation: [
        {
          conditionOperator: 'INCLUDE',
          conditionValue: '7',
          resultValue: 'hearing-welsh'
        },
        {
          conditionOperator: 'NOT INCLUDE',
          conditionValue: '7',
          resultValue: 'hearing-panel-required'
        }
      ]
    },
    {
      screenName: 'hearing-welsh',
      navigation: [
        {
          resultValue: 'hearing-panel-required'
        }
      ]
    },
    {
      screenName: 'hearing-panel-required',
      conditionKey: 'isAPanelFlag',
      navigation: [
        {
          conditionOperator: 'INCLUDE',
          conditionValue: 'true',
          resultValue: 'hearing-panel-selector'
        },
        {
          conditionOperator: 'NOT INCLUDE',
          conditionValue: 'false',
          resultValue: 'hearing-judge'
        }
      ]
    },
    {
      screenName: 'hearing-judge',
      navigation: [
        {
          resultValue: 'hearing-timing'
        }
      ]
    },
    {
      screenName: 'hearing-panel-selector',
      navigation: [
        {
          resultValue: 'hearing-timing'
        }
      ]
    },
    {
      screenName: 'hearing-timing',
      navigation: [
        {
          resultValue: 'hearing-link'
        }
      ]
    },
    {
      screenName: 'hearing-link',
      navigation: [
        {
          resultValue: 'hearing-additional-instructions'
        }
      ]
    },
    {
      screenName: 'hearing-additional-instructions',
      navigation: [
        {
          resultValue: 'hearing-create-edit-summary'
        }
      ]
    }
  ],
  vocabulary: [
    {
      word1: ''
    }
  ]
};
