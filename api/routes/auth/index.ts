import express from 'express';

import signin from './signin';
import signup from './signup';
import signout from './signout';

import { verifyToken } from '../../utils/jwt.js';
import errorHandler from '../../utils/errorHandler.js';
import errorGenerator from '../../utils/errorGenerator.js';

const router = express.Router();

router.head('/', async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];

    verifyToken(token, (err) => {
      if (!err) {
        res.status(200).json({});
        return;
      }

      switch (err.name) {
        case 'ToeknExpiredError':
          throw errorGenerator({
            message: err.message,
            code: 'auth/token-expired',
          });
        case 'JsonWebTokenError':
          throw errorGenerator({
            message: err.message,
            code: 'auth/invalid-token',
          });
        default:
          throw errorGenerator({
            message: err.message,
            code: 'auth/invalid-token',
          });
      }
    });
  } catch (err) {
    console.log(err.code);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.use('/signin', signin);
router.use('/signup', signup);
router.use('/signout', signout);

export default router;
