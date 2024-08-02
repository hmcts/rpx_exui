import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FilterService } from '@hmcts/rpx-xui-common-lib';
import { FilterConfig, FilterFieldConfig, FilterSetting } from '@hmcts/rpx-xui-common-lib/lib/models/filter.model';
import { LocationByEPIMMSModel } from '@hmcts/rpx-xui-common-lib/lib/models/location.model';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PersonRole } from '../../../../api/workAllocation/interfaces/person';
import { AppUtils } from '../../../app/app-utils';
import * as fromAppStore from '../../../app/store';

@Component({
  selector: 'exui-case-manager-filter',
  templateUrl: './case-manager-filter.component.html',
  styleUrls: ['./case-manager-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CaseManagerFilterComponent implements OnInit, OnDestroy {
  private static readonly FILTER_NAME: string = 'all-work-cases-filter';
  @Input() public jurisdictions: string[] = [];
  @Output() public selectChanged: EventEmitter<any> = new EventEmitter<any>();
  public filterConfig: FilterConfig = {
    persistence: 'local',
    enableDisabledButton: true,
    id: CaseManagerFilterComponent.FILTER_NAME,
    fields: [],
    cancelButtonText: 'Reset to default',
    applyButtonText: 'Apply',
    showCancelFilterButton: true,
    cancelSetting: {
      id: CaseManagerFilterComponent.FILTER_NAME,
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
          name: 'actorId',
          value: [PersonRole.ALL]
        }
      ]
    }
  };

  public appStoreSub: Subscription;
  private sub: Subscription;

  constructor(private readonly filterService: FilterService,
              private readonly appStore: Store<fromAppStore.State>) {}

  private static initServiceFilter(jurisdictions: string[]): FilterFieldConfig {
    return {
      name: 'jurisdiction',
      options: jurisdictions.map((service) => ({ key: service, label: service })),
      minSelected: 1,
      maxSelected: 1,
      minSelectedError: 'You must select a service',
      maxSelectedError: null,
      changeResetFields: ['selectLocation', 'selectPerson', 'role', 'person', 'actorId', 'findPersonControl'],
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
      findLocationField: 'jurisdiction',
      enableCondition: 'selectLocation=search',
      minSelectedError: 'You must select a location',
      maxSelectedError: null,
      enableAddButton: false,
      type: 'find-location',
      radioSelectionChange: 'selectLocation=search'
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
      type: 'radio',
      lineBreakBefore: true
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
      domain: PersonRole.ALL,
      changeResetFields: ['findPersonControl', 'person'],
      findPersonField: 'person',
      lineBreakBefore: true,
      minSelectedError: 'You must select a role type',
      maxSelectedError: null,
      title: 'Select a role type',
      type: 'select'
    };
  }

  private static findPersonFilter(): FilterFieldConfig {
    return {
      name: 'person',
      options: [],
      minSelected: 1,
      maxSelected: 1,
      minSelectedError: 'You must select a person',
      maxSelectedError: null,
      domainField: 'role',
      type: 'find-person',
      title: 'Person',
      subTitle: 'Search for a person',
      lineBreakBefore: true,
      servicesField: 'jurisdiction',
      placeholderContent: 'You must specify a person...'
    };
  }

  public ngOnInit(): void {
    this.appStoreSub = this.appStore.pipe(select(fromAppStore.getUserDetails)).subscribe(
      (userDetails) => {
        const isLegalOpsOrJudicialRole = AppUtils.getUserRole(userDetails?.userInfo?.roles || []);
        const roleType = AppUtils.convertDomainToLabel(isLegalOpsOrJudicialRole);
        this.filterConfig.cancelSetting.fields.push({
          name: 'jurisdiction',
          value: [this.jurisdictions[0]]
        },
        {
          name: 'role',
          value: [roleType]
        }
        );
      }
    );
    this.filterConfig.fields = [
      CaseManagerFilterComponent.initServiceFilter(this.jurisdictions),
      CaseManagerFilterComponent.initRoleTypeFilter(),
      CaseManagerFilterComponent.findPersonFilter(),
      CaseManagerFilterComponent.initSelectLocationFilter(),
      CaseManagerFilterComponent.initLocationFilter()
    ];
    this.sub = this.filterService.getStream(CaseManagerFilterComponent.FILTER_NAME)
      .pipe(
        map((f: FilterSetting) => {
          if (f === null) {
            f = {
              id: CaseManagerFilterComponent.FILTER_NAME,
              reset: false,
              fields: this.filterConfig.cancelSetting.fields
            };
            return f;
          }
          return f;
        }),
        filter((f: FilterSetting) => f && f.hasOwnProperty('fields') && f.id === CaseManagerFilterComponent.FILTER_NAME),
        filter((f: FilterSetting) => !f.reset),
      ).subscribe((f: FilterSetting) => {
        const fields = f.fields.reduce((acc, field: { name: string, value: string[] }) => {
          if (field.name === 'location') {
            const value: any = field.value && field.value.length > 0 ? (field.value[0] as unknown as LocationByEPIMMSModel).epimms_id : '';
            return { ...acc, [field.name]: value };
          }
          return { ...acc, [field.name]: field.value[0] };
        }, {});
        this.selectChanged.emit(fields);
      });
  }

  public ngOnDestroy(): void {
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
    }
  }
}
