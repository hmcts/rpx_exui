import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { selectStaffError } from './staff-select.selector';
import { staffSelectReducer } from '../reducers/staff-select.reducer';

describe('Staff Selectors', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('staffUI', staffSelectReducer)
      ]
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getHearingConditions', () => {
    it('should return hearings navigation state', () => {
      let result = null;
      store.pipe(select(selectStaffError)).subscribe((value) => {
        result = value;
      });
      expect(result).toBeNull();
    });
  });
});
