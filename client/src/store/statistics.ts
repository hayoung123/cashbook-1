import { initState } from 'src/lib/observer';

export interface CategoryStatisticsType {
  category: string;
  expenditure: number;
}

export interface StatisticsType {
  totalExpenditure: number;
  categoryList: CategoryStatisticsType[];
}

export interface TrendType {
  yearlyTrend: number[];
}

export interface currentCategoryType {
  currentCategory: string;
}

export const statisticsState = initState<StatisticsType>({
  key: 'statisticsState',
  defaultValue: {
    totalExpenditure: 0,
    categoryList: [],
  },
});

export const trendState = initState<TrendType>({
  key: 'trendState',
  defaultValue: {
    yearlyTrend: [],
  },
});

export const currentCategoryState = initState<currentCategoryType>({
  key: 'currentCategoryState',
  defaultValue: {
    currentCategory: '',
  },
});
