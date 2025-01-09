import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LoadingService, PaginationModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule, FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { SessionStorageService } from '../../../app/services';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import * as fromActions from '../../../app/store';
import { CaseRoleDetails } from '../../../role-access/models/case-role-details.interface';
import { AllocateRoleService } from '../../../role-access/services';
import { JurisdictionsService } from '../../../work-allocation/services/juridictions.service';
import { WorkAllocationComponentsModule } from '../../components/work-allocation.components.module';
import { Case } from '../../models/cases';
import { CaseworkerDataService, LocationDataService, WASupportedJurisdictionsService, WorkAllocationCaseService } from '../../services';
import { getMockCaseRoles, getMockCases } from '../../tests/utils.spec';
import { MyAccessComponent } from '../my-access/my-access.component';
import { MyCasesComponent } from '../my-cases/my-cases.component';
import { WorkCaseListComponent } from '../work-case-list/work-case-list.component';
import { WorkCaseListWrapperComponent } from './work-case-list-wrapper.component';

const USER_DETAILS = {
  canShareCases: true,
  userInfo: {
    id: 'someId',
    forename: 'foreName',
    surname: 'surName',
    email: 'email@email.com',
    active: true,
    roles: ['pui-case-manager']
  },
  roleAssignmentInfo: [
    {
      roleName: 'test',
      jurisdiction: 'service',
      roleType: 'type'
    }
  ]
};
const JURISDICTIONS = [{
  id: '123',
  name: 'IA',
  description: '',
  caseTypes: []
}];

describe('WorkCaseListWrapperComponent', () => {
  const mockWASupportedJurisdictionService = jasmine.createSpyObj('mockWASupportedJurisdictionService', ['getWASupportedJurisdictions']);
  mockWASupportedJurisdictionService.getWASupportedJurisdictions.and.returnValue(of(['IA']));

  const mockJurisdictionService = jasmine.createSpyObj('mockJurisdictionService', ['getJurisdictions']);
  mockJurisdictionService.getJurisdictions.and.returnValue(of(JURISDICTIONS));

  let component: WorkCaseListWrapperComponent;
  let fixture: ComponentFixture<WorkCaseListWrapperComponent>;
  const mockLocationService = jasmine.createSpyObj('mockLocationService', ['getLocations']);
  const mockRef = jasmine.createSpyObj('mockRef', ['']);
  const mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  const mockWorkAllocationService = jasmine.createSpyObj('mockWorkAllocationService', ['searchCase', 'getCase', 'getMyCases', 'getMyAccess']);
  const mockInfoMessageCommService = jasmine.createSpyObj('mockInfoMessageCommService', ['']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem']);
  const mockAlertService = jasmine.createSpyObj('mockAlertService', ['']);
  const mockFeatureService = jasmine.createSpyObj('mockFeatureService', ['getActiveWAFeature']);
  const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockLoadingService', ['isEnabled']);
  const mockCaseworkerDataService = jasmine.createSpyObj('mockCaseworkerDataService', ['getAll']);
  const mockAllocateRoleService = jasmine.createSpyObj('mockAllocateRoleService', ['getCaseRolesUserDetails', 'getValidRoles']);
  let storeMock: jasmine.SpyObj<Store<fromActions.State>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<fromActions.State>;

  beforeEach((() => {
    storeMock = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
    storeMock.pipe.and.returnValue(of(USER_DETAILS));
    TestBed.configureTestingModule({
      imports: [
        WorkAllocationComponentsModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        StoreModule.forRoot({ ...fromActions.reducers }),
        CdkTableModule,
        PaginationModule
      ],
      declarations: [MyCasesComponent, MyAccessComponent, WorkCaseListWrapperComponent, WorkCaseListComponent],
      providers: [
        { provide: LocationDataService, useValue: mockLocationService },
        { provide: JurisdictionsService, useValue: mockJurisdictionService },
        { provide: ChangeDetectorRef, useValue: mockRef },
        { provide: WorkAllocationCaseService, useValue: mockWorkAllocationService },
        { provide: Router, useValue: mockRouter },
        { provide: InfoMessageCommService, useValue: mockInfoMessageCommService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerDataService },
        { provide: AllocateRoleService, useValue: mockAllocateRoleService },
        { provide: WASupportedJurisdictionsService, useValue: mockWASupportedJurisdictionService },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WorkCaseListWrapperComponent);
    component = fixture.componentInstance;
    const cases: Case[] = getMockCases();
    const caseRoles: CaseRoleDetails[] = getMockCaseRoles();
    store = TestBed.inject(Store);
    mockWorkAllocationService.searchCase.and.returnValue(of({ cases }));
    mockWorkAllocationService.getMyCases.and.returnValue(of({ cases }));
    mockWorkAllocationService.getMyAccess.and.returnValue(of({ cases }));
    mockFeatureService.getActiveWAFeature.and.returnValue(of('WorkAllocationRelease2'));
    mockFeatureToggleService.isEnabled.and.returnValue(of(false));
    mockCaseworkerDataService.getAll.and.returnValue(of([]));
    mockAllocateRoleService.getCaseRolesUserDetails.and.returnValue(of(caseRoles));
    mockAllocateRoleService.getValidRoles.and.returnValue(of([]));
    mockSessionStorageService.getItem.and.returnValue(undefined);
    fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('onActionHandler()', () => {
    const exampleCase = getMockCases()[0];
    const firstAction = exampleCase.actions[0];
    const secondAction = exampleCase.actions[1];
    const firstCaseAction = { invokedCase: exampleCase, action: firstAction };
    const secondCaseAction = { invokedCase: exampleCase, action: secondAction };

    it('should handle a reallocate action', fakeAsync(async () => {
      // need to check that navigate has been called
      component.onActionHandler(firstCaseAction);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(jasmine.stringMatching('reallocate'), { state: { backUrl: null } });
    }));

    it('should handle a remove action', fakeAsync(async () => {
      // need to spy on the router and set up the task action
      component.onActionHandler(secondCaseAction);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(jasmine.stringMatching('remove'), { state: { backUrl: null } });
    }));

    it('should filter out duplicates values', () => {
      const loadSpy = spyOn(component, 'loadSupportedJurisdictions');
      let jurisdictionValue = [];
      component.waSupportedJurisdictions$ = new Observable((jr) => {
        jr.next(['Public Law', 'Immigration', 'Public Law']);
      });

      component.waSupportedJurisdictions$.subscribe((rst) => {
        jurisdictionValue = [...new Set(rst)];
      });

      component.ngOnInit();
      expect(loadSpy).toHaveBeenCalled();
      expect(jurisdictionValue.length).toEqual(2);
    });
  });
});
