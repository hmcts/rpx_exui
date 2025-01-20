import * as applicationinsights from 'applicationinsights';
import * as express from 'express';
import { getConfigValue, showFeature } from '../configuration/';
import {
  APP_INSIGHTS_CONNECTION_STRING,
  FEATURE_APP_INSIGHTS_ENABLED
} from '../configuration/references';

export let client: applicationinsights.TelemetryClient;

if (showFeature(FEATURE_APP_INSIGHTS_ENABLED)) {
  applicationinsights
    .setup(getConfigValue(APP_INSIGHTS_CONNECTION_STRING))
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)
    .start();

  client = applicationinsights.defaultClient;
  client.trackTrace({ message: 'App Insight Activated' });
} else {
  client = null;
}

export function appInsights(req: express.Request, res: express.Response, next) {
  if (client) {
    client.trackNodeHttpRequest({ request: req, response: res });
  }

  next();
}

export function trackTrace(trace: string, properties?: {[key: string]: any}) {
  if (client) {
    client.trackTrace({ message: trace, properties });
  }
}
