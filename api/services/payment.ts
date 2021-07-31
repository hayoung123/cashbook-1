import { db } from '../models/db';
import errorGenerator from '../utils/errorGenerator';

//TODO: 있는지 확인하는 사이에 누가 넣거나 하면 어떻게 해결해야될까? 트랜젝션??
//중복은 알아서 검사할텐데 아래처럼 따로 처리를 해줘야되나?
async function createUserPayment(userId: string, paymentName: string): Promise<boolean> {
  const paymentId = await createPayment(paymentName);

  const isUserHasPayment = await checkUserHasPayment(userId, paymentId);

  if (isUserHasPayment) {
    throw errorGenerator({
      message: 'owned payment',
      code: 'payment/owned-payment',
    });
  }

  await db.USER_has_PAYMENT.create({
    USERId: userId,
    PAYMENTId: paymentId,
  });

  return true;
}

async function deleteUserPayment(userId: string, paymentName: string): Promise<boolean> {
  const paymentId = await getPaymentId(paymentName);

  if (!paymentId) {
    throw errorGenerator({
      message: 'nonexistent payment',
      code: 'payment/nonexistent-payment',
    });
  }

  const isUserHasPayment = await checkUserHasPayment(userId, paymentId);

  if (!isUserHasPayment) {
    throw errorGenerator({
      message: 'unowned payment',
      code: 'payment/unowned-payment',
    });
  }

  await db.USER_has_PAYMENT.destroy({
    where: {
      USERId: userId,
      PAYMENTId: paymentId,
    },
  });

  return true;
}

async function getPaymentId(paymentName: string): Promise<string | null> {
  const paymentSnapshot = await db.Payment.findOne({
    attributes: ['id', 'name'],
    where: {
      name: paymentName,
    },
  });
  console.log(paymentSnapshot);
  if (!paymentSnapshot) return null;

  const paymentId = paymentSnapshot.getDataValue('id');
  return paymentId;
}

//결제 수단 체크 후 삽입 그리고 id 반환 / 이미 존재시 바로 Id 반환
async function createPayment(paymentName: string): Promise<string> {
  const paymentId = await getPaymentId(paymentName);

  if (paymentId) return paymentId;

  const result = await db.Payment.create({
    name: paymentName,
  });

  return result.getDataValue('id');
}

async function checkUserHasPayment(userId: string, paymentId: string): Promise<boolean> {
  const isUserHasPayment = await db.USER_has_PAYMENT.count({
    where: {
      USERId: userId,
      PAYMENTId: paymentId,
    },
  });

  return !!isUserHasPayment;
}

export default {
  createUserPayment,
  deleteUserPayment,
};
