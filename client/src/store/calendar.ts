import { initState } from 'src/lib/observer';

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

export const calendarDataState = initState({
  key: 'calendar date state',
  defaultValue: {
    totalIncome: 0,
    totalExpenditure: 0,
    totalPrice: 0,
    statistics: {},
  },
});
