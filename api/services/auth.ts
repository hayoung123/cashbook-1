import sequelize, { db } from 'models/db';
import errorGenerator from 'utils/errorGenerator';
import { createToken } from 'utils/jwt';
import hashPassword from 'utils/hashPassword';

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

export default {
  signUp,
};
