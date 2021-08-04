import { getState } from 'src/lib/observer';

import { STATISTICS_URL } from 'src/configs/urls';

import { dateState, DateType } from 'src/store/transaction';

import fetchWrapper from 'src/utils/fetchWrapper';

export const getCalendarStatistics = async (): Promise<{ success: boolean; response: any }> => {
  const { year, month } = getState<DateType>(dateState);

  const query = `type=calendar&year=${year}&month=${month}`;

  const data = await fetchWrapper(`${STATISTICS_URL}?${query}`, 'GET');
  return data;
};
