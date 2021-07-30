import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRE_DATE = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

export const createToken = (option) => {
  const token = jwt.sign(
    {
      exp: ACCESS_TOKEN_EXPIRE_DATE,
      ...option,
    },
    process.env.ACCESS_TOKEN_SECRET,
  );

  return token;
};

export const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  return decoded;
};

export const verifyToken = (token, errCallback) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    errCallback(err);
  });
};
