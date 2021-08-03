import { CategoryType } from 'types/common';

export type CategoryStatisticsType = {
  [key in CategoryType]: number;
};
