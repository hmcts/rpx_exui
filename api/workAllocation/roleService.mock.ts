import * as MockAdapter from 'axios-mock-adapter';
import { HttpMockAdapter } from '../common/httpMockAdapter';
import { CASEROLES } from './constants/roles.mock.data';

export const init = () => {
  const mock: MockAdapter = HttpMockAdapter.getInstance();
  const getCaseRolesUrl = /http:\/\/am-role-assignment-service-aat.service.core-compute-aat.internal\/cases\/[a-fA-F0-9]{16}/;
  mock.onGet(getCaseRolesUrl).reply(() => {
    return [
      200,
      CASEROLES
    ];
  });
};
