import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { AppConfigService } from './configuration.services';

describe('Configuration Service', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let service: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule
      ],
      providers: [AppConfigService],
      teardown: { destroyAfterEach: false }
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  });

  it('should have configuration service', () => {
    service = TestBed.inject(AppConfigService);
    expect(service).toBeTruthy();
  });

  it('should have configuration service load method', () => {
    httpClientSpy.get.and.returnValue({});
    service.load().subscribe((data) => {
      expect(data.features).toBeDefined();
    });
  });

  it('should have configuration service getFeatureToggle method', () => {
    expect(service.getFeatureToggle).toBeTruthy();
  });

  it('should have configuration service setConfiguration method', () => {
    expect(service.setConfiguration).toBeTruthy();
  });

  it('should have configuration service setConfiguration method', () => {
    expect(service.getEditorConfiguration).toBeTruthy();
  });
});

