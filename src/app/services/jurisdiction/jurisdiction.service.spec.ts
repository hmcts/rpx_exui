import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JurisdictionService } from './jurisdiction.service';

describe('Jurisdiction Service', () => {
  let httpClientGetSpy: { get: jasmine.Spy };
  let service: JurisdictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        JurisdictionService
      ],
      teardown: { destroyAfterEach: false }
    });

    httpClientGetSpy = jasmine.createSpyObj('HttpClient', ['get']);
  });

  it('should have configuration service', () => {
    service = TestBed.inject(JurisdictionService);
    expect(service).toBeTruthy();
  });

  it('should get jurisdictions', () => {
    httpClientGetSpy.get.and.returnValue({});
    service.getJurisdictions().subscribe((data) => {
      expect(data).toBeTruthy();
    });
  });
});
