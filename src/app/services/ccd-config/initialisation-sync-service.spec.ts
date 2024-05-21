import { LaunchDarklyDefaultsConstants } from './launch-darkly-defaults.constants';
import { DeploymentEnvironmentEnum } from '../../enums/deployment-environment-enum';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from './ccd-case.config';
import { AppConfigService } from '../config/configuration.services';
import { InitialisationSyncService } from './initialisation-sync-service';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { EnvironmentService } from '../../shared/services/environment.service';
import createSpy = jasmine.createSpy;

describe('InitialisationSyncService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        InitialisationSyncService
      ]
    });
  });

  it('should create an instance of injectable service', () => {
    const iss = TestBed.inject(InitialisationSyncService);
    expect(iss).toBeTruthy();
  });

  it('should call callback when initialisation is complete', fakeAsync(() => {
    const iss = TestBed.inject(InitialisationSyncService);
    const foo = (complete: boolean) => {
      if (complete) {
        console.log('initialisation done');
      } else {
        console.log('callback called, initialisation incomplete');
      }
    };
    const spyFoo = createSpy('testSpy', foo).and.callThrough();
    iss.waitForInitialisation(spyFoo);
    expect(iss.getSubscriptionCount()).toBe(1);
    iss.initialisationComplete();
    flush();
    expect(spyFoo).toHaveBeenCalled();
  }));
});
