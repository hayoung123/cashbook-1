import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // 로그아웃
  } catch (err) {
    console.log(err);
  }
});

export default router;
