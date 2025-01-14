import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { HearingsFeatureService } from './hearings-feature.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HearingsFeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StoreModule.forRoot({})],
    providers: [
        HearingsFeatureService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });
  it('should be created', inject([HearingsFeatureService], (service: HearingsFeatureService) => {
    expect(service).toBeTruthy();
  }));
});
