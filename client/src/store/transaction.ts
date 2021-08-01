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
