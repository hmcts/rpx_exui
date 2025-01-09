import { Component, OnInit } from '@angular/core';
import { AppUtils } from '../../../app/app-utils';
import { UserInfo, UserRole } from '../../../app/models';
import { ConfigConstants, ListConstants, PageConstants, SortConstants } from '../../components/constants';
import { SortOrder } from '../../enums';
import { Location } from '../../interfaces/common';
import { FieldConfig, SortField } from '../../models/common';
import { PaginationParameter, SearchCaseRequest } from '../../models/dtos';
import { WorkCaseListWrapperComponent } from '../work-case-list-wrapper/work-case-list-wrapper.component';

@Component({
  selector: 'exui-all-work-cases',
  templateUrl: 'all-work-case.component.html',
  styleUrls: ['all-work-case.component.scss']
})
export class AllWorkCaseComponent extends WorkCaseListWrapperComponent implements OnInit {
  public sortedBy: SortField = {
    fieldName: '',
    order: SortOrder.NONE
  };

  public isFirsTimeLoad = true;
  public isCasesFiltered = false;
  public pagination: PaginationParameter = {
    page_number: 1,
    page_size: 25
  };

  public jurisdictions: string[];
  private selectedPerson: string = '';
  private selectedRole: string = 'All';
  private readonly selectedLocation: Location = {
    id: '231596',
    locationName: 'Birmingham',
    services: []
  };

  public get emptyMessage(): string {
    return ListConstants.EmptyMessage.AllWorkCases;
  }

  public get sortSessionKey(): string {
    return SortConstants.Session.AllWorkCases;
  }

  public get pageSessionKey(): string {
    return PageConstants.Session.AllWorkCases;
  }

  public get view(): string {
    return ListConstants.View.AllWorkCases;
  }

  public get fields(): FieldConfig[] {
    return ConfigConstants.AllWorkCases;
  }

  public backUrl: string = 'work/all-work/cases';

  public ngOnInit(): void {
    this.setUpLocationsAndJurisdictions();
    this.setupCaseWorkers();
  }

  public getSearchCaseRequestPagination(): SearchCaseRequest {
    const userInfoStr = this.sessionStorageService.getItem('userDetails');

    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      const userRole: UserRole = AppUtils.getUserRole(userInfo.roles);
      return {
        search_parameters: [
          { key: 'jurisdiction', operator: 'EQUAL', values: this.selectedServices[0] },
          { key: 'location_id', operator: 'EQUAL', values: this.selectedLocation.id },
          { key: 'actorId', operator: 'EQUAL', values: this.selectedPerson },
          { key: 'role', operator: 'EQUAL', values: this.selectedRole }
        ],
        sorting_parameters: [this.getSortParameter()],
        search_by: userRole,
        pagination_parameters: this.getPaginationParameter()
      };
    }
  }

  /**
   * Handle the paging event
   */
  public onPaginationEvent(pageNumber: number): void {
    this.onPaginationHandler(pageNumber);
  }

  public onSelectionChanged(selection: { location: string, jurisdiction: string, actorId: string, role: string, person: any }): void {
    this.selectedLocation.id = !selection.location ? '' : selection.location;
    this.selectedServices = [selection.jurisdiction];
    this.selectedPerson = selection.actorId === 'All' ? '' : selection.person.id;
    this.selectedRole = selection.role;
    this.pagination.page_number = 1;
    if (this.isFirsTimeLoad) {
      this.isFirsTimeLoad = false;
    } else {
      this.doLoad();
      this.isCasesFiltered = true;
    }
  }
}
