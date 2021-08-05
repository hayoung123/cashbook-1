import express from 'express';

import { db } from 'models/db';

import authService from 'services/auth';

import errorHandler from 'utils/error-handler';

import { TokenType } from 'types/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const GITHUB_LOGIN_URL = `https://github.com/login/oauth/authorize`;
    const CLIENT_ID = process.env.CLIENT_ID;
    const REDIRECT_URL = process.env.REDIRECT_URL;
    const url = `${GITHUB_LOGIN_URL}?client_id=${CLIENT_ID}
                &redirect_url=${REDIRECT_URL}&scope=user:email`;

    res.status(200).json({ url });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.post('/', async (req, res) => {
  try {
    const { code } = req.body;

    const { access_token } = await authService.getGithubAccessToken(code as string);

    const email = await authService.getUserEmailByGithub(access_token);

    const userCount = await db.User.count({
      where: { email },
    });

    let result: TokenType;

    if (userCount > 0) {
      result = await authService.signIn(email, access_token, true);
    } else {
      result = await authService.signUp(email, access_token, true);
    }

    const { accessToken, refreshToken } = result;

    res.cookie('_rt', refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
