import { initState } from 'src/lib/observer';

export interface DateType {
  year: number;
  month: number;
}

export const dateState = initState({
  key: 'dateState',
  defaultValue: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
});

export interface transactionPriceType {
  isIncome: boolean;
  isExpenditure: boolean;
}
export const transactionPriceTypeState = initState({
  key: 'transactionTypeState-isIncome/isExpenditure',
  defaultValue: { isIncome: true, isExpenditure: true },
});

export interface RecordType {
  id: string;
  date: string;
  category: string;
  title: string;
  payment: string;
  price: number;
}
export interface DayRecordsType {
  date: string;
  transaction: Array<RecordType>;
}

export interface transactionType {
  totalCount: number;
  totalIncome: number;
  totalExpenditure: number;
  transaction: Array<DayRecordsType>;
}

export const transactionState = initState({
  key: 'transactionState',
  defaultValue: {
    totalCount: 0,
    totalIncome: 0,
    totalExpenditure: 0,
    transaction: [],
  },
});
