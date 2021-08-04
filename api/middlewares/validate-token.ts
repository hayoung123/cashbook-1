import { Request, Response, NextFunction } from 'express';

import { getAccessToken, verifyToken } from 'utils/jwt';
import errorGenerator from 'utils/error-generator';
import errorHandler from 'utils/error-handler';

async function validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accessToken = getAccessToken(req.headers.authorization);

    if (!accessToken) {
      throw errorGenerator({
        message: 'No token',
        code: 'req/no-token',
      });
    }

    let isTokenExpired = false;

    verifyToken('access', accessToken, (err) => {
      if (!err) {
        return;
      }

      switch (err.name) {
        case 'TokenExpiredError':
          isTokenExpired = true;
          break;
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

    if (isTokenExpired) {
      res.redirect(303, '/auth');
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
}

export default validateToken;
