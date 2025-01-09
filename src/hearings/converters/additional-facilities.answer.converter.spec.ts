import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { facilitiesListRefData, initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { AdditionalFacilitiesAnswerConverter } from './additional-facilities.answer.converter';

describe('AdditionalFacilitiesAnswerConverter', () => {
  let converter: AdditionalFacilitiesAnswerConverter;
  let router: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                additionFacilitiesOptions: facilitiesListRefData
              }
            }
          }
        }
      ]
    });
    router = TestBed.inject(ActivatedRoute);
    converter = new AdditionalFacilitiesAnswerConverter(router);
  });

  it('should transform additional facilities', () => {
    const STATE: State = initialState.hearings;
    const result$ = converter.transformAnswer(of(STATE));
    const additionalFacilities = '<ul><li>Immigration detention centre</li><li>In camera court</li></ul>';
    const expected = cold('(b|)', { b: additionalFacilities });
    expect(result$).toBeObservable(expected);
  });

  it('should transform additional facilities when hearings amendment is enabled', () => {
    const STATE = {
      ...initialState.hearings,
      hearingConditions: {
        ...initialState.hearings.hearingConditions,
        isHearingAmendmentsEnabled: true
      }
    };
    const result$ = converter.transformAnswer(of(STATE));
    const additionalFacilities = '<ul><li>Same-sex courtroom</li><li>Secure dock</li></ul>';
    const expected = cold('(b|)', { b: additionalFacilities });
    expect(result$).toBeObservable(expected);
  });
});
