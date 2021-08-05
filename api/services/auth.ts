import fetch from 'node-fetch';

import { db } from 'models/db';

import { createToken } from 'utils/jwt';
import errorGenerator from 'utils/error-generator';
import { hashPassword, checkPassword } from 'utils/encryption';

import { TokenType } from 'types/auth';

async function signUp(email: string, password: string, isOAuth?: boolean): Promise<TokenType> {
  const userCount = await db.User.count({
    where: {
      email,
    },
  });

  if (userCount > 0) {
    throw errorGenerator({
      message: 'Existing email account',
      code: 'auth/existing-email',
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await db.User.create({
    email,
    password: hashedPassword,
    is_OAuth: isOAuth || false,
  });

  const uid = user.getDataValue('id');

  const accessToken = createToken('access', { uid });
  const refreshToken = createToken('refresh', { uid });

  return { accessToken, refreshToken };
}

async function signIn(email: string, password: string, isOAuth?: boolean): Promise<TokenType> {
  const userSnapshot = await db.User.findOne({
    attributes: ['id', 'password', 'is_OAuth'],
    where: {
      email,
    },
  });

  if (!userSnapshot) {
    throw errorGenerator({
      message: 'Account not found',
      code: 'auth/account-not-found',
    });
  }

  const uid = userSnapshot.getDataValue('id');
  const passwordOnDB = userSnapshot.getDataValue('password');
  const isAccountOAuth = userSnapshot.getDataValue('is_OAuth');

  if (isOAuth) {
    if (!isAccountOAuth) {
      throw errorGenerator({
        message: 'not oauth ',
        code: 'auth/wrong-password',
      });
    }
  } else {
    const isCorrectPassword = await checkPassword(password, passwordOnDB);

    if (!isCorrectPassword) {
      throw errorGenerator({
        message: 'Wrong password',
        code: 'auth/wrong-password',
      });
    }
  }

  const accessToken = createToken('access', { uid });
  const refreshToken = createToken('refresh', { uid });

  return { accessToken, refreshToken };
}

async function getGithubAccessToken(code: string): Promise<any> {
  const GITHUB_AT_URL = 'https://github.com/login/oauth/access_token';
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const query = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;
  const res = await fetch(`${GITHUB_AT_URL}?${query}`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
  });

  return res.json();
}

async function getUserEmailByGithub(accessToken: string): Promise<any> {
  const GITHUB_EMAIL_URL = `https://api.github.com/user`;
  const res = await fetch(GITHUB_EMAIL_URL, {
    method: 'GET',
    headers: {
      accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { login } = await res.json();

  const email = `${login}@githuboauth.io`;
  return email;
}

export default {
  signIn,
  signUp,
  getGithubAccessToken,
  getUserEmailByGithub,
};
