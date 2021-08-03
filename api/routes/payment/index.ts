import express, { Request, Response } from 'express';

import paymentService from 'services/payment';

import { decodeToken, getAccessToken } from 'utils/jwt';
import errorHandler from 'utils/error-handler';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken(accessToken);

    const result = await paymentService.getUserPayment(userId);
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

//결제수단 삭제
router.delete('/', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken(accessToken);

    const { payment } = req.body;

    const result = await paymentService.deleteUserPayment(userId, payment);
    res.status(200).json({ success: result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

// 결제수단 추가
router.post('/', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken(accessToken);

    const { payment } = req.body;

    const result = await paymentService.createUserPayment(userId, payment);
    res.status(200).json({ success: result });
  } catch (err) {
    console.log(err);
    const { statusCode, errorMessage } = errorHandler(err.code);
    res.status(statusCode).json({ errorMessage });
  }
});

export default router;
