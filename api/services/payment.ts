import { Op } from 'sequelize';

import { db } from 'models/db';

import errorGenerator from 'utils/error-generator';

async function getUserPayment(userId: string): Promise<string[]> {
  const userHasPaymentSnapshot = await db.USER_has_PAYMENT.findAll({
    attributes: ['PAYMENTId'],
    where: {
      USERId: userId,
    },
  });

  const paymentIds = userHasPaymentSnapshot.map((item) => item.getDataValue('PAYMENTId'));

  const paymentSnapshot = await db.Payment.findAll({
    attributes: ['name'],
    where: {
      id: {
        [Op.in]: paymentIds,
      },
    },
  });

  const paymentNames = paymentSnapshot.map((item) => item.getDataValue('name'));

  return paymentNames;
}

//TODO: 있는지 확인하는 사이에 누가 넣거나 하면 어떻게 해결해야될까? 트랜젝션??
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
  if (!paymentSnapshot) return null;

  const paymentId = paymentSnapshot.getDataValue('id');
  return paymentId;
}

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
  getUserPayment,
  createUserPayment,
  deleteUserPayment,
  checkUserHasPayment,
  getPaymentId,
};
