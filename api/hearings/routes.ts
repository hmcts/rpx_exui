import * as express from 'express';
import authInterceptor from '../lib/middleware/auth';
import {
  cancelHearingRequest,
  deleteLinkedHearingGroup,
  getHearing,
  getHearingActuals,
  getHearings,
  getLinkedHearingGroup, injectHearingsHeaders,
  postLinkedHearingGroup,
  putLinkedHearingGroup,
  submitHearingActuals,
  submitHearingRequest,
  updateHearingActuals,
  updateHearingRequest
} from './hmc.index';
import {
  loadLinkedCasesWithHearings,
  loadServiceHearingValues,
  loadServiceLinkedCases
} from './services.index';

export const router = express.Router({ mergeParams: true });

router.use(authInterceptor);
// ------request-amend hearing APIs start------
router.post('/loadServiceHearingValues', injectHearingsHeaders, loadServiceHearingValues);
router.get('/getHearings', injectHearingsHeaders, getHearings);
router.get('/getHearing', injectHearingsHeaders, getHearing);
router.post('/submitHearingRequest', injectHearingsHeaders, submitHearingRequest);
router.put('/updateHearingRequest', injectHearingsHeaders, updateHearingRequest);
router.delete('/cancelHearings', injectHearingsHeaders, cancelHearingRequest);
// ------request-amend hearing APIs end------
// ------actual hearing APIs start------
router.get('/hearingActuals/:hearingId', injectHearingsHeaders, getHearingActuals);
router.put('/hearingActuals', injectHearingsHeaders, updateHearingActuals);
router.post('/hearingActualsCompletion/:hearingId', injectHearingsHeaders, submitHearingActuals);
// ------actual hearing APIs end------
// ------link hearing APIs start------
router.post('/loadServiceLinkedCases', loadServiceLinkedCases);
router.post('/loadLinkedCasesWithHearings', loadLinkedCasesWithHearings);
router.get('/getLinkedHearingGroup', getLinkedHearingGroup);
router.post('/postLinkedHearingGroup', postLinkedHearingGroup);
router.put('/putLinkedHearingGroup', putLinkedHearingGroup);
router.delete('/deleteLinkedHearingGroup', deleteLinkedHearingGroup);
// ------link hearing APIs end------
