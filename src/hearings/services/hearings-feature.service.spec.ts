import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { HearingsFeatureService } from './hearings-feature.service';

describe('HearingsFeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({})
      ],
      providers: [
        HearingsFeatureService
      ]
    });
  });
  it('should be created', inject([HearingsFeatureService], (service: HearingsFeatureService) => {
    expect(service).toBeTruthy();
  }));
});
