import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // 로그인하기
  } catch (err) {
    console.log(err);
  }
});

export default router;
