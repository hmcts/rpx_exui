import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { NeedPanelAnswerConverter } from './need-panel.answer.converter';

describe('NeedPanelAnswerConverter', () => {
  let needPanelAnswerConverter: NeedPanelAnswerConverter;

  beforeEach(() => {
    needPanelAnswerConverter = new NeedPanelAnswerConverter();
  });

  it('should transform need panel answer', () => {
    const STATE: State = initialState.hearings;
    const result$ = needPanelAnswerConverter.transformAnswer(of(STATE));
    const needPanel = 'No';
    const expected = cold('(b|)', { b: needPanel });
    expect(result$).toBeObservable(expected);
  });
});
