import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AbstractAppConfig,
  AlertService,
  AuthService as CCDAuthService,
  CaseEditWizardGuard,
  CasesService,
  DocumentManagementService,
  DraftService,
  HttpErrorService,
  HttpService,
  PageValidationService,
  PlaceholderService,
  RequestOptionsBuilder,
  RouterHelperService,
  SearchFiltersModule,
  SearchService
} from '@hmcts/ccd-case-ui-toolkit';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { AppConfig } from '../../../app/services/ccd-config/ccd-case.config';
import { AppConfigService } from '../../../app/services/config/configuration.services';
import { SharedModule } from '../../../app/shared/shared.module';
import { reducers } from '../../../app/store';
import * as fromCases from '../../store/reducers';
import { CasesCreateComponent } from './case-create.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockSortService {
  public features = {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getFeatureToggle() { }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getEditorConfiguration() { }
}

describe('CaseCreateComponent', () => {
  let component: CasesCreateComponent;
  let fixture: ComponentFixture<CasesCreateComponent>;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [CasesCreateComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    teardown: { destroyAfterEach: false },
    imports: [RouterTestingModule,
        StoreModule.forRoot({ ...reducers, cases: combineReducers(fromCases.reducers) }),
        EffectsModule.forRoot([]),
        SharedModule,
        SearchFiltersModule],
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
    fixture = TestBed.createComponent(CasesCreateComponent);
    component = fixture.componentInstance;
    component.caseCreateInputs = { jurisdictionId: '', caseTypeId: '', eventId: '' };

    fixture.detectChanges();
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have ngOnInit', () => {
    expect(component.ngOnInit).toBeTruthy();
  });

  it('should call unsubscribe on ngDestroy', () => {
    const subscription = jasmine.createSpyObj('myObject', ['unsubscribe']);

    component.unSubscribe(subscription);
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should not call unsubscribe when no subscription', () => {
    const subscription = jasmine.createSpyObj('myObject', ['unsubscribe']);

    component.unSubscribe(null);
    expect(subscription.unsubscribe).not.toHaveBeenCalled();
  });
});
