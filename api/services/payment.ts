import { db } from '../models/db';
import errorGenerator from '../utils/errorGenerator';

//TODO: 있는지 확인하는 사이에 누가 넣거나 하면 어떻게 해결해야될까? 트랜젝션??
//중복은 알아서 검사할텐데 아래처럼 따로 처리를 해줘야되나?
async function createPayment(userId: string, payment: string): Promise<boolean> {
  const isExistPayment = await db.Payment.count({
    where: {
      name: payment,
    },
  });
  if (!isExistPayment) {
    throw errorGenerator({
      message: 'nonexistent payment',
      code: 'payment/nonexistent-payment',
    });
  }

  const isUserHasPayment = await db.USER_has_PAYMENT.count({
    where: {
      USERId: userId,
      PAYMENTId: payment,
    },
  });
  if (isUserHasPayment) {
    throw errorGenerator({
      message: 'owned payment',
      code: 'payment/owned-payment',
    });
  }

  await db.USER_has_PAYMENT.create({
    USERId: userId,
    PAYMENTId: payment,
  });

  return true;
}

export default {
  createPayment,
};
