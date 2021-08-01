import { Op } from 'sequelize';
import { db } from 'models/db';
import errorGenerator from 'utils/errorGenerator';
import {
  PostTransactionParamType,
  EditTransactionParamType,
  getTransactionParamType,
  TransactionRecordType,
  DayTransactionType,
} from 'types/transaction';

import paymentService from './payment';
/**
 * [
 *   {
 *      date:string,
 *      transaction ;[{...},{...},{...}],
 *      totalIncome: 0000,
 *      totalExpenditure:0000
 *   },
 *   {
 *      ...
 *   }
 * ]
 *
 */
//거래내역 조회
async function getTransaction({
  userId,
  year,
  month,
  isIncome,
  isExpenditure,
}: getTransactionParamType): Promise<any> {
  const { startDate, endDate } = getSideDate(+year, +month);

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
      price: item.getDataValue('price'),
    };
  });

  if (!isIncome) transactions = transactions.filter(({ price }) => price < 0);
  if (!isExpenditure) transactions = transactions.filter(({ price }) => price > 0);

  const parsedTransaction = parseTransactionByDate(transactions);

  return parsedTransaction;
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

//날짜 시작한날 끝날 구하기 - util로 이동
function getSideDate(year: number, month: number): { startDate: Date; endDate: Date } {
  const lastDate = new Date(year, month, 0).getDate();
  return {
    startDate: new Date(year, month - 1, 1),
    endDate: new Date(year, month - 1, lastDate),
  };
}
//거래내역 파싱 - util로 이동
const parseTransactionByDate = (
  transactions: Array<TransactionRecordType>,
): Array<DayTransactionType> => {
  const result: Array<DayTransactionType> = [];
  let dayRecord: any = {};

  transactions.forEach((record) => {
    if (dayRecord.date === record.date) {
      dayRecord.transaction.push(record);
      return;
    }
    if (dayRecord.date) {
      result.push(dayRecord);
      dayRecord = {};
    }
    dayRecord.date = record.date;
    dayRecord.transaction = [record];
  });

  result.push(dayRecord);

  return result;
};

export default { getTransaction, createTransaction, deleteTransaction, editTransaction };
