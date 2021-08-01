import { Op } from 'sequelize';

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

interface EditTransactionDataType extends TransactionDataType {
  transactionId: string;
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
}: TransactionDataType): Promise<boolean> {
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
async function editTransaction(editTransactionData: EditTransactionDataType): Promise<boolean> {
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

async function getStatistics(
  uid: string,
  type: string,
  year: string,
  month: string,
  category: string,
): Promise<C | any[] | void> {
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
        // TODO: 수입 지출 구분방법에 따라 달라져야 함
        // price: {
        //   [Op.lte]: 0,
        // },
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
        category,
        date: {
          [Op.lte]: new Date(`${year}-12-31`),
          [Op.gte]: new Date(`${year}-1-1`),
        },
      },
    });

    const trendStatistics = new Array(13).fill(0);

    transactionSnapshot.forEach((t) => {
      const price = t.getDataValue('price');
      const date = t.getDataValue('date');
      const month = new Date(date).getMonth();

      trendStatistics[month] += +price;
    });

    return trendStatistics;
  }
  return;
}

export default { createTransaction, deleteTransaction, editTransaction, getStatistics };
