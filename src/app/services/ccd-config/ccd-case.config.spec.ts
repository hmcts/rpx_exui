import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { EnvironmentService } from '../../../app/shared/services/environment.service';
import { AppConfigService } from '../config/configuration.services';
import { AppConfig } from './ccd-case.config';
import { InitialisationSyncService } from './initialisation-sync-service';
import { DeploymentEnvironmentEnum } from '../../enums/deployment-environment-enum';
import { LoggerService } from '../logger/logger.service';

class MockConfigService {
  private readonly config;
  private readonly caseEditorConfig = {};
  constructor() {
    this.config = {
      login_url: 'test',
      document_management_url_v2: 'dummy',
      document_management_secure_enabled: true,
      hrs_url: 'dummy',
      remote_hrs_url: 'dummy',
      access_management_mode: true,
      location_ref_api_url: 'dummy',
      cam_role_assignments_api_url: 'dummy',
      notification_url: 'dummy',
      events_to_hide: [
        'queryManagementRespondQuery'
      ]
    };
  }

  public getEditorConfiguration = () => this.config;
}

const mockFeatureToggleService = jasmine.createSpyObj('mockFeatureToggleService', ['isEnabled', 'getValue']);

const mockEnvironmentService = jasmine.createSpyObj('EnvironmentService', ['get', 'getDeploymentEnv']);
mockEnvironmentService.getDeploymentEnv.and.returnValue(DeploymentEnvironmentEnum.PROD);
mockEnvironmentService.get.and.returnValue('someUrl');

const mockWindow = jasmine.createSpyObj('Window', ['location']);
mockWindow.location.and.returnValue(new URL('https://manage-case.platform.hmcts.net'));
const mockLoggerService = jasmine.createSpyObj('LoggerService', ['log']);

describe('AppConfiguration', () => {
  mockFeatureToggleService.isEnabled.and.returnValue(of(false));
  mockFeatureToggleService.getValue.and.callFake((featureMame: string, defVal: any) => {
    return of(defVal);
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule
      ],
      providers: [
        { provide: Window, useValue: mockWindow },
        AppConfig,
        InitialisationSyncService,
        { provide: AppConfigService, useClass: MockConfigService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: EnvironmentService, useValue: mockEnvironmentService },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    });
    const iss = TestBed.inject(InitialisationSyncService);
    iss.initialisationComplete(true);
  });

  it('should be created ', inject([AppConfig, Window], (service: AppConfig) => {
    expect(service).toBeTruthy();
    expect(mockEnvironmentService.getDeploymentEnv).toHaveBeenCalled();
  }));

  it('should have load', inject([AppConfig], (service: AppConfig) => {
    expect(service.load()).toBeDefined();
  }));

  it('should have getLoginUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getLoginUrl).toBeDefined();
  }));

  it('should have getLoginUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getLoginUrl).toBeDefined();
  }));

  it('should have getApiUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getApiUrl).toBeDefined();
  }));

  it('should have getDocumentManagementUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getDocumentManagementUrl).toBeDefined();
  }));

  it('should have getRemoteDocumentManagementUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getRemoteDocumentManagementUrl).toBeDefined();
  }));

  it('should have getHrsUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getHrsUrl).toBeDefined();
  }));

  it('should have getRemoteHrsUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getRemoteHrsUrl).toBeDefined();
  }));

  it('should have getHrsUrl return value', inject([AppConfig], (service: AppConfig) => {
    expect(service.getHrsUrl()).toBe('dummy');
  }));

  it('should have getRemoteHrsUrl return value', inject([AppConfig], (service: AppConfig) => {
    expect(service.getRemoteHrsUrl()).toBe('dummy');
  }));

  it('should have getPostcodeLookupUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getPostcodeLookupUrl).toBeDefined();
  }));

  it('should have getOAuth2ClientId', inject([AppConfig], (service: AppConfig) => {
    expect(service.getOAuth2ClientId).toBeDefined();
  }));

  it('should have getPaymentsUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getPaymentsUrl()).toBeUndefined();
  }));

  it('should have getCreateOrUpdateDraftsUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getCreateOrUpdateDraftsUrl).toBeDefined();
  }));

  it('should have getCaseHistoryUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getCaseHistoryUrl).toBeDefined();
  }));

  it('should have getActivityUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getActivityUrl).toBeDefined();
  }));

  it('should have getRemotePrintServiceUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getRemotePrintServiceUrl()).toBeUndefined();
  }));

  it('should have getCreateOrUpdateDraftsUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getCreateOrUpdateDraftsUrl('')).toBe('undefined/internal/case-types//drafts/');
  }));

  it('should have getAnnotationApiUrl', inject([AppConfig], (service: AppConfig) => {
    expect(service.getAnnotationApiUrl()).toBeUndefined();
  }));

  it('should have getDocumentManagementUrlV2', inject([AppConfig], (service: AppConfig) => {
    expect(service.getDocumentManagementUrlV2).toBeDefined();
  }));

  it('should have getDocumentSecureMode', inject([AppConfig], (service: AppConfig) => {
    expect(service.getDocumentSecureMode).toBeDefined();
  }));

  it('should have getDocumentManagementUrlV2 return value', inject([AppConfig], (service: AppConfig) => {
    expect(service.getDocumentManagementUrlV2()).toBe('dummy');
  }));

  it('should have getDocumentSecureMode return value', inject([AppConfig], (service: AppConfig) => {
    expect(service.getDocumentSecureMode()).toBe(false);
  }));

  it('should have getAccessManagementMode return value', inject([AppConfig], (service: AppConfig) => {
    mockEnvironmentService.get.and.returnValue(true);
    expect(service.getAccessManagementMode()).toBe(true);
  }));

  it('should have getLocationRefApiUrl return value', inject([AppConfig], (service: AppConfig) => {
    expect(service.getLocationRefApiUrl()).toBe('dummy');
  }));

  it('should have getCamRoleAssignmentsApiUrl return value', inject([AppConfig], (service: AppConfig) => {
    expect(service.getCamRoleAssignmentsApiUrl()).toBe('dummy');
  }));

  it('should have getEventsToHide return value', inject([AppConfig], (service: AppConfig) => {
    expect(service.getEventsToHide()).toEqual(['queryManagementRespondQuery']);
  }));

  it('should have called LogService log method', inject([AppConfig, Window], (service: AppConfig) => {
    service.logMessage('hello world');
    expect(mockLoggerService.log).toHaveBeenCalledWith('hello world');
  }));

  it('should add attributes to an object retaining original attributes', inject([AppConfig], (service: AppConfig) => {
    const testObj = { foo: 'bar', thud: 1 };
    const expectedObj = {
      ...testObj,
      'wibble': 'wassock'
    };
    const result = service.addAttribute(testObj, 'wibble', 'wassock');
    expect(result).toEqual(expectedObj);
    expect(typeof result).toEqual(typeof(expectedObj));
  }));

  it('should be initialised after all LD observables complete', fakeAsync(inject([AppConfig], (service: AppConfig) => {
    tick(5000);
    expect(service.initialisationComplete).toBeTruthy();
  })));
});
