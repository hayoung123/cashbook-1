import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 결제내역 통계 불러오기
  } catch (err) {
    console.log(err);
  }
});

export default router;
