import express from 'express';

import errorGenerator from 'utils/error-generator';
import errorHandler from 'utils/error-handler';

const router = express.Router();

router.post('/', async (req, res) => {
  const { code } = req.query;

  const GET_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_PW;

  const res = await fetch(
    `${GET_TOKEN_URL}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const accessToken = res.data.access_token;
  res.redirect('auth/github/success');
});

router.get('/success', (req, res) => {
  const GITHUB_USER_URL = `https://api.github.com/user`;
  const res = await fetch(GITHUB_USER_URL, {
    method: 'GET',
    headers: {
      Authorization: 'token' + access_token,
    },
  });
});

export default router;
