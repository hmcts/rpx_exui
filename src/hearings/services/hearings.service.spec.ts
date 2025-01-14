import { HttpRequest, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import * as _ from 'lodash';
import { initialState } from '../hearing.test.data';
import { HearingRequestMainModel } from '../models/hearingRequestMain.model';
import {
  GroupLinkType
} from '../models/hearings.enum';
import { LinkedHearingGroupMainModel } from '../models/linkHearings.model';
import { LovRefDataModel } from '../models/lovRefData.model';
import { HearingsService } from './hearings.service';

describe('HearingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StoreModule.forRoot({})],
    providers: [
        HearingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should be created', inject([HearingsService], (service: HearingsService) => {
    expect(service).toBeTruthy();
  }));

  describe('getAllHearings', () => {
    it('should get all hearings list', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.getAllHearings('1111222233334444').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/getHearings?caseId=1111222233334444');
      expect(req.request.method).toEqual('GET');
      req.flush(null);
    }));
  });

  describe('loadHearingValues', () => {
    it('should load hearing values', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.loadHearingValues('SSCS', '1111222233334444').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/loadServiceHearingValues?jurisdictionId=SSCS');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));
  });

  describe('loadHearingRequest', () => {
    const payload = 'h100000';

    it('should load hearing request', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.loadHearingRequest(payload).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/getHearing?hearingId=h100000');
      expect(req.request.method).toEqual('GET');
      req.flush(null);
    }));
  });

  describe('submitHearingRequest', () => {
    const payload = {
      requestDetails: null,
      hearingDetails: {
        duration: 0,
        hearingType: null,
        hearingLocations: null,
        hearingWindow: null,
        panelRequirements: null,
        autolistFlag: null,
        hearingPriorityType: null,
        amendReasonCodes: null,
        hearingChannels: null,
        listingAutoChangeReasonCode: null
      },
      partyDetails: null
    };

    it('should submit hearing request', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.submitHearingRequest(payload).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/submitHearingRequest');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));
  });

  describe('updateHearingRequest', () => {
    const hearingRequest: HearingRequestMainModel = _.cloneDeep(initialState.hearings.hearingRequest.hearingRequestMainModel);
    const payload = {
      ...hearingRequest,
      requestDetails: {
        ...hearingRequest.requestDetails,
        hearingRequestID: '1000000'
      },
      ...hearingRequest,
      hearingDetails: {
        ...hearingRequest.hearingDetails
      }
    };

    it('should update hearing request', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.updateHearingRequest(payload).subscribe((response) => {
        console.log('RESPONSE', JSON.stringify(response));
        console.log('PAYLOAD', JSON.stringify(payload));
        expect(response).toBeNull();
      });
      httpMock.expectOne((req: HttpRequest<any>) => {
        expect(req.url).toBe('api/hearings/updateHearingRequest');
        expect(req.method).toBe('PUT');
        expect(req.params.get('hearingId')).toEqual('1000000');
        return true;
      })
        .flush(null);
    }));
  });

  describe('cancelHearingRequest', () => {
    const payload: LovRefDataModel[] = [
      {
        key: 'reasonOne',
        value_en: 'Reason 1',
        value_cy: '',
        hint_text_en: 'reason 1',
        hint_text_cy: '',
        lov_order: 1,
        parent_key: null,
        category_key: 'CancelHearingReason',
        parent_category: '',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        key: 'reasonTwo',
        value_en: 'Reason 2',
        value_cy: '',
        hint_text_en: 'Reason 2',
        hint_text_cy: '',
        lov_order: 2,
        parent_key: null,
        category_key: 'CancelHearingReason',
        parent_category: '',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        key: 'reasonThree',
        value_en: 'Reason 3',
        value_cy: '',
        hint_text_en: 'Reason 3',
        hint_text_cy: '',
        lov_order: 4,
        parent_key: null,
        category_key: 'CancelHearingReason',
        parent_category: '',
        active_flag: 'Y',
        child_nodes: null
      }
    ];

    it('should cancel hearing request', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      const cancellationReasonCodes: string[] = payload.map((reason) => reason.key);
      service.cancelHearingRequest('h0002', payload).subscribe((response) => {
        expect(response).toBeNull();
      });

      httpMock.expectOne((req: HttpRequest<any>) => {
        expect(req.url).toBe('api/hearings/cancelHearings?hearingId=h0002');
        expect(req.method).toBe('DELETE');
        expect(req.body.cancellationReasonCodes).toEqual(cancellationReasonCodes);
        return true;
      })
        .flush(null);
    }));
  });

  describe('getHearingActuals', () => {
    it('should hearing actuals by id', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.getHearingActuals('1111222233334444').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/hearingActuals/1111222233334444');
      expect(req.request.method).toEqual('GET');
      req.flush(null);
    }));
  });

  describe('updateHearingActuals', () => {
    const payload = {
      hearingOutcome: null,
      actualHearingDays: []
    };

    it('should update hearing actuals', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.updateHearingActuals('1111222233334444', payload).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/hearingActuals?hearingId=1111222233334444');
      expect(req.request.method).toEqual('PUT');
      req.flush(null);
    }));
  });

  describe('submitHearingActuals', () => {
    it('should submit hearing actuals', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.submitHearingActuals('1111222233334444').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/hearingActualsCompletion/1111222233334444');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));
  });

  describe('link hearing services', () => {
    it('should call loadServiceLinkedCases', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.loadServiceLinkedCases('SSCS', '1111222233334444', 'h1000000').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/loadServiceLinkedCases?jurisdictionId=SSCS');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));

    it('should call loadLinkedCasesWithHearings', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.loadLinkedCasesWithHearings('SSCS', '1111222233334444', 'test', 'h1000000').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/loadLinkedCasesWithHearings?jurisdictionId=SSCS');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));

    it('should call getLinkedHearingGroup', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.getLinkedHearingGroup('1').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/getLinkedHearingGroup?groupId=1');
      expect(req.request.method).toEqual('GET');
      req.flush(null);
    }));

    it('should call postLinkedHearingGroup', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.postLinkedHearingGroup(null).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/postLinkedHearingGroup');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));

    it('should call putLinkedHearingGroup', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      const linkedHearingGroupMainModel: LinkedHearingGroupMainModel = {
        groupDetails: {
          groupComments: 'TBU',
          groupLinkType: GroupLinkType.ORDERED,
          groupName: 'TBU',
          groupReason: '1'
        },
        hearingsInGroup: [
          {
            hearingId: '2000002012',
            hearingOrder: 3
          },
          {
            hearingId: '2000002014',
            hearingOrder: 1
          },
          {
            hearingId: '2000001916',
            hearingOrder: 2
          }
        ]
      };
      service.putLinkedHearingGroup('1', linkedHearingGroupMainModel).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/hearings/putLinkedHearingGroup?groupId=1');
      expect(req.request.method).toEqual('PUT');
      req.flush(null);
    }));

    it('should call deleteLinkedHearingGroup', inject([HttpTestingController, HearingsService], (httpMock: HttpTestingController, service: HearingsService) => {
      service.deleteLinkedHearingGroup('g100000').subscribe((response) => {
        expect(response).toBeNull();
      });

      httpMock.expectOne((req: HttpRequest<any>) => {
        expect(req.url).toBe('api/hearings/deleteLinkedHearingGroup');
        expect(req.method).toBe('DELETE');
        expect(req.params.get('hearingGroupId')).toEqual('g100000');
        return true;
      })
        .flush(null);
    }));
  });

  describe('prepareHearingRequestModel', () => {
    const model:HearingRequestMainModel = {
      hearingDetails: {
        duration: 0,
        hearingType: null,
        hearingLocations: null,
        hearingWindow: {
          dateRangeStart: '2022-11-23T09:00:00.000Z',
          dateRangeEnd: '2022-11-30T09:00:00.000Z',
          firstDateTimeMustBe: '2022-12-01T09:00:00.000Z'
        },
        panelRequirements: null,
        autolistFlag: null,
        hearingPriorityType: null,
        amendReasonCodes: null,
        hearingChannels: null,
        listingAutoChangeReasonCode: null
      },
      partyDetails: []
    };

    it('should return HearingRequestMainModel with no update', inject([HearingsService], (service: HearingsService) => {
      expect(service.prepareHearingRequestModel(model)).toEqual(model);
    }));

    it('should return HearingRequestMainModel hearingWindow null', inject([HearingsService], (service: HearingsService) => {
      const newModel:HearingRequestMainModel = {
        ...model,
        hearingDetails: {
          ...model.hearingDetails,
          hearingWindow: {}
        }
      };

      const result:HearingRequestMainModel = {
        ...model,
        hearingDetails: {
          ...model.hearingDetails,
          hearingWindow: null
        }
      };
      expect(service.prepareHearingRequestModel(newModel)).toEqual(result);
    }));
  });
});
