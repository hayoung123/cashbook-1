import express from 'express';

import signin from './signin';
import signup from './signup';
import signout from './signout';

import authService from 'services/auth';

import { getAccessToken } from 'utils/jwt';
import errorHandler from 'utils/error-handler';
import errorGenerator from 'utils/error-generator';

const router = express.Router();

router.use('/signin', signin);
router.use('/signup', signup);
router.use('/signout', signout);

router.head('/', async (req, res) => {
  try {
    const token = getAccessToken(req.headers.authorization);

    if (!token) {
      throw errorGenerator({
        message: 'No token',
        code: 'req/no-token',
      });
    }

    await authService.verifyAuth(token);

    res.status(200).end();
  } catch (err) {
    console.log(err.code);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
