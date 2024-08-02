import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { ApplicationInsights, IConfig, IEventTelemetry, IPageViewPerformanceTelemetry } from '@microsoft/applicationinsights-web';

export interface IMonitoringService {
  logPageView(name?: string, url?: string, properties?: any,
              measurements?: any, duration?: number);
  logEvent(name: string, properties?: any, measurements?: any);
  logException(exception: Error);
}

export class MonitorConfig implements IConfig {
  public instrumentationKey?: string;
  public connectionString?: string;
  public endpointUrl?: string;
  public emitLineDelimitedJson?: boolean;
  public accountId?: string;
  public sessionRenewalMs?: number;
  public sessionExpirationMs?: number;
  public maxBatchSizeInBytes?: number;
  public maxBatchInterval?: number;
  public enableDebug?: boolean;
  public disableExceptionTracking?: boolean;
  public disableTelemetry?: boolean;
  public verboseLogging?: boolean;
  public diagnosticLogInterval?: number;
  public samplingPercentage?: number;
  public autoTrackPageVisitTime?: boolean;
  public disableAjaxTracking?: boolean;
  public overridePageViewDuration?: boolean;
  public maxAjaxCallsPerView?: number;
  public disableDataLossAnalysis?: boolean;
  public disableCorrelationHeaders?: boolean;
  public correlationHeaderExcludedDomains?: string[];
  public disableFlushOnBeforeUnload?: boolean;
  public enableSessionStorageBuffer?: boolean;
  public isCookieUseDisabled?: boolean;
  public cookieDomain?: string;
  public isRetryDisabled?: boolean;
  public url?: string;
  public isStorageUseDisabled?: boolean;
  public isBeaconApiDisabled?: boolean;
  public sdkExtension?: string;
  public isBrowserLinkTrackingEnabled?: boolean;
  public appId?: string;
  public enableCorsCorrelation?: boolean;
}

@Injectable()
export class MonitoringService implements IMonitoringService {
  public areCookiesEnabled: boolean = false;
  @Optional() appInsights: ApplicationInsights;
  @Optional() private config?: MonitorConfig;

  constructor(private readonly http: HttpClient) { }

  public logPageView(name?: string, url?: string, properties?: any,
    measurements?: any, duration?: number) {
    const pageViewTelemetry: IPageViewPerformanceTelemetry = {
      name, uri: url, properties, measurements, duration: duration.toString()
    };
    this.send(() => {
      this.appInsights.trackPageView(pageViewTelemetry);
    });
  }

  public logEvent(name: string, properties?: any, measurements?: any) {
    const eventTelemetry: IEventTelemetry = {
      name, properties, measurements
    };
    this.send(() => {
      this.appInsights.trackEvent(eventTelemetry);
    });
  }

  public logException(exception: Error) {
    this.send(() => {
      this.appInsights.trackException({ exception });
    });
  }

  public enableCookies() {
    this.areCookiesEnabled = true;
  }

  private send(func: () => any): void {
    if (this.config?.connectionString) {
      func();
    } else {
      // will only get run once per login
      this.http.get('/api/monitoring-tools').subscribe((monitor) => {
        // eslint-disable-next-line dot-notation
        const connStr = monitor['connectionString'];
        console.log('Setting appInsights connection string to ' + connStr);
        this.config = {
          connectionString: connStr
        };
        if (!this.areCookiesEnabled) {
          this.config = {
            ...this.config,
            isCookieUseDisabled: true,
            isStorageUseDisabled: true,
            enableSessionStorageBuffer: true
          };
        }
        this.appInsights = new ApplicationInsights({ config: this.config });
        // below is important step to utilise the app insights instance
        this.appInsights.loadAppInsights();
        func();
      });
    }
  }
}
