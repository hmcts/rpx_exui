import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../hearing.test.data';
import { ActualSummaryResponseResolver } from './actual-summary-response-resolver.resolve';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ActualSummaryResponseResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
        provideMockStore({ initialState }),
        ActualSummaryResponseResolver,
        { provide: APP_BASE_HREF, useValue: '/' },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}
    );
  });

  it('should be created', () => {
    const service: ActualSummaryResponseResolver = TestBed.inject(ActualSummaryResponseResolver);
    expect(service).toBeTruthy();
  });
});
