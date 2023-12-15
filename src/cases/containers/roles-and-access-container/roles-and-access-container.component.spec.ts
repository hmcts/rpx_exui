import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AbstractAppConfig, AlertService, AuthService, CaseField, CaseNotifier, CaseView, CasesService, HttpErrorService } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule, FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CASEROLES } from '../../../../api/workAllocation/constants/roles.mock.data';
import { CaseRolesTableComponent } from '../../../role-access/components/case-roles-table/case-roles-table.component';
import { ExclusionsTableComponent } from '../../../role-access/components/exclusions-table/exclusions-table.component';
import { CaseRole, RoleCategory, RoleExclusion } from '../../../role-access/models';
import { CaseRoleDetails } from '../../../role-access/models/case-role-details.interface';
import { RoleExclusionsService } from '../../../role-access/services';
import { RoleExclusionsMockService } from '../../../role-access/services/role-exclusions.mock.service';
import { initialMockState } from '../../../role-access/testing/app-initial-state.mock';
import { AllocateARoleLinkComponent, RoleAccessSectionComponent } from '../../components';
import { RolesAndAccessComponent } from '../../components/roles-and-access/roles-and-access.component';
import { ShowAllocateLinkDirective } from '../../directives/show-allocate-link.directive';
import { RolesAndAccessContainerComponent } from './roles-and-access-container.component';

const metadataField = {} as CaseField;
metadataField.id = '[JURISDICTION]';
metadataField.value = 'JUDICIAL';
const flags = {
  enabledFlag: true,
  disabledFlag: false
};
const CASE_VIEW: CaseView = {
  metadataFields: [metadataField],
  events: [],
  triggers: [],
  case_id: '1234567890123456',
  case_type: {
    id: 'TestAddressBookCase',
    name: 'Test Address Book Case',
    jurisdiction: {
      id: 'TEST',
      name: 'Test'
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

describe('RolesContainerComponent', () => {
  const featureToggleService = jasmine.createSpyObj('featureToggleService', ['isEnabled', 'getValue']);
  let component: RolesAndAccessContainerComponent;
  let fixture: ComponentFixture<RolesAndAccessContainerComponent>;
  const mockAllocateRoleService = jasmine.createSpyObj('AllocateRoleService', ['getCaseRoles', 'getCaseRolesUserDetails']);
  const mockNotifierService = jasmine.createSpyObj('caseNotifier', ['cachedCaseView']);
  mockNotifierService.cachedCaseView = {};
  const data: CaseRoleDetails[] = [
    {
      idam_id: '519e0c40-d30e-4f42-8a4c-2c79838f0e4e',
      sidam_id: '519e0c40-d30e-4f42-8a4c-2c79838f0e4e',
      known_as: 'Tom',
      surname: 'Cruz',
      full_name: 'Tom Cruz',
      email_id: '330085EMP-@ejudiciary.net'
    }
  ];
  const caseRolesData: any[] = [
    {
      actions: [
        {
          id: 'reallocate',
          title: 'Reallocate'
        },
        {
          id: 'remove',
          title: 'Remove Allocation'
        }
      ],
      actorId: '519e0c40-d30e-4f42-8a4c-2c79838f0e4e',
      end: null,
      id: '13daef07-dbd2-4106-9099-711c4505f04f',
      location: null,
      roleCategory: RoleCategory.JUDICIAL,
      roleName: 'hearing-judge',
      start: '2021-12-09T00:00:00Z'
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), ExuiCommonLibModule, HttpClientTestingModule, HttpClientModule],
      providers: [
        CasesService, HttpErrorService, HttpErrorService, AuthService, AbstractAppConfig, AlertService,
        { provide: CaseNotifier, useValue: mockNotifierService },
        {
          provide: RoleExclusionsService,
          useClass: RoleExclusionsMockService
        },
        {
          provide: FeatureToggleService,
          useValue: {
            isEnabled: (flag) => of(flags[flag]),
            getValue: (flag) => of(flags[flag])
          }
        },
        provideMockStore({ initialState: initialMockState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                roles: CASEROLES,
                showAllocateRoleLink: true,
                case: CASE_VIEW
              }
            }
          }
        }
      ],
      declarations: [
        RolesAndAccessContainerComponent,
        RolesAndAccessComponent,
        CaseRolesTableComponent,
        ShowAllocateLinkDirective,
        ExclusionsTableComponent,
        RoleAccessSectionComponent,
        AllocateARoleLinkComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAndAccessContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('setDisplayAllocateLink to set true for JUDICIAL', () => {
    component.setDisplayAllocateLink(initialMockState.appConfig.userDetails, 'JUDICIAL');

    expect(component.showAllocateRoleLink).toBeTruthy();
  });

  it('should get exclusions from the api', () => {
    component.exclusions$.subscribe((exclusions: RoleExclusion[]) => {
      expect(exclusions.length).toBe(1);
      expect(exclusions[0].name).toBe('Judge Birch');
    });
  });

  it('should case roles from api', () => {
    mockAllocateRoleService.getCaseRoles.and.returnValue(of(caseRolesData));
    mockAllocateRoleService.getCaseRolesUserDetails.and.returnValue(of(data));
    component.roles$.subscribe((caseRoles: CaseRole[]) => {
      expect(caseRoles.length).toBe(1);
      expect(caseRoles[0].name).toBe('Tom Cruz');
    });
  });
});

describe('RolesContainerComponent', () => {
  let component: RolesAndAccessContainerComponent;
  const route = jasmine.createSpyObj('route', ['navigate']);
  const store = jasmine.createSpyObj('route', ['pipe', 'select']);
  const featureToggleService: FeatureToggleService = jasmine.createSpyObj('featureToggleService', ['isEnabled', 'getValue']);
  const roleExclusionsService = jasmine.createSpyObj('route', ['getCurrentUserRoleExclusions']);
  const allocateService = jasmine.createSpyObj('route', ['getCaseRoles', 'getCaseRolesUserDetails']);
  const caseworkerDataService = jasmine.createSpyObj('route', ['loadAll']);
  const sessionStorageService = jasmine.createSpyObj('sessionStorageService', ['getItem', 'setItem']);
  const mockNotifierService = jasmine.createSpyObj('caseNotifier', ['cachedCaseView']);
  mockNotifierService.cachedCaseView = {};

  it('loadRoles', () => {
    component = new RolesAndAccessContainerComponent(route, store, roleExclusionsService, allocateService, caseworkerDataService, sessionStorageService, featureToggleService);
    const caseDetails = {} as CaseView;
    caseDetails.case_id = '123456789';
    caseDetails.case_type = {
      id: '334',
      name: '',
      description: '',
      jurisdiction: {
        id: '',
        name: '',
        description: ''
      },
      printEnabled: false
    };
    component.caseDetails = caseDetails;
    const caseRoles = [{ roleCategory: 'JUDICIAL', actorId: '234' }];
    allocateService.getCaseRoles.and.returnValue(of(caseRoles));
    const caseUserDetails = [{ known_as: 'some', idam_id: '234' }];
    allocateService.getCaseRolesUserDetails.and.returnValue(of(caseUserDetails));
    const casefield = {};
    component.loadRoles(casefield);
    component.roles$.subscribe((roles) => {
      expect(roles).not.toBeNull();
      expect(roles.length).toEqual(1);
      expect(roles[0].actorId).toEqual('234');
      expect(roles[0].roleCategory).toEqual('JUDICIAL');
    });
  });

  // it('loadRoles should update with caseRoles', () => {
  //   component = new RolesAndAccessContainerComponent(route, store, roleExclusionsService, allocateService, caseworkerDataService, sessionStorageService);
  //   const caseDetails = {} as CaseView;
  //   caseDetails.case_id = '123456789';
  //   caseDetails.case_type = {
  //     id: '334',
  //     name: '',
  //     description: '',
  //     jurisdiction: {
  //       id: '',
  //       name: '',
  //       description: '',
  //     },
  //     printEnabled: false
  //   }
  //   component.caseDetails = caseDetails;
  //   const caseRoles = [];
  //   allocateService.getCaseRoles.and.returnValue(of(caseRoles));
  //   const caseUserDetails = [{ known_as: 'some', idam_id: '234' }];
  //   allocateService.getCaseRolesUserDetails.and.returnValue(of(caseUserDetails));
  //   const casefield = {};
  //   component.loadRoles(casefield);
  //   component.roles$.subscribe(roles => {
  //     expect(roles).toEqual(caseRoles);
  //   });
  // });

  it('loadExclusions', () => {
    component = new RolesAndAccessContainerComponent(route, store, roleExclusionsService, allocateService, caseworkerDataService, sessionStorageService, featureToggleService);

    const jurisdiction = { value: 'ia' };
    const exclusions = [
      {
        actorId: 'ret',
        id: 'id23',
        type: 'err',
        name: '',
        userType: 'JUDICIAL',
        notes: '',
        added: new Date(),
        email: ''
      }
    ];
    const caseDetails = { case_id: '12344', case_type: { id: '345' } } as CaseView;
    component.caseDetails = caseDetails;
    roleExclusionsService.getCurrentUserRoleExclusions.and.returnValue(of(exclusions));
    component.loadExclusions(jurisdiction);
    component.exclusions$.subscribe(() => {
      expect(allocateService.getCaseRolesUserDetails).toHaveBeenCalled();
    });
  });

  it('loadExclusions should update exclusions with empty array', () => {
    component = new RolesAndAccessContainerComponent(route, store, roleExclusionsService, allocateService, caseworkerDataService, sessionStorageService, featureToggleService);

    const jurisdiction = { value: 'ia' };
    const exclusions = [];
    component.caseDetails = { case_id: '12344', case_type: { id: '345' } } as CaseView;
    roleExclusionsService.getCurrentUserRoleExclusions.and.returnValue(of(exclusions));
    component.loadExclusions(jurisdiction);
    component.exclusions$.subscribe((actual) => {
      expect(actual).toEqual(exclusions);
    });
  });

  it('applyJurisdiction', () => {
    component = new RolesAndAccessContainerComponent(route, store, roleExclusionsService, allocateService, caseworkerDataService, sessionStorageService, featureToggleService);
    spyOn(component, 'setDisplayAllocateLink');

    store.select.and.returnValue(of({}));
    component.applyJurisdiction(CASE_VIEW);

    expect(component.setDisplayAllocateLink).toHaveBeenCalled();
    expect(component.caseJurisdiction).toEqual('JUDICIAL');
  });
});
