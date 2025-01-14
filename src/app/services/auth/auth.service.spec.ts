import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StoreModule.forRoot({})],
    providers: [
        AuthService,
        SessionStorageService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  describe('isAuthenticated', () => {
    it('should make a call to check authentication', inject(
      [HttpTestingController, AuthService],
      (httpMock: HttpTestingController, service: AuthService) => {
        service.isAuthenticated().subscribe((response) => {
          expect(JSON.parse(String(response))).toBeFalsy();
        });

        const req = httpMock.expectOne('/auth/isAuthenticated');
        expect(req.request.method).toEqual('GET');
        req.flush('false');
      }
    ));
  });

  describe('logOut', () => {
    it('should make a call to logOut', inject(
      [HttpTestingController, AuthService, SessionStorageService],
      (httpMock: HttpTestingController, service: AuthService, sessionStorageService: SessionStorageService) => {
        spyOn(sessionStorageService, 'clear');
        service.logOut().subscribe((response) => {
          expect(response).toBeNull();
        });

        const req = httpMock.expectOne('/auth/logout?noredirect=true');
        expect(req.request.method).toEqual('GET');
        req.flush(null);

        // Should have cleared out the session storage.
        expect(sessionStorageService.clear).toHaveBeenCalled();
      }
    ));
  });

  describe('logOutAndRedirect', () => {
    it('should work', inject(
      [AuthService],
      async (service: AuthService) => {
        const spyOnSetWindowLocation = spyOn(service, 'setWindowLocationHref');
        spyOn(service, 'logOut').and.returnValue(of(false));
        service.logOutAndRedirect();
        expect(spyOnSetWindowLocation).toHaveBeenCalledWith('/idle-sign-out');
      }
    ));
  });

  describe('signOut', () => {
    it('should work', inject(
      [AuthService, SessionStorageService],
      async (service: AuthService, sessionStorageService: SessionStorageService) => {
        spyOn(sessionStorageService, 'clear');
        const spyOnSetWindowLocation = spyOn(service, 'setWindowLocationHref');
        service.signOut();
        expect(spyOnSetWindowLocation).toHaveBeenCalledWith('/auth/logout');
        expect(sessionStorageService.clear).toHaveBeenCalled();
      }
    ));
  });
});
