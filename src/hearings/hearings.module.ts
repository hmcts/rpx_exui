import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AbstractAppConfig,
  DatePipe,
  FormatTranslatorService,
  LoadingService, PaletteUtilsModule
} from '@hmcts/ccd-case-ui-toolkit';
import {
  ExuiCommonLibModule
} from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppConfig } from '../app/services/ccd-config/ccd-case.config';
import { SharedModule } from '../app/shared/shared.module';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { HearingsEditGuard } from './guards/hearings-edit-guard';
import { HearingsViewGuard } from './guards/hearings-view-guard';
import { HearingAmendmentsGuard } from './guards/hearing-amendments-guard';
import { hearingsRouting } from './hearings.routes';
import { HearingsPipesModule } from './pipes/hearings.pipes.module';
import { HearingsService } from './services/hearings.service';
import { HearingsFeatureService } from './services/hearings-feature.service';
import { effects, reducers } from './store';
import { AbstractPageFlow } from './utils/abstract-page-flow';
import { PageFlow } from './utils/page-flow';
import { WarningAndErrorSectionComponent } from './containers/request-hearing/hearing-edit-summary/warning-and-error-section/warning-and-error-section.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('hearings', reducers),
    EffectsModule.forFeature(effects),
    hearingsRouting,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ExuiCommonLibModule,
    HearingsPipesModule,
    PaletteUtilsModule
  ],
  declarations: [...fromComponents.components, ...fromContainers.containers, WarningAndErrorSectionComponent],
  providers: [
    PageFlow,
    {
      provide: AbstractAppConfig,
      useExisting: AppConfig
    },
    {
      provide: AbstractPageFlow,
      useExisting: PageFlow
    },
    HearingsService,
    HearingsEditGuard,
    HearingsViewGuard,
    LoadingService,
    DatePipe,
    FormatTranslatorService,
    HearingAmendmentsGuard,
    HearingsFeatureService
  ]
})
/**
 * Entry point for Hearings Module that is also lazy loaded.
 */
export class HearingsModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(@Optional() @SkipSelf() parentModule: HearingsModule) {
    HearingsModule.forRoot();
  }

  public static forRoot(): ModuleWithProviders<RouterModule> {
    return {
      ngModule: HearingsModule,
      providers: [LoadingService]
    };
  }
}
