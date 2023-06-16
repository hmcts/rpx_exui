import * as fromCases from '../actions/create-case.action';

export interface CreatedCaseModel {
  caseId: string;
  status: string;
}

export interface CasesState {
  createdCase: CreatedCaseModel | object;
  createCaseFilters: any;
  loading: boolean;
  loaded: boolean;
}

export const initialState: CasesState = {
  createdCase: {},
  createCaseFilters: {},
  loaded: false,
  loading: false
};

export function reducerCreateCase(
  state = initialState,
  action: fromCases.CreateCasesAction
): CasesState {
  // tslint:disable-next-line:switch-default
  switch (action.type) {
    case fromCases.CREATE_CASE_APPLY: {
      return {
        ...state,
        createdCase: action.payload,
        loaded: true
      };
    }

    case fromCases.CREATE_CASE_FILTER_APPLY: {
      return {
        ...state,
        createCaseFilters: action.payload,
        loaded: true
      };
    }

    case fromCases.CREATE_CASE_RESET: {
      return {
        ...state,
        ...initialState
      };
    }
  }

  return state;
}

export const getCreatedCase = (state: CasesState) => state.createdCase;
export const getCaseFiltersState = (state: CasesState) => state.createCaseFilters;
