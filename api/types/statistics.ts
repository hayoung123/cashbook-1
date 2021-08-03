import { CategoryType } from 'types/common';

export type CategoryStatisticsType = {
  [key in CategoryType]: number;
};

export interface CalendarStatisticsType {
  totalIncome: number;
  totalExpenditure: number;
  totalPrice: number;
  statistics: {
    [key: number]: {
      income: number;
      expenditure: number;
      total: number;
    };
  };
}
