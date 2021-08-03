import { VerifyErrors } from 'jsonwebtoken';

import sequelize, { db } from 'models/db';

import { createToken, verifyToken } from 'utils/jwt';
import errorGenerator from 'utils/error-generator';
import { hashPassword, checkPassword } from 'utils/encryption';

import { TokenType } from 'types/auth';

async function signUp(email: string, password: string): Promise<TokenType> {
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

  const transaction = await sequelize.transaction();

  const hashedPassword = await hashPassword(password);

  const user = await db.User.create(
    {
      email,
      password: hashedPassword,
      is_OAuth: false,
    },
    { transaction },
  );

  const uid = user.getDataValue('id');

  const accessToken = createToken('access', { uid });
  const refreshToken = createToken('refresh', { uid });

  await db.User.update(
    {
      refresh_token: refreshToken,
    },
    {
      where: {
        id: uid,
      },
      transaction,
    },
  );

  await transaction.commit();

  return { accessToken, refreshToken };
}

async function verifyAuth(token: string): Promise<void> {
  return new Promise((resolve, reject) => {
    verifyToken(token, (err: VerifyErrors | null) => {
      if (!err) {
        resolve();
        return;
      }

      switch (err.name) {
        case 'ToeknExpiredError':
          reject(
            errorGenerator({
              message: err.message,
              code: 'auth/token-expired',
            }),
          );
          break;
        case 'JsonWebTokenError':
          reject(
            errorGenerator({
              message: err.message,
              code: 'auth/invalid-token',
            }),
          );
          break;
        default:
          reject(
            errorGenerator({
              message: err.message,
              code: 'auth/invalid-token',
            }),
          );
      }
    });
  });
}

async function signIn(email: string, password: string): Promise<TokenType> {
  const userSnapshot = await db.User.findOne({
    attributes: ['id', 'password'],
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

  const isCorrectPassword = await checkPassword(password, passwordOnDB);

  if (!isCorrectPassword) {
    throw errorGenerator({
      message: 'Wrong password',
      code: 'auth/wrong-password',
    });
  }

  const transaction = await sequelize.transaction();

  const accessToken = createToken('access', { uid });
  const refreshToken = createToken('refresh', { uid });

  await db.User.update(
    {
      refresh_token: refreshToken,
    },
    {
      where: {
        id: uid,
      },
      transaction,
    },
  );

  await transaction.commit();

  return { accessToken, refreshToken };
}

export default {
  signIn,
  signUp,
  verifyAuth,
};
