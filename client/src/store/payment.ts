import { initState } from 'src/lib/observer';

export type PaymentType = Array<string>;

export const userPaymentState = initState({
  key: 'user payment state',
  defaultValue: [],
});
