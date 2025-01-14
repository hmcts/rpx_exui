import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CaseAllocateRoleLinkResolverService } from './case-allocate-role-link-resolver.service';

describe('CaseAllocateRoleLinkResolverService', () => {
  let httpClient: HttpClient;
  const routerSpy = jasmine.createSpy('Router');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
        CaseAllocateRoleLinkResolverService,
        { provide: Router, useValue: routerSpy },
        { provide: APP_BASE_HREF, useValue: '/' },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    httpClient = TestBed.inject(HttpClient) as HttpClient;
  }));

  it('should return a value which tells if the user is allowed to see the allocate role link', async () => {
    spyOn(httpClient, 'get').and.returnValue(of(true));
    const service: CaseAllocateRoleLinkResolverService = await TestBed.inject(CaseAllocateRoleLinkResolverService);
    const activatedRoute = new ActivatedRouteSnapshot();
    activatedRoute.params = {
      cid: '1546883526751282'
    };
    service.resolve(activatedRoute).subscribe((value: boolean) => {
      expect(value).toBeTruthy();
    });
  });
});
