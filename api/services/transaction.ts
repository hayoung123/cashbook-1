import { Op } from 'sequelize';
import { db } from 'models/db';
import errorGenerator from 'utils/error-generator';
import {
  PostTransactionParamType,
  EditTransactionParamType,
  getTransactionParamType,
  TransactionRecordType,
  DayTransactionType,
  CalendarStatisticsType,
} from 'types/transaction';

import paymentService from './payment';
/**
 * {
 * totalIncome:0000,
 * totalExpenditure:0000,
 * transaction: [
 *    {
 *       date:string,
 *       transaction ;[{...},{...},{...}],
 *    },
 *    {
 *       ...
 *    }
 *  ]
 * }
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

type Category = 'life' | 'food' | 'transport' | 'shop' | 'health' | 'culture' | 'etc';

type C = {
  [key in Category]: number;
};

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

// TODO: 날짜 validation 추가
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

  if (dayRecord.date) result.push(dayRecord);

  return result;
};

async function getStatistics(
  uid: string,
  type: string,
  year: string,
  month: string,
  category: string,
): Promise<C | any[] | void | CalendarStatisticsType> {
  if (type === 'category') {
    if (!year || !month) {
      throw errorGenerator({
        code: 'req/query-not-found',
        message: 'Required query not found',
      });
    }
    const currentMonthStart = `${year}-${month}`;
    const currentMonthEnd = `${year}-${+month + 1}`;

    const transactionSnapshot = await db.Transaction.findAll({
      attributes: ['category', 'price'],
      where: {
        USERId: uid,
        price: {
          [Op.lte]: 0,
        },
        date: {
          [Op.lt]: new Date(currentMonthEnd),
          [Op.gte]: new Date(currentMonthStart),
        },
      },
    });

    const categoryStatistics: C = {
      life: 0,
      food: 0,
      transport: 0,
      shop: 0,
      health: 0,
      culture: 0,
      etc: 0,
    };

    transactionSnapshot.forEach((t) => {
      const category: Category = t.getDataValue('category');
      const price: number = +t.getDataValue('price');

      categoryStatistics[category] += price;
    });

    return categoryStatistics;
  }

  if (type === 'trend') {
    if (!year || !category) {
      throw errorGenerator({
        code: 'req/query-not-found',
        message: 'Required query not found',
      });
    }

    const transactionSnapshot = await db.Transaction.findAll({
      attributes: ['date', 'price'],
      where: {
        USERId: uid,
        price: {
          [Op.lte]: 0,
        },
        category,
        date: {
          [Op.lte]: new Date(`${year}-12-31`),
          [Op.gte]: new Date(`${year}-1-1`),
        },
      },
    });

    const trendStatistics = new Array(12).fill(0);

    transactionSnapshot.forEach((t) => {
      const price = t.getDataValue('price');
      const date = t.getDataValue('date');
      const month = new Date(date).getMonth();

      trendStatistics[month - 1] += +price;
    });

    return trendStatistics;
  }
  if (type === 'calendar') {
    return await getCalendarStatistics(uid, year, month);
  }
  return;
}

//todo 반환값 바꾸기
async function getCalendarStatistics(
  uid: string,
  year: string,
  month: string,
): Promise<CalendarStatisticsType> {
  if (!year || !month) {
    throw errorGenerator({
      code: 'req/query-not-found',
      message: 'Required query not found',
    });
  }
  const result: CalendarStatisticsType = {
    totalIncome: 0,
    totalExpenditure: 0,
    totalPrice: 0,
    statistics: {},
  };

  const { startDate, endDate } = getSideDate(+year, +month);
  const transactionSnapshot = await db.Transaction.findAll({
    attributes: ['date', 'price'],
    where: {
      USERId: uid,
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['date', 'DESC']],
  });

  transactionSnapshot.forEach((record) => {
    const date = new Date(record.getDataValue('date')).getDate();
    const price = +record.getDataValue('price');

    if (price > 0) {
      result.totalIncome += price;
      if (date in result.statistics) {
        result.statistics[date].income += price;
        result.statistics[date].total += price;
      } else {
        result.statistics[date] = { income: price, expenditure: 0, total: price };
      }
    } else {
      result.totalExpenditure += +price;
      if (date in result.statistics) {
        result.statistics[date].expenditure += price;
        result.statistics[date].total += price;
      } else {
        result.statistics[date] = { income: 0, expenditure: price, total: price };
      }
    }
  });

  result.totalPrice = result.totalIncome + result.totalExpenditure;

  return result;
}

export default {
  getTransaction,
  createTransaction,
  deleteTransaction,
  editTransaction,
  getStatistics,
};
