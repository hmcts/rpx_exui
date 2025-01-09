import * as MockAdapter from 'axios-mock-adapter';
import { HttpMockAdapter } from '../../common/httpMockAdapter';
import { ALL_REF_DATA } from './data/lov.mock.data';

export const init = () => {
  const mock: MockAdapter = HttpMockAdapter.getInstance();

  const getRefDataUrl = /refdata\/commondata\/lov\/[\w]*\/[\w]*/;

  mock.onGet(getRefDataUrl).reply((config) => {
    const params = new URL(config.url);

    // deep clone object
    const data = JSON.parse(JSON.stringify(ALL_REF_DATA));

    if (params.searchParams.get('isChildRequired') !== 'Y') {
      data.forEach((model) => {
        model.services.forEach((service) => {
          service.values.forEach((value) => {
            // just remove the top level child nodes
            delete value.child_nodes;
          });
        });
      });
    }

    return [
      200,
      data
    ];
  });
};
