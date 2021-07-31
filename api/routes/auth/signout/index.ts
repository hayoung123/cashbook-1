import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    res.clearCookie('_rt');
    res.status(200).json({});
  } catch (err) {
    console.log(err);
  }
});

export default router;
