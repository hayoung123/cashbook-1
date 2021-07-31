import errorHandler from '../../utils/errorHandler';
import express, { Request, Response } from 'express';
import { decodeToken, getAccessToken, JwtDecodeType } from './../../utils/jwt';
import paymentService from '../../services/payment';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // 결제수단 불러오기
  } catch (err) {
    console.log(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    // 결제수단 삭제하기
  } catch (err) {
    console.log(err);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const accessToken = getAccessToken(req.headers.authorization);
    const { uid: userId } = decodeToken(accessToken);
    const { payment } = req.body;

    try {
      const result = await paymentService.createPayment(userId, payment);

      res.status(200).json({ success: result });
    } catch (err) {
      console.log(err);
      const { statusCode, errorMessage } = errorHandler(err.code);
      res.status(statusCode).json({ errorMessage });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
