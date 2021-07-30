import express from 'express';

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

router.post('/', async (req, res, next) => {
  try {
    // 결제수단 추가하기
  } catch (err) {
    console.log(err);
  }
});

export default router;
