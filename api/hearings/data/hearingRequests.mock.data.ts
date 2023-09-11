import { HearingRequestMainModel } from '../models/hearingRequestMain.model';
import {
  CategoryType,
  HMCLocationType,
  LaCaseStatus,
  ListingStatus,
  PartyType,
  UnavailabilityType
} from '../models/hearings.enum';

export const HEARING_REQUEST_RESULTS: HearingRequestMainModel[] = [
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 45,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
        }
      ],
      hearingIsLinkedFlag: false,
      hearingWindow: {
        dateRangeStart: '2022-11-23T09:00:00.000Z',
        dateRangeEnd: '2022-11-30T09:00:00.000Z',
        firstDateTimeMustBe: '2022-12-01T09:00:00.000Z'
      },
      privateHearingRequiredFlag: false,
      panelRequirements: {
        roleType: [
          'tj',
          'dtj',
          'rtj'
        ],
        panelPreferences: [],
        panelSpecialisms: [
          'DisabilityQualifiedPanelMember',
          'EyeSurgeon',
          'GeneralPractitioner',
          'FinanciallyQualifiedPanelMember',
          'RegionalMedicalMember'
        ]
      },
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
      amendReasonCodes: ['reasonOne'],
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
      caseManagementLocationCode: null,
      caserestrictedFlag: false,
      caseSLAStartDate: '2021-11-23T09:00:00.000Z'
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          preferredHearingChannel: 'inPerson',
          lastName: 'Representative',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.PENDING_RELISTING,
      listingStatus: ListingStatus.FIXED,
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              preferredHearingChannel: 'byVideo',
              lastName: 'Representative',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 50,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
        }
      ],
      hearingIsLinkedFlag: false,
      hearingWindow: {
        dateRangeStart: '2022-11-23T09:00:00.000Z',
        dateRangeEnd: '2022-11-30T09:00:00.000Z',
        firstDateTimeMustBe: '2022-12-01T09:00:00.000Z'
      },
      privateHearingRequiredFlag: false,
      panelRequirements: {
        roleType: [
          'tj',
          'rtj'
        ],
        panelPreferences: [],
        panelSpecialisms: [
          'GeneralPractitioner',
          'FinanciallyQualifiedPanelMember',
          'RegionalMedicalMember'
        ]
      },
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100002',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          lastName: 'Representative',
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              preferredHearingChannel: 'byVideo',
              lastName: 'Representative',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 55,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100003',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          lastName: 'Representative',
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.LISTED,
      listingStatus: ListingStatus.FIXED,
      hearingCancellationReason: '123456543',
      hearingDaySchedule: [{
        hearingStartDateTime: '2021-03-12T09:00:00.000Z',
        hearingEndDateTime: '2021-03-12T11:00:00.000Z',
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              preferredHearingChannel: 'byVideo',
              lastName: 'Representative',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 60,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100004',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          preferredHearingChannel: 'byVideo',
          lastName: 'Representative',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.PENDING_RELISTING,
      listingStatus: ListingStatus.FIXED,
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: 'Representative',
              preferredHearingChannel: 'byVideo',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 65,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100005',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          lastName: 'Representative',
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.PENDING_RELISTING,
      listingStatus: ListingStatus.FIXED,
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: 'Representative',
              preferredHearingChannel: 'byVideo',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 70,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100006',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          lastName: 'Representative',
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      errorTimestamp: '2022-03-27T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.EXCEPTION,
      listingStatus: ListingStatus.FIXED,
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: 'Representative',
              preferredHearingChannel: 'byVideo',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 70,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100007',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          lastName: 'Representative',
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.LISTED,
      listingStatus: ListingStatus.FIXED,
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: 'Representative',
              preferredHearingChannel: 'byVideo',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 70,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100012',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          lastName: 'Representative',
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.CLOSED,
      listingStatus: ListingStatus.FIXED,
      hearingCancellationReason: 'cancelled',
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: 'Representative',
              preferredHearingChannel: 'byVideo',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 70,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100008',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          lastName: 'Representative',
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.CLOSED,
      listingStatus: ListingStatus.FIXED,
      hearingCancellationReason: 'cancelled',
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
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: null,
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: 'Representative',
              preferredHearingChannel: 'byVideo',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 70,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'SSCS',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100010',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        individualDetails: {
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        },
        partyRole: 'Judge'
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        individualDetails: {
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        },
        partyRole: 'Judge'
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.LISTED,
      listingStatus: ListingStatus.FIXED,
      hearingCancellationReason: 'cancelled',
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
            partyRole: 'Judge',
            individualDetails: {
              firstName: 'Jane',
              lastName: 'Smith',
              preferredHearingChannel: 'inPerson'
            }
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'Judge',
            individualDetails: {
              firstName: 'DWP',
              lastName: null,
              preferredHearingChannel: 'byVideo'
            }
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 70,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'SSCS',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100011',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        partyRole: 'Judge',
        individualDetails: {
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        }
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'Judge',
        individualDetails: {
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        }
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.LISTED,
      listingStatus: ListingStatus.FIXED,
      hearingCancellationReason: 'cancelled',
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
            partyRole: 'Judge',
            individualDetails: {
              firstName: 'Jane',
              lastName: 'Smith',
              preferredHearingChannel: 'inPerson'
            }
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'Judge',
            individualDetails: {
              firstName: 'DWP',
              lastName: null,
              preferredHearingChannel: 'byVideo'
            }
          }
        ]
      }]
    }
  },
  {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000Z',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 60,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'BBA3',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100014',
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
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
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
            'RA0042'
          ],
          interpreterLanguage: 'PF0015'
        },
        organisationDetails: {},
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-10T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        individualDetails: {
          title: '',
          firstName: 'DWP',
          lastName: 'Representative',
          reasonableAdjustments: [
            'RA0005'
          ],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityDOW: null,
        unavailabilityRange: [
          {
            unavailableFromDate: '2021-12-20T09:00:00.000Z',
            unavailableToDate: '2021-12-31T09:00:00.000Z',
            unavailabilityType: UnavailabilityType.ALL_DAY
          }
        ]
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000Z',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.LISTED,
      listingStatus: ListingStatus.FIXED,
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
              title: 'Miss',
              firstName: 'Jane',
              lastName: 'Smith',
              reasonableAdjustments: [
                'RA0042',
                'RA0053',
                'RA0013',
                'RA0016',
                'RA0042'
              ],
              interpreterLanguage: 'PF0015'
            },
            organisationDetails: {},
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-10T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'claimant',
            individualDetails: {
              title: '',
              firstName: 'DWP',
              lastName: 'Representative',
              reasonableAdjustments: [
                'RA0005'
              ],
              interpreterLanguage: null
            },
            organisationDetails: {
              name: 'DWP',
              organisationType: 'GOV',
              cftOrganisationID: 'O100000'
            },
            unavailabilityDOW: null,
            unavailabilityRange: [
              {
                unavailableFromDate: '2021-12-20T09:00:00.000Z',
                unavailableToDate: '2021-12-31T09:00:00.000Z',
                unavailabilityType: UnavailabilityType.ALL_DAY
              }
            ]
          }
        ]
      }]
    }
  }, {
    requestDetails: {
      timeStamp: '2022-02-23T09:00:00.000+0000',
      versionNumber: 1
    },
    hearingDetails: {
      duration: 70,
      hearingType: 'final',
      hearingChannels: [],
      hearingLevelParticipantAttendance: [],
      hearingLocations: [
        {
          locationType: HMCLocationType.COURT,
          locationId: '196538'
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
      amendReasonCodes: ['reasonOne'],
      listingAutoChangeReasonCode: null
    },
    caseDetails: {
      hmctsServiceCode: 'SSCS',
      caseRef: '1584618195804035',
      requestTimeStamp: null,
      hearingID: 'h100009',
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
      caseSLAStartDate: '2021-11-23T09:00:00.000+0000'
    },
    partyDetails: [
      {
        partyID: 'P1',
        partyName: 'Jane and Smith',
        partyType: PartyType.IND,
        individualDetails: {
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson'
        },
        partyRole: 'Judge'
      },
      {
        partyID: 'P2',
        partyName: 'DWP',
        partyType: PartyType.ORG,
        individualDetails: {
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo'
        },
        partyRole: 'Judge'
      }
    ],
    hearingResponse: {
      listAssistTransactionID: '123456789',
      receivedDateTime: '2021-11-30T09:00:00.000+0000',
      responseVersion: 0,
      laCaseStatus: LaCaseStatus.LISTED,
      listingStatus: ListingStatus.FIXED,
      hearingCancellationReason: 'cancelled',
      hearingDaySchedule: [{
        hearingStartDateTime: '2021-03-12T09:00:00.000+0000',
        hearingEndDateTime: '2021-03-12T16:00:00.000+0000',
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
            partyRole: 'Judge',
            individualDetails: {
              firstName: 'Jane',
              lastName: 'Smith',
              preferredHearingChannel: 'inPerson'
            }
          },
          {
            partyID: 'P2',
            partyName: 'DWP',
            partyType: PartyType.ORG,
            partyRole: 'Judge',
            individualDetails: {
              firstName: 'DWP',
              lastName: null,
              preferredHearingChannel: 'byVideo'
            }
          }
        ]
      }]
    }
  }
];
