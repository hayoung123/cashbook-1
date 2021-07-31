import express from 'express';

import auth from './auth';
import transaction from './transaction';
import payment from './payment';

const router = express.Router();

router.use('/transaction', transaction);
router.use('/auth', auth);
router.use('/payment', payment);

export default router;
