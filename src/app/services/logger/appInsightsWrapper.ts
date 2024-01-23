import {
  IAppInsights,
  IEventTelemetry,
  IMetricTelemetry,
  IPageViewPerformanceTelemetry,
  IAutoExceptionTelemetry,
  ITelemetryItem,
  ITraceTelemetry, IExceptionTelemetry, IPageViewTelemetry
} from '@microsoft/applicationinsights-web';

import { ICookieMgr } from '@microsoft/applicationinsights-core-js;

export abstract class AbstractAppInsights implements IAppInsights {
  _onerror(exception: IAutoExceptionTelemetry): void {
  }

  addTelemetryInitializer(telemetryInitializer: (item: ITelemetryItem) => (boolean | void)): void {
  }

  getCookieMgr(): ICookieMgr {
    return undefined;
  }

  startTrackEvent(name: string): void {
  }

  startTrackPage(name?: string): void {
  }

  stopTrackEvent(name: string, properties?: Object, measurements?: Object): void {
  }

  stopTrackPage(name?: string, url?: string, customProperties?: Object): void {
  }

  trackEvent(event: IEventTelemetry, customProperties?: { [p: string]: any }): void {
  }

  trackException(exception: IExceptionTelemetry, customProperties?: { [p: string]: any }): void {
  }

  trackMetric(metric: IMetricTelemetry, customProperties?: { [p: string]: any }): void {
  }

  trackPageView(pageView: IPageViewTelemetry, customProperties?: { [p: string]: any }): void {
  }

  trackPageViewPerformance(pageViewPerformance: IPageViewPerformanceTelemetry, customProperties?: { [p: string]: any }): void {
  }

  trackTrace(trace: ITraceTelemetry, customProperties?: { [p: string]: any }): void {
  }
 }

export class AppInsightsWrapper implements AbstractAppInsights {
  public startTrackPage(name?: string) {
    AppInsights.startTrackPage(name);
  }

  public stopTrackPage(name?: string, url?: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
    AppInsights.stopTrackPage(name, url, properties, measurements);
  }

  public trackPageView(name?: string, url?: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; },
    duration?: number) {
    AppInsights.trackPageView(name, url, properties, measurements, duration);
  }

  public startTrackEvent(name: string) {
    AppInsights.startTrackEvent(name);
  }

  public stopTrackEvent(name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
    AppInsights.stopTrackEvent(name, properties, measurements);
  }

  public trackEvent(name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
    AppInsights.trackEvent(name, properties, measurements);
  }

  public trackDependency(id: string, method: string, absoluteUrl: string, pathName: string, totalTime: number, success: boolean,
    resultCode: number, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
    AppInsights.trackDependency(id, method, absoluteUrl, pathName, totalTime, success, resultCode, properties, measurements);
  }

  public trackException(exception: Error, handledAt?: string, properties?: { [name: string]: string; },
    measurements?: { [name: string]: number; }, severityLevel?: AI.SeverityLevel) {
    AppInsights.trackException(exception, handledAt, properties, measurements, severityLevel);
  }

  public trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: { [name: string]: string; }) {
    AppInsights.trackMetric(name, average, sampleCount, min, max, properties);
  }

  public trackTrace(message: string, properties?: { [name: string]: string; }, severityLevel?: AI.SeverityLevel) {
    AppInsights.trackTrace(message, properties, severityLevel);
  }

  public flush() {
    AppInsights.flush();
  }

  public setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean) {
    AppInsights.setAuthenticatedUserContext(authenticatedUserId, accountId, storeInCookie);
  }

  public clearAuthenticatedUserContext() {
    AppInsights.clearAuthenticatedUserContext();
  }

  public downloadAndSetup(config: Microsoft.ApplicationInsights.IConfig) {
    AppInsights.downloadAndSetup(config);
  }

  public _onerror(message: string, url: string, lineNumber: number, columnNumber: number, error: Error) {
    AppInsights._onerror(message, url, lineNumber, columnNumber, error);
  }
}
