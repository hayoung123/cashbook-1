import express from 'express';
import errorHandler from 'utils/errorHandler';

import transactionService from 'services/transaction';
import statistics from './statistics';

const router = express.Router();

/**
 * 메인 페이지 (/transaction?year=2021&month=7)
 * 수입 지출 / 연 월 - isIncome isExpenditure / year month
 *
 * 달력 페이지 (/transaction/sum?type=calendar&year=2021&month=7)
 * 월 + 지출,수입,총합 : {2:{지출: 수입: 총합: }, 18: {지출: 수입: 총합: }}
 *
 * 차트 페이지
 * 월 + category + 지출 총합: {categoryname:price} - 원 그래프
 *  /transaction/sum?type=category&year=2021&month=7
 * 연 + category + 지출 총합: Array - 선 그래프
 *  /transaction/sum?type=trend&year=2021&category=food
 */

// 결제내역 불러오기
router.get('/', async (req, res, next) => {
  try {
    // const accessToken = getAccessToken(req.headers.authorization);
    // const { uid: userId } = decodeToken(accessToken);
    const userId = process.env.TEST_ID as string;
    const { year, month, isIncome = true, isExpenditure = true } = req.params;
    const result = await transactionService.getTransaction({
      year,
      month,
      isIncome,
      isExpenditure,
    });

    res.status.json({ data: result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

// 결제내역 삭제하기
router.delete('/:id', async (req, res, next) => {
  try {
    // const accessToken = getAccessToken(req.headers.authorization);
    // const { uid: userId } = decodeToken(accessToken);
    const userId = process.env.TEST_ID as string;

    const { id: transactionId } = req.params;

    const result = await transactionService.deleteTransaction(userId, transactionId);

    res.status(200).json({ success: result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

// 결제내역 수정하기
router.put('/:id', async (req, res, next) => {
  try {
    // const accessToken = getAccessToken(req.headers.authorization);
    // const { uid: userId } = decodeToken(accessToken);
    const userId = process.env.TEST_ID as string;
    const { id: transactionId } = req.params;
    const transactionData = { userId, transactionId, ...req.body };
    const result = await transactionService.editTransaction(transactionData);

    res.status(200).json({ success: result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

// 결제내역 추가하기
router.post('/', async (req, res, next) => {
  try {
    // const accessToken = getAccessToken(req.headers.authorization);
    // const { uid: userId } = decodeToken(accessToken);
    const userId = process.env.TEST_ID as string;
    const transactionData = { userId, ...req.body };
    const result = await transactionService.createTransaction(transactionData);

    res.status(200).json({ success: result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.use('/statistics', statistics);

export default router;
