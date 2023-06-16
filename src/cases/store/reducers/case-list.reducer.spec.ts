import { SearchResultView } from '@hmcts/ccd-case-ui-toolkit';
import * as fromCases from '../actions/case-list.action';
import * as filterCaseList from './case-list.reducer';

describe('CaseList Filter Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialCaselistState } = filterCaseList;
      const action = {} as any;
      const state = filterCaseList.caselistReducer(undefined, action);
      expect(state).toBe(initialCaselistState);
    });
  });

  describe('[CreateCaselist] Apply Caselist Filter', () => {
    it('should set correct object', () => {
      const { initialCaselistState } = filterCaseList;
      const action = new fromCases.ApplyCaselistFilter({
        selected: {
          caseState: {
            id: '1',
            name: 'One',
            description: 'One desc'
          },
          jurisdiction: {
            id: '2',
            name: 'Two',
            description: 'Two desc',
            caseTypes: []
          },
          caseType: {
            id: '3',
            name: 'case type',
            description: 'Case Type Desc',
            events: [],
            states: [],
            case_fields: [],
            jurisdiction: null,
            printEnabled: false
          }
        }
      });

      const state = filterCaseList.caselistReducer(initialCaselistState, action);

      expect(state.loading).toEqual(true);
      expect(state.loaded).toEqual(false);
      expect(state.filter.caseState).toEqual({
        id: '1',
        name: 'One',
        description: 'One desc'
      });
      expect(state.filter.jurisdiction).toEqual({
        id: '2',
        name: 'Two',
        description: 'Two desc',
        caseTypes: []
      });
      expect(state.filter.caseType).toEqual({
        id: '3',
        name: 'case type',
        description: 'Case Type Desc',
        events: [],
        states: [],
        case_fields: [],
        jurisdiction: null,
        printEnabled: false
      });
    });
  });

  describe('[CreateCaselist] Apply Caselist Filter for ES', () => {
    it('should set correct object', () => {
      const { initialCaselistState } = filterCaseList;
      const action = new fromCases.ApplyCaselistFilterForES({
        selected: {
          caseState: {
            id: '1',
            name: 'One',
            description: 'One desc'
          },
          jurisdiction: {
            id: '2',
            name: 'Two',
            description: 'Two desc',
            caseTypes: []
          },
          caseType: {
            id: '3',
            name: 'case type',
            description: 'Case Type Desc',
            events: [],
            states: [],
            case_fields: [],
            jurisdiction: null,
            printEnabled: false
          }
        }
      });

      const state = filterCaseList.caselistReducer(initialCaselistState, action);

      expect(state.loading).toEqual(true);
      expect(state.loaded).toEqual(false);
      expect(state.filter.caseState).toEqual({
        id: '1',
        name: 'One',
        description: 'One desc'
      });
      expect(state.filter.jurisdiction).toEqual({
        id: '2',
        name: 'Two',
        description: 'Two desc',
        caseTypes: []
      });
      expect(state.filter.caseType).toEqual({
        id: '3',
        name: 'case type',
        description: 'Case Type Desc',
        events: [],
        states: [],
        case_fields: [],
        jurisdiction: null,
        printEnabled: false
      });
    });
  });

  describe('[CreateCaselist] Find caselist pagination metadata success', () => {
    it('should set correct object', () => {
      const { initialCaselistState } = filterCaseList;
      const action = new fromCases.FindCaselistPaginationMetadataSuccess({
        totalPagesCount: 10,
        totalResultsCount: 25
      });

      const state = filterCaseList.caselistReducer(initialCaselistState, action);

      expect(state.loading).toEqual(true);
      expect(state.loaded).toEqual(false);
      expect(state.paginationMetadata.totalPagesCount).toEqual(10);
      expect(state.paginationMetadata.totalResultsCount).toEqual(25);
    });
  });

  describe('[CreateCaselist] Apply Caselist Filter Success', () => {
    it('should set correct object', () => {
      const { initialCaselistState } = filterCaseList;
      const action = new fromCases.ApplyCaselistFilterSuccess(new SearchResultView());

      const state = filterCaseList.caselistReducer(initialCaselistState, action);

      expect(state.loading).toEqual(true);
      expect(state.loaded).toEqual(false);
      expect(state.results.resultView).toEqual(new SearchResultView());
    });
  });

  describe('[CreateCaseList] toggle caselist filter success', () => {
    it('should set correct object', () => {
      const { initialCaselistState } = filterCaseList;
      const action = new fromCases.CaseFilterToggleSuccess(true);

      const state = filterCaseList.caselistReducer(initialCaselistState, action);

      expect(state.showFilter).toEqual(true);
    });
  });

  describe('[CreateCaseList] toggle caselist filter success', () => {
    it('should set correct object', () => {
      const { initialCaselistState } = filterCaseList;
      const action = new fromCases.CaseListReset();

      const state = filterCaseList.caselistReducer(initialCaselistState, action);

      expect(state).toBe(initialCaselistState);
    });
  });
});
