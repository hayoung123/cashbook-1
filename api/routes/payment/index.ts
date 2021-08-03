import express, { Request, Response } from 'express';

import paymentService from 'services/payment';

import { decodeToken, getAccessToken } from 'utils/jwt';
import errorHandler from 'utils/error-handler';
import errorGenerator from 'utils/error-generator';

const router = express.Router();

/**
 * path: /payment
 *
 * get: 사용자 결제수단 조회
 * delete: 결제수단 삭제
 * post: 결제수단 추가
 */

router.get('/', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken(accessToken);

    const result = await paymentService.getUserPayment(userId);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken(accessToken);

    const { payment } = req.body;

    if (!payment) {
      throw errorGenerator({
        message: 'invalid-body',
        code: 'req/invalid-body',
      });
    }

    const result = await paymentService.deleteUserPayment(userId, payment);
    res.status(200).json({});
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken(accessToken);

    const { payment } = req.body;

    if (!payment) {
      throw errorGenerator({
        message: 'invalid-body',
        code: 'req/invalid-body',
      });
    }

    const result = await paymentService.createUserPayment(userId, payment);
    res.status(200).json({});
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
