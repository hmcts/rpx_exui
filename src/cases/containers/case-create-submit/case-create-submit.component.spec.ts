import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AbstractAppConfig,
  AlertService,
  AuthService as CCDAuthService,
  CaseEventData,
  CaseEventTrigger,
  CaseField,
  CasesService,
  RetryUtil,
  createCaseEventTrigger,
  DraftService,
  HttpErrorService,
  HttpService,
  LoadingService,
  OrderService,
  RequestOptionsBuilder,
  SearchService,
  SessionStorageService,
  WorkAllocationService
} from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule, FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { AppConfig } from '../../../app/services/ccd-config/ccd-case.config';
import { AppConfigService } from '../../../app/services/config/configuration.services';
import * as fromCases from '../../store/reducers';
import { CaseCreateSubmitComponent } from './case-create-submit.component';
import { InitialisationSyncService } from '../../../app/services/ccd-config/initialisation-sync-service';
import { LoggerService } from 'src/app/services/logger/logger.service';

class MockSortService {
  public features = {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getFeatureToggle() { }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getEditorConfiguration() { }
}

const EVENT_TRIGGER: CaseEventTrigger = createCaseEventTrigger(
  'TEST_TRIGGER',
  'Test Trigger',
  'caseId',
  false,
  [
    ({
      id: 'PersonFirstName',
      label: 'First name',
      field_type: null,
      display_context: 'READONLY'
    }) as CaseField,
    ({
      id: 'PersonLastName',
      label: 'Last name',
      field_type: null,
      display_context: 'OPTIONAL'
    }) as CaseField
  ],
  [],
  true
);

const SANITISED_EDIT_FORM: CaseEventData = {
  data: {},
  event: {
    id: null,
    summary: 'Some summary',
    description: 'Some description'
  },
  event_token: 'test-token',
  ignore_warning: false
};

@Component({
  selector: 'exui-ccd-connector',
  template: '<div></div>'
})

class FakeExuidCcdConnectorComponent { }

describe('CaseCreateSubmitComponent', () => {
  let component: CaseCreateSubmitComponent;
  let fixture: ComponentFixture<CaseCreateSubmitComponent>;
  let casesService: CasesService;
  let draftService: DraftService;
  const mockAlertService = jasmine.createSpyObj('alertService', ['error']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockFeatureToggleService', ['isEnabled', 'getValue']);
  const mockLoggerService = jasmine.createSpyObj('LoggerService', ['log']);

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  beforeEach(waitForAsync(() => {
    mockFeatureToggleService.isEnabled.and.returnValue(of(false));
    mockFeatureToggleService.getValue.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ExuiCommonLibModule,
        HttpClientTestingModule,
        StoreModule.forRoot({ ...fromCases.reducers, cases: combineReducers(fromCases.reducers) }),
        EffectsModule.forRoot([])
      ],
      declarations: [CaseCreateSubmitComponent, FakeExuidCcdConnectorComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue:
          {
            queryParams: of({ Origin: 'viewDraft' }),
            snapshot: {
              data: { eventTrigger: EVENT_TRIGGER },
              params: {},
              pathFromRoot: [
                {},
                {
                  data: {
                    profile: {}
                  }
                }
              ]
            },
            params: of({ jid: 'jid', ctid: 'ctid' })
          }
        },
        CasesService,
        RetryUtil,
        CCDAuthService,
        DraftService,
        AlertService,
        HttpService,
        OrderService,
        WorkAllocationService,
        LoadingService,
        SessionStorageService,
        HttpErrorService,
        { provide: Window, useValue: window },
        InitialisationSyncService,
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
        {
          provide: AlertService,
          useValue: mockAlertService
        },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CaseCreateSubmitComponent);
    component = fixture.componentInstance;
    casesService = fixture.debugElement.injector.get(CasesService);
    casesService = fixture.debugElement.injector.get(CasesService);
    draftService = fixture.debugElement.injector.get(DraftService);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have ngOnInit', () => {
    expect(component.ngOnInit).toBeTruthy();
  });

  it('should have called casesService.createCase on submit', async () => {
    spyOn(casesService, 'createCase').and.callThrough();
    component.submit()(SANITISED_EDIT_FORM);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(casesService.createCase).toHaveBeenCalled();
  });

  it('should have called casesService.validateCase on validate', async () => {
    spyOn(casesService, 'validateCase').and.callThrough();
    component.validate()(SANITISED_EDIT_FORM, '12');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(casesService.validateCase).toHaveBeenCalled();
  });

  it('should have called draftService.createOrUpdateDraft on saveDraft', async () => {
    spyOn(draftService, 'createOrUpdateDraft').and.callThrough();
    component.saveDraft()(SANITISED_EDIT_FORM);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(draftService.createOrUpdateDraft).toHaveBeenCalled();
  });

  it('should not  have called draftService.createOrUpdateDraft on saveDraft is false', async () => {
    spyOn(draftService, 'createOrUpdateDraft').and.callThrough();
    component.eventTrigger.can_save_draft = false;
    expect(component.saveDraft()).toBeUndefined();
  });
});
