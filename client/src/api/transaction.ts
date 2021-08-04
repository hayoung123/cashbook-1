import { getState } from 'src/lib/observer';

import { TRANSACTION_URL } from 'src/configs/urls';

import { dateState, transactionPriceTypeState } from 'src/store/transaction';

import fetchWrapper from 'src/utils/fetchWrapper';

export const getTransaction = async (): Promise<{ success: boolean; response: any }> => {
  const { year, month } = getState(dateState);
  const { isIncome, isExpenditure } = getState(transactionPriceTypeState);

  const query = `year=${year}&month=${month}&isIncome=${isIncome}&isExpenditure=${isExpenditure}`;

  const data = await fetchWrapper(`${TRANSACTION_URL}?${query}`, 'GET');
  return data;
};

interface TransactionType {
  date: string;
  category: string;
  title: string;
  payment: string;
  price: number;
}

export const createTransaction = async (
  transactionInfo: TransactionType,
): Promise<{ success: boolean; response: any }> => {
  const res = await fetchWrapper(TRANSACTION_URL, 'POST', transactionInfo);
  return res;
};

interface EditTransactionType extends TransactionType {
  id: string;
}

export const editTransaction = async (
  transactionInfo: EditTransactionType,
): Promise<{ success: boolean; response: any }> => {
  const res = await fetchWrapper(
    `${TRANSACTION_URL}/${transactionInfo.id}`,
    'PUT',
    transactionInfo,
  );

  return res;
};

export const deleteTransaction = async (
  id: string,
): Promise<{ success: boolean; response: any }> => {
  const res = await fetchWrapper(`${TRANSACTION_URL}/${id}`, 'DELETE');

  return res;
};
