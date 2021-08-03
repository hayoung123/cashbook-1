import express from 'express';

import transactionService from 'services/transaction';

import { decodeToken, getAccessToken } from 'utils/jwt';
import errorGenerator from 'utils/error-generator';
import errorHandler from 'utils/error-handler';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, year, month, category } = req.query;

    if (!type) {
      throw errorGenerator({
        code: 'req/query-not-found',
        message: 'Required query not found',
      });
    }

    if (type !== 'trend' && type !== 'category' && type !== 'calendar') {
      throw errorGenerator({
        code: 'req/query-not-found',
        message: 'Required query not found',
      });
    }

    const token = getAccessToken(req.headers.authorization);
    const { uid } = decodeToken(token);

    const result = await transactionService.getStatistics(
      uid,
      type,
      `${year}`,
      `${month}`,
      `${category}`,
    );

    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
