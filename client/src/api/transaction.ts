import { getState, setState } from 'src/lib/observer';
import { dateState, transactionPriceTypeState, transactionState } from 'src/store/transaction';

export const getTransaction = async (): Promise<void> => {
  const { year, month } = getState(dateState);
  const { isIncome, isExpenditure } = getState(transactionPriceTypeState);

  const token = localStorage.getItem('token');
  const query = `year=${year}&month=${month}&isIncome=${isIncome}&isExpenditure=${isExpenditure}`;

  const res = await fetch(`/transaction?${query}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const { data } = await res.json();
  setState(transactionState)(data);
  return data;
};

export const createTransaction = async () => {};
