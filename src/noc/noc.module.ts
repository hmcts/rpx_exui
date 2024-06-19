import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AbstractAppConfig } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppConfig } from '../app/services/ccd-config/ccd-case.config';
import { SharedModule } from '../app/shared/shared.module';
import * as fromContainers from './containers';
import { FormValidatorsService } from './containers/noc-field/form-validators.service';
import { PaletteService } from './containers/noc-field/palette.service';
import { UtilsModule } from './containers/noc-field/utils/utils.module';
import { YesNoService } from './containers/noc-field/yes-no';
import { nocRouting } from './noc.routes';
import { NocService } from './services';
import { effects, reducers } from './store';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('noc', reducers),
    EffectsModule.forFeature(effects),
    nocRouting,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    ExuiCommonLibModule
  ],
  declarations: [...fromContainers.containers],
  providers: [{
    provide: AbstractAppConfig,
    useExisting: AppConfig
  },
  NocService,
  PaletteService,
  FormValidatorsService,
  YesNoService
  ]
})
/**
 * Entry point for NOC Module that is also lazy loaded.
 */
export class NocModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(@Optional() @SkipSelf() parentModule: NocModule) {
    NocModule.forRoot();
  }

  public static forRoot(): ModuleWithProviders<RouterModule> {
    return {
      ngModule: NocModule,
      providers: [
      ]
    };
  }
}
