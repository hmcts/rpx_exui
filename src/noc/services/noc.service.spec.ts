import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { NocService } from './noc.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StoreModule.forRoot({})],
    providers: [
        NocService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should be created', inject([NocService], (service: NocService) => {
    expect(service).toBeTruthy();
  }));

  describe('getNoCQuestions', () => {
    it('should get getNoCQuestions', inject([HttpTestingController, NocService], (httpMock: HttpTestingController, service: NocService) => {
      service.getNoCQuestions('123456').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/noc/nocQuestions?caseId=123456');
      expect(req.request.method).toEqual('GET');
      req.flush(null);
    }));
  });

  describe('validateNoCAnswers', () => {
    it('should validateNoCAnswers', inject([HttpTestingController, NocService], (httpMock: HttpTestingController, service: NocService) => {
      service.validateNoCAnswers({ case_id: '123', answers: [] }).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/noc/validateNoCQuestions');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));
  });

  describe('submitNoCEvent', () => {
    it('should submitNoCEvent', inject([HttpTestingController, NocService], (httpMock: HttpTestingController, service: NocService) => {
      service.submitNoCEvent({ case_id: '123', answers: [] }).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/noc/submitNoCEvents');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));
  });
});
