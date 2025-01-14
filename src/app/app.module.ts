import { provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  ErrorHandler,
  NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PaymentLibModule } from '@hmcts/ccpay-web-component';
import {
  CookieService,
  ExuiCommonLibModule,
  FeatureToggleGuard,
  FeatureToggleService,
  FilterService,
  GoogleTagManagerService,
  LaunchDarklyService,
  LoadingService,
  RoleService,
  TimeoutNotificationsService
} from '@hmcts/rpx-xui-common-lib';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
// ngrx modules - START
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { MetaReducer, Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import {
  LoggerModule,
  NGXLogger,
  NgxLoggerLevel,
  NGXLoggerMapperService
} from 'ngx-logger';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { BookingServiceDownComponent, BookingSystemErrorComponent, RefreshBookingServiceDownComponent } from '../booking/containers';
import { environment } from '../environments/environment';
import {
  EnvironmentConfig,
  ENVIRONMENT_CONFIG
} from '../models/environmentConfig.model';
import { initApplication } from './app-initilizer';
// app routes
import { ROUTES, routingConfiguration } from './app.routes';
import { AppComponent } from './containers/app/app.component';
// common provider
import { ProvidersModule } from './providers/providers.module';
import { AcceptTermsService } from './services/acceptTerms/acceptTerms.service';
import { CaseShareService } from './services/case/share-case.service';
import { DefaultErrorHandler } from './services/errorHandler/defaultErrorHandler';
import { JurisdictionService } from './services/jurisdiction/jurisdiction.service';
import { CryptoWrapper } from './services/logger/cryptoWrapper';
import { LoggerService } from './services/logger/logger.service';
import { MonitoringService } from './services/logger/monitoring.service';
import { SharedModule } from './shared/shared.module';
import { effects } from './store/effects';
// ngrx modules - END
// APP store
import { CustomSerializer, reducers } from './store/reducers';
import { InitialisationSyncService } from './services/ccd-config/initialisation-sync-service';
// enforces immutability
export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze]
  : [];

export function launchDarklyClientIdFactory(
  envConfig: EnvironmentConfig
): string {
  return envConfig.launchDarklyClientId || '';
}

@NgModule({ declarations: [AppComponent, BookingServiceDownComponent, BookingSystemErrorComponent, RefreshBookingServiceDownComponent],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [LoggerModule.forRoot({
            level: NgxLoggerLevel.TRACE,
            disableConsoleLogging: false
        }),
        BrowserModule,
        BrowserAnimationsModule,
        ProvidersModule.forRoot(),
        RouterModule.forRoot(ROUTES, routingConfiguration),
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot(effects),
        StoreRouterConnectingModule.forRoot(),
        StoreDevtoolsModule.instrument({
            logOnly: environment.production,
            connectInZone: true
        }),
        SharedModule,
        ExuiCommonLibModule,
        NgIdleKeepaliveModule.forRoot(),
        PaymentLibModule,
        RpxTranslationModule.forRoot({
            baseUrl: '/api/translation',
            debounceTimeMs: 300,
            validity: {
                days: 1
            },
            testMode: false
        })], providers: [
        NGXLogger,
        NGXLoggerMapperService,
        {
            provide: RouterStateSerializer,
            useClass: CustomSerializer
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initApplication,
            deps: [Store, ENVIRONMENT_CONFIG],
            multi: true
        },
        CryptoWrapper,
        MonitoringService,
        LoggerService,
        {
            provide: ErrorHandler,
            useClass: DefaultErrorHandler
        },
        AcceptTermsService,
        CaseShareService,
        { provide: FeatureToggleService, useClass: LaunchDarklyService },
        TimeoutNotificationsService,
        JurisdictionService,
        CookieService,
        FeatureToggleGuard,
        FilterService,
        GoogleTagManagerService,
        LoadingService,
        RoleService,
        InitialisationSyncService,
        { provide: Window, useValue: window },
        provideHttpClient(withInterceptorsFromDi(), withXsrfConfiguration({
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-XSRF-TOKEN'
        }))
    ] })
export class AppModule {}
