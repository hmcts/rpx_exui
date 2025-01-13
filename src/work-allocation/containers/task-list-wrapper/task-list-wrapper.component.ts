import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService, FilterService, FilterSetting, RoleCategory } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of } from 'rxjs';
import { debounceTime, filter, mergeMap, switchMap } from 'rxjs/operators';

import { DetailedService, UserInfo } from '../../../app/models';
import { SessionStorageService } from '../../../app/services';
import { InfoMessage } from '../../../app/shared/enums/info-message';
import { InfoMessageType } from '../../../app/shared/enums/info-message-type';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import * as fromActions from '../../../app/store';
import { AllocateRoleService } from '../../../role-access/services';
import { TaskListFilterComponent } from '../../components';
import { ListConstants } from '../../components/constants';
import { SortOrder, TaskActionIds, TaskService } from '../../enums';
import { Caseworker, Location } from '../../interfaces/common';
import { FieldConfig, SortField } from '../../models/common';
import { PaginationParameter, SearchTaskRequest, SortParameter } from '../../models/dtos';
import { InvokedTaskAction, Task, TaskServiceConfig } from '../../models/tasks';
import { TaskResponse } from '../../models/tasks/task.model';
import {
  CaseworkerDataService,
  LocationDataService,
  WASupportedJurisdictionsService,
  WorkAllocationTaskService
} from '../../services';
import { REDIRECTS, WILDCARD_SERVICE_DOWN, getAssigneeName, handleFatalErrors, handleTasksFatalErrors } from '../../utils';

@Component({
  templateUrl: 'task-list-wrapper.component.html'
})
export class TaskListWrapperComponent implements OnDestroy, OnInit {
  public specificPage: string = '';
  public caseworkers: Caseworker[];
  public locations: Location[] = new Array<Location>();
  public showSpinner$: Observable<boolean>;
  public waSupportedJurisdictions$: Observable<string[]>;
  // details only used for all work
  public waSupportedDetailedServices$: Observable<DetailedService[]>;
  public sortedBy: SortField;
  public pagination: PaginationParameter;
  public selectedLocations: string[] = [];
  public selectedWorkTypes: string[] = [];
  public selectedServices: string[] = [];
  public taskServiceConfig: TaskServiceConfig;
  protected userDetailsKey: string = 'userDetails';
  private pTasks: Task[] = [];
  private myWorkSubscription: Subscription;
  private pTasksTotal: number;
  private currentUser: string;
  public routeEventsSubscription: Subscription;
  public userRoleCategory: string;
  private initialFilterApplied = false;
  private goneBackCount = 0;

  /**
   * Take in the Router so we can navigate when actions are clicked.
   */
  constructor(
    protected ref: ChangeDetectorRef,
    protected taskService: WorkAllocationTaskService,
    protected router: Router,
    protected infoMessageCommService: InfoMessageCommService,
    protected sessionStorageService: SessionStorageService,
    protected alertService: AlertService,
    protected caseworkerService: CaseworkerDataService,
    protected loadingService: LoadingService,
    protected featureToggleService: FeatureToggleService,
    protected locationService: LocationDataService,
    protected waSupportedJurisdictionsService: WASupportedJurisdictionsService,
    protected filterService: FilterService,
    protected rolesService: AllocateRoleService,
    protected store: Store<fromActions.State>
  ) { }

  public get tasks(): Task[] {
    return this.pTasks;
  }

  public set tasks(value: Task[]) {
    this.pTasks = value;
  }

  public get tasksTotal(): number {
    return this.pTasksTotal;
  }

  public set tasksTotal(value: number) {
    this.pTasksTotal = value;
  }

  public get fields(): FieldConfig[] {
    return [];
  }

  public get emptyMessage(): string {
    return ListConstants.EmptyMessage.Default;
  }

  /**
   * To be overridden.
   */
  public get sortSessionKey(): string {
    return 'sortSessionKey';
  }

  /**
   * To be overridden.
   */
  public get pageSessionKey(): string {
    return 'pageSessionKey';
  }

  /**
   * To be overridden.
   */
  public get view(): string {
    return 'default';
  }

  public get returnUrl(): string {
    return this.router ? this.router.url : '/mywork';
  }

  /**
   * Flag to indicate whether or not we've arrived here following a bad
   * request with a flag having been set on another route. The flag is
   * passed through the router and so is held in window.history.state.
   */
  private get wasBadRequest(): boolean {
    if (window && window.history && window.history.state) {
      return !!window.history.state.badRequest;
    }
    return false;
  }

  public getTaskServiceConfig(): TaskServiceConfig {
    return {
      service: TaskService.IAC,
      defaultSortDirection: SortOrder.ASC,
      defaultSortFieldName: this.fields.some((f) => f.name === 'priority') ? 'priority' : 'created_date',
      fields: this.fields
    };
  }

  public getDateField(defaultSortColumn: string): string {
    const field = this.fields.find((currentField) => currentField.isDate);
    if (field) {
      return field.sortName;
    }
    return defaultSortColumn;
  }

  public ngOnInit(): void {
    // get supported jurisdictions on initialisation in order to get caseworkers by these services
    this.waSupportedJurisdictions$ = this.waSupportedJurisdictionsService.getWASupportedJurisdictions();
    this.userRoleCategory = this.getCurrentUserRoleCategory();
    this.taskServiceConfig = this.getTaskServiceConfig();
    this.loadCaseWorkersAndLocations();
    this.setupTaskList();
  }

  public ngOnDestroy(): void {
    if (this.myWorkSubscription) {
      this.myWorkSubscription.unsubscribe();
    }
  }

  public loadCaseWorkersAndLocations() {
    this.myWorkSubscription = this.filterService.getStream(TaskListFilterComponent.FILTER_NAME)
      .pipe(
        debounceTime(200),
        filter((f: FilterSetting) => f && f.hasOwnProperty('fields'))
      )
      .subscribe((f: FilterSetting) => {
        const newLocations = f.fields.find((field) => field.name === 'locations')?.value;
        const typesOfWork = f.fields.find((field) => field.name === 'types-of-work');
        const services = f.fields.find((field) => field.name === 'services')?.value;
        const newWorkTypes = typesOfWork ? typesOfWork.value : [];
        if (this.initialFilterApplied) {
          // do not reset the pagination when the initial filter value has not been consumed
          this.resetPagination(newLocations, newWorkTypes, services);
        }
        this.initialFilterApplied = true;
        this.selectedLocations = (newLocations).map((l) => l.epimms_id);
        this.selectedWorkTypes = newWorkTypes.filter((workType) => workType !== 'types_of_work_all');
        this.selectedServices = services?.filter((service) => service !== 'services_all');
        this.doLoad();
      });
  }

  public setupTaskList() {
    // NOTE - staffSupportedJurisdictions can replace waSupportedJurisdictions for quick testing purposes
    const caseworkersByService$ = this.waSupportedJurisdictions$.pipe(switchMap((jurisdictions) =>
      this.caseworkerService.getUsersFromServices(jurisdictions)
    ));
    // similar to case list wrapper changes
    caseworkersByService$.subscribe((caseworkers) => {
      this.caseworkers = caseworkers;
      // EUI-2027 - Load tasks again in case this is start of new caching of caseworkers
      // note: the if is relevant to stop the same request happening at exactly the same time on available tasks causing an error
      if (this.tasks.length > 0) {
        this.doLoad();
      }
    }, (error) => {
      handleFatalErrors(error.status, this.router);
    });
    // Try to get the sort order out of the session.
    const sortStored = this.sessionStorageService.getItem(this.sortSessionKey);
    if (sortStored) {
      const { fieldName, order } = JSON.parse(sortStored);
      this.sortedBy = {
        fieldName,
        order: order as SortOrder
      };
    } else {
      // Otherwise, set up the default sorting.
      this.sortedBy = {
        fieldName: this.taskServiceConfig.defaultSortFieldName,
        order: this.taskServiceConfig.defaultSortDirection
      };
    }
    const pageSorted = +this.sessionStorageService.getItem(this.pageSessionKey);
    this.pagination = {
      page_number: pageSorted ? pageSorted : 1,
      page_size: 25
    };
  }

  /**
   * Load the tasks to display in the component.
   */
  public loadTasks(): void {
    if (this.wasBadRequest) {
      this.refreshTasks();
    } else {
      this.doLoad();
    }
  }

  /**
   * On the return of the refreshed tasks, we throw up a refresh message.
   */
  public refreshTasks(): void {
    this.infoMessageCommService.addMessage({
      type: InfoMessageType.INFO,
      message: InfoMessage.LIST_OF_TASKS_REFRESHED
    });
    this.doLoad();
  }

  public performSearchUpdatedTaskPermissions(): Observable<TaskResponse> {
    const searchRequest = this.getSearchTaskRequestPagination();
    return this.taskService.searchTask({ searchRequest, view: this.view, refined: true, currentUser: this.currentUser });
  }

  public performSearchPreviousTaskPermissions(): Observable<TaskResponse> {
    const searchRequest = this.getSearchTaskRequestPagination();
    return this.taskService.searchTask({ searchRequest, view: this.view, refined: false, currentUser: this.currentUser });
  }

  /**
   * Get a search task request appropriate to the current view,
   * sort order, etc.
   */
  public getSearchTaskRequestPagination(): SearchTaskRequest {
    return {
      search_parameters: [],
      sorting_parameters: this.getSortParameter(),
      pagination_parameters: this.getPaginationParameter()
    };
  }

  public getSortParameter(): SortParameter[] {
    if (this.sortedBy && this.sortedBy.fieldName !== 'priority') {
      return [{
        sort_by: this.sortedBy.fieldName,
        sort_order: this.sortedBy.order
      }];
    }

    return [] as SortParameter[];
  }

  public getPaginationParameter(): PaginationParameter {
    const savedPaginationNumber = JSON.parse(this.sessionStorageService.getItem(this.pageSessionKey));
    if (savedPaginationNumber && typeof savedPaginationNumber === 'number') {
      return { ...this.pagination, page_number: savedPaginationNumber };
    }
    return { ...this.pagination };
  }

  /**
   * We need to sort the Task List based on the fieldName.
   *
   * Following on from this function we will need to retrieve the sorted tasks from
   * the WA Api, once we have these then we need to set the tasks and fields, and pass
   * these into the TaskListComponent.
   *
   * @param fieldName - ie. 'caseName'
   */
  public onSortHandler(fieldName: string): void {
    let order: SortOrder = SortOrder.ASC;
    if (this.sortedBy.fieldName === fieldName && this.sortedBy.order === SortOrder.ASC) {
      order = SortOrder.DESC;
    }
    this.sortedBy = { fieldName, order };
    this.sessionStorageService.setItem(this.sortSessionKey, JSON.stringify(this.sortedBy));
    this.loadTasks();
  }

  /**
   * InvokedTaskAction from the Task List Component, so that we can handle the User's
   * action.
   */
  public onActionHandler(taskAction: InvokedTaskAction): void {
    try {
      if (taskAction.action.id === TaskActionIds.CLAIM) {
        this.claimTask(taskAction.task.id);
        return;
      } else if (taskAction.action.id === TaskActionIds.CLAIM_AND_GO) {
        this.claimTaskAndGo(taskAction.task);
        return;
      } else if (taskAction.action.id === TaskActionIds.GO) {
        const goToTaskUrl = `/cases/case-details/${taskAction.task.case_id}/tasks`;
        this.router.navigate([goToTaskUrl]);
        return;
      }
      if (this.returnUrl.includes('manager') && taskAction.action.id === TaskActionIds.RELEASE) {
        this.specificPage = 'manager';
      }
      const state = {
        returnUrl: this.returnUrl,
        showAssigneeColumn: taskAction.action.id !== TaskActionIds.ASSIGN
      };
      const actionUrl = `/work/${taskAction.task.id}/${taskAction.action.id}/${this.specificPage}`;
      this.router.navigate([actionUrl], { queryParams: { service: taskAction.task.jurisdiction }, state });
    } catch (error) {
      console.error('onActionHandler', error, taskAction);
    }
  }

  /**
   * A User 'Claims' themselves a task aka. 'Assign to me'.
   */
  public claimTask(taskId: string): void {
    this.taskService.claimTask(taskId).subscribe(() => {
      this.infoMessageCommService.nextMessage({
        type: InfoMessageType.SUCCESS,
        message: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS
      });
      this.refreshTasks();
    }, (error) => {
      this.claimTaskErrors(error.status);
    });
  }

  /**
   * A User 'Claims' themselves a task and goes to the case details page for that case aka. 'Assign to me'.
   */
  public claimTaskAndGo(task: Task): void {
    this.taskService.claimTask(task.id).subscribe(() => {
      const goToCaseUrl = `/cases/case-details/${task.case_id}/tasks`;
      // navigates to case details page for specific case id
      this.router.navigate([goToCaseUrl], {
        state: {
          showMessage: true,
          messageText: InfoMessage.ASSIGNED_TASK_AVAILABLE_IN_MY_TASKS
        }
      });
    }, (error) => {
      this.claimTaskErrors(error.status);
    });
  }

  /**
   * Navigate the User to the correct error page, or throw an on page warning
   * that the Task is no longer available.
   */
  public claimTaskErrors(status: number): void {
    const REDIRECT_404 = [{ status: 404, redirectTo: REDIRECTS.ServiceDown }];
    const handledStatus = handleTasksFatalErrors(status, this.router, REDIRECT_404);
    if (handledStatus > 0) {
      this.infoMessageCommService.nextMessage({
        type: InfoMessageType.WARNING,
        message: InfoMessage.TASK_NO_LONGER_AVAILABLE
      });
    }
  }

  public onPaginationHandler(pageNumber: number): void {
    this.pagination.page_number = pageNumber;
    this.sessionStorageService.setItem(this.pageSessionKey, pageNumber.toString());
    this.loadTasks();
  }

  public isCurrentUserJudicial(): boolean {
    return this.userRoleCategory?.toUpperCase() === RoleCategory.JUDICIAL;
  }

  // Do the actual load. This is separate as it's called from two methods.
  private doLoad(): void {
    const userInfoStr = this.sessionStorageService.getItem(this.userDetailsKey);
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      this.currentUser = userInfo.uid ? userInfo.uid : userInfo.id;
    }
    this.showSpinner$ = this.loadingService.isLoading as any;
    const loadingToken = this.loadingService.register();
    const tasksSearch$ = this.performSearchPreviousTaskPermissions();
    const mappedSearchResult$ = tasksSearch$.pipe(mergeMap(((result: TaskResponse) => {
      const assignedJudicialUsers: string[] = [];
      result.tasks.forEach((task) => {
        task.assigneeName = getAssigneeName(this.caseworkers, task.assignee);
        if (!task.assigneeName && task.assignee) {
          assignedJudicialUsers.push(task.assignee);
        }
      });
      if (!assignedJudicialUsers) {
        return of(result);
      }
      return this.rolesService.getCaseRolesUserDetails(assignedJudicialUsers, this.selectedServices).pipe(switchMap(((judicialUserData) => {
        result.tasks.map((task) => {
          const judicialAssignedData = judicialUserData.find((judicialUser) => judicialUser.sidam_id === task.assignee);
          task.assigneeName = judicialAssignedData ? judicialAssignedData.full_name : task.assigneeName;
        });
        return of(result);
      })));
    })));
    mappedSearchResult$.subscribe((result) => {
      this.setTaskListDetails(result, loadingToken);
    }, (error) => {
      this.loadingService.unregister(loadingToken);
      handleFatalErrors(error.status, this.router, WILDCARD_SERVICE_DOWN);
    });
  }

  private setTaskListDetails(result: TaskResponse, loadingToken: string): void {
    this.loadingService.unregister(loadingToken);
    this.tasks = result.tasks;
    this.tasksTotal = result.total_records;
    this.ref.detectChanges();
    if (result.tasks && result.tasks.length === 0 && this.pagination.page_number > 1) {
      // if possibly back at a page that has been removed by actions to task, go back one to attempt to get tasks
      this.goneBackCount++;
      if (this.goneBackCount < 10) {
        this.onPaginationHandler(this.pagination.page_number - 1);
      } else {
        // if gone back 10 pages, we can avoid a potentially extraordinarily long loop by resetting
        this.goneBackCount = 0;
        this.onPaginationHandler(1);
      }
    } else {
      this.goneBackCount = 0;
    }
  }

  // reset pagination when filter is applied
  private resetPagination(locations: string[], workTypes: string[], services: string[]): void {
    if (!this.locationListsEqual(locations) || !this.listsEquivalent(this.selectedWorkTypes, workTypes) || !this.listsEquivalent(this.selectedServices, services)) {
      // Sreekanth - to test looping back functionality please comment these two lines out
      this.pagination.page_number = 1;
      this.sessionStorageService.setItem(this.pageSessionKey, '1');
    }
  }

  public getCurrentUserRoleCategory(): string {
    const userInfoStr = this.sessionStorageService.getItem(this.userDetailsKey);
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      return userInfo.roleCategory;
    }
  }

  private locationListsEqual(newLocations: string[]): boolean {
    if (newLocations.length !== this.selectedLocations.length) {
      return false;
    }
    return this.listsEquivalent(this.selectedLocations, newLocations);
  }

  private listsEquivalent(originalList: string[], newList: string[]): boolean {
    for (let i = 0; i < newList.length; i++) {
      if (!originalList.includes(newList[i])) {
        return false;
      }
    }
    return true;
  }
}
