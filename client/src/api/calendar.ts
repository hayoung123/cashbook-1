import { STATISTICS_URL } from './../configs/urls';
import { getState } from 'src/lib/observer';
import { dateState } from 'src/store/transaction';
import fetchWrapper from 'src/utils/fetchWrapper';

export const getCalendarStatistics = async (): Promise<{ success: boolean; response: any }> => {
  const { year, month } = getState(dateState);

  const query = `type=calendar&year=${year}&month=${month}`;

  const data = await fetchWrapper(`${STATISTICS_URL}?${query}`, 'GET');
  return data;
};
