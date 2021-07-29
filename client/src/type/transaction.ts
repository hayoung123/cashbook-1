export type PaymentType = {
  category: string;
  title: string;
  method: string;
  price: number;
};

export type DayTransactionType = {
  date: string;
  transaction: Array<PaymentType>;
};

export type TransactionType = Array<DayTransactionType>;
