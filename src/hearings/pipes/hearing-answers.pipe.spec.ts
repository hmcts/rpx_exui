import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { cold } from 'jasmine-marbles';
import * as _ from 'lodash';
import { of } from 'rxjs';
import {
  caseFlagsRefData,
  caseTypeRefData,
  hearingPriorityRefData,
  initialState,
  partyChannelsRefData,
  partySubChannelsRefData
} from '../hearing.test.data';
import { AnswerSource, RadioOptions } from '../models/hearings.enum';
import { LocationByEPIMMSModel } from '../models/location.model';
import { LocationsDataService } from '../services/locations-data.service';
import { State } from '../store/reducers';
import { HearingAnswersPipe } from './hearing-answers.pipe';

describe('HearingAnswersPipe', () => {
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
  }, {
    epimms_id: '234850',
    site_name: 'Cardiff Civil and Family Justice Centre',
    court_name: 'CARDIFF CIVIL AND FAMILY JUSTICE CENTRE',
    open_for_public: 'YES',
    region_id: '8',
    region: 'Wales',
    cluster_id: null,
    cluster_name: null,
    court_status: 'Open',
    court_open_date: null,
    closed_date: null,
    postcode: 'CF10 1ET',
    court_address: 'PARK STREET, CARDIFF',
    phone_number: '',
    court_location_code: '',
    dx_address: '99500 CARDIFF 6',
    welsh_site_name: '',
    welsh_court_address: '',
    venue_name: '',
    is_case_management_location: '',
    is_hearing_location: ''
  }];
  initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails.hearingInWelshFlag = true;
  const STATE: State = _.cloneDeep(initialState.hearings);
  let hearingAnswersPipe: HearingAnswersPipe;
  let router: any;
  const locationsDataService = jasmine.createSpyObj('LocationsDataService', ['getLocationById']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hearingPriorities: hearingPriorityRefData,
                caseType: caseTypeRefData,
                caseFlags: caseFlagsRefData,
                partyChannels: partyChannelsRefData,
                partySubChannels: partySubChannelsRefData
              }
            }
          }
        },
        {
          provide: LocationsDataService,
          useValue: locationsDataService
        }
      ]
    });
    router = TestBed.inject(ActivatedRoute);
    hearingAnswersPipe = new HearingAnswersPipe(router, locationsDataService);
    locationsDataService.getLocationById.and.returnValue(of(FOUND_LOCATIONS));
  });

  it('should transform additional instructions', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.ADDITIONAL_INSTRUCTION, of(STATE), 0);
    const listingComments = 'blah blah blah';
    const expected = cold('(b|)', { b: listingComments });
    expect(result$).toBeObservable(expected);
  });

  it('should transform case name', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.CASE_NAME, of(STATE), 0);
    const caseName = 'Jane Smith vs DWP';
    const expected = cold('(b|)', { b: caseName });
    expect(result$).toBeObservable(expected);
  });

  it('should transform case number', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.CASE_NUMBER, of(STATE), 0);
    const caseNumber = '1111-2222-3333-4444';
    const expected = cold('(b|)', { b: caseNumber });
    expect(result$).toBeObservable(expected);
  });

  it('should transform type', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.Type, of(STATE), 0);
    const type = 'PERSONAL INDEPENDENT PAYMENT (NEW CLAIM) \n<ul><li>- CONDITIONS OF ENTITLEMENT - COMPLEX</li><li>- GOOD CAUSE</li><li>- RATE OF ASSESSMENT/PAYABILITY ISSUES - COMPLEX</li></ul>';
    const expected = cold('(b|)', { b: type });
    expect(result$).toBeObservable(expected);
  });

  it('should transform case flag', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.CASE_FLAGS, of(STATE), 0);
    const caseFlags = '<strong class=\'bold\'>Jane Smith</strong>\n<ul><li>Sign Language Interpreter</li><li>Hearing Loop</li><li>Larger font size</li><li>Reading documents for customer</li><li>Sign Language Interpreter</li></ul><br>';
    const expected = cold('(b|)', { b: caseFlags });
    expect(result$).toBeObservable(expected);
  });

  it('should transform reasonable adjustment flags', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.REASONABLE_ADJUSTMENT_FLAGS, of(STATE), 0);
    const caseFlags = '<strong class=\'bold\'>Jane Smith</strong>\n<ul><li>Sign Language Interpreter</li><li>Hearing Loop</li><li>Larger font size</li><li>Reading documents for customer</li><li>Sign Language Interpreter</li></ul><br>';
    const expected = cold('(b|)', { b: caseFlags });
    expect(result$).toBeObservable(expected);
  });

  it('should transform how party attend', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.HOW_ATTENDANT, of(STATE), 0);
    const partyFlags = '<ul><li>Jane Smith - In person</li></ul>';
    const expected = cold('(b|)', { b: partyFlags });
    expect(result$).toBeObservable(expected);
  });

  it('should transform how party attend', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.HOW_PARTICIPANTS_ATTEND, of(STATE), 0);
    const attendance = '<ul><li>By phone</li></ul>';
    const expected = cold('(b|)', { b: attendance });
    expect(result$).toBeObservable(expected);
  });

  it('should transform number of attendees', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.ATTENDANT_PERSON_AMOUNT, of(STATE), 0);
    const expected = cold('(b|)', { b: '3' });
    expect(result$).toBeObservable(expected);
  });

  it('should transform paper hearing', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.IS_PAPER_HEARING, of(STATE), 0);
    const expected = cold('(b|)', { b: 'No' });
    expect(result$).toBeObservable(expected);
  });

  it('should transform venue', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.VENUE, of(STATE), 0);
    const caseFlags = '<ul><li>LIVERPOOL SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL</li><li>CARDIFF CIVIL AND FAMILY JUSTICE CENTRE</li></ul>';
    const expected = cold('(b|)', { b: caseFlags });
    expect(result$).toBeObservable(expected);
  });

  it('should transform need welsh', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.NEED_WELSH, of(STATE), 0);
    const needWelsh = 'Yes';
    const expected = cold('(b|)', { b: needWelsh });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing length', () => {
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.duration = 60;
    const result$ = hearingAnswersPipe.transform(AnswerSource.HEARING_LENGTH, of(STATE), 0);
    const hearingDuration = '1 Hour';
    const expected = cold('(b|)', { b: hearingDuration });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing specific date', () => {
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingWindow = {
      dateRangeStart: '2022-12-12T09:00:00.000Z',
      dateRangeEnd: '2022-12-12T09:00:00.000Z',
      firstDateTimeMustBe: ''
    };
    const result$ = hearingAnswersPipe.transform(AnswerSource.HEARING_SPECIFIC_DATE, of(STATE), 0);
    const hearingDateRange = `${RadioOptions.CHOOSE_DATE_RANGE}<br>Earliest start date: 12 December 2022<br>Latest end date: 12 December 2022`;
    const expected = cold('(b|)', { b: hearingDateRange });
    expect(result$).toBeObservable(expected);
  });

  it('should transform need hearing priority', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.HEARING_PRIORITY, of(STATE), 0);
    const hearingPriority = 'Standard';
    const expected = cold('(b|)', { b: hearingPriority });
    expect(result$).toBeObservable(expected);
  });

  it('should transform linked hearings', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.LINKED_HEARINGS, of(STATE), 0);
    const linkedHearings = 'No';
    const expected = cold('(b|)', { b: linkedHearings });
    expect(result$).toBeObservable(expected);
  });

  it('should transform type from request', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.TYPE_FROM_REQUEST, of(STATE), 0);
    const typeName = 'PERSONAL INDEPENDENT PAYMENT (NEW CLAIM) \n<ul><li>- CONDITIONS OF ENTITLEMENT - COMPLEX</li><li>- GOOD CAUSE</li><li>- RATE OF ASSESSMENT/PAYABILITY ISSUES - COMPLEX</li></ul>';
    const expected = cold('(b|)', { b: typeName });
    expect(result$).toBeObservable(expected);
  });

  it('should transform status', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.STATUS, of(STATE), 0);
    const status = 'LISTED';
    const expected = cold('(b|)', { b: status });
    expect(result$).toBeObservable(expected);
  });

  it('should transform date request submitted', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.DATE_REQUEST_SUBMITTED, of(STATE), 0);
    const date = '30 November 2021';
    const expected = cold('(b|)', { b: date });
    expect(result$).toBeObservable(expected);
  });

  it('should transform time response submitted', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.DATE_RESPONSE_SUBMITTED_TIME, of(STATE), 0);
    const date = '09:00';
    const expected = cold('(b|)', { b: date });
    expect(result$).toBeObservable(expected);
  });

  it('should transform date response submitted', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.DATE_RESPONSE_SUBMITTED, of(STATE), 0);
    const date = '12 December 2022';
    const expected = cold('(b|)', { b: date });
    expect(result$).toBeObservable(expected);
  });

  it('should transform date response submitted multiday', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.DATE_RESPONSE_SUBMITTED_MULTI_DAY, of(STATE), 0);
    const date = '12 December 2022 - 12 December 2022';
    const expected = cold('(b|)', { b: date });
    expect(result$).toBeObservable(expected);
  });

  it('should transform date response received', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.DATE_RESPONSE_RECEIVED, of(STATE), 0);
    const date = '30 November 2021';
    const expected = cold('(b|)', { b: date });
    expect(result$).toBeObservable(expected);
  });

  it('should transform additional security required', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.ADDITIONAL_SECURITY_REQUIRED, of(STATE), 0);
    const answer = 'No';
    const expected = cold('(b|)', { b: answer });
    expect(result$).toBeObservable(expected);
  });

  it('should transform court location', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.COURT_LOCATION, of(STATE), 0);
    const answer = '';
    const expected = cold('(b|)', { b: answer });
    expect(result$).toBeObservable(expected);
  });

  it('should transform participant attendence', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.PARTICIPANT_ATTENDENCE, of(STATE), 0);
    const answer = 'Jane Smith - In person';
    const expected = cold('(b|)', { b: answer });
    expect(result$).toBeObservable(expected);
  });

  it('should transform response status', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.HEARING_RESPONSE_STATUS, of(STATE), 0);
    const answer = 'PENDING_RELISTING';
    const expected = cold('(b|)', { b: answer });
    expect(result$).toBeObservable(expected);
  });

  it('should transform response status', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.HEARING_RESPONSE_LENGTH, of(STATE), 0);
    const answer = '1 Day 1 Hour';
    const expected = cold('(b|)', { b: answer });
    expect(result$).toBeObservable(expected);
  });

  it('should transform private hearing required', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.PRIVATE_HEARING_REQUIRED, of(STATE), 0);
    const answer = 'No';
    const expected = cold('(b|)', { b: answer });
    expect(result$).toBeObservable(expected);
  });

  it('should transform public case name', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.PUBLIC_CASE_NAME, of(STATE), 0);
    const answer = 'Jane Smith vs DWP';
    const expected = cold('(b|)', { b: answer });
    expect(result$).toBeObservable(expected);
  });

  it('should transform case restriction', () => {
    const result$ = hearingAnswersPipe.transform(AnswerSource.CASE_RESTRICTION, of(STATE), 0);
    const answer = 'No';
    const expected = cold('(b|)', { b: answer });
    expect(result$).toBeObservable(expected);
  });
});
