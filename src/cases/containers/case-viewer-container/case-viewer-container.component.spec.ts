import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CaseField, CaseTab, CaseView } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService, FeatureUser } from '@hmcts/rpx-xui-common-lib';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { State, reducers } from '../../../app/store';
import { AllocateRoleService } from '../../../role-access/services';
import { WASupportedJurisdictionsService } from '../../../work-allocation/services';
import { CaseViewerContainerComponent } from './case-viewer-container.component';

@Component({
  selector: 'ccd-case-viewer',
  template: `
    <mat-tab-group>
      <mat-tab *ngFor="let tab of prependedTabs" [id]="tab.id" [label]="tab.label">
      </mat-tab>
    </mat-tab-group>
  `
})
class CaseViewerComponent {
  @Input() public caseDetails: CaseView;
  @Input() public prependedTabs: CaseTab[] = [];
  @Input() public appendedTabs: CaseTab[] = [];
}

const CASE_VIEW: CaseView = {
  events: [],
  triggers: [],
  case_id: '1234567890123456',
  case_type: {
    id: 'Benefit',
    name: 'Test Address Book Case',
    jurisdiction: {
      id: 'SSCS',
      name: 'SSCS'
    },
    printEnabled: true
  },
  channels: [],
  state: {
    id: 'CaseCreated',
    name: 'Case created'
  },
  tabs: [
    {
      id: 'NameTab',
      label: 'Name',
      order: 2,
      fields: [
        Object.assign(new CaseField(), {
          id: 'PersonFirstName',
          label: 'First name',
          display_context: 'OPTIONAL',
          field_type: {
            id: 'Text',
            type: 'Text'
          },
          order: 2,
          value: 'Janet',
          show_condition: '',
          hint_text: ''
        }),
        Object.assign(new CaseField(), {
          id: 'PersonLastName',
          label: 'Last name',
          display_context: 'OPTIONAL',
          field_type: {
            id: 'Text',
            type: 'Text'
          },
          order: 1,
          value: 'Parker',
          show_condition: 'PersonFirstName="Jane*"',
          hint_text: ''
        }),
        Object.assign(new CaseField(), {
          id: 'PersonComplex',
          label: 'Complex field',
          display_context: 'OPTIONAL',
          field_type: {
            id: 'Complex',
            type: 'Complex',
            complex_fields: []
          },
          order: 3,
          show_condition: 'PersonFirstName="Park"',
          hint_text: ''
        })
      ],
      show_condition: 'PersonFirstName="Janet"'
    },
    {
      id: 'HistoryTab',
      label: 'History',
      order: 1,
      fields: [Object.assign(new CaseField(), {
        id: 'CaseHistory',
        label: 'Case History',
        display_context: 'OPTIONAL',
        field_type: {
          id: 'CaseHistoryViewer',
          type: 'CaseHistoryViewer'
        },
        order: 1,
        value: null,
        show_condition: '',
        hint_text: ''
      })],
      show_condition: ''
    },
    {
      id: 'SomeTab',
      label: 'Some Tab',
      order: 3,
      fields: [],
      show_condition: ''
    }
  ]
};

const mockSupportedJurisdictionsService = jasmine.createSpyObj('WASupportedJurisdictionsService', ['getWASupportedJurisdictions']);

class MockFeatureToggleService implements FeatureToggleService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getValue<R>(_key: string, _defaultValue: R): Observable<R> {
    if (_key === 'wa-service-config') {
      // @ts-ignore
      return of({ configurations: [{ serviceName: 'SSCS', caseTypes: ['Benefit'], releaseVersion: '3.0' }] });
    }
    // @ts-ignore
    return of([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getValueOnce<R>(_key: string, _defaultValue: R): Observable<R> {
    return of([{
      jurisdiction: 'SSCS',
      caseType: 'Benefit',
      roles: ['caseworker-sscs-judge', 'caseworker-sscs']
    }] as unknown as R);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getValueSync<R>(_key: string, _defaultValue: R): R {
    return {
      jurisdiction: 'SSCS',
      caseType: 'Benefit',
      roles: ['caseworker-sscs-judge', 'caseworker-sscs']
    } as unknown as R;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public initialize(_user: FeatureUser, _clientId: string): void { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isEnabled(_feature: string): Observable<boolean> {
    return undefined;
  }
}

class MockAllocateRoleService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public manageLabellingRoleAssignment(caseId: string): Observable<string[]> {
    return of([]);
  }
}

const TABS: CaseTab[] = [
  {
    id: 'tasks',
    label: 'Tasks',
    fields: [],
    show_condition: null
  },
  {
    id: 'roles-and-access',
    label: 'Roles and access',
    fields: [],
    show_condition: null
  }
];

const roles = [
  'caseworker',
  'caseworker-ia-iacjudge',
  'caseworker-sscs',
  'caseworker-sscs-judge',
  'caseworker-test',
  'managePayment',
  'payments',
  'payments-refund',
  'payments-refund-approver',
  'pui-finance-manager',
  'pui-organisation-manager',
  'pui-user-manager'
];

const rolesWithHearingRoles = [
  'caseworker',
  'hearing-manager'
];

describe('CaseViewerContainerComponent', () => {
  let component: CaseViewerContainerComponent;
  let fixture: ComponentFixture<CaseViewerContainerComponent>;
  let debug: DebugElement;

  const initialState: State = {
    routerReducer: null,
    appConfig: {
      config: {},
      termsAndCondition: null,
      loaded: true,
      loading: true,
      termsAndConditions: null,
      isTermsAndConditionsFeatureEnabled: null,
      useIdleSessionTimeout: null,
      userDetails: {
        sessionTimeout: {
          idleModalDisplayTime: 0,
          totalIdleTime: 0
        },
        canShareCases: true,
        userInfo: {
          id: '',
          active: true,
          email: 'juser4@mailinator.com',
          forename: 'XUI test',
          roles: roles,
          uid: 'd90ae606-98e8-47f8-b53c-a7ab77fde22b',
          surname: 'judge'
        },
        roleAssignmentInfo: []
      },
      decorate16digitCaseReferenceSearchBoxInHeader: false
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot(reducers), MatTabsModule, BrowserAnimationsModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                case: CASE_VIEW
              }
            }
          }
        },
        { provide: FeatureToggleService, useClass: MockFeatureToggleService },
        { provide: AllocateRoleService, useClass: MockAllocateRoleService },
        { provide: WASupportedJurisdictionsService, useValue: mockSupportedJurisdictionsService }
      ],
      declarations: [CaseViewerContainerComponent, CaseViewerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseViewerContainerComponent);
    mockSupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of(['IA', 'SSCS']));
    component = fixture.componentInstance;
    debug = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should return the two tabs', (done: DoneFn) => {
    component.prependedTabs$.subscribe((tabs: CaseTab[]) => {
      expect(tabs.length).toBe(TABS.length);
      expect(tabs[0].id).toBe('tasks');
      expect(tabs[1].id).toBe('roles-and-access');
      done();
    });
  });

  it('should render two tabs', () => {
    const matTabLabels: DebugElement = debug.query(By.css('.mat-tab-labels'));
    const matTabHTMLElement: HTMLElement = matTabLabels.nativeElement as HTMLElement;
    const tasksTab: HTMLElement = matTabHTMLElement.children[0] as HTMLElement;
    const roleAndAccessTab: HTMLElement = matTabHTMLElement.children[1] as HTMLElement;
    expect((tasksTab.querySelector('.mat-tab-label-content') as HTMLElement).innerText).toBe('Tasks');
    expect((roleAndAccessTab.querySelector('.mat-tab-label-content') as HTMLElement).innerText).toBe('Roles and access');
  });
});

describe('CaseViewerContainerComponent - Hearings tab visible', () => {
  let component: CaseViewerContainerComponent;
  let fixture: ComponentFixture<CaseViewerContainerComponent>;

  const initialState: State = {
    routerReducer: null,
    appConfig: {
      config: {},
      termsAndCondition: null,
      loaded: true,
      loading: true,
      termsAndConditions: null,
      isTermsAndConditionsFeatureEnabled: null,
      useIdleSessionTimeout: null,
      userDetails: {
        sessionTimeout: {
          idleModalDisplayTime: 0,
          totalIdleTime: 0
        },
        canShareCases: true,
        userInfo: {
          id: '',
          active: true,
          email: 'juser4@mailinator.com',
          forename: 'XUI test',
          roles: rolesWithHearingRoles,
          uid: 'd90ae606-98e8-47f8-b53c-a7ab77fde22b',
          surname: 'judge'
        },
        roleAssignmentInfo: []
      },
      decorate16digitCaseReferenceSearchBoxInHeader: false
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot(reducers), MatTabsModule, BrowserAnimationsModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                case: CASE_VIEW
              }
            }
          }
        },
        { provide: FeatureToggleService, useClass: MockFeatureToggleService },
        { provide: AllocateRoleService, useClass: MockAllocateRoleService },
        { provide: WASupportedJurisdictionsService, useValue: mockSupportedJurisdictionsService }
      ],
      declarations: [CaseViewerContainerComponent, CaseViewerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseViewerContainerComponent);
    mockSupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of(['IA', 'SSCS']));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display Hearings tab', () => {
    component.appendedTabs$.subscribe((tabs) =>
      expect(tabs[0].id).toEqual('hearings')
    );
  });
});

describe('CaseViewerContainerComponent - Hearings tab hidden', () => {
  let component: CaseViewerContainerComponent;
  let fixture: ComponentFixture<CaseViewerContainerComponent>;

  const initialState: State = {
    routerReducer: null,
    appConfig: {
      config: {},
      termsAndCondition: null,
      loaded: true,
      loading: true,
      termsAndConditions: null,
      isTermsAndConditionsFeatureEnabled: null,
      useIdleSessionTimeout: null,
      userDetails: {
        sessionTimeout: {
          idleModalDisplayTime: 0,
          totalIdleTime: 0
        },
        canShareCases: true,
        userInfo: {
          id: '',
          active: true,
          email: 'juser4@mailinator.com',
          forename: 'XUI test',
          roles: roles,
          uid: 'd90ae606-98e8-47f8-b53c-a7ab77fde22b',
          surname: 'judge'
        },
        roleAssignmentInfo: []
      },
      decorate16digitCaseReferenceSearchBoxInHeader: false
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot(reducers), MatTabsModule, BrowserAnimationsModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                case: CASE_VIEW
              }
            }
          }
        },
        { provide: FeatureToggleService, useClass: MockFeatureToggleService },
        { provide: AllocateRoleService, useClass: MockAllocateRoleService },
        { provide: WASupportedJurisdictionsService, useValue: mockSupportedJurisdictionsService }
      ],
      declarations: [CaseViewerContainerComponent, CaseViewerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseViewerContainerComponent);
    mockSupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of(['IA', 'SSCS']));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not display the Hearings tab', () => {
    component.appendedTabs$.subscribe((tabs) =>
      expect(tabs.length).toEqual(0)
    );
  });
});
