import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService, FilterService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { AppUtils } from '../../../app/app-utils';
import { UserRole } from '../../../app/models';
import { SessionStorageService } from '../../../app/services';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import * as fromActions from '../../../app/store';
import { AllocateRoleService } from '../../../role-access/services';
import { ConfigConstants, ListConstants, SortConstants } from '../../../work-allocation/components/constants';
import { SortOrder } from '../../../work-allocation/enums';
import { CaseworkerDataService, LocationDataService, WASupportedJurisdictionsService, WorkAllocationCaseService } from '../../services';
import { JurisdictionsService } from '../../services/juridictions.service';
import { MyCasesComponent } from './my-cases.component';

describe('MyCasesComponent', () => {
  let component: MyCasesComponent;

  const mockSessionStorageService = jasmine.createSpyObj('SessionStorageService', ['getItem', 'setItem']);
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
  }) => new MyCasesComponent(
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

  it('should create', () => {
    component = initializeComponent({ checkReleaseVersionService: mockCheckReleaseVersionService });

    expect(component).toBeTruthy();
  });

  describe('getSearchCaseRequestPagination', () => {
    it('should return a SearchCaseRequest', () => {
      component = initializeComponent({ sessionStorageService: mockSessionStorageService, checkReleaseVersionService: mockCheckReleaseVersionService });
      component.sortedBy = {
        fieldName: 'fieldName',
        order: SortOrder.ASC
      };

      const userInfo = { roles: [UserRole.Admin], id: 'One' };
      const localStorageGetItemSpy = spyOn(localStorage, 'getItem');
      const locations = { fields: [{ name: 'services', value: 'serviceValue' }] };

      mockSessionStorageService.getItem.withArgs('userDetails').and.returnValue(JSON.stringify(userInfo));
      localStorageGetItemSpy.and.returnValue(JSON.stringify(locations));
      spyOn(AppUtils, 'getUserRole').and.returnValue(UserRole.Admin);

      const actual = component.getSearchCaseRequestPagination();

      expect(actual).toEqual(jasmine.objectContaining({
        search_parameters: [
          { key: 'user', operator: 'IN', values: [`${userInfo.id}`] },
          { key: 'services', operator: 'IN', values: 'serviceValue' },
          { key: 'locations', operator: 'IN', values: [] }
        ],
        sorting_parameters: [{
          sort_by: component.sortedBy.fieldName,
          sort_order: component.sortedBy.order
        }],
        search_by: UserRole.Admin
      }));

      mockSessionStorageService.getItem.calls.reset();
      localStorageGetItemSpy.calls.reset();
    });

    it('should return a SearchCaseRequest with user \'uid\'', () => {
      component = initializeComponent({
        sessionStorageService: mockSessionStorageService,
        checkReleaseVersionService: mockCheckReleaseVersionService
      });

      component.sortedBy = {
        fieldName: 'fieldName',
        order: SortOrder.ASC
      };

      const userInfo = { roles: [UserRole.Admin], uid: 'UID' };
      const locations = { fields: [{ name: 'locations', value: [{ epimms_id: 'locationID' }] }] };
      mockSessionStorageService.getItem.withArgs('userDetails').and.returnValue(JSON.stringify(userInfo));
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(locations));
      spyOn(AppUtils, 'getUserRole').and.returnValue(UserRole.Admin);

      const actual = component.getSearchCaseRequestPagination();

      expect(actual).toEqual(jasmine.objectContaining({
        search_parameters: [
          { key: 'user', operator: 'IN', values: [`${userInfo.uid}`] },
          { key: 'services', operator: 'IN', values: [] },
          { key: 'locations', operator: 'IN', values: ['locationID'] }
        ],
        sorting_parameters: [{
          sort_by: component.sortedBy.fieldName,
          sort_order: component.sortedBy.order
        }],
        search_by: UserRole.Admin
      }));
    });

    it('should NOT return a SearchCaseRequest', () => {
      component = initializeComponent({
        sessionStorageService: mockSessionStorageService,
        checkReleaseVersionService: mockCheckReleaseVersionService
      });

      mockSessionStorageService.getItem.withArgs('userDetails').and.returnValue(undefined);

      const actual = component.getSearchCaseRequestPagination();

      expect(actual).toEqual(undefined);
    });
  });

  describe('getters', () => {
    const getters = [
      {
        method: 'emptyMessage',
        result: ListConstants.EmptyMessage.MyCases
      },
      {
        method: 'sortSessionKey',
        result: SortConstants.Session.MyCases
      },
      {
        method: 'view',
        result: ListConstants.View.MyCases
      },
      {
        method: 'fields',
        result: ConfigConstants.MyCases
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
