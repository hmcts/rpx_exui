import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { cold } from 'jasmine-marbles';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { caseFlagsRefData, initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { ReasonableAdjustmentFlagsAnswerConverter } from './reasonable-adjustment-flags.answer.converter';

describe('ReasonableAdjustmentFlagsAnswerConverter', () => {
  let reasonableAdjustmentFlagsConverter: ReasonableAdjustmentFlagsAnswerConverter;
  let router: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                caseFlags: caseFlagsRefData
              }
            }
          }
        }
      ]
    });
    router = TestBed.inject(ActivatedRoute);
    reasonableAdjustmentFlagsConverter = new ReasonableAdjustmentFlagsAnswerConverter(router);
  });

  it('should transform reasonable adjustment flags', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    const result$ = reasonableAdjustmentFlagsConverter.transformAnswer(of(STATE));
    const caseFlags = '<strong class=\'bold\'>Jane Smith</strong>\n<ul><li>Sign Language Interpreter</li><li>Hearing Loop</li><li>Larger font size</li><li>Reading documents for customer</li><li>Sign Language Interpreter</li></ul><br>';
    const expected = cold('(b|)', { b: caseFlags });
    expect(result$).toBeObservable(expected);
  });
});
