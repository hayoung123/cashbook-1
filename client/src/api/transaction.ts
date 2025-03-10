import { getState } from 'src/lib/observer';

import { TRANSACTION_URL } from 'src/configs/urls';

import {
  DateType,
  dateState,
  transactionPriceType,
  transactionPriceTypeState,
} from 'src/store/transaction';

import fetchWrapper from 'src/utils/fetchWrapper';

import { RecordInfoType, RecordType } from 'src/type/transaction';
import { responseType } from 'src/type/type';

export const getTransaction = async (): Promise<responseType> => {
  const { year, month } = getState<DateType>(dateState);
  const { isIncome, isExpenditure } = getState<transactionPriceType>(transactionPriceTypeState);

  const query = `year=${year}&month=${month}&isIncome=${isIncome}&isExpenditure=${isExpenditure}`;

  const data = await fetchWrapper(`${TRANSACTION_URL}?${query}`, 'GET');
  return data;
};

export const createTransaction = async (transactionInfo: RecordInfoType): Promise<responseType> => {
  const res = await fetchWrapper(TRANSACTION_URL, 'POST', transactionInfo);
  return res;
};

export const editTransaction = async (transactionInfo: RecordType): Promise<responseType> => {
  const res = await fetchWrapper(
    `${TRANSACTION_URL}/${transactionInfo.id}`,
    'PUT',
    transactionInfo,
  );

  return res;
};

export const deleteTransaction = async (id: string): Promise<responseType> => {
  const res = await fetchWrapper(`${TRANSACTION_URL}/${id}`, 'DELETE');

  return res;
};
