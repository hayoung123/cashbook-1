import { initState } from 'src/lib/observer';

import { TotalPriceType } from 'src/type/statistics';

export interface CalendarStatisticsType {
  totalIncome: number;
  totalExpenditure: number;
  totalPrice: number;
  statistics: {
    [key: number]: TotalPriceType;
  };
}

export const calendarDataState = initState<CalendarStatisticsType>({
  key: 'calendar statistics state',
  defaultValue: {
    totalIncome: 0,
    totalExpenditure: 0,
    totalPrice: 0,
    statistics: {},
  },
});
