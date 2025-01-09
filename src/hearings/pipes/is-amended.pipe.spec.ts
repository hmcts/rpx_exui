import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { cold } from 'jasmine-marbles';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { caseFlagsRefData, hearingPriorityRefData, initialStateImmutable, partyChannelsRefData } from '../hearing.test.data';
import { AnswerSource, MemberType, RequirementType } from '../models/hearings.enum';
import { State } from '../store';
import { IsAmendedPipe } from './is-amended.pipe';

describe('IsAmendedPipe', () => {
  let isAmendedPipe: IsAmendedPipe;
  let router: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hearingPriorities: hearingPriorityRefData,
                caseFlags: caseFlagsRefData,
                partyChannels: partyChannelsRefData
              }
            }
          }
        }
      ]
    });
    router = TestBed.inject(ActivatedRoute);
    isAmendedPipe = new IsAmendedPipe(router);
  });

  it('should transform is amended for reasonable adjustment flags', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.CASE_FLAGS, of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is amended for venue', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.VENUE, of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is amended for additional security required', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.ADDITIONAL_SECURITY_REQUIRED, of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is amended for additional person amount required', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.ATTENDANT_PERSON_AMOUNT, of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is paper hearing', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.IS_PAPER_HEARING, of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is amended for panel inclusion', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements = {
      panelPreferences: [{
        memberID: 'P000001',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      }]
    };
    const result$ = isAmendedPipe.transform(AnswerSource.PANEL_INCLUSION, of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is amended for panel exclusion', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements = {
      panelPreferences: [{
        memberID: 'P000001',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      }]
    };
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingType = 'final';
    const result$ = isAmendedPipe.transform(AnswerSource.PANEL_EXCLUSION, of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is amended for panel roles', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements = {
      panelPreferences: [{
        memberID: 'P000001',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      }]
    };
    const result$ = isAmendedPipe.transform(AnswerSource.PANEL_ROLES, of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is amended for additional facilities required', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.ADDITIONAL_FACILITIES_REQUIRED, of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should not transform the amended flag when previous vs current people attend count are equal', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.HOW_ATTENDANT, of(STATE));
    const isAmended = true;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should not transform the amended flag when previous vs current people attend count are equal', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.HOW_PARTICIPANTS_ATTEND, of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should return amended flag false for hearing type', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.hearingType = 'final';
    const result$ = isAmendedPipe.transform(AnswerSource.STAGE, of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform need welsh flag based on selection', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.NEED_WELSH, of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });

  it('should transform need linked hearings flag based on selection', () => {
    const STATE: State = _.cloneDeep(initialStateImmutable.hearings);
    const result$ = isAmendedPipe.transform(AnswerSource.LINKED_HEARINGS, of(STATE));
    const isAmended = false;
    const expected = cold('(b|)', { b: isAmended });
    expect(result$).toBeObservable(expected);
  });
});
