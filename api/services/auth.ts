import { VerifyErrors } from 'jsonwebtoken';

import sequelize, { db } from 'models/db';
import errorGenerator from 'utils/errorGenerator';
import { createToken, verifyToken } from 'utils/jwt';
import { hashPassword } from 'utils/encryption';

interface SignUpType {
  accessToken: string;
  refreshToken: string;
}

async function signUp(email: string, password: string): Promise<SignUpType> {
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

export default {
  signUp,
  verifyAuth,
};
