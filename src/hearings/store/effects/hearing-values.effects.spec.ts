import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { Go } from '../../../app/store';
import { initialState } from '../../hearing.test.data';
import { CategoryType, MemberType, PartyType, RequirementType, UnavailabilityType } from '../../models/hearings.enum';
import { ServiceHearingValuesModel } from '../../models/serviceHearingValues.model';
import { HearingsService } from '../../services/hearings.service';
import * as hearingValuesActions from '../actions/hearing-values.action';
import { HearingValuesEffects } from './hearing-values.effects';

describe('Hearing Values Effects', () => {
  let actions$;
  let effects: HearingValuesEffects;
  const hearingsServiceMock = jasmine.createSpyObj('HearingsService', [
    'loadHearingValues'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        {
          provide: HearingsService,
          useValue: hearingsServiceMock
        },
        HearingValuesEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(HearingValuesEffects);
  });

  describe('loadHearingValue$', () => {
    const SERVICE_HEARING_VALUES: ServiceHearingValuesModel = {
      hmctsServiceID: 'BBA3',
      hmctsInternalCaseName: 'Jane Smith vs DWP',
      publicCaseName: 'Jane Smith vs DWP',
      autoListFlag: false,
      hearingType: 'Final',
      hearingChannels: [],
      caseAdditionalSecurityFlag: false,
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
        dateRangeStart: '2021-11-23T09:00:00.000Z',
        dateRangeEnd: '2021-11-30T09:00:00.000Z',
        firstDateTimeMustBe: ''
      },
      duration: 45,
      hearingPriorityType: 'standard',
      numberOfPhysicalAttendees: 2,
      hearingInWelshFlag: false,
      hearingLocations: [],
      facilitiesRequired: [],
      listingComments: '',
      hearingRequester: '',
      privateHearingRequiredFlag: false,
      caseInterpreterRequiredFlag: false,
      panelRequirements: null,
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
      parties: [
        {
          partyID: 'P1',
          partyName: 'Jane and Smith',
          partyType: PartyType.IND,
          partyRole: 'appellant',
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
            partyName: 'Jane and Smith',
            flagId: 'Language Interpreter',
            flagDescription: 'Spanish interpreter required',
            flagStatus: 'ACTIVE'
          },
          {
            partyId: 'P2',
            partyName: 'DWP',
            flagId: 'case flag 1',
            flagDescription: 'case flag 1 description',
            flagStatus: 'ACTIVE'
          }
        ],
        flagAmendURL: '/'
      },
      screenFlow: [],
      vocabulary: [
        {
          word1: ''
        }
      ]
    };

    it('should return a response with service hearing values', () => {
      hearingsServiceMock.loadHearingValues.and.returnValue(of(SERVICE_HEARING_VALUES));
      const action = new hearingValuesActions.LoadHearingValues('1111222233334444');
      const completion = new hearingValuesActions.LoadHearingValuesSuccess(SERVICE_HEARING_VALUES);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadHearingValue$).toBeObservable(expected);
    });
  });

  describe('handleError', () => {
    it('should handle 500', () => {
      const action$ = HearingValuesEffects.handleError({
        status: 500,
        message: 'error'
      }, '1111222233334444');
      action$.subscribe((action) => expect(action).toEqual(new Go({ path: ['/cases/case-details/1111222233334444/hearings'] })));
    });

    it('should handle 4xx related errors', () => {
      const action$ = HearingValuesEffects.handleError({
        status: 403,
        message: 'error'
      }, '1111222233334444');
      action$.subscribe((action) => expect(action).toEqual(new Go({ path: ['/cases/case-details/1111222233334444/hearings'] })));
    });
  });
});
