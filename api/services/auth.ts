import sequelize, { db } from 'models/db';
import errorGenerator from 'utils/errorGenerator';
import { createToken } from 'utils/jwt';
import { hashPassword, checkPassword } from 'utils/encryption';

interface TokenType {
  accessToken: string;
  refreshToken: string;
}

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
};
