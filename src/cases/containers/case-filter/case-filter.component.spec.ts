import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AbstractAppConfig, AlertService, AuthService as CCDAuthService, CaseEditWizardGuard, CasesService, CreateCaseFiltersModule, DocumentManagementService, DraftService, HttpErrorService, HttpService, PageValidationService,
  PlaceholderService, RequestOptionsBuilder, RouterHelperService, SearchFiltersModule, SearchService
} from '@hmcts/ccd-case-ui-toolkit';
import { combineReducers, StoreModule } from '@ngrx/store';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { AppConfig } from '../../../app/services/ccd-config/ccd-case.config';
import { AppConfigService } from '../../../app/services/config/configuration.services';
import { SharedModule } from '../../../app/shared/shared.module';
import * as fromCaseCreate from '../../store/reducers';
import * as fromCases from '../../store/reducers/';
import { CaseFilterComponent } from './case-filter.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockSortService {
  public features = {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getFeatureToggle() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getEditorConfiguration() {}
}
describe('Case Filter Component', () => {
  let component: CaseFilterComponent;
  let fixture: ComponentFixture<CaseFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [CaseFilterComponent],
    imports: [RouterTestingModule,
        StoreModule.forRoot({ ...fromCases.reducers, cases: combineReducers(fromCases.reducers) }),
        HttpClientTestingModule,
        SharedModule,
        SearchFiltersModule,
        CreateCaseFiltersModule],
    providers: [
        PlaceholderService,
        CasesService,
        CCDAuthService,
        HttpService,
        HttpErrorService,
        AlertService,
        DraftService,
        PageValidationService,
        CaseEditWizardGuard,
        RouterHelperService,
        DocumentManagementService,
        AppConfigService,
        RequestOptionsBuilder,
        AppConfigService,
        AppConfig,
        {
            provide: SearchService,
            useValue: {
                requestOptionsBuilder: RequestOptionsBuilder
            }
        },
        {
            provide: AbstractAppConfig,
            useExisting: AppConfig
        },
        {
            provide: AppConfigService,
            useClass: MockSortService
        },
        ScrollToService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseFilterComponent);
    component = fixture.componentInstance;
    component.startButtonText = 'start';
    component.caseCreatFilterBindings = [];
    component.fromCasesFeature = fromCaseCreate;
    fixture.detectChanges();
  });

  xit('should create', () => {
    //  expect(component).toBeTruthy();
  });
});
