import { TRANSACTION_URL } from './../configs/urls';
import { getState } from 'src/lib/observer';
import { dateState, transactionPriceTypeState } from 'src/store/transaction';
import fetchWrapper from 'src/utils/fetchWrapper';

export const getTransaction = async (): Promise<{ success: boolean; response: any }> => {
  const { year, month } = getState(dateState);
  const { isIncome, isExpenditure } = getState(transactionPriceTypeState);

  const query = `year=${year}&month=${month}&isIncome=${isIncome}&isExpenditure=${isExpenditure}`;

  const data = await fetchWrapper(`${TRANSACTION_URL}?${query}`, 'GET');
  return data;
};

export const createTransaction = async () => {};
