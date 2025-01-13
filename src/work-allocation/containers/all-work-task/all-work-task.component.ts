import { Component } from '@angular/core';
import { Person } from '@hmcts/rpx-xui-common-lib';
import { select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUtils } from '../../../app/app-utils';
import { DetailedService, UserInfo, UserRole } from '../../../app/models';
import * as fromActions from '../../../app/store';
import { ConfigConstants, FilterConstants, ListConstants, PageConstants, SortConstants } from '../../components/constants';
import { SortOrder, TaskContext } from '../../enums';
import { Location } from '../../interfaces/common';
import { FieldConfig, SortField } from '../../models/common';
import { PaginationParameter, SearchTaskRequest } from '../../models/dtos';
import { TaskListWrapperComponent } from '../task-list-wrapper/task-list-wrapper.component';

@Component({
  selector: 'exui-all-work-tasks',
  templateUrl: 'all-work-task.component.html',
  styleUrls: ['all-work-task.component.scss']
})
export class AllWorkTaskComponent extends TaskListWrapperComponent {
  private static readonly ALL_TASKS = 'All';
  private static readonly AVAILABLE_TASKS = 'None / Available tasks';
  public supportedJurisdictions: string[];
  public sortedBy: SortField = {
    fieldName: '',
    order: SortOrder.NONE
  };

  public pagination: PaginationParameter = {
    page_number: 1,
    page_size: 25
  };

  private readonly selectedLocation: Location = {
    id: '**ALL LOCATIONS**',
    locationName: '',
    services: []
  };

  private selectedTaskCategory: string = 'All';
  private selectedPerson: string = '';
  private selectedTaskType: string = 'All';
  private selectedTaskName: string = '';

  // has the initial filter been ran previously
  private hasInitialFilterRan = false;

  public get emptyMessage(): string {
    return ListConstants.EmptyMessage.AllWork;
  }

  public get sortSessionKey(): string {
    return SortConstants.Session.AllWork;
  }

  public get pageSessionKey(): string {
    return PageConstants.Session.AllWork;
  }

  public get view(): string {
    return ListConstants.View.AllWork;
  }

  public get fields(): FieldConfig[] {
    return this.isCurrentUserJudicial() ? ConfigConstants.AllWorkTasksForJudicial : ConfigConstants.AllWorkTasksForLegalOps;
  }

  public loadCaseWorkersAndLocations(): void {
    const userRoles$ = this.store.pipe(select(fromActions.getUserDetails)).pipe(map((userDetails) => {
      if (!userDetails.roleAssignmentInfo) {
        // if no role assignment info, do not allow page to disappear
        return [];
      }
      return userDetails.roleAssignmentInfo.filter((role) => role.roleName && role.roleName === 'task-supervisor').map((role) => role.jurisdiction || null);
    }
    ));

    // get detailed services for the all work services list
    const waJurisdictions$ = this.waSupportedJurisdictionsService.getDetailedWASupportedJurisdictions();
    this.waSupportedDetailedServices$ = combineLatest(
      [userRoles$,
        waJurisdictions$]
    ).pipe(map((jurisdictions) => {
      return this.setServiceList(jurisdictions[0], jurisdictions[1]);
    }));
  }

  public getSearchTaskRequestPagination(): SearchTaskRequest {
    const userInfoStr = this.sessionStorageService.getItem('userDetails');
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      const userRole: UserRole = AppUtils.getUserRole(userInfo.roles);
      const searchParameters = [
        this.getStateParameter()
      ];
      const personParameter = { key: 'user', operator: 'IN', values: [this.selectedPerson] };
      const locationParameter = this.getLocationParameter();
      const taskTypeParameter = this.getTaskTypeParameter();
      const taskNameParameter = this.getTaskNameParameter();
      if (this.selectedServices?.length) {
        searchParameters.push({ key: 'jurisdiction', operator: 'IN', values: this.selectedServices });
      }
      if (this.selectedPerson) {
        searchParameters.push(personParameter);
      }
      if (locationParameter) {
        searchParameters.push(locationParameter);
      }
      if (taskTypeParameter) {
        searchParameters.push(taskTypeParameter);
      }

      if (taskNameParameter) {
        searchParameters.push(taskNameParameter);
      }

      const searchTaskParameter: SearchTaskRequest = {
        search_parameters: searchParameters,
        sorting_parameters: [...this.getSortParameter()],
        search_by: userRole === UserRole.Judicial ? 'judge' : 'caseworker',
        pagination_parameters: this.getPaginationParameter()
      };
      searchTaskParameter.request_context = TaskContext.ALL_WORK;
      return searchTaskParameter;
    }
  }

  /**
   * Handle the paging event
   */
  public onPaginationEvent(pageNumber: number): void {
    this.onPaginationHandler(pageNumber);
  }

  public onSelectionChanged(selection: { findTaskNameControl: any, location: string, service: string, selectPerson: string, person: Person, taskType: string, taskName: any }): void {
    this.selectedLocation.id = selection.location;
    this.selectedServices = [selection.service];
    this.selectedTaskCategory = selection.selectPerson;
    this.selectedPerson = selection.person ? selection.person.id : null;
    this.selectedTaskType = selection.taskType;
    this.selectedTaskName = selection.taskName ? selection.taskName.task_type_id : null;
    this.loadBasedOnFilter();
  }

  private setServiceList(roleServiceIds: string[], detailedWAServices: DetailedService[]): DetailedService[] {
    const supportedJurisdictions = [];
    detailedWAServices.forEach((jurisdiction) => {
      // get the serviceIds from the detailed service
      supportedJurisdictions.push(jurisdiction.serviceId);
    });
    this.supportedJurisdictions = supportedJurisdictions;
    if (!roleServiceIds.includes(null)) {
      const roleJurisdictions = [];
      // get set of serviceIds from jurisdictions within user roles
      const initialRoleJurisdictions = [...new Set(roleServiceIds)];
      initialRoleJurisdictions.forEach((serviceId) => {
        if (supportedJurisdictions.includes(serviceId)) {
          // if there is a service name for the serviceId, use it
          const matchingServices = detailedWAServices.filter((x) => x.serviceId === serviceId);
          const serviceName = matchingServices?.length > 0 ? matchingServices[0].serviceName : serviceId;
          roleJurisdictions.push({ serviceId, serviceName });
        } else {
          roleJurisdictions.push({ serviceId, serviceName: serviceId });
        }
      });
      return roleJurisdictions;
    }
    // use provided WA supported services
    return detailedWAServices;
  }

  private loadBasedOnFilter(): void {
    if (this.hasInitialFilterRan) {
      // added to only reset task list on filter
      this.onPaginationHandler(1);
    } else {
      this.hasInitialFilterRan = true;
      this.loadTasks();
    }
  }

  private getLocationParameter(): any {
    let values: string[];
    if (this.selectedLocation && this.selectedLocation.id !== FilterConstants.Options.Locations.ALL.id) {
      values = this.selectedLocation.id ? [this.selectedLocation.id] : [];
    } else {
      values = this.locations.map((loc) => loc.id);
    }
    return values && values.length > 0 ? { key: 'location', operator: 'IN', values } : null;
  }

  private getStateParameter(): any {
    if (this.selectedTaskCategory && this.selectedTaskCategory !== AllWorkTaskComponent.ALL_TASKS) {
      if (this.selectedTaskCategory === AllWorkTaskComponent.AVAILABLE_TASKS) {
        return { key: 'state', operator: 'IN', values: ['unassigned'] };
      }

      return { key: 'state', operator: 'IN', values: ['assigned'] };
    }

    return { key: 'state', operator: 'IN', values: ['assigned', 'unassigned'] };
  }

  private getTaskTypeParameter(): any {
    if (this.selectedTaskType && this.selectedTaskType !== AllWorkTaskComponent.ALL_TASKS) {
      return { key: 'role_category', operator: 'IN', values: [this.selectedTaskType] };
    }
  }

  private getTaskNameParameter(): { key: string, operator: string, values: string[] } {
    if (this.selectedTaskName) {
      return { key: 'task_type', operator: 'IN', values: [this.selectedTaskName] };
    }
  }
}
