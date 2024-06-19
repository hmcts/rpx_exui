import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInfo } from '../../../app/models';
import { SessionStorageService } from '..';
import { WindowLocationService } from '../window-location/window-location.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    public authService: AuthService,
    private readonly sessionStorage: SessionStorageService,
    private readonly windowLocationService: WindowLocationService
  ) {}

  public canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(map((isAuth) => {
      if (!isAuth) {
        this.storeRedirectUrl();
        this.authService.loginRedirect();
        return false;
      }

      this.redirectToStoredUrl();
      return true;
    }));
  }

  private storeRedirectUrl(): void {
    this.sessionStorage.setItem('redirectUrl', this.windowLocationService.getPathName());
  }

  public getJSONObject(value: string): UserInfo {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  private redirectToStoredUrl(): void {
    const currentLocationPathName = this.windowLocationService.getPathName();
    const currentPathIsNotEmpty = /^\/([a-z]+)/g;
    const currentPathIsRoot = !currentLocationPathName.match(currentPathIsNotEmpty);

    const userInfoStr = this.sessionStorage.getItem('userDetails');

    if (currentPathIsRoot && userInfoStr && this.getJSONObject(userInfoStr)) {
      const redirectUrl = this.sessionStorage.getItem('redirectUrl', true);
      if (!redirectUrl) {
        return;
      }

      if (window.location.pathname !== redirectUrl) {
        this.authService.setWindowLocationHref(redirectUrl);
      } else {
        return;
      }
    }
  }
}
