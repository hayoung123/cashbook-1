import express from 'express';

import statistics from './statistics';

import transactionService from 'services/transaction';

import validateToken from 'middlewares/validate-token';

import { decodeToken, getAccessToken } from 'utils/jwt';
import errorHandler from 'utils/error-handler';

import { getTransactionParamType } from 'types/transaction';
import errorGenerator from 'utils/error-generator';

const router = express.Router();

router.use('/statistics', statistics);

/**
 * path: /transaction
 *
 * get: 결제내역 조회
 * delete: 결제내역 삭제
 * put: 결제내역 수정
 * post: 결제내역 추가
 */

router.get('/', validateToken, async (req, res) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken('access', accessToken);

    const { year, month, isIncome = 'false', isExpenditure = 'false', category } = req.query;

    if (!year || !month) {
      throw errorGenerator({
        code: 'req/query-not-found',
        message: 'Required query not found',
      });
    }

    const result = await transactionService.getTransaction({
      userId,
      year,
      month,
      category,
      isIncome: isIncome === 'true',
      isExpenditure: isExpenditure === 'true',
    } as getTransactionParamType);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.delete('/:id', validateToken, async (req, res) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken('access', accessToken);

    const { id: transactionId } = req.params;

    await transactionService.deleteTransaction(userId, transactionId);

    res.status(200).json({});
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.put('/:id', validateToken, async (req, res) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken('access', accessToken);

    const { date, category, title, payment, price } = req.body;

    if (!date || !category || !title || !payment || !price) {
      throw errorGenerator({
        code: 'req/invalid-body',
        message: 'Required body not found',
      });
    }

    const { id: transactionId } = req.params;
    const transactionData = { userId, transactionId, ...req.body };
    await transactionService.editTransaction(transactionData);

    res.status(200).json({});
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.post('/', validateToken, async (req, res) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken('access', accessToken);

    const { date, category, title, payment, price } = req.body;

    if (!date || !category || !title || !payment || !price) {
      throw errorGenerator({
        code: 'req/invalid-body',
        message: 'Required body not found',
      });
    }

    const transactionData = { userId, ...req.body };
    await transactionService.createTransaction(transactionData);

    res.status(200).json({});
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
