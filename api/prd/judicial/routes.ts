import * as express from 'express';
import authInterceptor from '../../lib/middleware/auth';
import { getJudicialUsersSearch, searchJudicialUserByPersonalCodes, searchJudicialUserByIdamId } from './index';

export const router = express.Router({ mergeParams: true });

router.use(authInterceptor);
router.post('/searchJudicialUserByPersonalCodes', searchJudicialUserByPersonalCodes);
router.post('/searchJudicialUserByIdamId', searchJudicialUserByIdamId);
router.post('/getJudicialUsersSearch', getJudicialUsersSearch);
