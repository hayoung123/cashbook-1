import { getState } from 'src/lib/observer';

import { STATISTICS_URL, TRANSACTION_URL } from 'src/configs/urls';

import { dateState, DateType } from 'src/store/transaction';

import fetchWrapper from 'src/utils/fetchWrapper';
import { responseType } from 'src/type/type';

export const getChartStatistics = async (): Promise<responseType> => {
  const { year, month } = getState<DateType>(dateState);

  const query = `type=category&year=${year}&month=${month}`;

  const data = await fetchWrapper(`${STATISTICS_URL}?${query}`, 'GET');
  return data;
};

export const getTrend = async (category: string): Promise<responseType> => {
  const { year } = getState<DateType>(dateState);

  const query = `type=trend&year=${year}&category=${category}`;

  const data = await fetchWrapper(`${STATISTICS_URL}?${query}`, 'GET');
  return data;
};

export const getCategoryTransaction = async (category: string): Promise<responseType> => {
  const { year, month } = getState<DateType>(dateState);

  const query = `
    year=${year}&month=${month}&category=${category}&isIncome=false&isExpenditure=true
  `;

  const data = await fetchWrapper(`${TRANSACTION_URL}?${query.trim()}`, 'GET');
  return data;
};
