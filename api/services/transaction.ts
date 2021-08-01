import { db } from 'models/db';
import errorGenerator from 'utils/errorGenerator';

import paymentService from './payment';

interface TransactionDataType {
  userId: string;
  date: string;
  category: string;
  title: string;
  payment: string;
  price: number;
}

async function createTransaction({
  userId,
  date,
  category,
  title,
  payment,
  price,
}: TransactionDataType): Promise<boolean> {
  const isUserPayment = checkUserPayment(userId, payment);

  if (!isUserPayment) {
    throw errorGenerator({
      message: 'unowned payment',
      code: 'payment/unowned-payment',
    });
  }

  await db.Transaction.create({
    USERId: userId,
    date: new Date(date),
    category,
    title,
    payment,
    price,
  });

  return true;
}

async function deleteTransaction(userId: string, transactionId: string): Promise<boolean> {
  const isUserTransaction = await checkUserTransaction(userId, transactionId);

  if (!isUserTransaction) {
    throw errorGenerator({
      message: 'unowned transaction',
      code: 'transaction/unowned-transaction',
    });
  }

  await db.Transaction.destroy({
    where: {
      id: transactionId,
    },
  });

  return true;
}

async function checkUserPayment(userId: string, payment: string): Promise<boolean> {
  const paymentId = await paymentService.getPaymentId(payment);
  if (!paymentId) return false;

  const isUserHasPayment = await paymentService.checkUserHasPayment(userId, paymentId);
  if (!isUserHasPayment) return false;

  return true;
}

async function checkUserTransaction(userId: string, transactionId: string): Promise<boolean> {
  const isUserTransaction = await db.Transaction.count({
    where: {
      USERId: userId,
      id: transactionId,
    },
  });

  return !!isUserTransaction;
}

export default { createTransaction, deleteTransaction };
