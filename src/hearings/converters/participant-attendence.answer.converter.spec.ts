import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialState, partyChannelsRefData, partySubChannelsRefData } from '../hearing.test.data';
import { LaCaseStatus, ListingStatus, PartyType, UnavailabilityType } from '../models/hearings.enum';
import { State } from '../store';
import { ParticipantAttendenceAnswerConverter } from './participant-attendence.answer.converter';

describe('ParticipantAttendenceAnswerConverter', () => {
  let converter: ParticipantAttendenceAnswerConverter;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<any>;
  let router: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                partyChannels: partyChannelsRefData,
                partySubChannels: partySubChannelsRefData
              }
            }
          }
        }
      ]
    });
    store = TestBed.inject(Store);
    router = TestBed.inject(ActivatedRoute);
    converter = new ParticipantAttendenceAnswerConverter(router);
  });

  it('should transform hearing stage', () => {
    const STATE: State = initialState.hearings;
    const result$ = converter.transformAnswer(of(STATE), 0);
    const room = 'Jane Smith - In person';
    const expected = cold('(b|)', { b: room });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing stage with error', () => {
    const STATE: State = {
      hearingList: null,
      hearingValues: {
        serviceHearingValuesModel: {
          hmctsServiceID: 'BBA3',
          hmctsInternalCaseName: 'Jane vs DWP',
          publicCaseName: 'Jane vs DWP',
          autoListFlag: false,
          hearingType: 'Final',
          hearingChannels: [],
          caseCategories: null,
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
          hearingLocations: null,
          caseAdditionalSecurityFlag: false,
          facilitiesRequired: [],
          listingComments: '',
          hearingRequester: '',
          privateHearingRequiredFlag: false,
          caseInterpreterRequiredFlag: false,
          leadJudgeContractType: '',
          judiciary: null,
          hearingIsLinkedFlag: false,
          panelRequirements: null,
          parties: [
            {
              partyID: 'P1',
              partyType: PartyType.IND,
              partyRole: 'appellant',
              partyName: null,
              individualDetails: {
                title: 'Mrs',
                firstName: 'Jane',
                lastName: 'Smith',
                preferredHearingChannel: 'inPerson'
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
                preferredHearingChannel: 'inPerson'
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
            }
          ],
          caseFlags: null,
          screenFlow: null,
          vocabulary: null
        }
      },
      hearingRequestToCompare: null,
      hearingRequest: {
        hearingRequestMainModel: {
          requestDetails: null,
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
                  hearingSubChannel: 'invalidChannel',
                  partyName: null,
                  partyType: PartyType.IND,
                  partyRole: 'appellant',
                  individualDetails: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    preferredHearingChannel: 'invalidChannel'
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
                    preferredHearingChannel: 'byVideo'
                  }
                }
              ]
            }]
          },
          hearingDetails: null,
          caseDetails: null,
          partyDetails: null
        }
      },
      hearingConditions: null,
      hearingActuals: null,
      hearingLinks: null
    };
    const result$ = converter.transformAnswer(of(STATE), 0);
    const room = 'Jane Smith - Error: invalidChannel';
    const expected = cold('(b|)', { b: room });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing stage with error', () => {
    const STATE: State = {
      hearingList: null,
      hearingValues: {
        serviceHearingValuesModel: {
          hmctsServiceID: 'BBA3',
          hmctsInternalCaseName: 'Jane vs DWP',
          publicCaseName: 'Jane vs DWP',
          autoListFlag: false,
          hearingType: 'Final',
          hearingChannels: [],
          caseCategories: null,
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
          hearingLocations: null,
          caseAdditionalSecurityFlag: false,
          facilitiesRequired: [],
          listingComments: '',
          hearingRequester: '',
          privateHearingRequiredFlag: false,
          caseInterpreterRequiredFlag: false,
          leadJudgeContractType: '',
          judiciary: null,
          hearingIsLinkedFlag: false,
          panelRequirements: null,
          parties: [
            {
              partyID: 'P1',
              partyType: PartyType.IND,
              partyRole: 'appellant',
              partyName: null,
              individualDetails: {
                title: 'Mrs',
                firstName: 'Jane',
                lastName: 'Smith',
                preferredHearingChannel: 'inPerson'
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
                preferredHearingChannel: 'inPerson'
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
            }
          ],
          caseFlags: null,
          screenFlow: null,
          vocabulary: null
        }
      },
      hearingRequestToCompare: null,
      hearingRequest: {
        hearingRequestMainModel: {
          requestDetails: null,
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
                  hearingSubChannel: 'invalidChannel',
                  partyName: null,
                  partyType: PartyType.IND,
                  partyRole: 'appellant',
                  individualDetails: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    preferredHearingChannel: 'invalidChannel'
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
                    preferredHearingChannel: 'byVideo'
                  }
                }
              ]
            }]
          },
          hearingDetails: null,
          caseDetails: null,
          partyDetails: null
        }
      },
      hearingConditions: null,
      hearingActuals: null,
      hearingLinks: null
    };
    const result$ = converter.transformAnswer(of(STATE), 0);
    const room = 'Jane Smith - Error: invalidChannel';
    const expected = cold('(b|)', { b: room });
    expect(result$).toBeObservable(expected);
  });
});
