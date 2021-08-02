import { CATEGORY__INFO } from 'src/constant/category';

export const getCategoryColor = (category: string): string => {
  return CATEGORY__INFO[category].color;
};
