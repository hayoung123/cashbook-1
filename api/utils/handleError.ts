import { categories } from 'configs/constants';

import { isValidDate } from './date';
import errorGenerator from './error-generator';

export const checkInvalidDate = (date: string): void => {
  if (!isValidDate(date)) {
    throw errorGenerator({
      code: 'req/invalid-date',
      message: 'Required valid date',
    });
  }
};

export const checkInvalidCategory = (category: string): void => {
  if (!categories.find((v) => v === category)) {
    throw errorGenerator({
      code: 'req/invalid-category',
      message: 'Required valid category',
    });
  }
};

export const checkInvalidPrice = (price: number): void => {
  const numberRegex = /^[0-9]/g;
  if (numberRegex.test(price + '')) {
    throw errorGenerator({
      code: 'req/invalid-price',
      message: 'Required valid price',
    });
  }
};
