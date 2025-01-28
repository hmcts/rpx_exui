import { HearingActualsMainModel } from './models/hearingActualsMainModel';
import { HearingRequestMainModel } from './models/hearingRequestMain.model';
import {
  CategoryType, EXUIDisplayStatusEnum, EXUISectionStatusEnum,
  GroupLinkType,
  HearingListingStatusEnum,
  HearingResult,
  HMCLocationType,
  HMCStatus,
  LaCaseStatus,
  ListingStatus,
  MemberType,
  PartyType,
  RequirementType,
  UnavailabilityType
} from './models/hearings.enum';
import { JudicialUserModel } from './models/judicialUser.model';
import { ServiceHearingValuesModel } from './models/serviceHearingValues.model';

export const hearingStageRefData = [
  {
    key: 'initial',
    value_en: 'Initial',
    value_cy: '',
    hint_text_en: 'Initial',
    hint_text_cy: '',
    lov_order: 1,
    parent_key: null,
    category_key: 'HearingType',
    parent_category: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    key: 'final',
    value_en: 'Final',
    value_cy: '',
    hint_text_en: 'Final',
    hint_text_cy: '',
    lov_order: 2,
    parent_key: null,
    category_key: 'HearingType',
    parent_category: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    key: 'substantial',
    value_en: 'Substantial',
    value_cy: '',
    hint_text_en: 'Substantial',
    hint_text_cy: '',
    lov_order: 3,
    parent_key: null,
    category_key: 'HearingType',
    parent_category: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    key: 'case-management',
    value_en: 'Case management',
    value_cy: '',
    hint_text_en: 'Case management',
    hint_text_cy: '',
    lov_order: 4,
    parent_key: null,
    category_key: 'HearingType',
    parent_category: '',
    active_flag: 'Y',
    child_nodes: null
  }
];

export const judicialUsersRefData: JudicialUserModel[] = [{
  title: 'Mr',
  knownAs: 'Jacky Collins',
  surname: 'Jacky Collins',
  fullName: 'Jacky Collins',
  emailId: 'jacky.collins@judicial.com',
  idamId: '1102839232',
  initials: 'JC',
  postNominals: 'JP',
  personalCode: 'P0000001',
  isJudge: '',
  isMagistrate: '',
  isPanelMember: ''
}];

export const panelMembersRefData: JudicialUserModel[] = [{
  title: 'Mr',
  knownAs: 'Ramon',
  surname: 'Herrera',
  fullName: 'Ramon Herrera',
  emailId: '7007496EMP-@ejudiciary.net',
  idamId: 'a229ec37-d84d-4eed-bd7f-0c77a6721da6',
  initials: 'RH',
  postNominals: 'JP',
  personalCode: '7007496',
  isJudge: '',
  isMagistrate: '',
  isPanelMember: ''
}];

export const judgeRefData: JudicialUserModel[] = [
  {
    title: 'Mr',
    knownAs: 'Jacky Collins',
    surname: 'Collins',
    fullName: 'Jacky Collins',
    emailId: 'jacky.collins@judicial.com',
    idamId: '38eb0c5e-29c7-453e-b92d-f2029aaed6c1',
    initials: 'JC',
    postNominals: 'JP',
    personalCode: 'P0000001',
    isJudge: '',
    isMagistrate: '',
    isPanelMember: ''
  }];

export const hearingPriorityRefData = [
  {
    key: 'urgent',
    value_en: 'Urgent',
    value_cy: '',
    hintText_EN: 'Urgent',
    hintTextCY: '',
    order: 1,
    parentKey: null
  },
  {
    key: 'standard',
    value_en: 'Standard',
    value_cy: '',
    hintText_EN: 'Standard',
    hintTextCY: '',
    order: 2,
    parentKey: null
  }
];

export const facilitiesListRefData = [
  {
    key: 'immigrationDetentionCentre',
    value_en: 'Immigration detention centre',
    value_cy: '',
    hintText_EN: 'Immigration detention centre',
    hintTextCY: '',
    order: 1,
    parentKey: null
  },
  {
    key: 'inCameraCourt',
    value_en: 'In camera court',
    value_cy: '',
    hintText_EN: 'In camera court',
    hintTextCY: '',
    order: 2,
    parentKey: null
  },
  {
    key: 'sameSexCourtroom',
    value_en: 'Same-sex courtroom',
    value_cy: '',
    hint_text_EN: 'Same-sex courtroom',
    hint_text_CY: '',
    order: 3,
    parentKey: null
  },
  {
    key: 'secureDock',
    value_en: 'Secure dock',
    value_cy: '',
    hint_text_EN: 'Secure dock',
    hint_text_CY: '',
    order: 4,
    parentKey: null
  }
];

export const partyChannelsRefData = [
  {
    key: 'inPerson',
    value_en: 'In person',
    value_cy: '',
    hintText_EN: 'in person',
    hintTextCY: '',
    order: 1,
    parentKey: null
  },
  {
    key: 'byPhone',
    value_en: 'By phone',
    value_cy: '',
    hintText_EN: 'By Phone',
    hintTextCY: '',
    order: 2,
    parentKey: null
  },
  {
    key: 'byVideo',
    value_en: 'By video',
    value_cy: '',
    hintText_EN: 'By video',
    hintTextCY: '',
    order: 4,
    parentKey: null
  },
  {
    key: 'notAttending',
    value_en: 'Not attending',
    value_cy: '',
    hintText_EN: 'not attending',
    hintTextCY: '',
    order: 5,
    parentKey: null
  }
];

export const partySubChannelsRefData = [
  {
    category_key: 'HearingSubChannel',
    key: 'VIDSKYPE',
    value_en: 'Video - Skype',
    value_cy: 'Drwy Fideo - Skype',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'VID',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'TELOTHER',
    value_en: 'Telephone - Other',
    value_cy: 'Dros y Ffôn - Arall',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'TEL',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'VIDTEAMS',
    value_en: 'Video - Teams',
    value_cy: 'Drwy Fideo - Teams',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'VID',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'VIDCVP',
    value_en: 'Video - CVP',
    value_cy: 'Drwy Fideo - CVP',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'VID',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'VIDOTHER',
    value_en: 'Video - Other',
    value_cy: 'Drwy Fideo - Arall',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'VID',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'TELCVP',
    value_en: 'Telephone - CVP',
    value_cy: 'Dros y Ffôn - CVP',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'TEL',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'NA',
    value_en: 'Not in Attendance',
    value_cy: 'Ddim yn Bresennol',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'NA',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'INTER',
    value_en: 'In Person',
    value_cy: 'Yn Bersonol',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'INTER',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'TELBTM',
    value_en: 'Telephone - BTMeetme',
    value_cy: 'Dros y Ffôn - BTMeetme',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'TEL',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'VIDPVL',
    value_en: 'Prison Video',
    value_cy: 'Cyswllt Fideo â Charchar',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'VID',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'TELSKYP',
    value_en: 'Telephone - Skype',
    value_cy: 'Dros y Ffôn - Skype',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'TEL',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'HearingSubChannel',
    key: 'VIDVHS',
    value_en: 'Video - Video Hearing Service',
    value_cy: 'Drwy Fideo - Gwasanaeth Gwrandawiadau Fideo',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'HearingChannel',
    parent_key: 'VID',
    active_flag: 'Y',
    child_nodes: null
  }
];

export const caseTypeRefData = [
  {
    category_key: 'caseType',
    key: 'BBA3-002',
    value_en: 'PERSONAL INDEPENDENT PAYMENT (NEW CLAIM)',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: [
      {
        category_key: 'caseSubType',
        key: 'BBA3-002EC',
        value_en: 'ECHR',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002CP',
        value_en: 'CIVIL PENALTIES',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002EX',
        value_en: 'EX LEGISLATION',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002MO',
        value_en: 'MOBILITY COMPONENT',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002LE',
        value_en: 'LATE (EXTENDING BACK)',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002CC',
        value_en: 'CONDITIONS OF ENTITLEMENT - COMPLEX',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002OC',
        value_en: 'OVERPAYMENT - CAPITAL',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002RA',
        value_en: 'RATE OF ASSESSMENT/PAYABILITY ISSUES',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002EI',
        value_en: 'EXPORTABILITY ISSUES',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002OS',
        value_en: 'OVERPAYMENT - STRAIGHTFORWARD',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002DD',
        value_en: 'APPEAL DIRECTLY LODGED',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002AA',
        value_en: 'INVALID',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002LC',
        value_en: 'DAILY LIVING COMPONENT',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002MD',
        value_en: 'MOBILITY (DLA)',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002ON',
        value_en: 'ONE PROJECT',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002CE',
        value_en: 'CONDITIONS OF ENTITLEMENT',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002RC',
        value_en: 'RATE OF ASSESSMENT/PAYABILITY ISSUES - COMPLEX',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002OX',
        value_en: 'OVERPAYMENT - COMPLEX',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002CD',
        value_en: 'CARE (DLA)',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002AR',
        value_en: 'ALTERNATIVE DISPUTE RESOLUTION',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002VW',
        value_en: 'VERBALLY WITHDRAWN',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002CF',
        value_en: 'CARE/MOBILITY (DLA)',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002GC',
        value_en: 'GOOD CAUSE',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'caseSubType',
        key: 'BBA3-002ML',
        value_en: 'DAILY LIVING/MOBILITY',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'caseType',
        parent_key: 'BBA3-002',
        active_flag: 'Y',
        child_nodes: null
      }
    ]
  }
];

export const caseFlagsRefData = [
  {
    name: 'Case',
    hearingRelevant: true,
    flagComment: true,
    flagCode: 'CF0001',
    isParent: true,
    Path: [],
    childFlags: [
      {
        name: 'Complex Case',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'CF0002',
        isParent: false,
        Path: [
          'Case'
        ],
        childFlags: []
      },
      {
        name: 'Potentially harmful medical evidence',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'CF0003',
        isParent: false,
        Path: [
          'Case'
        ],
        childFlags: []
      },
      {
        name: 'Gender recognition',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'CF0004',
        isParent: false,
        Path: [
          'Case'
        ],
        childFlags: []
      },
      {
        name: 'Domestic violence allegation',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'CF0005',
        isParent: false,
        Path: [
          'Case'
        ],
        childFlags: []
      },
      {
        name: 'Potential fraud',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'CF0006',
        isParent: false,
        Path: [
          'Case'
        ],
        childFlags: []
      },
      {
        name: 'Urgent flag',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'CF0007',
        isParent: false,
        Path: [
          'Case'
        ],
        childFlags: []
      },
      {
        name: 'Exclusion order with Police',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'CF0008',
        isParent: false,
        Path: [
          'Case'
        ],
        childFlags: []
      }
    ]
  },
  {
    name: 'Party',
    hearingRelevant: true,
    flagComment: true,
    flagCode: 'PF0001',
    isParent: true,
    Path: [],
    childFlags: [
      {
        name: 'Vulnerable user',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0002',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Potentially suicidal',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0003',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Confidential address',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0004',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Anonymous party',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0005',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Potentially Violent Person',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0006',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Unacceptable customer behaviour',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0007',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Vexatious litigant',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0008',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Civil restraint order',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0009',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Extended civil restraint order',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0010',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Banning order',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0011',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Foreign national offender',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0012',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Unaccompanied minor',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0013',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Audio/Video Evidence',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0014',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Language Interpreter',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'PF0015',
        isParent: false,
        Path: [
          'Party'
        ],
        childFlags: []
      },
      {
        name: 'Reasonable adjustment',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'RA0001',
        isParent: true,
        Path: [
          'Party'
        ],
        childFlags: [
          {
            name: 'Alternative formats of our information',
            hearingRelevant: true,
            flagComment: true,
            flagCode: 'RA0002',
            isParent: true,
            Path: [
              'Party', 'Reasonable adjustment'
            ],
            childFlags: [
              {
                name: 'Audio / CD',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0009',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Alternative formats of our information'
                ],
                childFlags: []
              },
              {
                name: 'Braille',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0010',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Alternative formats of our information'
                ],
                childFlags: []
              },
              {
                name: 'Coloured paper',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0011',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Alternative formats of our information'
                ],
                childFlags: []
              },
              {
                name: 'Easy Read',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0012',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Alternative formats of our information'
                ],
                childFlags: []
              },
              {
                name: 'Larger font size',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0013',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Alternative formats of our information'
                ],
                childFlags: []
              }
            ]
          },
          {
            name: 'Assistance with court and tribunal processes and forms',
            hearingRelevant: true,
            flagComment: true,
            flagCode: 'RA0003',
            isParent: true,
            Path: [
              'Party', 'Reasonable adjustment'
            ],
            childFlags: [
              {
                name: 'Completing forms and documents dictated by customer',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0014',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Assistance with court and tribunal processes and forms'
                ],
                childFlags: []
              },
              {
                name: 'Face to face explanations to help customer to complete forms',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0015',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Assistance with court and tribunal processes and forms'
                ],
                childFlags: []
              },
              {
                name: 'Reading documents for customer',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0016',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Assistance with court and tribunal processes and forms'
                ],
                childFlags: []
              },
              {
                name: 'Time and opportunity for customer to explain their needs and preferences',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0017',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Assistance with court and tribunal processes and forms'
                ],
                childFlags: []
              }
            ]
          },
          {
            name: 'Pre- Hearing visit',
            hearingRelevant: true,
            flagComment: true,
            flagCode: 'RA0004',
            isParent: false,
            Path: [
              'Party', 'Reasonable adjustment'
            ],
            childFlags: []
          },
          {
            name: 'Physical access and facilities',
            hearingRelevant: true,
            flagComment: true,
            flagCode: 'RA0005',
            isParent: true,
            Path: [
              'Party', 'Reasonable adjustment'
            ],
            childFlags: [
              {
                name: 'Accessible toilet',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0018',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Assistance to get to court or tribunal',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0019',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Assistance using lifts',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0020',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Lift required',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0021',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Parking space close to court or tribunal',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0022',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Personal Evacuation Emergency Plan (PEEP) arrangements',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0023',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Ramps',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0024',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Relocation to another building / hearing room / ground floor room',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0025',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Use of venue wheelchair',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0026',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              },
              {
                name: 'Wheelchair access',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0027',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Physical access and facilities'
                ],
                childFlags: []
              }
            ]
          },
          {
            name: 'Within our buildings and hearing room environment',
            hearingRelevant: true,
            flagComment: true,
            flagCode: 'RA0006',
            isParent: true,
            Path: [
              'Party', 'Reasonable adjustment'
            ],
            childFlags: [
              {
                name: 'Alterations to seating layout',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0028',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment'
                ],
                childFlags: []
              },
              {
                name: 'Chair in the witness box',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0030',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment'
                ],
                childFlags: []
              },
              {
                name: 'Chair with back support / cushion / arms / adjustable / extra leg room',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0031',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment'
                ],
                childFlags: []
              },
              {
                name: 'Hearing Enhancement System (hearing loops infra red receiver)',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0032',
                isParent: true,
                Path: [
                  'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment'
                ],
                childFlags: [
                  {
                    name: 'Hearing Loop',
                    hearingRelevant: true,
                    flagComment: true,
                    flagCode: 'RA0053',
                    isParent: false,
                    Path: [
                      'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment',
                      'Hearing Enhancement System (hearing loops infra red receiver)'
                    ],
                    childFlags: []
                  },
                  {
                    name: 'Infra Red Receiver',
                    hearingRelevant: true,
                    flagComment: true,
                    flagCode: 'RA0054',
                    isParent: false,
                    Path: [
                      'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment',
                      'Hearing Enhancement System (hearing loops infra red receiver)'
                    ],
                    childFlags: []
                  },
                  {
                    name: 'Induction Loop',
                    hearingRelevant: true,
                    flagComment: true,
                    flagCode: 'RA0055',
                    isParent: false,
                    Path: [
                      'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment',
                      'Hearing Enhancement System (hearing loops infra red receiver)'
                    ],
                    childFlags: []
                  }
                ]
              },
              {
                name: 'Natural light',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0033',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment'
                ],
                childFlags: []
              },
              {
                name: 'Need to be close to who is speaking',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0034',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment'
                ],
                childFlags: []
              },
              {
                name: 'Separate waiting area / Private room',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0035',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment'
                ],
                childFlags: []
              }
            ]
          },
          {
            name: 'The Hearing',
            hearingRelevant: true,
            flagComment: true,
            flagCode: 'RA0007',
            isParent: true,
            Path: [
              'Party', 'Reasonable adjustment'
            ],
            childFlags: [
              {
                name: 'Domiciliary hearing',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0036',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'The Hearing'
                ],
                childFlags: []
              },
              {
                name: 'Facility to be able to get up and move around',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0037',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'The Hearing'
                ],
                childFlags: []
              },
              {
                name: 'On-line hearing',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0038',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'The Hearing'
                ],
                childFlags: []
              },
              {
                name: 'Regular or extra breaks (eg for medication, food and drink or lavatory needs',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0039',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'The Hearing'
                ],
                childFlags: []
              },
              {
                name: 'Telephone hearing',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0040',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'The Hearing'
                ],
                childFlags: []
              },
              {
                name: 'Video link',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0041',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'The Hearing'
                ],
                childFlags: []
              }
            ]
          },
          {
            name: 'Help or support from a third party',
            hearingRelevant: true,
            flagComment: true,
            flagCode: 'RA0008',
            isParent: true,
            Path: [
              'Party', 'Reasonable adjustment'
            ],
            childFlags: [
              {
                name: 'Sign Language Interpreter',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0042',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'CA Witness Services',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0043',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Clock (Community Legal Outreach Collaboration) representative',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0044',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Good Things foundation',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0045',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Intermediary',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0046',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Lip Speaker',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0047',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Mackenzie Friend',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0048',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Other Charity representative',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0049',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Personal Support Unit',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0050',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Speech to text reporter (Palantypist)',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0051',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              },
              {
                name: 'Support Worker / Carer',
                hearingRelevant: true,
                flagComment: true,
                flagCode: 'RA0052',
                isParent: false,
                Path: [
                  'Party', 'Reasonable adjustment', 'Help or support from a third party'
                ],
                childFlags: []
              }
            ]
          }
        ]
      }
    ]
  }
];

export const serviceHearingValuesModel: ServiceHearingValuesModel = {
  hmctsServiceID: 'BBA3',
  hmctsInternalCaseName: 'Jane Smith vs DWP',
  publicCaseName: 'Jane Smith vs DWP',
  autoListFlag: false,
  hearingType: 'Final',
  hearingChannels: [],
  caseCategories: [
    {
      categoryType: CategoryType.CaseType,
      categoryValue: 'BBA3-002'
    }, {
      categoryType: CategoryType.CaseSubType,
      categoryValue: 'BBA3-002CC',
      categoryParent: 'BBA3-002'
    }, {
      categoryType: CategoryType.CaseSubType,
      categoryValue: 'BBA3-002GC',
      categoryParent: 'BBA3-002'
    }, {
      categoryType: CategoryType.CaseSubType,
      categoryValue: 'BBA3-002RC',
      categoryParent: 'BBA3-002'
    }
  ],
  caseDeepLink: 'https://manage-case.demo.platform.hmcts.net/',
  caserestrictedFlag: false,
  externalCaseReference: '',
  caseManagementLocationCode: '196538',
  caseSLAStartDate: '2021-05-05T09:00:00.000Z',
  hearingWindow: {
    dateRangeStart: '2022-11-23T09:00:00.000Z',
    dateRangeEnd: '2022-11-30T09:00:00.000Z',
    firstDateTimeMustBe: '2022-12-21T09:00:00.000Z'
  },
  duration: 45,
  hearingPriorityType: 'standard',
  numberOfPhysicalAttendees: 2,
  hearingInWelshFlag: false,
  hearingLocations: [{
    locationId: '196538',
    locationType: HMCLocationType.COURT
  },
  {
    locationId: '234850',
    locationType: HMCLocationType.COURT
  }
  ],
  caseAdditionalSecurityFlag: false,
  facilitiesRequired: [],
  listingComments: '',
  hearingRequester: '',
  privateHearingRequiredFlag: false,
  caseInterpreterRequiredFlag: false,
  leadJudgeContractType: '',
  judiciary: {
    roleType: [
      ''
    ],
    authorisationTypes: [
      ''
    ],
    authorisationSubType: [
      ''
    ],
    panelComposition: [
      {
        memberType: '',
        count: 1
      }
    ],
    judiciaryPreferences: [
      {
        memberID: 'p1000000',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      }
    ],
    judiciarySpecialisms: [
      ''
    ]
  },
  hearingIsLinkedFlag: false,
  panelRequirements: {
    roleType: [
      'tj',
      'dtj',
      'rtj'
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
      partyRole: 'appellant',
      partyName: 'Jane Smith',
      individualDetails: {
        title: 'Mrs',
        firstName: 'Jane',
        lastName: 'Smith',
        preferredHearingChannel: 'inPerson',
        reasonableAdjustments: [
          'RA0042',
          'SM0001'
        ]
      },
      unavailabilityRanges: [
        {
          unavailableFromDate: '2021-12-10T09:00:00.000Z',
          unavailableToDate: '2021-12-31T09:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        }
      ]
    },
    {
      partyID: 'P2',
      partyType: PartyType.ORG,
      partyRole: 'claimant',
      partyName: 'DWP',
      organisationDetails: {
        name: 'DWP',
        organisationType: 'GOV',
        cftOrganisationID: 'O100000'
      },
      unavailabilityRanges: [
        {
          unavailableFromDate: '2021-12-20T09:00:00.000Z',
          unavailableToDate: '2021-12-31T09:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        }
      ]
    }],
  caseFlags: {
    flags: [
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'RA0008',
        flagId: 'RA0042',
        flagDescription: 'Sign language interpreter required',
        flagStatus: 'ACTIVE',
        dateTimeCreated: '2023-11-07T09:00:00.000Z',
        dateTimeModified: '2023-11-07T09:00:00.000Z'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'RA0032',
        flagId: 'RA0053',
        flagDescription: 'Hearing loop required',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'RA0002',
        flagId: 'RA0013',
        flagDescription: 'Larger font size',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'RA0003',
        flagId: 'RA0016',
        flagDescription: 'Reading documents for customer',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'RA0008',
        flagId: 'RA0042',
        flagDescription: 'Sign Language Interpreter',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'PF0001',
        flagId: 'PF0015',
        flagDescription: 'Language Interpreter',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'PF0001',
        flagId: 'PF0002',
        flagDescription: 'Vulnerable user',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P2',
        partyName: 'DWP',
        flagParentId: 'RA0001',
        flagId: 'RA0005',
        flagDescription: 'Physical access and facilities',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P2',
        partyName: 'DWP',
        flagParentId: 'PF0001',
        flagId: 'PF0011',
        flagDescription: 'Banning order',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P2',
        partyName: 'Jane Smith vs DWP',
        flagParentId: 'CF0001',
        flagId: 'CF0002',
        flagDescription: 'Complex Case',
        flagStatus: 'ACTIVE',
        dateTimeCreated: '2024-07-02T00:00:00.000Z',
        dateTimeModified: null
      },
      {
        partyId: 'P2',
        partyName: 'Jane Smith vs DWP',
        flagParentId: 'CF0001',
        flagId: 'CF0006',
        flagDescription: 'Potential fraud',
        flagStatus: 'ACTIVE',
        dateTimeCreated: '2024-07-02T00:00:00.000Z',
        dateTimeModified: '2024-07-03T00:00:00.000Z'
      },
      {
        partyId: 'P2',
        partyName: 'Jane Smith vs DWP',
        flagParentId: 'CF0001',
        flagId: 'CF0007',
        flagDescription: 'Urgent flag',
        flagStatus: 'ACTIVE',
        dateTimeCreated: '2022-01-23T09:00:00.000Z'
      }
    ],
    flagAmendURL: '/'
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
          resultValue: 'hearing-judge'
        }
      ]
    },
    {
      screenName: 'hearing-welsh',
      navigation: [
        {
          resultValue: 'hearing-judge'
        }
      ]
    },
    {
      screenName: 'hearing-judge',
      navigation: [
        {
          resultValue: 'hearing-panel'
        }
      ]
    },
    {
      screenName: 'hearing-panel',
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

export const hearingRequestMainModel: HearingRequestMainModel = {
  requestDetails: {
    timestamp: '2022-02-23T09:00:00.000Z',
    versionNumber: 1
  },
  hearingDetails: {
    duration: 45,
    hearingType: 'final',
    hearingChannels: [],
    hearingLocations: [
      {
        locationId: '196538',
        locationType: HMCLocationType.COURT
      }
    ],
    hearingIsLinkedFlag: false,
    hearingWindow: {
      dateRangeStart: '2022-11-23T09:00:00.000Z',
      dateRangeEnd: '2022-11-30T09:00:00.000Z',
      firstDateTimeMustBe: '2022-12-01T09:00:00.000Z'
    },
    privateHearingRequiredFlag: false,
    panelRequirements: null,
    autolistFlag: false,
    hearingPriorityType: 'standard',
    numberOfPhysicalAttendees: 2,
    hearingInWelshFlag: false,
    facilitiesRequired: [
      'immigrationDetentionCentre',
      'inCameraCourt',
      'sameSexCourtroom'
    ],
    listingComments: 'Interpreter required',
    hearingRequester: '',
    leadJudgeContractType: '',
    amendReasonCodes: [],
    listingAutoChangeReasonCode: null
  },
  caseDetails: {
    hmctsServiceCode: 'BBA3',
    caseRef: '1584618195804035',
    requestTimeStamp: null,
    hearingID: 'h100001',
    externalCaseReference: null,
    caseDeepLink: null,
    hmctsInternalCaseName: 'Jane Smith vs DWP',
    publicCaseName: 'Jane Smith vs DWP',
    caseAdditionalSecurityFlag: false,
    caseInterpreterRequiredFlag: false,
    caseCategories: [
      {
        categoryType: CategoryType.CaseType,
        categoryValue: 'BBA3-002'
      }, {
        categoryType: CategoryType.CaseSubType,
        categoryValue: 'BBA3-002CC',
        categoryParent: 'BBA3-002'
      }, {
        categoryType: CategoryType.CaseSubType,
        categoryValue: 'BBA3-002GC',
        categoryParent: 'BBA3-002'
      }, {
        categoryType: CategoryType.CaseSubType,
        categoryValue: 'BBA3-002RC',
        categoryParent: 'BBA3-002'
      }],
    caseManagementLocationCode: '196538',
    caserestrictedFlag: false,
    caseSLAStartDate: '2021-11-23T09:00:00.000Z'
  },
  partyDetails: [
    {
      partyID: 'P1',
      partyType: PartyType.IND,
      partyRole: 'appellant',
      individualDetails: {
        title: null,
        firstName: 'Jane',
        lastName: 'Smith',
        preferredHearingChannel: 'inPerson'
      }
    },
    {
      partyID: 'P2',
      partyType: PartyType.ORG,
      partyRole: 'claimant',
      organisationDetails: {
        name: 'DWP',
        organisationType: 'GOV',
        cftOrganisationID: 'O100000'
      }
    }
  ],
  hearingResponse: {
    listAssistTransactionID: '123456789',
    receivedDateTime: '2021-11-30T09:00:00.000Z',
    responseVersion: 0,
    laCaseStatus: LaCaseStatus.PENDING_RELISTING,
    listingStatus: ListingStatus.DRAFT,
    hearingCancellationReason: '123456543',
    hearingDaySchedule: [{
      hearingStartDateTime: '2021-03-12T09:00:00.000Z',
      hearingEndDateTime: '2021-03-12T16:00:00.000Z',
      listAssistSessionID: '0d22d836-b25a-11eb-a18c-f2d58a9b7b15',
      hearingVenueId: '815833',
      hearingRoomId: 'room 4',
      hearingJudgeId: 'p1000002',
      panelMemberIds: ['p1000001'],
      attendees: [
        {
          partyID: 'P1',
          partyName: 'Jane and Smith',
          partyType: PartyType.IND,
          partyRole: 'appellant',
          individualDetails: {
            title: null,
            firstName: 'Jane',
            lastName: 'Smith',
            preferredHearingChannel: 'inPerson'
          }
        },
        {
          partyID: 'P2',
          partyName: 'DWP',
          partyType: PartyType.ORG,
          partyRole: 'claimant',
          organisationDetails: {
            name: 'DWP',
            organisationType: 'GOV',
            cftOrganisationID: 'O100000'
          }
        }
      ]
    }]
  }
};

export const hearingActualsMainModel: HearingActualsMainModel = {
  hearingActuals: {
    hearingOutcome: {
      hearingFinalFlag: false,
      hearingResult: HearingResult.CANCELLED,
      hearingResultDate: '2019-01-01',
      hearingResultReasonType: 'unable',
      hearingType: 'Pre-hearing review'
    },
    actualHearingDays: [
      {
        hearingDate: '2021-03-12',
        hearingStartTime: '2021-03-12T09:00:00.000Z',
        hearingEndTime: '2021-03-12T10:00:00.000Z',
        pauseDateTimes: [],
        notRequired: false,
        actualDayParties: [
          {
            actualPartyId: '1',
            individualDetails: {
              firstName: 'Bob',
              lastName: 'Jones'
            },
            actualOrganisationName: 'Company A',
            didNotAttendFlag: false,
            partyChannelSubType: 'inPerson',
            partyRole: 'appellant',
            representedParty: ''
          },
          {
            actualPartyId: '2',
            individualDetails: {
              firstName: 'Mary',
              lastName: 'Jones'
            },
            actualOrganisationName: 'Company B',
            didNotAttendFlag: false,
            partyChannelSubType: 'inPerson',
            partyRole: 'claimant',
            representedParty: ''
          },
          {
            actualPartyId: '3',
            individualDetails: {
              firstName: 'James',
              lastName: 'Gods'
            },
            actualOrganisationName: 'Solicitors A',
            didNotAttendFlag: false,
            partyChannelSubType: 'inPerson',
            partyRole: 'interpreter',
            representedParty: '1'
          }
        ]
      },
      {
        hearingDate: '2021-03-14',
        hearingStartTime: '2021-03-14T09:00:00.000Z',
        hearingEndTime: '2021-03-14T10:00:00.000Z',
        pauseDateTimes: [],
        notRequired: false,
        actualDayParties: [
          {
            actualPartyId: '1',
            individualDetails: {
              firstName: 'Bob',
              lastName: 'Jones'
            },
            actualOrganisationName: 'Company A',
            didNotAttendFlag: false,
            partyChannelSubType: 'inPerson',
            partyRole: 'appellant',
            representedParty: ''
          },
          {
            actualPartyId: '2',
            individualDetails: {
              firstName: 'Mary',
              lastName: 'Jones'
            },
            actualOrganisationName: 'Company B',
            didNotAttendFlag: false,
            partyChannelSubType: 'inPerson',
            partyRole: 'claimant',
            representedParty: ''
          },
          {
            actualPartyId: '3',
            individualDetails: {
              firstName: 'James',
              lastName: 'Gods'
            },
            actualOrganisationName: 'Solicitors A',
            didNotAttendFlag: false,
            partyChannelSubType: 'inPerson',
            partyRole: 'interpreter',
            representedParty: '1'
          }
        ]
      }
    ]
  },
  hearingPlanned: {
    plannedHearingType: 'final',
    plannedHearingDays: [
      {
        plannedStartTime: '2021-03-12T09:00:00.000Z',
        plannedEndTime: '2021-03-12T10:00:00.000Z',
        parties: [
          {
            individualDetails: {
              title: 'Miss',
              firstName: 'Bob',
              lastName: 'Jones'
            },
            organisationDetails: {
              cftOrganisationID: '54321',
              name: 'Company A'
            },
            partyID: '1',
            partyRole: 'interpreter',
            partyChannelSubType: 'appellant'
          },
          {
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: ''
            },
            organisationDetails: {
              cftOrganisationID: 'ogd1',
              name: 'DWP'
            },
            partyID: '2',
            partyRole: 'interpreter',
            partyChannelSubType: 'claimant'
          }
        ]
      },
      {
        plannedStartTime: '2021-03-14T09:00:00.000Z',
        plannedEndTime: '2021-03-14T10:00:00.000Z',
        parties: [
          {
            individualDetails: {
              title: 'Miss',
              firstName: 'Jo',
              lastName: 'Blogg'
            },
            organisationDetails: {
              cftOrganisationID: '54321',
              name: 'Company A'
            },
            partyID: '1',
            partyRole: 'interpreter',
            partyChannelSubType: 'appellant'
          },
          {
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: ''
            },
            organisationDetails: {
              cftOrganisationID: 'ogd1',
              name: 'DWP'
            },
            partyID: '2',
            partyRole: 'interpreter',
            partyChannelSubType: 'claimant'
          }
        ]
      }
    ]
  },
  hmcStatus: HMCStatus.UPDATE_SUBMITTED,
  caseDetails: {
    hmctsServiceCode: 'BBA3',
    caseRef: '1584618195804035',
    requestTimeStamp: null,
    hearingID: 'h100001',
    externalCaseReference: null,
    caseDeepLink: null,
    hmctsInternalCaseName: 'Jane Smith vs DWP',
    publicCaseName: 'Jane Smith vs DWP',
    caseAdditionalSecurityFlag: false,
    caseInterpreterRequiredFlag: false,
    caseCategories: [
      {
        categoryType: CategoryType.CaseType,
        categoryValue: 'BBA3-002'
      }, {
        categoryType: CategoryType.CaseSubType,
        categoryValue: 'BBA3-002CC',
        categoryParent: 'BBA3-002'
      }, {
        categoryType: CategoryType.CaseSubType,
        categoryValue: 'BBA3-002GC',
        categoryParent: 'BBA3-002'
      }, {
        categoryType: CategoryType.CaseSubType,
        categoryValue: 'BBA3-002RC',
        categoryParent: 'BBA3-002'
      }],
    caseManagementLocationCode: null,
    caserestrictedFlag: false,
    caseSLAStartDate: '2021-11-23T09:00:00.000Z'
  }
};

export const initialState = {
  hearings: {
    hearingList: {
      hearingListMainModel: {
        caseRef: '1111222233334444',
        hmctsServiceID: 'BBA3',
        caseHearings: [{
          hearingID: 'h00001',
          hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
          hearingType: 'Case management hearing',
          hmcStatus: HMCStatus.HEARING_REQUESTED,
          lastResponseReceivedDateTime: '',
          responseVersion: 'rv1',
          hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
          listAssistCaseStatus: '',
          hearingIsLinkedFlag: true,
          hearingGroupRequestId: null,
          hearingDaySchedule: null
        }]
      }
    },
    hearingActuals: {
      hearingActualsMainModel,
      lastError: null
    },
    hearingValues: {
      serviceHearingValuesModel,
      lastError: null
    },
    hearingRequestToCompare: {
      hearingRequestMainModel: {
        requestDetails: {
          timestamp: null,
          versionNumber: 1
        },
        hearingDetails: {
          duration: 60,
          hearingType: 'final',
          hearingChannels: [],
          hearingLocations: [
            {
              locationId: '196538',
              locationType: HMCLocationType.COURT
            },
            {
              locationId: '234850',
              locationType: HMCLocationType.COURT
            }
          ],
          hearingIsLinkedFlag: false,
          hearingWindow: {
            dateRangeStart: '2022-12-12T09:00:00.000Z',
            dateRangeEnd: '2022-12-12T09:00:00.000Z',
            firstDateTimeMustBe: ''
          },
          privateHearingRequiredFlag: false,
          panelRequirements: null,
          autolistFlag: false,
          nonStandardHearingDurationReasons: [],
          hearingPriorityType: 'standard',
          numberOfPhysicalAttendees: 3,
          hearingInWelshFlag: false,
          facilitiesRequired: [
            'sameSexCourtroom',
            'secureDock'
          ],
          listingComments: 'some comments to compare',
          hearingRequester: null,
          leadJudgeContractType: null,
          amendReasonCodes: null,
          listingAutoChangeReasonCode: null,
          isAPanelFlag: false
        },
        caseDetails: {
          hmctsServiceCode: null,
          caseRef: '1234123412341234',
          requestTimeStamp: null,
          hearingID: null,
          externalCaseReference: null,
          caseDeepLink: null,
          hmctsInternalCaseName: null,
          publicCaseName: null,
          caseAdditionalSecurityFlag: false,
          caseInterpreterRequiredFlag: false,
          caseCategories: [
            {
              categoryType: CategoryType.CaseType,
              categoryValue: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002CC',
              categoryParent: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002GC',
              categoryParent: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002RC',
              categoryParent: 'BBA3-002'
            }],
          caseManagementLocationCode: null,
          caserestrictedFlag: false,
          caseSLAStartDate: null
        },
        partyDetails: [
          {
            partyID: 'P1',
            partyType: PartyType.IND,
            partyRole: 'appellant',
            individualDetails: {
              title: 'Miss',
              firstName: 'Jane',
              lastName: 'Rogers',
              reasonableAdjustments: [
                'RA0042',
                'RA0053',
                'RA0013',
                'RA0016',
                'RA0042',
                'RA0009'
              ],
              interpreterLanguage: 'spa',
              preferredHearingChannel: 'byVideo'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      },
      lastError: null
    },
    hearingRequest: {
      hearingRequestMainModel: {
        requestDetails: {
          hearingRequestID: '1000000',
          status: 'LISTED',
          timestamp: '2021-11-30T09:00:00.000Z',
          versionNumber: 1,
          cancellationReasonCodes: ['withdraw', 'struck']
        },
        hearingResponse: {
          listAssistTransactionID: '',
          responseVersion: 1,
          receivedDateTime: '2021-11-30T09:00:00.000Z',
          laCaseStatus: LaCaseStatus.PENDING_RELISTING,
          listingStatus: ListingStatus.FIXED,
          hearingCancellationReason: '',
          hearingDaySchedule: [{
            hearingStartDateTime: '2022-12-12T09:00:00.000Z',
            hearingEndDateTime: '2022-12-12T16:00:00.000Z',
            listAssistSessionID: '',
            hearingVenueId: '815833',
            hearingRoomId: 'room 3',
            hearingJudgeId: 'p1000002',
            panelMemberIds: ['p1000001'],
            attendees: [
              {
                partyID: 'P1',
                hearingSubChannel: 'inPerson',
                partyName: 'Jane and Smith',
                partyType: PartyType.IND,
                partyRole: 'appellant',
                individualDetails: {
                  firstName: 'Jane',
                  lastName: 'Smith',
                  preferredHearingChannel: 'inPerson'
                }
              },
              {
                partyID: 'P2',
                hearingSubChannel: 'byVideo',
                partyName: 'DWP',
                partyType: PartyType.ORG,
                partyRole: 'claimant',
                organisationDetails: {
                  name: 'DWP',
                  organisationType: 'GOV',
                  cftOrganisationID: 'O100000'
                }
              }
            ]
          }]
        },
        hearingDetails: {
          duration: 60,
          hearingType: 'final',
          hearingChannels: ['byPhone'],
          hearingLocations: [
            {
              locationId: '196538',
              locationType: HMCLocationType.COURT
            },
            {
              locationId: '234850',
              locationType: HMCLocationType.COURT
            }
          ],
          hearingIsLinkedFlag: false,
          hearingWindow: {
            dateRangeStart: '2022-12-12T09:00:00.000Z',
            dateRangeEnd: '2022-12-12T09:00:00.000Z',
            firstDateTimeMustBe: ''
          },
          privateHearingRequiredFlag: false,
          panelRequirements: null,
          autolistFlag: false,
          nonStandardHearingDurationReasons: [],
          hearingPriorityType: 'standard',
          numberOfPhysicalAttendees: 3,
          hearingInWelshFlag: false,
          facilitiesRequired: [
            'immigrationDetentionCentre',
            'inCameraCourt'
          ],
          listingComments: 'blah blah blah',
          hearingRequester: null,
          leadJudgeContractType: null,
          amendReasonCodes: null,
          listingAutoChangeReasonCode: null
        },
        caseDetails: {
          hmctsServiceCode: null,
          caseRef: '1234123412341234',
          requestTimeStamp: null,
          hearingID: null,
          externalCaseReference: null,
          caseDeepLink: null,
          hmctsInternalCaseName: 'Jane Smith vs DWP',
          publicCaseName: 'Jane Smith vs DWP',
          caseAdditionalSecurityFlag: false,
          caseInterpreterRequiredFlag: false,
          caseCategories: [
            {
              categoryType: CategoryType.CaseType,
              categoryValue: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002CC',
              categoryParent: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002GC',
              categoryParent: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002RC',
              categoryParent: 'BBA3-002'
            }],
          caseManagementLocationCode: '196538',
          caserestrictedFlag: false,
          caseSLAStartDate: null
        },
        partyDetails: [
          {
            partyID: 'P1',
            partyType: PartyType.IND,
            partyRole: 'appellant',
            individualDetails: {
              title: 'Miss',
              firstName: 'Jane',
              lastName: 'Smith',
              preferredHearingChannel: 'inPerson',
              reasonableAdjustments: [
                'RA0042',
                'RA0053',
                'RA0013',
                'RA0016',
                'RA0042'
              ],
              interpreterLanguage: 'spa'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P3',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      },
      lastError: null
    },
    hearingConditions: {
      caseId: '1111222233334444',
      mode: 'create',
      isInit: true,
      fragmentId: 'venue'
    },
    hearingLinks: {
      serviceLinkedCases: [
        {
          caseReference: '4652724902696213',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Linked for a hearing'
          ]
        },
        {
          caseReference: '5283819672542864',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Linked for a hearing',
            'Progressed as part of lead case'
          ]
        },
        {
          caseReference: '8254902572336147',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Familial',
            'Guardian',
            'Linked for a hearing'
          ]
        }
      ],
      serviceLinkedCasesWithHearings: [
        {
          caseRef: '4652724902696213',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Linked for a hearing'
          ],
          caseHearings: [{
            hearingID: 'h100001',
            hearingType: 'Substantive',
            hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
            lastResponseReceivedDateTime: '',
            exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
            exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
            hmcStatus: HMCStatus.HEARING_REQUESTED,
            responseVersion: 'rv1',
            hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
            listAssistCaseStatus: '',
            hearingIsLinkedFlag: true,
            hearingGroupRequestId: null,
            hearingDaySchedule: [],
            isSelected: true
          }]
        },
        {
          caseRef: '5283819672542864',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Linked for a hearing',
            'Progressed as part of lead case'
          ],
          caseHearings: []
        },
        {
          caseRef: '8254902572336147',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Familial',
            'Guardian',
            'Linked for a hearing'
          ],
          caseHearings: [{
            hearingID: 'h100010',
            hearingType: 'Direction Hearings',
            hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
            lastResponseReceivedDateTime: '',
            exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
            exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
            hmcStatus: HMCStatus.AWAITING_LISTING,
            responseVersion: 'rv1',
            hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
            listAssistCaseStatus: '',
            hearingIsLinkedFlag: true,
            hearingGroupRequestId: null,
            hearingDaySchedule: [],
            isSelected: true
          }, {
            hearingID: 'h100012',
            hearingType: 'Chambers Outcome',
            hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
            lastResponseReceivedDateTime: '',
            exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
            exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
            hmcStatus: HMCStatus.AWAITING_LISTING,
            responseVersion: 'rv1',
            hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
            listAssistCaseStatus: '',
            hearingIsLinkedFlag: true,
            hearingGroupRequestId: null,
            hearingDaySchedule: [],
            isSelected: true
          }]
        }
      ],
      linkedHearingGroup: {
        groupDetails: {
          groupName: 'Group A',
          groupReason: 'Reason 1',
          groupLinkType: GroupLinkType.ORDERED,
          groupComments: 'Comment 1'
        },
        hearingsInGroup: [
          {
            hearingId: 'h1000001',
            hearingOrder: 1
          },
          {
            hearingId: 'h1000003',
            hearingOrder: 2
          },
          {
            hearingId: 'h1000005',
            hearingOrder: 3
          }]
      },
      lastError: null
    }
  }
};

export const hearingRoles = [
  {
    category_key: 'EntityRoleCode',
    key: 'APEL',
    value_en: 'Appellant',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'Applicant',
    parent_key: 'APPL',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'APIN',
    value_en: 'Appointee',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'Support',
    parent_key: 'SUPP',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'JOPA',
    value_en: 'Joint Party',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'Applicant',
    parent_key: 'APPL',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'OTPA',
    value_en: 'Other Party',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'Respondent',
    parent_key: 'RESP',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'RESP',
    value_en: 'Respondent',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'WERP',
    value_en: 'Welfare Representative',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'Representative',
    parent_key: 'RPTT',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'LGRP',
    value_en: 'Legal Representative',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'Representative',
    parent_key: 'RPTT',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'BARR',
    value_en: 'Barrister',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: 'Representative',
    parent_key: 'RPTT',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'INTP',
    value_en: 'Interpreter',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'RPTT',
    value_en: 'Representative',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'SUPP',
    value_en: 'Support',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'APPL',
    value_en: 'Applicant',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  },
  {
    category_key: 'EntityRoleCode',
    key: 'DEFE',
    value_en: 'Defendant',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: null
  }
];

export const initialStateImmutable = {
  hearings: {
    hearingList: {
      hearingListMainModel: {
        caseRef: '1111222233334444',
        hmctsServiceID: 'BBA3',
        caseHearings: [{
          hearingID: 'h00001',
          hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
          hearingType: 'Case management hearing',
          hmcStatus: HMCStatus.HEARING_REQUESTED,
          lastResponseReceivedDateTime: '',
          responseVersion: 'rv1',
          hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
          listAssistCaseStatus: '',
          hearingIsLinkedFlag: true,
          hearingGroupRequestId: null,
          hearingDaySchedule: null
        }]
      }
    },
    hearingActuals: {
      hearingActualsMainModel,
      lastError: null
    },
    hearingValues: {
      serviceHearingValuesModel,
      lastError: null
    },
    hearingRequestToCompare: {
      hearingRequestMainModel: {
        requestDetails: {
          timestamp: null,
          versionNumber: 1
        },
        hearingDetails: {
          duration: 60,
          hearingType: 'final',
          hearingChannels: [],
          hearingLocations: [
            {
              locationId: '196538',
              locationType: HMCLocationType.COURT
            },
            {
              locationId: '234850',
              locationType: HMCLocationType.COURT
            }
          ],
          hearingIsLinkedFlag: false,
          hearingWindow: {
            dateRangeStart: '2022-12-12T09:00:00.000Z',
            dateRangeEnd: '2022-12-12T09:00:00.000Z',
            firstDateTimeMustBe: ''
          },
          privateHearingRequiredFlag: false,
          panelRequirements: null,
          autolistFlag: false,
          nonStandardHearingDurationReasons: [],
          hearingPriorityType: 'urgent',
          numberOfPhysicalAttendees: 3,
          hearingInWelshFlag: false,
          facilitiesRequired: [
            'immigrationDetentionCentre',
            'inCameraCourt'
          ],
          listingComments: 'blah blah blah',
          hearingRequester: null,
          leadJudgeContractType: null,
          amendReasonCodes: null,
          listingAutoChangeReasonCode: null
        },
        caseDetails: {
          hmctsServiceCode: null,
          caseRef: '1234123412341234',
          requestTimeStamp: null,
          hearingID: null,
          externalCaseReference: null,
          caseDeepLink: null,
          hmctsInternalCaseName: null,
          publicCaseName: null,
          caseAdditionalSecurityFlag: true,
          caseInterpreterRequiredFlag: false,
          caseCategories: [
            {
              categoryType: CategoryType.CaseType,
              categoryValue: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002CC',
              categoryParent: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002GC',
              categoryParent: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002RC',
              categoryParent: 'BBA3-002'
            }],
          caseManagementLocationCode: null,
          caserestrictedFlag: false,
          caseSLAStartDate: null
        },
        partyDetails: [
          {
            partyID: 'P1',
            partyType: PartyType.IND,
            partyRole: 'appellant',
            individualDetails: {
              title: 'Miss',
              firstName: 'Jane',
              lastName: 'Smith',
              reasonableAdjustments: [
                'RA0042',
                'RA0053',
                'RA0013',
                'RA0016',
                'RA0042',
                'RA0009'
              ],
              interpreterLanguage: 'spa',
              preferredHearingChannel: 'byVideo'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      },
      lastError: null
    },
    hearingRequest: {
      hearingRequestMainModel: {
        requestDetails: {
          hearingRequestID: '1000000',
          status: 'LISTED',
          timestamp: '2021-11-30T09:00:00.000Z',
          versionNumber: 1,
          cancellationReasonCodes: ['withdraw', 'struck']
        },
        hearingResponse: {
          listAssistTransactionID: '',
          responseVersion: 1,
          receivedDateTime: '2021-11-30T09:00:00.000Z',
          laCaseStatus: LaCaseStatus.PENDING_RELISTING,
          listingStatus: ListingStatus.FIXED,
          hearingCancellationReason: '',
          hearingDaySchedule: [{
            hearingStartDateTime: '2022-12-12T09:00:00.000Z',
            hearingEndDateTime: '2022-12-12T16:00:00.000Z',
            listAssistSessionID: '',
            hearingVenueId: '',
            hearingRoomId: 'room 3',
            hearingJudgeId: 'p1000002',
            panelMemberIds: ['p1000001'],
            attendees: [
              {
                partyID: 'P1',
                hearingSubChannel: 'inPerson',
                partyName: 'Jane and Smith',
                partyType: PartyType.IND,
                partyRole: 'appellant',
                individualDetails: {
                  firstName: 'Jane',
                  lastName: 'Smith',
                  preferredHearingChannel: 'inPerson'
                }
              },
              {
                partyID: 'P2',
                hearingSubChannel: 'byVideo',
                partyName: 'DWP',
                partyType: PartyType.ORG,
                partyRole: 'claimant',
                organisationDetails: {
                  name: 'DWP',
                  organisationType: 'GOV',
                  cftOrganisationID: 'O100000'
                }
              }
            ]
          }]
        },
        hearingDetails: {
          duration: 60,
          hearingType: 'final',
          hearingChannels: [],
          hearingLocations: [
            {
              locationId: '196538',
              locationType: HMCLocationType.COURT
            },
            {
              locationId: '234850',
              locationType: HMCLocationType.COURT
            }
          ],
          hearingIsLinkedFlag: false,
          hearingWindow: {
            dateRangeStart: '2022-12-12T09:00:00.000Z',
            dateRangeEnd: '2022-12-12T09:00:00.000Z',
            firstDateTimeMustBe: ''
          },
          privateHearingRequiredFlag: false,
          panelRequirements: null,
          autolistFlag: false,
          nonStandardHearingDurationReasons: [],
          hearingPriorityType: 'standard',
          numberOfPhysicalAttendees: 3,
          hearingInWelshFlag: false,
          facilitiesRequired: [
            'immigrationDetentionCentre',
            'inCameraCourt'
          ],
          listingComments: 'blah blah blah',
          hearingRequester: null,
          leadJudgeContractType: null,
          amendReasonCodes: null,
          listingAutoChangeReasonCode: null
        },
        caseDetails: {
          hmctsServiceCode: null,
          caseRef: '1234123412341234',
          requestTimeStamp: null,
          hearingID: null,
          externalCaseReference: null,
          caseDeepLink: null,
          hmctsInternalCaseName: 'Jane Smith vs DWP',
          publicCaseName: 'Jane Smith vs DWP',
          caseAdditionalSecurityFlag: false,
          caseInterpreterRequiredFlag: false,
          caseCategories: [
            {
              categoryType: CategoryType.CaseType,
              categoryValue: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002CC',
              categoryParent: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002GC',
              categoryParent: 'BBA3-002'
            }, {
              categoryType: CategoryType.CaseSubType,
              categoryValue: 'BBA3-002RC',
              categoryParent: 'BBA3-002'
            }],
          caseManagementLocationCode: null,
          caserestrictedFlag: false,
          caseSLAStartDate: null
        },
        partyDetails: [
          {
            partyID: 'P1',
            partyType: PartyType.IND,
            partyRole: 'appellant',
            individualDetails: {
              title: 'Miss',
              firstName: 'Jane',
              lastName: 'Smith',
              preferredHearingChannel: 'inPerson',
              reasonableAdjustments: [
                'RA0042',
                'RA0053',
                'RA0013',
                'RA0016',
                'RA0042'
              ],
              interpreterLanguage: 'spa'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRanges: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      },
      lastError: null
    },
    hearingConditions: {
      caseId: '1111222233334444',
      mode: 'create',
      isInit: true,
      fragmentId: 'venue'
    },
    hearingLinks: {
      serviceLinkedCases: [
        {
          caseReference: '4652724902696213',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Linked for a hearing'
          ]
        },
        {
          caseReference: '5283819672542864',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Linked for a hearing',
            'Progressed as part of lead case'
          ]
        },
        {
          caseReference: '8254902572336147',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Familial',
            'Guardian',
            'Linked for a hearing'
          ]
        }
      ],
      serviceLinkedCasesWithHearings: [
        {
          caseRef: '4652724902696213',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Linked for a hearing'
          ],
          caseHearings: [{
            hearingID: 'h100001',
            hearingType: 'Substantive',
            hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
            lastResponseReceivedDateTime: '',
            exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
            exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
            hmcStatus: HMCStatus.HEARING_REQUESTED,
            responseVersion: 'rv1',
            hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
            listAssistCaseStatus: '',
            hearingIsLinkedFlag: true,
            hearingGroupRequestId: null,
            hearingDaySchedule: [],
            isSelected: true
          }]
        },
        {
          caseRef: '5283819672542864',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Linked for a hearing',
            'Progressed as part of lead case'
          ],
          caseHearings: []
        },
        {
          caseRef: '8254902572336147',
          caseName: 'Smith vs Peterson',
          reasonsForLink: [
            'Familial',
            'Guardian',
            'Linked for a hearing'
          ],
          caseHearings: [{
            hearingID: 'h100010',
            hearingType: 'Direction Hearings',
            hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
            lastResponseReceivedDateTime: '',
            exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
            exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
            hmcStatus: HMCStatus.AWAITING_LISTING,
            responseVersion: 'rv1',
            hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
            listAssistCaseStatus: '',
            hearingIsLinkedFlag: true,
            hearingGroupRequestId: null,
            hearingDaySchedule: [],
            isSelected: true
          }, {
            hearingID: 'h100012',
            hearingType: 'Chambers Outcome',
            hearingRequestDateTime: '2021-09-01T16:00:00.000Z',
            lastResponseReceivedDateTime: '',
            exuiSectionStatus: EXUISectionStatusEnum.UPCOMING,
            exuiDisplayStatus: EXUIDisplayStatusEnum.AWAITING_LISTING,
            hmcStatus: HMCStatus.AWAITING_LISTING,
            responseVersion: 'rv1',
            hearingListingStatus: HearingListingStatusEnum.UPDATE_REQUESTED,
            listAssistCaseStatus: '',
            hearingIsLinkedFlag: true,
            hearingGroupRequestId: null,
            hearingDaySchedule: [],
            isSelected: true
          }]
        }
      ],
      linkedHearingGroup: {
        groupDetails: {
          groupName: 'Group A',
          groupReason: 'Reason 1',
          groupLinkType: GroupLinkType.ORDERED,
          groupComments: 'Comment 1'
        },
        hearingsInGroup: [
          {
            hearingId: 'h1000001',
            hearingOrder: 1
          },
          {
            hearingId: 'h1000003',
            hearingOrder: 2
          },
          {
            hearingId: 'h1000005',
            hearingOrder: 3
          }]
      },
      lastError: null
    }
  }
};
