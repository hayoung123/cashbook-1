import { initState } from 'src/lib/observer';

export interface DateType {
  year: number;
  month: number;
}

export const dateState = initState<DateType>({
  key: 'dateState',
  defaultValue: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
});

export interface transactionPriceType {
  isIncome: boolean;
  isExpenditure: boolean;
}
export const transactionPriceTypeState = initState<transactionPriceType>({
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
  transaction: RecordType[];
}

export interface transactionType {
  totalCount: number;
  totalIncome: number;
  totalExpenditure: number;
  transaction: DayRecordsType[];
}

export const transactionState = initState<transactionType>({
  key: 'transactionState',
  defaultValue: {
    totalCount: 0,
    totalIncome: 0,
    totalExpenditure: 0,
    transaction: [],
  },
});
