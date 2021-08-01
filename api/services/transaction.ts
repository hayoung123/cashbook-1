import { Op } from 'sequelize';
import { db } from 'models/db';
import errorGenerator from 'utils/errorGenerator';
import {
  PostTransactionParamType,
  EditTransactionParamType,
  getTransactionParamType,
} from 'types/transaction';

import paymentService from './payment';

//거래내역 조회
async function getTransaction({
  userId,
  year,
  month,
  isIncome,
  isExpenditure,
}: getTransactionParamType): Promise<any> {
  const conditions = [];

  const { startDate, endDate } = getSideDate(+year, +month);
  const transactionSnapshot = await db.Transaction.findAll({
    attributes: ['date', 'category', 'title', 'payment', 'price'],
    where: {
      USERId: userId,
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const transactions = transactionSnapshot.map((item) => {
    return {
      date: item.getDataValue('date'),
      category: item.getDataValue('category'),
      title: item.getDataValue('title'),
      payment: item.getDataValue('payment'),
      price: item.getDataValue('price'),
    };
  });

  return transactions;
}

//거래내역 추가
async function createTransaction({
  userId,
  date,
  category,
  title,
  payment,
  price,
}: PostTransactionParamType): Promise<boolean> {
  const isUserPayment = await checkUserPayment(userId, payment);

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

//거래내역 삭제
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

//거래내역 수정
async function editTransaction(editTransactionData: EditTransactionParamType): Promise<boolean> {
  const { userId, transactionId, date, category, title, payment, price } = editTransactionData;

  const isUserTransaction = await checkUserTransaction(userId, transactionId);

  if (!isUserTransaction) {
    throw errorGenerator({
      message: 'unowned transaction',
      code: 'transaction/unowned-transaction',
    });
  }

  const isUserPayment = await checkUserPayment(userId, payment);

  if (!isUserPayment) {
    throw errorGenerator({
      message: 'unowned payment',
      code: 'payment/unowned-payment',
    });
  }

  await db.Transaction.update(
    {
      USERId: userId,
      date: new Date(date),
      category,
      title,
      payment,
      price,
    },
    {
      where: {
        id: transactionId,
      },
    },
  );

  return true;
}

//유저의 거래수단인지 확인
async function checkUserPayment(userId: string, payment: string): Promise<boolean> {
  const paymentId = await paymentService.getPaymentId(payment);
  if (!paymentId) return false;

  const isUserHasPayment = await paymentService.checkUserHasPayment(userId, paymentId);
  if (!isUserHasPayment) return false;

  return true;
}

//유저의 거래내역인지 확인
async function checkUserTransaction(userId: string, transactionId: string): Promise<boolean> {
  const isUserTransaction = await db.Transaction.count({
    where: {
      USERId: userId,
      id: transactionId,
    },
  });

  return !!isUserTransaction;
}

// function checkValidDate(date: string): boolean {}

function getSideDate(year: number, month: number): { startDate: Date; endDate: Date } {
  const lastDate = new Date(year, month, 0).getDate();
  console.log(year);
  console.log(month);
  console.log(lastDate);
  return {
    startDate: new Date(year, month - 1, 1),
    endDate: new Date(year, month - 1, lastDate),
  };
}

export default { getTransaction, createTransaction, deleteTransaction, editTransaction };
