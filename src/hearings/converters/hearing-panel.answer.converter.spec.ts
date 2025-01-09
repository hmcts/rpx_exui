import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { MemberType, RadioOptions, RequirementType } from '../models/hearings.enum';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';
import { HearingPanelAnswerConverter } from './hearing-panel.answer.converter';
describe('HearingPanelAnswerConverter', () => {
  let converter: AnswerConverter;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<any>;
  const JUDICAIL_USER_DETAILS = [{
    memberID: 'P0000001',
    memberType: MemberType.PANEL_MEMBER,
    requirementType: RequirementType.MUSTINC
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState })
      ]
    });
    store = TestBed.inject(Store);
    converter = new HearingPanelAnswerConverter();
  });
  it('should transform hearing panel answer selection to yes', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements = {
      panelPreferences: JUDICAIL_USER_DETAILS
    };
    const result$ = converter.transformAnswer(of(STATE));
    const option = RadioOptions.YES;
    const expected = cold('(b|)', { b: option });
    expect(result$).toBeObservable(expected);
  });
  it('should transform hearing panel answer selection to no', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements = null;
    const result$ = converter.transformAnswer(of(STATE));
    const option = RadioOptions.NO;
    const expected = cold('(b|)', { b: option });
    expect(result$).toBeObservable(expected);
  });

  it('should transform hearing panel answer selection to no when hearings amendment is enabled', () => {
    const STATE = {
      ...initialState.hearings,
      hearingConditions: {
        ...initialState.hearings.hearingConditions,
        isHearingAmendmentsEnabled: true
      },
      hearingRequestToCompare: {
        ...initialState.hearings.hearingRequestToCompare,
        hearingRequestMainModel: {
          ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
          hearingDetails: {
            ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
            panelRequirements: null
          }
        }
      }
    };
    const result$ = converter.transformAnswer(of(STATE));
    const option = RadioOptions.NO;
    const expected = cold('(b|)', { b: option });
    expect(result$).toBeObservable(expected);
  });
});
