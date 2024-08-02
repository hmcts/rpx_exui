import * as express from 'express';
import accessManagementRouter from './accessManagement/routes';
import { router as caseShareRoutes } from './caseshare/routes';
import { router as challengedAccessRouter } from './challengedAccess/routes';
import { getConfigValue, showFeature } from './configuration';
import { APP_INSIGHTS_CONNECTION_STRING, APP_INSIGHTS_KEY } from './configuration/references';
import { router as globalSearchRoutes } from './globalSearch/routes';
import healthCheck from './healthCheck';
import { router as hearingsRouter } from './hearings/routes';
import authInterceptor from './lib/middleware/auth';
import { router as locationsRouter } from './locations/routes';
import { router as nocRouter } from './noc/routes';
import { router as organisationRouter } from './organisations';
import { router as prdRouter } from './prd/routes';
import roleAccessRouter from './roleAccess/routes';
import { router as refDataRouter } from './ref-data/routes';
import { router as specificAccessRouter } from './specificAccessOrchastrator/routes';
import staffRefDataRouter from './staff-ref-data/routes';
import { router as staffSupportedJurisdictionsRouter } from './staffSupportedJurisdictions';
import userRouter from './user/routes';
import { router as waSupportedJurisdictionRouter } from './waSupportedJurisdictions';

const router = express.Router({ mergeParams: true });

router.use('/healthCheck', healthCheck);

router.get('/monitoring-tools', (req, res) => {
  res.send({
    key: getConfigValue(APP_INSIGHTS_KEY),
    connectionString: getConfigValue(APP_INSIGHTS_CONNECTION_STRING)
  });
});

router.get('/configuration', (req, res) => {
  res.send(showFeature(req.query.configurationKey as string));
});

router.use(authInterceptor);

router.use('/user', userRouter);

router.use('/am', accessManagementRouter);

router.use('/role-access', roleAccessRouter);

router.use('/am', accessManagementRouter);

router.use('/role-access', roleAccessRouter);

router.use('/locations', locationsRouter);
// TODO: potentially can be moved to proxy but with onRes callback
router.use('/caseshare', caseShareRoutes);
router.use('/noc', nocRouter);
router.use('/organisation', organisationRouter);
router.use('/staff-supported-jurisdiction', staffSupportedJurisdictionsRouter);
router.use('/wa-supported-jurisdiction', waSupportedJurisdictionRouter);
router.use('/globalSearch', globalSearchRoutes);
router.use('/locations', locationsRouter);
router.use('/ref-data', refDataRouter);
router.use('/prd', prdRouter);
router.use('/hearings', hearingsRouter);
router.use('/specific-access-request', specificAccessRouter);
router.use('/challenged-access-request', challengedAccessRouter);
router.use('/staff-ref-data', staffRefDataRouter);

export default router;
