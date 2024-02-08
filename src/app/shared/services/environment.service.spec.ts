import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvironmentService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([EnvironmentService], (service: EnvironmentService) => {
    expect(service).toBeTruthy();
  }));

  it('should detect the production environment correctly', inject([EnvironmentService], (service: EnvironmentService) => {
    const dummyWithData = {
      data: {
        ccdGatewayUrl: ''
      },
      isProd: () => {
        return false;
      }
    };

    dummyWithData.isProd = service.isProd.bind(dummyWithData);

    dummyWithData.data.ccdGatewayUrl = 'https://gateway.ccd.AAT.platform.hmcts.net';
    expect(dummyWithData.isProd()).toBe(false);

    dummyWithData.data.ccdGatewayUrl = '';
    expect(dummyWithData.isProd()).toBe(true);

    dummyWithData.data.ccdGatewayUrl = null;
    expect(dummyWithData.isProd()).toBe(true);

    dummyWithData.data.ccdGatewayUrl = 'https://gateway.ccd.platform.hmcts.net';
    expect(dummyWithData.isProd()).toBe(true);
  }));
});
