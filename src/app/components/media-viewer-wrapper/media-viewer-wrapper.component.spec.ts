import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AbstractAppConfig, DocumentUrlPipe, WindowService } from '@hmcts/ccd-case-ui-toolkit';
import { MediaViewerModule } from '@hmcts/media-viewer';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
import { MediaViewerWrapperComponent } from './media-viewer-wrapper.component';
import { RpxTranslationModule } from 'rpx-xui-translation';
import createSpyObj = jasmine.createSpyObj;
import { Title } from '@angular/platform-browser';

const GATEWAY_DOCUMENT_URL = 'http://localhost:1234/documents';
const REMOTE_DOCUMENT_URL = 'https://www.example.com/binary';
const MEDIA_VIEWER_DATA = {
  document_binary_url: GATEWAY_DOCUMENT_URL,
  document_filename: 'sample.pdf',
  content_type: 'pdf'
};

describe('MediaViewerWrapperComponent', () => {
  let component: MediaViewerWrapperComponent;
  let fixture: ComponentFixture<MediaViewerWrapperComponent>;
  let windowService;
  let sessionStorageService;
  let mockAppConfig: any;
  let featureToggleService;
  let titleService;

  beforeEach(waitForAsync(() => {
    mockAppConfig = createSpyObj<AbstractAppConfig>('AppConfig', ['getDocumentManagementUrl', 'getRemoteDocumentManagementUrl']);
    mockAppConfig.getDocumentManagementUrl.and.returnValue(GATEWAY_DOCUMENT_URL);
    mockAppConfig.getRemoteDocumentManagementUrl.and.returnValue(REMOTE_DOCUMENT_URL);
    windowService = createSpyObj('windowService', ['setLocalStorage', 'getLocalStorage', 'removeLocalStorage']);
    sessionStorageService = createSpyObj('sessionStorageService', ['setItem', 'getItem']);
    featureToggleService = createSpyObj('featureToggleService', ['isEnabled', 'getValue']);
    titleService = createSpyObj('titleService', ['setTitle']);
    TestBed.configureTestingModule({
      imports: [
        MediaViewerModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterTestingModule,
        RpxTranslationModule.forRoot({
          baseUrl: '',
          debounceTimeMs: 300,
          validity: {
            days: 1
          },
          testMode: true
        })
      ],
      declarations: [
        MediaViewerWrapperComponent,
        DocumentUrlPipe
      ],
      providers: [
        { provide: AbstractAppConfig, useValue: mockAppConfig },
        { provide: WindowService, useValue: windowService },
        { provide: FeatureToggleService, useValue: featureToggleService },
        { provide: SessionStorageService, useValue: sessionStorageService },
        { provide: Title, useValue: titleService }
      ],
      teardown: { destroyAfterEach: false }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create media viewer component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load media viewer data from local storage', () => {
      windowService.getLocalStorage.and.returnValues(JSON.stringify(MEDIA_VIEWER_DATA));
      fixture.detectChanges();
      expect(component).toBeTruthy();
      component.ngOnInit();
      expect(component.mediaURL).toBe(GATEWAY_DOCUMENT_URL);
      expect(component.mediaFilename).toBe('sample.pdf');
      expect(component.mediaContentType).toBe('pdf');
    });

    it('should move media viewer data from local to session storage', () => {
      windowService.getLocalStorage.and.returnValues(JSON.stringify(MEDIA_VIEWER_DATA));
      fixture.detectChanges();
      expect(component).toBeTruthy();
      component.ngOnInit();
      expect(sessionStorageService.setItem).toHaveBeenCalledTimes(1);
      expect(windowService.removeLocalStorage).toHaveBeenCalledTimes(1);
    });

    it('should not set the session or remove the local storage media viewer data if there is already media viewer data in session storage', () => {
      sessionStorageService.getItem.and.returnValues(JSON.stringify(MEDIA_VIEWER_DATA));
      fixture.detectChanges();
      expect(component).toBeTruthy();
      component.ngOnInit();
      expect(sessionStorageService.setItem).toHaveBeenCalledTimes(0);
      expect(windowService.removeLocalStorage).toHaveBeenCalledTimes(0);
    });
  });

  describe('isIcpEnabled', () => {
    it('should return true when icp-enabled is true and jurisdiction is empty', () => {
      expect(component.isIcpEnabled(true, [])).toBeTruthy();
    });

    it('should return false when icp-enabled is false and jurisdiction is empty', () => {
      component.caseJurisdiction = 'dummy';
      expect(component.isIcpEnabled(false, [])).toBeFalsy();
    });

    it('should return true when icp-enabled is false but jurisdiction is not empty and correct', () => {
      component.caseJurisdiction = 'dummy';
      expect(component.isIcpEnabled(false, ['dummy'])).toBeTruthy();
    });

    it('should return false when icp-enabled is false and jurisdiction is not empty but is wrong ', () => {
      component.caseJurisdiction = 'dummy';
      expect(component.isIcpEnabled(false, ['dummy1'])).toBeFalsy();
    });

    it('should change the browser title', () => {
      titleService.setTitle.and.returnValues('View Document - Any');
      fixture.detectChanges();
      expect(component).toBeTruthy();
      component.ngOnInit();
      expect(titleService.setTitle).toHaveBeenCalled();
    });
  });
});
