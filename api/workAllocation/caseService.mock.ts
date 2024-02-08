import * as MockAdapter from 'axios-mock-adapter';
import { HttpMockAdapter } from '../common/httpMockAdapter';
import { filterAllWorkCases } from './caseService';
import { CASEWORKER_ALL_CASES, CASEWORKER_MY_CASES, JUDICIAL_ALL_CASES, JUDICIAL_MY_CASES } from './constants/mock.data';
import { SearchTaskParameter } from './interfaces/taskSearchParameter';

export const init = () => {
  const mock: MockAdapter = HttpMockAdapter.getInstance();

  const judicialMyCaseUrl = /http:\/\/wa-task-management-api-aat.service.core-compute-aat.internal\/myCases\?view=judicial/;
  const caseworkerMyCaseUrl = /http:\/\/wa-task-management-api-aat.service.core-compute-aat.internal\/myCases\?view=legalops/;

  const judicialAllCaseUrl = /http:\/\/wa-task-management-api-aat.service.core-compute-aat.internal\/allWorkCases\?view=judicial/;
  const caseworkerAllCaseUrl = /http:\/\/wa-task-management-api-aat.service.core-compute-aat.internal\/allWorkCases\?view=legalops/;

  // simulate some error if needed
  // mock.onGet(url).networkErrorOnce()
  mock.onPost(judicialMyCaseUrl).reply((config) => {
    // return an array in the form of [status, data, headers]
    const body = JSON.parse(config.data);
    const paginationConfig = body.pagination_parameters;
    const sortingConfig = body.sorting_parameters;
    const caseList = sort(JUDICIAL_MY_CASES.cases,
      getSortName(sortingConfig[0].sort_by), (sortingConfig[0].sort_order === 'asc'));
    return [
      200,
      {
        cases: paginate(caseList, paginationConfig.page_number, paginationConfig.page_size),
        total_records: JUDICIAL_MY_CASES.cases.length
      }
    ];
  });

  mock.onPost(caseworkerMyCaseUrl).reply((config) => {
    // return an array in the form of [status, data, headers]
    const body = JSON.parse(config.data);
    const paginationConfig = body.pagination_parameters;
    const sortingConfig = body.sorting_parameters;
    const caseList = sort(CASEWORKER_ALL_CASES.cases,
      getSortName(sortingConfig[0].sort_by), (sortingConfig[0].sort_order === 'asc'));
    return [
      200,
      {
        cases: paginate(caseList, paginationConfig.page_number, paginationConfig.page_size),
        total_records: CASEWORKER_MY_CASES.cases.length
      }
    ];
  });

  mock.onPost(judicialAllCaseUrl).reply((config) => {
    // return an array in the form of [status, data, headers]
    const body = JSON.parse(config.data);
    const paginationConfig = body.pagination_parameters;
    const sortingConfig = body.sorting_parameters;
    const searchParameters: SearchTaskParameter[] = body.search_parameters as SearchTaskParameter[];
    const filteredList = filterAllWorkCases(JUDICIAL_ALL_CASES.cases, searchParameters);
    const caseList = sort(filteredList,
      getSortName(sortingConfig[0].sort_by), (sortingConfig[0].sort_order === 'asc'));
    return [
      200,
      {
        cases: paginate(caseList, paginationConfig.page_number, paginationConfig.page_size),
        total_records: filteredList.length
      }
    ];
  });

  mock.onPost(caseworkerAllCaseUrl).reply((config) => {
    // return an array in the form of [status, data, headers]
    const body = JSON.parse(config.data);
    const paginationConfig = body.pagination_parameters;
    const sortingConfig = body.sorting_parameters;
    const filteringConfig = body.search_parameters;
    const filteredList = filterAllWorkCases(CASEWORKER_ALL_CASES.cases, filteringConfig);
    const caseList = sort(filteredList,
      getSortName(sortingConfig[0].sort_by), (sortingConfig[0].sort_order === 'asc'));
    return [
      200,
      {
        cases: paginate(caseList, paginationConfig.page_number, paginationConfig.page_size),
        total_records: filteredList.length
      }
    ];
  });
};

export const getSortName = (sortName: string): string => {
  switch (sortName) {
    case 'caseName':
      return 'case_name';
    case 'caseCategory':
      return 'case_category';
    case 'locationName':
      return 'location_name';
    case 'taskTitle':
      return 'task_title';
    default:
      return sortName;
  }
};

export const sort = (array: any[], sortName: string, isAsc: boolean): any[] => {
  array = array.sort((a, b) => a[sortName].localeCompare(b[sortName]));
  return isAsc ? array : array.reverse();
};

export const paginate = (array: any[], pageNumber: number, pageSize: number): any[] => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
