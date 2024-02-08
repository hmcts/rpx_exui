import * as MockAdapter from 'axios-mock-adapter';
import { HttpMockAdapter } from '../common/httpMockAdapter';
import {
  HEARING_ACTUAL, HEARING_ACTUAL_ADJOURNED, HEARING_ACTUAL_AWAITING,
  HEARING_ACTUAL_COMPLETED
} from './data/hearing-actuals.mock.data';
import { EMPTY_HEARINGS_LIST, HEARINGS_LIST } from './data/hearingLists.mock.data';
import { HEARING_REQUEST_RESULTS } from './data/hearingRequests.mock.data';
import { LINKED_HEARING_GROUP, SERVICE_LINKED_CASES } from './data/linkHearings.mock.data';
import { SERVICE_HEARING_VALUES } from './data/serviceHearingValues.mock.data';

export const init = () => {
  const mock: MockAdapter = HttpMockAdapter.getInstance();

  // ------ Mock service APIs Start ------
  const postServiceHearingValues = /serviceHearingValues/;

  const loadServiceLinkedCases = /serviceLinkedCases/;
  // ------ Mock service APIs End ------

  // ------ Mock HMC APIs Start ------
  const getHearingsUrl = /hearings\/[0-9]{16}/;

  const getHearingInfoUrl = /hearing\/[\w]*/;

  const submitHearingRequest = /(hearing)\b/;

  const updateHearingRequest = /(hearing)\b/;

  const cancelHearingRequest = /(hearing)\b\/[\w]*/;

  const hearingActualsUrl = /(hearingActuals)\b\/[\w]*/;

  const postHearingActualsUrl = /hearingActualsCompletion\/[\w]*/;

  const getLinkedHearingGroup = /linkedHearingGroup\?caseReference=[\w]*&hearingId=[\w]*/;

  const linkedHearingGroup = /linkedHearingGroup/;
  // ------ Mock HMC APIs End ------

  mock.onPost(postServiceHearingValues).reply((config) => {
    const jsonData = JSON.parse(config.data);
    const caseReference = jsonData.caseReference;
    // START : This few lines code jus to faciliate testing for case references ending with 1
    // so that even the failure scenarios can be verified
    if (caseReference.endsWith('1')) {
      return [
        500,
        null
      ];
    }
    // END
    return [
      200,
      SERVICE_HEARING_VALUES
    ];
  });

  mock.onPost(loadServiceLinkedCases).reply(() => {
    return [
      200,
      SERVICE_LINKED_CASES
    ];
  });

  mock.onGet(getHearingsUrl).reply((config) => {
    const url = config.url;
    const caseIds = url.match(/[0-9]{16}/g);
    const mod = parseInt(caseIds[0], 10) % 2;
    if (mod === 1) {
      return [
        200,
        {
          ...HEARINGS_LIST,
          caseRef: caseIds[0]
        }
      ];
    }

    // the below exclusion of return 500 just to faciliate testing
    if (caseIds[0].endsWith('6')) {
      return [
        500,
        null
      ];
    }

    return [
      200,
      {
        ...EMPTY_HEARINGS_LIST,
        caseRef: caseIds[0]
      }
    ];
  });

  mock.onGet(getHearingInfoUrl).reply((config) => {
    const urlPaths: string[] = config.url.split('/');
    const hearingId = urlPaths[urlPaths.length - 1];
    if (hearingId === 'h100004') {
      return [
        500,
        null
      ];
    }
    const FOUND_A_HEARING = HEARING_REQUEST_RESULTS.find((hearing) => hearing.caseDetails.hearingID === hearingId);
    return [
      200,
      FOUND_A_HEARING
    ];
  });

  mock.onPost(submitHearingRequest).reply(() => {
    return [
      200,
      []
    ];
  });

  mock.onPut(updateHearingRequest).reply(() => {
    return [
      200,
      []
    ];
  });

  mock.onDelete(cancelHearingRequest).reply((config) => {
    // START : This few lines code jus to faciliate testing for specific hearing id of 100002
    // so that even the failure scenarios can be verified
    if (config.url.includes('/h100002')) {
      return [
        500,
        null
      ];
    }
    // END
    return [
      200,
      {}
    ];
  });

  mock.onGet(hearingActualsUrl).reply((config) => {
    // START : This few lines code jus to faciliate testing for specific hearing id of 100013
    // so that even the failure scenarios can be verified
    if (config.url.includes('/h100013')) {
      return [
        500,
        null
      ];
    }
    // END
    // returns completed hearing actual result
    if (config.url.includes('/h100010')) {
      return [
        200,
        HEARING_ACTUAL_COMPLETED
      ];
    } else if (config.url.includes('/h100011')) {
      return [
        200,
        HEARING_ACTUAL_ADJOURNED
      ];
    } else if (config.url.includes('/h100009')) {
      return [
        200,
        HEARING_ACTUAL_AWAITING
      ];
    }
    return [
      200,
      HEARING_ACTUAL
    ];
  });

  mock.onPut(hearingActualsUrl).reply(() => {
    return [
      200,
      HEARING_ACTUAL
    ];
  });

  mock.onPost(postHearingActualsUrl).reply(() => {
    return [
      200,
      []
    ];
  });

  mock.onGet(getLinkedHearingGroup).reply(() => {
    return [
      200,
      LINKED_HEARING_GROUP
    ];
  });

  mock.onPost(linkedHearingGroup).reply((config) => {
    // START : This few lines code just to faciliate testing for specific hearing id of h100014
    // so that even the failure scenarios can be verified
    const jsonData = JSON.parse(config.data);
    if (jsonData && jsonData.hearingsInGroup && jsonData.hearingsInGroup[0].hearingId === 'h100014') {
      return [
        500,
        null
      ];
    }
    // END
    return [
      200,
      {
        hearingGroupRequestId: 'g1000000'
      }
    ];
  });

  mock.onPut(linkedHearingGroup).reply(() => {
    return [
      200,
      {
        hearingGroupRequestId: 'g1000000'
      }
    ];
  });

  mock.onDelete(linkedHearingGroup).reply(() => {
    return [
      200,
      null
    ];
  });
};
