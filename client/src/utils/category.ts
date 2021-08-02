import { CATEGORY__INFO } from 'src/constant/category';

export const getCategoryKey = (category: string): string => {
  for (const [key, { name }] of Object.entries(CATEGORY__INFO)) {
    if (category === name) return key;
  }
  return '';
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY__INFO[category].color;
};
