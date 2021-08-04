import { getState } from 'src/lib/observer';

import { STATISTICS_URL } from 'src/configs/urls';

import { dateState, DateType } from 'src/store/transaction';

import fetchWrapper from 'src/utils/fetchWrapper';

import { responseType } from 'src/type/type';

export const getCalendarStatistics = async (): Promise<responseType> => {
  const { year, month } = getState<DateType>(dateState);

  const query = `type=calendar&year=${year}&month=${month}`;

  const data = await fetchWrapper(`${STATISTICS_URL}?${query}`, 'GET');
  return data;
};
