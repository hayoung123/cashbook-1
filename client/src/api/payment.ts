import { PAYMENT_URL } from 'src/configs/urls';

import fetchWrapper from 'src/utils/fetchWrapper';

export const getUserPayment = async (): Promise<{ success: boolean; response: any }> => {
  const data = await fetchWrapper(PAYMENT_URL, 'GET');
  return data;
};
