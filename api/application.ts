import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import * as express from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';
import amRoutes from './accessManagement/routes';
import { getContentSecurityPolicy } from '@hmcts/rpx-xui-node-lib';
import { getXuiNodeMiddleware } from './auth';
import { getConfigValue, showFeature } from './configuration';
import {
  FEATURE_HELMET_ENABLED,
  FEATURE_COMPRESSION_ENABLED,
  HELMET,
  PROTOCOL,
  SESSION_SECRET
} from './configuration/references';
import * as health from './health';
import * as log4jui from './lib/log4jui';
import { JUILogger } from './lib/models';
import * as tunnel from './lib/tunnel';
import openRoutes from './openRoutes';
import { initProxy } from './proxy.config';
import routes from './routes';
import workAllocationRouter from './workAllocation/routes';
import { idamCheck } from './idamCheck';
import { getNewUsersByServiceName } from './workAllocation';

export const app = express();

if (showFeature(FEATURE_HELMET_ENABLED)) {
  app.use(helmet(getConfigValue(HELMET)));
  app.use(helmet.noSniff());
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.referrerPolicy({ policy: ['origin'] }));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts({ maxAge: 28800000 }));
  app.use(helmet.xssFilter());
  app.use(getContentSecurityPolicy(helmet));
  app.use((req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex');
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate, proxy-revalidate');
    next();
  });
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });
  app.get('/sitemap.xml', (req, res) => {
    res.type('text/xml');
    res.send('User-agent: *\nDisallow: /');
  });
  app.disable('x-powered-by');
  app.disable('X-Powered-By');
}

app.use(cookieParser(getConfigValue(SESSION_SECRET)));

if (showFeature(FEATURE_COMPRESSION_ENABLED)) {
  app.use(compression());
}

// TODO: remove tunnel and configurations
tunnel.init();
/**
 * Add Reform Standard health checks.
 */
health.addReformHealthCheck(app);

app.use(getXuiNodeMiddleware());

// applyProxy needs to be used before bodyParser
initProxy(app);

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use('/am', amRoutes);
app.use('/api', routes);
app.use('/external', openRoutes);
app.use('/workallocation', workAllocationRouter);
app.use(csrf({ cookie: { key: 'XSRF-TOKEN', httpOnly: false, secure: true }, ignoreMethods: ['GET'] }));

const logger: JUILogger = log4jui.getLogger('Application');
logger.info(`Started up using ${getConfigValue(PROTOCOL)}`);

new Promise(idamCheck).then(() => 'IDAM is up and running');
// EUI-2028 - Get the caseworkers, ideally prior to a user logging into application
new Promise(getNewUsersByServiceName).then(() => 'Caseworkers have been loaded');
