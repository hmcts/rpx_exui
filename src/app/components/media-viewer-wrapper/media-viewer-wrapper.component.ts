import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WindowService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Observable } from 'rxjs';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
import { Title } from '@angular/platform-browser';

const MEDIA_VIEWER = 'media-viewer-info';

@Component({
  selector: 'exui-media-viewer',
  templateUrl: './media-viewer-wrapper.component.html',
  styleUrls: ['./media-viewer-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MediaViewerWrapperComponent implements OnInit {
  public mediaURL = '';
  public mediaFilename = '';
  public mediaContentType = '';
  public mediaAnnotationApiUrl = '';
  public toolbarButtons = { showPrint: true };
  public caseId = '';
  public caseJurisdiction = '';

  public icpJurisdictions$: Observable<string[]>;
  public icpEnabled$: Observable<boolean>;
  public enableRedactSearch$: Observable<boolean>;

  public constructor(
        private readonly windowService: WindowService,
        private readonly featureToggleService: FeatureToggleService,
        private readonly sessionStorageService: SessionStorageService,
        private readonly titleService: Title
  ) {}

  public async ngOnInit() {
    const localStorageMedia = this.windowService.getLocalStorage(MEDIA_VIEWER);
    let sessionStorageMedia = this.sessionStorageService.getItem(MEDIA_VIEWER);

    if (!sessionStorageMedia && localStorageMedia) {
      // move media viewer item from local to session storage to allow page refresh on multiple media viewer tabs
      sessionStorageMedia = localStorageMedia;
      this.sessionStorageService.setItem(MEDIA_VIEWER, sessionStorageMedia);
      this.windowService.removeLocalStorage(MEDIA_VIEWER);
    }

    if (sessionStorageMedia) {
      const media: {
                document_binary_url: string
                document_filename: string
                content_type: string
                annotation_api_url?: string
                case_id?: string
                case_jurisdiction?: string
            } = JSON.parse(sessionStorageMedia);
      this.mediaURL = media.document_binary_url;
      this.mediaFilename = media.document_filename;
      this.mediaContentType = media.content_type;
      this.mediaAnnotationApiUrl = media.annotation_api_url;
      this.caseId = media.case_id;
      this.caseJurisdiction = media.case_jurisdiction;
    }

    this.icpJurisdictions$ = this.featureToggleService.getValue('icp-jurisdictions', []);
    this.icpEnabled$ = this.featureToggleService.isEnabled('icp-enabled');
    this.enableRedactSearch$ = this.featureToggleService.isEnabled('enable-redact-search');

    this.titleService.setTitle(this.mediaFilename + ' - View Document');
  }

  /**
     * isIcpEnabled()
     * Determines ICP visibility
     *
     * @param isEnabled - true
     * @param icpJurisdictions - []
     */
  public isIcpEnabled(isEnabled: boolean, icpJurisdictions: string[]): boolean {
    return icpJurisdictions && icpJurisdictions.length > 0 ? icpJurisdictions.includes(this.caseJurisdiction) : isEnabled;
  }
}
