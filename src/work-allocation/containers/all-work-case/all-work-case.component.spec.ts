import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService, FilterService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AppUtils } from '../../../app/app-utils';
import { UserRole } from '../../../app/models';
import { SessionStorageService } from '../../../app/services';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import * as fromActions from '../../../app/store';
import { CaseRoleDetails } from '../../../role-access/models/case-role-details.interface';
import { AllocateRoleService } from '../../../role-access/services';
import { ConfigConstants, ListConstants, PageConstants, SortConstants } from '../../components/constants';
import { ALL_LOCATIONS } from '../../components/constants/locations';
import { Case } from '../../models/cases';
import { Location } from '../../models/dtos';
import {
  CaseworkerDataService,
  JurisdictionsService,
  LocationDataService,
  WASupportedJurisdictionsService,
  WorkAllocationCaseService
} from '../../services';
import { getMockCaseRoles, getMockCases } from '../../tests/utils.spec';
import { AllWorkCaseComponent } from './all-work-case.component';

// const USER_DETAILS = {
//   canShareCases: true,
//   userInfo: {
//     id: 'someId',
//     forename: 'foreName',
//     surname: 'surName',
//     email: 'email@email.com',
//     active: true,
//     roles: ['pui-case-manager']
//   },
//   roleAssignmentInfo: [
//     {
//       roleName: 'test',
//       jurisdiction: 'service',
//       roleType: 'type'
//     }
//   ]
// };

describe('AllWorkCaseComponent', () => {
  let component: AllWorkCaseComponent;

  // const routerMock = jasmine.createSpyObj('Router', [ 'navigateByUrl' ]);
  const mockCaseService = jasmine.createSpyObj('mockCaseService', ['searchCase', 'getCases', 'getMyAccess']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  const mockCaseworkerService = jasmine.createSpyObj('mockCaseworkerService', ['getAll']);
  const mockLocationService = jasmine.createSpyObj('mockLocationService', ['getLocations']);
  const mockFeatureService = jasmine.createSpyObj('mockFeatureService', ['getActiveWAFeature']);
  // const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockLoadingService', ['isEnabled']);
  const mockWASupportedJurisdictionService = jasmine.createSpyObj('mockWASupportedJurisdictionService', ['getWASupportedJurisdictions']);
  const mockAllocateRoleService = jasmine.createSpyObj('mockAllocateRoleService', ['getCaseRolesUserDetails', 'getValidRoles']);
  const mockjurisdictionsService = jasmine.createSpyObj('mockJurisdictionsService', ['getJurisdictions']);
  const mockCheckReleaseVersionService = {
    isRelease4: () => {
      return {
        subscribe: () => true
      };
    }
  };
  const initializeComponent = ({
    changeDetectorRef = {},
    workAllocationTaskService = {},
    router = {},
    infoMessageCommService = {},
    sessionStorageService = {},
    alertService = {},
    caseworkerDataService = {},
    loadingService = {},
    featureToggleService = {},
    locationDataService = {},
    waSupportedJurisdictionsService = {},
    filterService = {},
    jurisdictionsService = {},
    allocateRoleService = {},
    httpClient = {},
    store = {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkReleaseVersionService = {}
  }) => new AllWorkCaseComponent(
    changeDetectorRef as ChangeDetectorRef,
    workAllocationTaskService as WorkAllocationCaseService,
    filterService as FilterService,
    router as Router,
    infoMessageCommService as InfoMessageCommService,
    sessionStorageService as SessionStorageService,
    alertService as AlertService,
    caseworkerDataService as CaseworkerDataService,
    loadingService as LoadingService,
    locationDataService as LocationDataService,
    featureToggleService as FeatureToggleService,
    waSupportedJurisdictionsService as WASupportedJurisdictionsService,
    jurisdictionsService as JurisdictionsService,
    allocateRoleService as AllocateRoleService,
    httpClient as HttpClient,
    store as Store<fromActions.State>
  );

  const cases: Case[] = getMockCases();
  const caseRoles: CaseRoleDetails[] = getMockCaseRoles();
  mockCaseService.getCases.and.returnValue(of({ cases }));
  mockCaseworkerService.getAll.and.returnValue(of([]));
  mockFeatureService.getActiveWAFeature.and.returnValue(of('WorkAllocationRelease2'));
  mockFeatureToggleService.isEnabled.and.returnValue(of(false));
  mockLocationService.getLocations.and.returnValue(of(ALL_LOCATIONS as unknown as Location[]));
  mockWASupportedJurisdictionService.getWASupportedJurisdictions.and.returnValue(of(['IA']));
  mockjurisdictionsService.getJurisdictions.and.returnValue(of(['IA']));
  mockAllocateRoleService.getCaseRolesUserDetails.and.returnValue(of(caseRoles));
  mockAllocateRoleService.getValidRoles.and.returnValue(of([]));
  mockSessionStorageService.getItem.and.returnValue(undefined);

  describe('ngOnInit', () => {
    it('should call \'setupCaseWorkers\' and update \'locations\' and \'waSupportedJurisdictions\'', () => {
      component = initializeComponent({ locationDataService: mockLocationService, waSupportedJurisdictionsService: mockWASupportedJurisdictionService, checkReleaseVersionService: mockCheckReleaseVersionService });
      spyOn(component, 'setupCaseWorkers');
      spyOn(component, 'loadSupportedJurisdictions');
      component.waSupportedJurisdictions$ = of(['IA']);

      component.ngOnInit();

      expect(component.setupCaseWorkers).toHaveBeenCalled();
      expect(component.loadSupportedJurisdictions).toHaveBeenCalled();
    });
  });

  describe('getSearchCaseRequestPagination', () => {
    it('should return a SearchCaseRequest', async () => {
      component = initializeComponent({ sessionStorageService: mockSessionStorageService, checkReleaseVersionService: mockCheckReleaseVersionService });

      const userInfo = { roles: [UserRole.Admin] };
      mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userInfo));
      spyOn(AppUtils, 'getUserRole').and.returnValue(UserRole.Admin);

      const actual = component.getSearchCaseRequestPagination();

      expect(actual).toEqual(jasmine.objectContaining({
        search_parameters: [
          { key: 'jurisdiction', operator: 'EQUAL', values: component.selectedServices[0] },
          { key: 'location_id', operator: 'EQUAL', values: '231596' },
          { key: 'actorId', operator: 'EQUAL', values: '' },
          { key: 'role', operator: 'EQUAL', values: 'All' }
        ],
        sorting_parameters: [{
          sort_by: component.sortedBy.fieldName,
          sort_order: component.sortedBy.order
        }],
        search_by: UserRole.Admin,
        pagination_parameters: { ...component.pagination }
      }));
    });

    it('should NOT return a SearchCaseRequest', () => {
      component = initializeComponent({ sessionStorageService: mockSessionStorageService, checkReleaseVersionService: mockCheckReleaseVersionService });

      mockSessionStorageService.getItem.and.returnValue(undefined);

      const actual = component.getSearchCaseRequestPagination();

      expect(actual).toEqual(undefined);
    });
  });

  describe('onPaginationEvent', () => {
    it('should call \'onPaginationHandler\'', () => {
      component = initializeComponent({ checkReleaseVersionService: mockCheckReleaseVersionService });

      spyOn(component, 'onPaginationHandler');

      component.onPaginationEvent(2);

      expect(component.onPaginationHandler).toHaveBeenCalledWith(2);
    });
  });

  describe('getters', () => {
    const getters = [
      {
        method: 'emptyMessage',
        result: ListConstants.EmptyMessage.AllWorkCases
      },
      {
        method: 'sortSessionKey',
        result: SortConstants.Session.AllWorkCases
      },
      {
        method: 'pageSessionKey',
        result: PageConstants.Session.AllWorkCases
      },
      {
        method: 'view',
        result: ListConstants.View.AllWorkCases
      },
      {
        method: 'fields',
        result: ConfigConstants.AllWorkCases
      }
    ];
    getters.forEach(({ method, result }) => {
      it(`should return '${result}'`, () => {
        component = initializeComponent({ checkReleaseVersionService: mockCheckReleaseVersionService });

        expect(component[method]).toEqual(result);
      });
    });
  });
});
