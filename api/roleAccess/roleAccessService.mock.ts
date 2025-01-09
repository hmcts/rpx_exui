import * as MockAdapter from 'axios-mock-adapter';
import { HttpMockAdapter } from '../common/httpMockAdapter';

export const init = () => {
  const mock: MockAdapter = HttpMockAdapter.getInstance();

  const allocateRoleConfirmUrl = /http:\/\/am-role-assignment-service-aat.service.core-compute-aat.internal\/am\/role-assignments/;

  const deleteRoleUrl = /http:\/\/am-role-assignment-service-aat.service.core-compute-aat.internal\/am\/role-assignments\/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

  mock.onPost(allocateRoleConfirmUrl).reply((config) => {
    const payload = JSON.parse(config.data);
    const durationOfRole = payload.durationOfRole;
    if (durationOfRole === '7 days') {
      return [
        500,
        payload
      ];
    }
    return [
      200,
      payload
    ];
  });

  mock.onDelete(deleteRoleUrl).reply((config) => {
    const payload = JSON.parse(config.data);
    return [
      200,
      payload
    ];
  });
};
