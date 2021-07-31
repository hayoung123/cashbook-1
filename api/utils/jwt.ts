import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

interface OptionType {
  uid: string;
}

const ACCESS_TOKEN_EXPIRE_DATE = Math.floor(Date.now() / 1000) + 60 * 60 * 12;
const REFRESH_TOKEN_EXPIRE_DATE = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

const secret = process.env.TOKEN_SECRET || '';

export const createToken = (type: 'access' | 'refresh', option: OptionType): string => {
  const expireDate = type === 'access' ? ACCESS_TOKEN_EXPIRE_DATE : REFRESH_TOKEN_EXPIRE_DATE;

  const token = jwt.sign(
    {
      exp: expireDate,
      ...option,
    },
    secret,
  );

  return token;
};

export const decodeToken = (token: string): string | JwtPayload => {
  const decoded = jwt.verify(token, secret);

  return decoded;
};

export const verifyToken = (
  token: string,
  errCallback: (err: VerifyErrors | null) => void,
): void => {
  jwt.verify(token, secret, (err) => {
    errCallback(err);
  });
};

export const getAccessToken = (authorization: string | void): string | void => {
  if (!authorization) return;
  return authorization.split('Bearer ')[1];
};
