import { getState } from 'src/lib/observer';

import { STATISTICS_URL } from 'src/configs/urls';

import { dateState, DateType } from 'src/store/transaction';

import fetchWrapper from 'src/utils/fetchWrapper';

export const getChartStatistics = async (): Promise<{ success: boolean; response: any }> => {
  const { year, month } = getState<DateType>(dateState);

  const query = `type=category&year=${year}&month=${month}`;

  const data = await fetchWrapper(`${STATISTICS_URL}?${query}`, 'GET');
  return data;
};

export const getTrend = async (category: string): Promise<{ success: boolean; response: any }> => {
  const { year } = getState<DateType>(dateState);

  const query = `type=trend&year=${year}&category=${category}`;

  const data = await fetchWrapper(`${STATISTICS_URL}?${query}`, 'GET');
  return data;
};
