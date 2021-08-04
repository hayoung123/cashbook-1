import { initState } from 'src/lib/observer';

export type PaymentType = string[];

export const userPaymentState = initState<PaymentType>({
  key: 'user payment state',
  defaultValue: [],
});
