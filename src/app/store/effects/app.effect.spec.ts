import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RoleService } from '@hmcts/rpx-xui-common-lib';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { AppConfigService } from '../../services/config/configuration.services';
import { Logout } from '../actions';
import * as fromAppEffects from './app.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('App Effects', () => {
  let actions$;
  let effects: fromAppEffects.AppEffects;
  const AuthServiceMock = jasmine.createSpyObj('AuthService', [
    'signOut'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StoreModule.forRoot({})],
    providers: [
        AppConfigService,
        {
            provide: AuthService,
            useValue: AuthServiceMock
        },
        RoleService,
        fromAppEffects.AppEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    effects = TestBed.inject(fromAppEffects.AppEffects);
  });

  describe('logout$', () => {
    it('should logout', () => {
      const payload = [{ payload: 'something' }];
      AuthServiceMock.signOut.and.returnValue(of(payload));
      const action = new Logout();
      actions$ = hot('-a', { a: action });
      effects.logout.subscribe(() => {
        expect(AuthServiceMock.signOut).toHaveBeenCalled();
      });
    });
  });
});
