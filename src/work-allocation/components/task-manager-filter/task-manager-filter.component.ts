import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BookingCheckType, FeatureToggleService, FilterService, PersonRole } from '@hmcts/rpx-xui-common-lib';
import { FilterConfig, FilterFieldConfig, FilterSetting } from '@hmcts/rpx-xui-common-lib/lib/models';
import { LocationByEPIMMSModel } from '@hmcts/rpx-xui-common-lib/lib/models/location.model';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppUtils } from '../../../app/app-utils';
import { DetailedService, UserRole } from '../../../app/models';
import * as fromAppStore from '../../../app/store';
import { getRoleCategory } from '../../utils';

@Component({
  selector: 'exui-task-manager-filter',
  templateUrl: './task-manager-filter.component.html',
  styleUrls: ['./task-manager-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskManagerFilterComponent implements OnInit, OnDestroy {
  private static readonly FILTER_NAME: string = 'all-work-tasks-filter';
  @Input() public jurisdictions: DetailedService[] = [];
  @Input() public waSupportedJurisdictions: string[];
  @Output() public selectionChanged: EventEmitter<any> = new EventEmitter<any>();

  public appStoreSub: Subscription;
  public filterSub: Subscription;
  public roleType: string;
  public userRole: UserRole;

  public fieldsConfig: FilterConfig = {
    persistence: 'local',
    enableDisabledButton: true,
    id: TaskManagerFilterComponent.FILTER_NAME,
    fields: [],
    cancelButtonText: 'Reset to default',
    applyButtonText: 'Apply',
    showCancelFilterButton: true,
    cancelSetting: {
      id: TaskManagerFilterComponent.FILTER_NAME,
      fields: [
        {
          name: 'selectLocation',
          value: ['location_all']
        },
        {
          name: 'selectPerson',
          value: ['All']
        },
        {
          name: 'taskName',
          value: [{ task_type_id: '', task_type_name: '' }]
        },
        {
          name: 'findTaskNameControl',
          value: ['']
        }
      ]
    }
  };

  constructor(private readonly filterService: FilterService,
              private featureToggleService: FeatureToggleService,
              private readonly appStore: Store<fromAppStore.State>) {}

  private static initServiceFilter(jurisdictions: DetailedService[]): FilterFieldConfig {
    return {
      name: 'service',
      options: jurisdictions.map((service) => ({ key: service.serviceId, label: service.serviceName })),
      minSelected: 1,
      maxSelected: 1,
      minSelectedError: 'You must select a service',
      maxSelectedError: null,
      changeResetFields: ['selectLocation', 'selectPerson', 'role', 'person', 'findPersonControl', 'taskType', 'findTaskNameControl'],
      title: 'Service',
      type: 'select'
    };
  }

  private static initLocationFilter(): FilterFieldConfig {
    return {
      name: 'location',
      options: [],
      minSelected: 1,
      maxSelected: 1,
      findLocationField: 'service',
      enableCondition: 'selectLocation=search',
      minSelectedError: 'You must select a location',
      maxSelectedError: null,
      enableAddButton: false,
      type: 'find-location',
      radioSelectionChange: 'selectLocation=search',
      bookingCheckType: BookingCheckType.NO_CHECK
    };
  }

  private static initSelectLocationFilter(): FilterFieldConfig {
    return {
      name: 'selectLocation',
      options: [
        { key: 'location_all', label: 'All' },
        { key: 'search', label: 'Search for a location' }
      ],
      minSelected: 1,
      maxSelected: 1,
      minSelectedError: 'You must select a location',
      maxSelectedError: null,
      title: 'Location',
      type: 'radio'
    };
  }

  private static initPersonFilter(): FilterFieldConfig {
    return {
      name: 'selectPerson',
      options: [
        {
          key: 'All',
          label: 'All'
        },
        {
          key: 'None / Available tasks',
          label: 'Unassigned'
        },
        {
          key: 'Specific person',
          label: 'Assigned to a person'
        }
      ],
      minSelected: 1,
      maxSelected: 1,
      minSelectedError: 'You must select a person',
      maxSelectedError: null,
      changeResetFields: ['person', 'findPersonControl'],
      lineBreakBefore: true,
      findPersonField: 'person',
      title: 'Tasks',
      type: 'radio'
    };
  }

  private static initRoleTypeFilter(): FilterFieldConfig {
    return {
      name: 'role',
      options: [
        {
          key: PersonRole.JUDICIAL,
          label: PersonRole.JUDICIAL
        },
        {
          key: PersonRole.CASEWORKER,
          label: PersonRole.CASEWORKER
        },
        {
          key: PersonRole.ADMIN,
          label: PersonRole.ADMIN
        },
        {
          key: PersonRole.CTSC,
          label: PersonRole.CTSC
        }
      ],
      minSelected: 1,
      maxSelected: 1,
      changeResetFields: ['person', 'findPersonControl'],
      minSelectedError: 'You must select a role type',
      maxSelectedError: null,
      enableCondition: 'selectPerson=Specific person',
      findPersonField: 'person',
      disabledText: 'Select a role type',
      type: 'select'
    };
  }

  private static findPersonFilter(waSupportedJurisdictions: string[]): FilterFieldConfig {
    return {
      name: 'person',
      options: [],
      minSelected: 0,
      maxSelected: 0,
      minSelectedError: 'You must select a person',
      maxSelectedError: null,
      domainField: 'role',
      enableCondition: 'selectPerson=Specific person',
      type: 'find-person',
      radioSelectionChange: 'selectPerson=Specific person',
      servicesField: 'service',
      services: waSupportedJurisdictions
    };
  }

  private static initTaskTypeFilter(): FilterFieldConfig {
    return {
      name: 'taskType',
      options: [
        {
          key: 'All',
          label: 'All'
        },
        {
          key: 'JUDICIAL',
          label: 'Judicial'
        },
        {
          key: 'LEGAL_OPERATIONS',
          label: 'Legal Ops'
        },
        {
          key: 'ADMIN',
          label: 'Admin'
        },
        {
          key: 'CTSC',
          label: 'CTSC'
        }
      ],
      minSelected: 1,
      maxSelected: 1,
      minSelectedError: 'You must select a task type',
      maxSelectedError: null,
      lineBreakBefore: true,
      title: 'Tasks by role type',
      type: 'select'
    };
  }

  private static initTaskNameFilter(): FilterFieldConfig {
    return {
      name: 'taskName',
      title: 'Task by name',
      options: [],
      minSelected: 0,
      maxSelected: 1,
      servicesField: 'service',
      minSelectedError: 'You must select a task name',
      maxSelectedError: null,
      enableAddTaskNameButton: false,
      type: 'find-task-name'
    };
  }

  public ngOnInit(): void {
    this.appStoreSub = this.appStore.pipe(select(fromAppStore.getUserDetails)).subscribe(
      (userDetails) => {
        // get jurisdiction key from detailed service list
        const jurisdiction = this.jurisdictions?.length > 0 ? this.jurisdictions[0].serviceId : '';
        this.userRole = AppUtils.getUserRole(userDetails?.userInfo?.roles || []);
        this.roleType = AppUtils.convertDomainToLabel(this.userRole);
        this.fieldsConfig.cancelSetting.fields.push({
          name: 'taskType',
          value: [getRoleCategory(this.roleType)]
        },
        {
          name: 'role',
          value: [this.roleType]
        },
        {
          name: 'service',
          value: [jurisdiction]
        }
        );
      }
    );
    this.fieldsConfig.fields = [
      TaskManagerFilterComponent.initServiceFilter(this.jurisdictions),
      TaskManagerFilterComponent.initSelectLocationFilter(),
      TaskManagerFilterComponent.initLocationFilter(),
      // TaskManagerFilterComponent.initRoleTypeFilter(),
      TaskManagerFilterComponent.initPersonFilter(),
      TaskManagerFilterComponent.initRoleTypeFilter(),
      TaskManagerFilterComponent.findPersonFilter(this.waSupportedJurisdictions),
      TaskManagerFilterComponent.initTaskTypeFilter(),
      TaskManagerFilterComponent.initTaskNameFilter()
    ];

    this.filterSub = this.filterService.getStream(TaskManagerFilterComponent.FILTER_NAME)
      .pipe(
        map((f: FilterSetting) => {
          if (f === null) {
            f = {
              id: TaskManagerFilterComponent.FILTER_NAME,
              reset: false,
              fields: this.fieldsConfig.cancelSetting.fields
            };
            return f;
          }
          return f;
        }),
        filter((f: FilterSetting) => f && f.hasOwnProperty('fields')),
        filter((f: FilterSetting) => !f.reset),
      ).subscribe((f: FilterSetting) => {
        const fields = f.fields.reduce((acc, field: { name: string, value: string[] }) => {
          if (field.name === 'location') {
            const value: any = field.value && field.value.length > 0 ? (field.value[0] as unknown as LocationByEPIMMSModel).epimms_id : '';
            return { ...acc, [field.name]: value };
          }
          return { ...acc, [field.name]: field.value[0] };
        }, {});
        this.selectionChanged.emit(fields);
      });
  }

  public ngOnDestroy(): void {
    if (this.appStoreSub && !this.appStoreSub.closed) {
      this.appStoreSub.unsubscribe();
    }
    if (this.filterSub && !this.filterSub.closed) {
      this.filterSub.unsubscribe();
    }
  }
}
