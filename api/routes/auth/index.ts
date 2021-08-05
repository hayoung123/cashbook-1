import express from 'express';

import signin from './signin';
import signup from './signup';
import signout from './signout';
import github from './github';

import {
  getAccessToken,
  checkTokenExpiration,
  decodeToken,
  createToken,
  checkTokenValidity,
} from 'utils/jwt';
import errorHandler from 'utils/error-handler';
import errorGenerator from 'utils/error-generator';

const router = express.Router();

router.use('/signin', signin);
router.use('/signup', signup);
router.use('/signout', signout);
router.use('/github', github);

router.get('/', async (req, res) => {
  try {
    const { redirect } = req.query;

    const accessToken = getAccessToken(req.headers.authorization);
    const refreshToken = req.cookies['_rt'];

    if (!accessToken || !refreshToken) {
      throw errorGenerator({
        message: 'No token',
        code: 'req/no-token',
      });
    }

    const isValidAccessToken = await checkTokenValidity('access', accessToken);

    const isAccessTokenExpired = await checkTokenExpiration('access', accessToken);
    const isRefreshTokenExpired = await checkTokenExpiration('refresh', refreshToken);

    if (isAccessTokenExpired && isRefreshTokenExpired) {
      res.clearCookie('_rt');
      throw errorGenerator({
        code: 'auth/token-expired',
        message: 'All tokens have expired',
      });
    }

    const { uid } = decodeToken('refresh', refreshToken);
    const newAccessToken = createToken('access', { uid });

    if (!redirect) {
      const result = isValidAccessToken ? {} : { newAccessToken };
      res.status(200).json(result);
      return;
    }

    res.status(200).json({ requestAgain: true, newAccessToken });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
