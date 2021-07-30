import { verifyToken } from '../utils/jwt.js';
import errorGenerator from '../utils/errorGenerator.js';

async function validateToken(req, res, next): Promise<void> {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];

    verifyToken(token, (err) => {
      if (!err) {
        next();
        return;
      }

      switch (err.name) {
        case 'ToeknExpiredError':
          throw errorGenerator({
            message: err.message,
            code: 'auth/token-expired',
          });
        case 'JsonWebTokenError':
          throw errorGenerator({
            message: err.message,
            code: 'auth/invalid-token',
          });
        default:
          throw errorGenerator({
            message: err.message,
            code: 'auth/invalid-token',
          });
      }
    });
  } catch (err) {
    console.log(err.code);
    switch (err.code) {
      case 'auth/token-expired':
        res.status(400).json({});
        break;
      case 'auth/invalid-token':
        res.status(400).json({});
        break;
      default:
        res.status(500).json({});
    }
  }
}

export default validateToken;
