import express from 'express';

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

router.get('/', async (req, res, next) => {
  try {
    // 결제내역 불러오기
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    // 결제내역 삭제하기
  } catch (err) {
    console.log(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    // 결제내역 수정하기
  } catch (err) {
    console.log(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // 결제내역 추가하기
  } catch (err) {
    console.log(err);
  }
});

router.use('/statistics', statistics);

export default router;
