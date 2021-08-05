import express from 'express';

import authService from 'services/auth';

import errorHandler from 'utils/error-handler';

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

    const { accessToken, refreshToken } = await authService.signInWithGithub(code);

    res.cookie('_rt', refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
