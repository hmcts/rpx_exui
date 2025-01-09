import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../app/shared/shared.module';
import { StaffAddEditUserFormComponent } from './components/staff-add-edit-user/staff-add-edit-user-form/staff-add-edit-user-form.component';
import {
  StaffSelectLocationComponent
} from './components/staff-add-edit-user/staff-add-edit-user-form/staff-select-location/staff-select-location.component';
import { StaffUserCheckAnswersComponent } from './components/staff-add-edit-user/staff-user-check-answers/staff-user-check-answers.component';
import { StaffStatusComponent } from './components/staff-user-details/staff-status/staff-status.component';
import { StaffUserDetailsComponent } from './components/staff-user-details/staff-user-details.component';
import { StaffAdvFilterComponent } from './components/staff-users/staff-adv-filter/staff-adv-filter.component';
import { StaffSearchComponent } from './components/staff-users/staff-search/staff-search.component';
import { StaffUserListComponent } from './components/staff-users/staff-user-list/staff-user-list.component';
import { StaffAddEditUserContainerComponent } from './containers/staff-add-edit-user-container/staff-add-edit-user-container.component';
import { StaffMainContainerComponent } from './containers/staff-main-container/staff-main-container.component';
import { StaffUserDetailsContainerComponent } from './containers/staff-user-details-container/staff-user-details-container.component';
import { StaffUsersComponent } from './containers/staff-users/staff-users.component';
import { StaffFilterOptionsJobTitlesResolver } from './resolvers/staff-filter-options-job-titles.resolver';
import { StaffFilterOptionsServicesResolver } from './resolvers/staff-filter-options-services.resolver';
import { StaffFilterOptionsSkillsResolver } from './resolvers/staff-filter-options-skills.resolver';
import { StaffFilterOptionsUserTypesResolver } from './resolvers/staff-filter-options-userTypes.resolver';
import { StaffUserDetailsResolverService } from './resolvers/staff-user-details-resolver.service';
import { StaffDataAccessService } from './services/staff-data-access/staff-data-access.service';
import { staffAdministratorRouting } from './staff-administrator.routes';
import { staffSelectReducer } from './store/reducers/staff-select.reducer';

@NgModule({
  declarations: [
    StaffMainContainerComponent,

    StaffUsersComponent,
    StaffSearchComponent,
    StaffAdvFilterComponent,
    StaffUserListComponent,

    StaffUserDetailsContainerComponent,
    StaffUserDetailsComponent,
    StaffStatusComponent,

    StaffAddEditUserContainerComponent,
    StaffAddEditUserFormComponent,
    StaffSelectLocationComponent,
    StaffUserCheckAnswersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CdkTableModule,
    ExuiCommonLibModule,
    ReactiveFormsModule,
    staffAdministratorRouting,
    NgxPaginationModule,
    StoreModule.forFeature('staffUI', staffSelectReducer),
    MatTooltipModule,
    MatAutocompleteModule
  ],
  providers: [
    StaffDataAccessService,
    StaffFilterOptionsServicesResolver,
    StaffFilterOptionsSkillsResolver,
    StaffFilterOptionsJobTitlesResolver,
    StaffFilterOptionsUserTypesResolver,
    StaffUserDetailsResolverService
  ],
  exports: []
})
export class StaffAdministratorModule {}
