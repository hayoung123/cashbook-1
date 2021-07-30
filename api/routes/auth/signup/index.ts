import express, { Request, Response } from 'express';

import errorGenerator from 'utils/errorGenerator';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    // 회원가입 하기
  } catch (err) {
    console.log(err);
  }
});

export default router;
