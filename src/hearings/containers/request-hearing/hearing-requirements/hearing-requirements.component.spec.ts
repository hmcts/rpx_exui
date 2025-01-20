import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ErrorMessage } from '@hmcts/ccd-case-ui-toolkit';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { LoggerService } from '../../../../app/services/logger/logger.service';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { HearingActualsMainModel } from '../../../models/hearingActualsMainModel';
import { HearingRequestMainModel } from '../../../models/hearingRequestMain.model';
import {
  ACTION,
  CategoryType, EXUIDisplayStatusEnum, EXUISectionStatusEnum, GroupLinkType, HearingListingStatusEnum, HearingResult,
  HMCLocationType, HMCStatus, LaCaseStatus, ListingStatus, MemberType,
  PartyType, RequirementType,
  UnavailabilityType
} from '../../../models/hearings.enum';
import { HearingWindowModel } from '../../../models/hearingWindow.model';
import { LocationByEPIMMSModel } from '../../../models/location.model';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { PartyFlagsModel } from '../../../models/partyFlags.model';
import { ServiceHearingValuesModel } from '../../../models/serviceHearingValues.model';
import { HearingsService } from '../../../services/hearings.service';
import { LocationsDataService } from '../../../services/locations-data.service';
import { CaseFlagsUtils } from '../../../utils/case-flags.utils';
import * as fromHearingStore from '../../../store';
import { HearingRequirementsComponent } from './hearing-requirements.component';
import * as _ from 'lodash';

@Component({
  selector: 'exui-hearing-parties-title',
  template: ''
})
class MockHearingPartiesComponent {
  @Input() public error: ErrorMessage;
}

describe('HearingRequirementsComponent', () => {
  const serviceHearingValuesModel: ServiceHearingValuesModel = {
    hmctsServiceID: 'BBA3',
    hmctsInternalCaseName: 'Jane vs DWP',
    publicCaseName: 'Jane vs DWP',
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
      firstDateTimeMustBe: '2022-12-01T09:00:00.000Z'
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
          interpreterLanguage: 'POR',
          reasonableAdjustments: [
            'RA0042',
            'RA0053',
            'RA0013',
            'RA0016',
            'RA0042',
            'PF0015'
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
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'inPerson',
          interpreterLanguage: null,
          reasonableAdjustments: [
            'RA0005'
          ]
        },
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
          flagStatus: 'ACTIVE'
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
          flagStatus: 'ACTIVE'
        },
        {
          partyId: 'P2',
          partyName: 'Jane Smith vs DWP',
          flagParentId: 'CF0001',
          flagId: 'CF0006',
          flagDescription: 'Potential fraud',
          flagStatus: 'ACTIVE'
        },
        {
          partyId: 'P2',
          partyName: 'Jane Smith vs DWP',
          flagParentId: 'CF0001',
          flagId: 'CF0007',
          flagDescription: 'Urgent flag',
          flagStatus: 'ACTIVE'
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
  const hearingActualsMainModel: HearingActualsMainModel = {
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
          notRequired: true,
          hearingDate: '2021-03-12T09:00:00.000Z',
          hearingStartTime: '2021-03-12T09:00:00.000Z',
          hearingEndTime: '2021-03-13T10:00:00.000Z',
          pauseDateTimes: [],
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
          plannedEndTime: '2021-03-13T10:00:00.000Z',
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
  const initialStateImmutable = {
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
            hearingInWelshFlag: true,
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
            caseRef: null,
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
                  'RA0042',
                  'RA0009'
                ],
                interpreterLanguage: 'POR',
                preferredHearingChannel: 'byVideo'
              },
              organisationDetails: {},
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
              partyName: 'DWP',
              partyType: PartyType.ORG,
              partyRole: 'claimant',
              individualDetails: {
                firstName: 'DWP',
                lastName: null,
                preferredHearingChannel: 'byVideo',
                reasonableAdjustments: ['RA0005'],
                interpreterLanguage: null
              },
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
                    preferredHearingChannel: 'inPerson',
                    interpreterLanguage: 'POR'
                  }
                },
                {
                  partyID: 'P2',
                  hearingSubChannel: 'byVideo',
                  partyName: 'DWP',
                  partyType: PartyType.ORG,
                  partyRole: 'claimant',
                  individualDetails: {
                    firstName: 'DWP',
                    lastName: null,
                    preferredHearingChannel: 'byVideo',
                    interpreterLanguage: null
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
              dateRangeStart: '2022-11-23T09:00:00.000Z',
              dateRangeEnd: '2022-11-30T09:00:00.000Z',
              firstDateTimeMustBe: '2022-12-01T09:00:00.000Z'
            },
            privateHearingRequiredFlag: false,
            panelRequirements: null,
            autolistFlag: false,
            nonStandardHearingDurationReasons: [],
            hearingPriorityType: 'standard',
            numberOfPhysicalAttendees: 3,
            hearingInWelshFlag: true,
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
            caseRef: null,
            requestTimeStamp: null,
            hearingID: null,
            externalCaseReference: null,
            caseDeepLink: null,
            hmctsInternalCaseName: 'Jane vs DWP',
            publicCaseName: 'Jane vs DWP',
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
                interpreterLanguage: 'POR'
              },
              organisationDetails: {},
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
              partyName: 'DWP',
              partyType: PartyType.ORG,
              partyRole: 'claimant',
              individualDetails: {
                preferredHearingChannel: 'byVideo',
                reasonableAdjustments: ['RA0005'],
                interpreterLanguage: null
              },
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
  const caseTypeRefData = [
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
  const caseFlagsRefData = [
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

  const caseFlagsFromLatestSHV: PartyFlagsModel[] = [
    {
      partyId: 'P1',
      partyName: 'Jane Smith',
      flagParentId: 'RA0008',
      flagId: 'RA0042',
      flagDescription: 'Sign language interpreter required',
      flagStatus: 'ACTIVE'
    },
    {
      partyId: 'P2',
      partyName: 'Jane Smith vs DWP',
      flagParentId: 'CF0001',
      flagId: 'CF0006',
      flagDescription: 'Potential fraud',
      flagStatus: 'ACTIVE'
    },
    {
      partyId: 'P3',
      partyName: 'Jane Smith vs DWP',
      flagParentId: 'CF0001',
      flagId: 'CF0007',
      flagDescription: 'Urgent flag',
      flagStatus: 'ACTIVE'
    }
  ];

  const FOUND_LOCATIONS: LocationByEPIMMSModel[] = [{
    epimms_id: '196538',
    site_name: 'Liverpool Social Security and Child Support Tribunal',
    court_name: 'LIVERPOOL SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL',
    open_for_public: 'YES',
    region_id: '5',
    region: 'North West',
    cluster_id: '3',
    cluster_name: 'Cheshire and Merseyside',
    court_status: 'Open',
    court_open_date: null,
    closed_date: null,
    postcode: 'L2 5UZ',
    court_address: 'PRUDENTIAL BUILDING, 36 DALE STREET, LIVERPOOL',
    phone_number: '',
    court_location_code: '',
    dx_address: '',
    welsh_site_name: '',
    welsh_court_address: '',
    venue_name: 'Liverpool',
    is_case_management_location: 'Y',
    is_hearing_location: 'Y'
  }];
  let component: HearingRequirementsComponent;
  let fixture: ComponentFixture<HearingRequirementsComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  const locationsDataService = new LocationsDataService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);
  const loggerServiceMock = jasmine.createSpyObj('loggerService', ['error']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HearingRequirementsComponent, MockHearingPartiesComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState: initialStateImmutable }),
        { provide: HearingsService, useValue: hearingsService },
        { provide: LocationsDataService, useValue: locationsDataService },
        { provide: LoggerService, useValue: loggerServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                caseFlags: caseFlagsRefData,
                caseType: caseTypeRefData
              }
            },
            fragment: of('point-to-me')
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(HearingRequirementsComponent);
    component = fixture.componentInstance;
    spyOn(locationsDataService, 'getLocationById').and.returnValue(of(FOUND_LOCATIONS));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should window onFocus', () => {
    const storeDispatchSpy = spyOn(component.hearingStore, 'dispatch');
    component.lostFocus = true;
    component.onFocus();
    expect(component.lostFocus).toBeFalsy();
    expect(storeDispatchSpy).toHaveBeenCalledWith(new fromHearingStore.LoadHearingValues(component.referenceId));
  });

  it('should window onblur', () => {
    component.onBlur();
    expect(component.lostFocus).toBeTruthy();
  });

  it('should set option collection', () => {
    expect(component).toBeDefined();
    expect(component.serviceHearingValuesModel).toEqual(serviceHearingValuesModel);
  });

  it('should call unsubscribe', () => {
    spyOn(component.hearingStateSub, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.hearingStateSub.unsubscribe).toHaveBeenCalled();
  });

  it('should not consider the case flags from in-memory object for create new hearing request journey', () => {
    component.hearingCondition = {
      mode: 'create'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.reasonableAdjustmentFlags.length).toEqual(2);
  });

  it('should set the case flags from in-memory object when there are changes to case flags but not party name', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.reasonableAdjustmentFlags.length).toEqual(1);
  });

  it('should set the case flags from in-memory object when there are changes to case flags and party name', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.reasonableAdjustmentFlags.length).toEqual(1);
  });

  it('should set the case flags from in-memory object when there are changes to party names', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.reasonableAdjustmentFlags.length).toEqual(1);
  });

  it('should set the case flags from in-memory object when there are changes to party names', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: null,
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.reasonableAdjustmentFlags.length).toEqual(0);
  });

  it('should not set reasonable adjustments warning message', () => {
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.showReasonableAdjustmentFlagsWarningMessage).toEqual(false);
  });

  it('should set reasonable adjustments warning message', () => {
    const partyDetails = [
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
            'RA0098'
          ],
          interpreterLanguage: 'PF0015'
        }
      }
    ];
    component.hearingRequestToCompareMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      partyDetails: partyDetails
    };
    component.serviceHearingValuesModel = {
      ...initialState.hearings.hearingValues.serviceHearingValuesModel,
      parties: partyDetails
    };
    component.hearingCondition = {
      mode: 'view-edit'
    };
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: { flags: caseFlagsFromLatestSHV, flagAmendURL: '/' },
      parties: null,
      hearingWindow: null,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        partyDetailsChangesRequired: false,
        hearingWindowChangesRequired: false,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.showReasonableAdjustmentFlagsWarningMessage).toEqual(true);
  });

  it('should initialize hearing request from hearing values', () => {
    const expectedHearingRequestMainModel: HearingRequestMainModel = {
      hearingDetails: {
        duration: 45,
        hearingType: 'Final',
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
            'BBA3-DQPM',
            'BBA3-MQPM2-003',
            'BBA3-MQPM2-004',
            'BBA3-FQPM',
            'BBA3-RMM'
          ]
        },
        autolistFlag: false,
        hearingPriorityType: 'standard',
        numberOfPhysicalAttendees: 2,
        hearingInWelshFlag: false,
        facilitiesRequired: [],
        listingComments: '',
        hearingRequester: '',
        leadJudgeContractType: '',
        amendReasonCodes: null,
        listingAutoChangeReasonCode: null
      },
      caseDetails: {
        hmctsServiceCode: 'BBA3',
        caseRef: '1111222233334444',
        requestTimeStamp: null,
        hearingID: null,
        caseDeepLink: 'https://manage-case.demo.platform.hmcts.net/',
        hmctsInternalCaseName: 'Jane vs DWP',
        publicCaseName: 'Jane vs DWP',
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
          }
        ],
        caseManagementLocationCode: '196538',
        caserestrictedFlag: false,
        caseSLAStartDate: '2021-05-05T09:00:00.000Z',
        externalCaseReference: ''
      },
      partyDetails: [{
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
            'RA0053',
            'RA0013',
            'RA0016',
            'RA0042'],
          interpreterLanguage: 'POR'
        },
        unavailabilityRanges: [{
          unavailableFromDate: '2021-12-10T09:00:00.000Z',
          unavailableToDate: '2021-12-31T09:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        }]
      }, {
        partyID: 'P2',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        partyName: 'DWP',
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'byVideo',
          reasonableAdjustments: ['RA0005'],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        },
        unavailabilityRanges: [{
          unavailableFromDate: '2021-12-20T09:00:00.000Z',
          unavailableToDate: '2021-12-31T09:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        }]
      }]
    };
    const storeDispatchSpy = spyOn(component.hearingStore, 'dispatch');
    component.initializeHearingRequestFromHearingValues();
    fixture.detectChanges();
    expect(storeDispatchSpy).toHaveBeenCalledWith(new fromHearingStore.InitializeHearingRequest(expectedHearingRequestMainModel));
  });

  it('should set hearingWindow from serviceHearingValuesModel if it is null in hearingRequestMainModel', () => {
    // Arrange
    component.serviceHearingValuesModel = serviceHearingValuesModel;

    // Act
    component.initializeHearingRequestFromHearingValues();

    // Assert
    expect(component.hearingRequestMainModel.hearingDetails.hearingWindow).toEqual(serviceHearingValuesModel.hearingWindow);
  });

  it('should set hearingWindow from hearingRequestMainModel if it is not null', () => {
    // Arrange
    const mockHearingWindow: HearingWindowModel = { dateRangeStart: '2023-12-15T09:00:00.000Z' };
    const expectedHearingRequestMainModel: HearingRequestMainModel = {
      hearingDetails: {
        duration: 45,
        hearingType: 'Final',
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
        hearingWindow: mockHearingWindow,
        privateHearingRequiredFlag: false,
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
        autolistFlag: false,
        hearingPriorityType: 'standard',
        numberOfPhysicalAttendees: 2,
        hearingInWelshFlag: false,
        facilitiesRequired: [],
        listingComments: '',
        hearingRequester: '',
        leadJudgeContractType: '',
        amendReasonCodes: null,
        listingAutoChangeReasonCode: null
      },
      caseDetails: {
        hmctsServiceCode: 'BBA3',
        caseRef: '1111222233334444',
        requestTimeStamp: null,
        hearingID: null,
        caseDeepLink: 'https://manage-case.demo.platform.hmcts.net/',
        hmctsInternalCaseName: 'Jane vs DWP',
        publicCaseName: 'Jane vs DWP',
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
          }
        ],
        caseManagementLocationCode: '196538',
        caserestrictedFlag: false,
        caseSLAStartDate: '2021-05-05T09:00:00.000Z',
        externalCaseReference: ''
      },
      partyDetails: [{
        partyID: 'P1',
        partyType: PartyType.IND,
        partyRole: 'appellant',
        partyName: 'Jane Smith',
        unavailabilityRanges: [{
          unavailableFromDate: '2021-12-10T09:00:00.000Z',
          unavailableToDate: '2021-12-31T09:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        }],
        individualDetails: {
          title: 'Mrs',
          firstName: 'Jane',
          lastName: 'Smith',
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: [
            'RA0042',
            'RA0053',
            'RA0013',
            'RA0016',
            'RA0042'],
          interpreterLanguage: 'POR'
        }
      }, {
        partyID: 'P2',
        partyType: PartyType.ORG,
        partyRole: 'claimant',
        partyName: 'DWP',
        unavailabilityRanges: [{
          unavailableFromDate: '2021-12-20T09:00:00.000Z',
          unavailableToDate: '2021-12-31T09:00:00.000Z',
          unavailabilityType: UnavailabilityType.ALL_DAY
        }],
        individualDetails: {
          title: null,
          firstName: 'DWP',
          lastName: null,
          preferredHearingChannel: 'inPerson',
          reasonableAdjustments: ['RA0005'],
          interpreterLanguage: null
        },
        organisationDetails: {
          name: 'DWP',
          organisationType: 'GOV',
          cftOrganisationID: 'O100000'
        }
      }]
    };
    component.hearingRequestMainModel = expectedHearingRequestMainModel;

    // Act
    component.initializeHearingRequestFromHearingValues();

    // Assert
    expect(component.hearingRequestMainModel.hearingDetails.hearingWindow).toEqual(expectedHearingRequestMainModel.hearingDetails.hearingWindow);
  });

  it('should return an empty array when partyDetails is empty', () => {
    // Arrange
    const partyDetails: PartyDetailsModel[] = [];

    // Act
    const result = component.combinePartiesWithIndOrOrg(partyDetails);

    // Assert
    expect(result).toEqual([]);
  });

  it('should remove language interpreter flag from reasonable adjustments', () => {
    // Arrange
    const partyDetails: PartyDetailsModel[] = [{
      partyID: 'P1',
      partyType: PartyType.IND,
      partyRole: 'appellant',
      partyName: 'Jane Smith',
      unavailabilityRanges: [{
        unavailableFromDate: '2021-12-10T09:00:00.000Z',
        unavailableToDate: '2021-12-31T09:00:00.000Z',
        unavailabilityType: UnavailabilityType.ALL_DAY
      }],
      individualDetails: {
        title: 'Mrs',
        firstName: 'Jane',
        lastName: 'Smith',
        preferredHearingChannel: 'inPerson',
        reasonableAdjustments: [
          'RA0042',
          'RA0053',
          CaseFlagsUtils.LANGUAGE_INTERPRETER_FLAG_ID,
          'RA0013',
          'RA0016',
          'RA0042'
        ],
        interpreterLanguage: 'POR'
      }
    }, {
      partyID: 'P2',
      partyType: PartyType.ORG,
      partyRole: 'claimant',
      partyName: 'DWP',
      unavailabilityRanges: [{
        unavailableFromDate: '2021-12-20T09:00:00.000Z',
        unavailableToDate: '2021-12-31T09:00:00.000Z',
        unavailabilityType: UnavailabilityType.ALL_DAY
      }],
      individualDetails: {
        title: null,
        firstName: 'DWP',
        lastName: null,
        preferredHearingChannel: 'byVideo',
        reasonableAdjustments: ['RA0005', CaseFlagsUtils.LANGUAGE_INTERPRETER_FLAG_ID],
        interpreterLanguage: null
      },
      organisationDetails: {
        name: 'DWP',
        organisationType: 'GOV',
        cftOrganisationID: 'O100000'
      }
    }];

    // Act
    const result = component.combinePartiesWithIndOrOrg(partyDetails);

    // Assert
    expect(result.length).toEqual(2);
    const transformedPartyDetails = _.cloneDeep(partyDetails);
    transformedPartyDetails[0].individualDetails.reasonableAdjustments = [
      'RA0042', 'RA0053', 'RA0013', 'RA0016', 'RA0042'
    ];
    transformedPartyDetails[1].individualDetails.reasonableAdjustments = ['RA0005'];
    expect(result).toEqual(transformedPartyDetails);
  });

  it('should dispatch InitializeHearingRequest action', () => {
    // Arrange
    spyOn(component.hearingStore, 'dispatch');

    // Act
    component.initializeHearingRequestFromHearingValues();

    // Assert
    expect(component.hearingStore.dispatch).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
