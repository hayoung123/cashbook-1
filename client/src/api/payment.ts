import { PAYMENT_URL } from 'src/configs/urls';

import fetchWrapper from 'src/utils/fetchWrapper';

import { responseType } from 'src/type/type';

export const getUserPayment = async (): Promise<responseType> => {
  const result = await fetchWrapper(PAYMENT_URL, 'GET');
  return result;
};

export const createUserPayment = async (payment: string): Promise<responseType> => {
  const result = await fetchWrapper(PAYMENT_URL, 'POST', { payment });
  return result;
};
