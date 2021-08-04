import express from 'express';

import signin from './signin';
import signup from './signup';
import signout from './signout';

import authService from 'services/auth';

import validateToken from 'middlewares/validate-token';

import { getAccessToken, checkTokenExpiration, decodeToken, createToken } from 'utils/jwt';
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
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.get('/', async (req, res) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const refreshToken = req.cookies['_rt'];

    if (!accessToken || !refreshToken) {
      throw errorGenerator({
        message: 'No token',
        code: 'req/no-token',
      });
    }

    const isAccessTokenExpired = await checkTokenExpiration('access', accessToken);
    const isRefreshTokenExpired = await checkTokenExpiration('refresh', refreshToken);

    if (isAccessTokenExpired && isRefreshTokenExpired) {
      res.clearCookie('_rt');
      throw errorGenerator({
        code: 'auth/token-expired',
        message: 'All tokens have expired',
      });
    }

    if (!isAccessTokenExpired) {
      const { uid } = decodeToken('access', accessToken);
      const newRefreshToken = createToken('refresh', { uid });
      res.cookie('_rt', newRefreshToken, { httpOnly: true });
      res.status(200).json({ requestAgain: true });
      return;
    }

    const { uid } = decodeToken('refresh', refreshToken);
    const newAccessToken = createToken('access', { uid });

    res.status(200).json({ requestAgain: true, newAccessToken });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
