import { Op } from 'sequelize';

import { db } from 'models/db';

import paymentService from './payment';

import errorGenerator from 'utils/error-generator';
import { getSideDate, parseTransactionByDate } from 'utils/date';

import {
  PostTransactionParamType,
  EditTransactionParamType,
  getTransactionParamType,
  TransactionRecordType,
  TransactionDataType,
} from 'types/transaction';

// 거래내역 조회
async function getTransaction({
  userId,
  year,
  month,
  isIncome,
  isExpenditure,
}: getTransactionParamType): Promise<TransactionDataType> {
  const { startDate, endDate } = getSideDate(+year, +month);
  let totalIncome = 0;
  let totalExpenditure = 0;

  const transactionSnapshot = await db.Transaction.findAll({
    attributes: ['id', 'date', 'category', 'title', 'payment', 'price'],
    where: {
      USERId: userId,
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['date', 'DESC']],
  });

  let transactions: TransactionRecordType[] = transactionSnapshot.map((item) => {
    return {
      id: item.getDataValue('id'),
      date: item.getDataValue('date'),
      category: item.getDataValue('category'),
      title: item.getDataValue('title'),
      payment: item.getDataValue('payment'),
      price: +item.getDataValue('price'),
    };
  });

  transactions.forEach((record) => {
    if (record.price > 0) totalIncome += record.price;
    else totalExpenditure += record.price;
  });

  if (!isIncome) transactions = transactions.filter(({ price }) => price < 0);
  if (!isExpenditure) transactions = transactions.filter(({ price }) => price > 0);

  const parsedTransaction = parseTransactionByDate(transactions);

  return {
    totalCount: transactions.length,
    totalIncome,
    totalExpenditure,
    transaction: parsedTransaction,
  };
}

// 거래내역 추가
async function createTransaction({
  userId,
  date,
  category,
  title,
  payment,
  price,
}: PostTransactionParamType): Promise<boolean> {
  const isUserPayment = await checkUserPayment(userId, payment);

  //TODO : date Validation
  //TODO : category Validation
  //TODO : price Validation

  if (!isUserPayment) {
    throw errorGenerator({
      message: 'unowned payment',
      code: 'payment/unowned-payment',
    });
  }

  await db.Transaction.create({
    USERId: userId,
    date: new Date(date).toLocaleDateString(),
    category,
    title,
    payment,
    price,
  });

  return true;
}

// 거래내역 삭제
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

// 거래내역 수정
async function editTransaction(editTransactionData: EditTransactionParamType): Promise<boolean> {
  const { userId, transactionId, date, category, title, payment, price } = editTransactionData;

  const isUserTransaction = await checkUserTransaction(userId, transactionId);

  //TODO : date Validation
  //TODO : category Validation
  //TODO : price Validation

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
      date: new Date(date).toLocaleDateString(),
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

// 유저의 거래수단인지 확인
async function checkUserPayment(userId: string, payment: string): Promise<boolean> {
  const paymentId = await paymentService.getPaymentId(payment);
  if (!paymentId) return false;

  const isUserHasPayment = await paymentService.checkUserHasPayment(userId, paymentId);
  if (!isUserHasPayment) return false;

  return true;
}

// 유저의 거래내역인지 확인
async function checkUserTransaction(userId: string, transactionId: string): Promise<boolean> {
  const isUserTransaction = await db.Transaction.count({
    where: {
      USERId: userId,
      id: transactionId,
    },
  });

  return !!isUserTransaction;
}

// TODO: 날짜 validation 추가
// function checkValidDate(date: string): boolean {}

export default {
  getTransaction,
  createTransaction,
  deleteTransaction,
  editTransaction,
};
