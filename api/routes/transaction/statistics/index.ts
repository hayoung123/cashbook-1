import express from 'express';

import transactionService from 'services/transaction-statistics';

import { decodeToken, getAccessToken } from 'utils/jwt';
import errorGenerator from 'utils/error-generator';
import errorHandler from 'utils/error-handler';

import { CategoryType } from 'types/common';
import { CategoryStatisticsType, CalendarStatisticsType } from 'types/statistics';

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

    let result: CategoryStatisticsType | number[] | void | CalendarStatisticsType;

    if (type === 'category') {
      result = await transactionService.getCategoryStatistics(uid, year as string, month as string);
    }

    if (type === 'trend') {
      result = await transactionService.getTrendStatistics(
        uid,
        year as string,
        category as CategoryType,
      );
    }

    if (type === 'calendar') {
      result = await transactionService.getCalendarStatistics(uid, year as string, month as string);
    }

    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
