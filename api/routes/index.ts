import express from 'express';

import transaction from './transaction';
import auth from './auth';

const router = express.Router();

router.use('/transaction', transaction);
router.use('/auth', auth);

export default router;
