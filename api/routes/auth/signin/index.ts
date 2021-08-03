import express, { Request, Response } from 'express';

import authService from 'services/auth';

import errorGenerator from 'utils/error-generator';
import errorHandler from 'utils/error-handler';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw errorGenerator({
        message: 'Not enough input',
        code: 'req/invalid-body',
      });
    }

    const { accessToken, refreshToken } = await authService.signIn(email, password);

    res.cookie('_rt', refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
