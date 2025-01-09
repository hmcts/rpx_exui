import { cold } from 'jasmine-marbles';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { ParticipantAttendanceExclusionHiddenConverter } from './participant-attendance-exclusion.hidden.converter';

describe('ParticipantAttendanceExclusionHiddenConverter', () => {
  let participantAttendanceExclusionHiddenConverter: ParticipantAttendanceExclusionHiddenConverter;

  beforeEach(() => {
    participantAttendanceExclusionHiddenConverter = new ParticipantAttendanceExclusionHiddenConverter();
  });

  it('should transform hidden of true answer', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingValues.serviceHearingValuesModel.screenFlow = null;
    const result$ = participantAttendanceExclusionHiddenConverter.transformHidden(of(STATE));
    const expected = cold('(b|)', { b: true });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hidden of false answer', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    const result$ = participantAttendanceExclusionHiddenConverter.transformHidden(of(STATE));
    const expected = cold('(b|)', { b: false });
    expect(result$).toBeObservable(expected);
  });
});
