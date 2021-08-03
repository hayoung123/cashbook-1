import { Op } from 'sequelize';

import { db } from 'models/db';

import errorGenerator from 'utils/error-generator';
import { getSideDate } from 'utils/date';

import { CategoryType } from 'types/common';
import { CategoryStatisticsType, CalendarStatisticsType } from 'types/statistics';

async function getCategoryStatistics(
  uid: string,
  year: string,
  month: string,
): Promise<CategoryStatisticsType> {
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

  const categoryStatistics: CategoryStatisticsType = {
    life: 0,
    food: 0,
    transport: 0,
    shop: 0,
    health: 0,
    culture: 0,
    etc: 0,
  };

  // TODO: 불필요타입제거
  transactionSnapshot.forEach((t) => {
    const category: CategoryType = t.getDataValue('category');
    const price: number = +t.getDataValue('price');

    categoryStatistics[category] += price;
  });

  return categoryStatistics;
}

async function getTrendStatistics(
  uid: string,
  year: string,
  category: CategoryType,
): Promise<number[]> {
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
  getCategoryStatistics,
  getTrendStatistics,
  getCalendarStatistics,
};
