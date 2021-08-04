import { initState } from 'src/lib/observer';

import { CategoryStatisticsType } from 'src/type/statistics';

export interface StatisticsType {
  totalExpenditure: number;
  categoryList: CategoryStatisticsType[];
}

export const statisticsState = initState<StatisticsType>({
  key: 'statisticsState',
  defaultValue: {
    totalExpenditure: 0,
    categoryList: [],
  },
});

export interface TrendType {
  yearlyTrend: number[];
}

export const trendState = initState<TrendType>({
  key: 'trendState',
  defaultValue: {
    yearlyTrend: [],
  },
});

export interface currentCategoryType {
  currentCategory: string;
}

export const currentCategoryState = initState<currentCategoryType>({
  key: 'currentCategoryState',
  defaultValue: {
    currentCategory: '',
  },
});
