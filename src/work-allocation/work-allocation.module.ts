import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { AlertService, LoadingService, PaginationModule, PipesModule, SessionStorageService } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from '../app/shared/shared.module';
import { BookingService } from '../booking/services';
import { RoleAccessModule } from '../role-access/role-access.module';
import { WorkAllocationComponentsModule } from './components/work-allocation.components.module';
import * as fromContainers from './containers';
import { WorkAllocationAccessGuard } from './guards';
import { CaseworkerDataService, LocationDataService, StaffSupportedJurisdictionsService, WASupportedJurisdictionsService, WorkAllocationTaskService } from './services';
import { workAllocationRouting } from './work-allocation-feature.routes';

// from containers
@NgModule({ declarations: [...fromContainers.containers],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [CommonModule,
        SharedModule,
        MatDialogModule,
        WorkAllocationComponentsModule,
        PipesModule,
        workAllocationRouting,
        CdkTableModule,
        ExuiCommonLibModule,
        ReactiveFormsModule,
        RoleAccessModule,
        PaginationModule,
        NgxPaginationModule], providers: [
        WorkAllocationTaskService,
        WorkAllocationAccessGuard,
        AlertService,
        BookingService,
        CaseworkerDataService,
        LocationDataService,
        StaffSupportedJurisdictionsService,
        WASupportedJurisdictionsService,
        LoadingService,
        SessionStorageService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class WorkAllocationModule {}
