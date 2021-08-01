export interface getTransactionParamType {
  userId: string;
  year: string;
  month: string;
  isIncome: boolean;
  isExpenditure: boolean;
}

interface TransactionRecordType {
  date: string;
  category: string;
  title: string;
  payment: string;
  price: number;
}

export interface PostTransactionParamType extends TransactionRecordType {
  userId: string;
}

export interface EditTransactionParamType extends TransactionRecordType {
  userId: string;
  transactionId: string;
}

// export interface DayTransactionListType {
//   date: string;
//   transaction: Array<TransactionRecordType>;
// }
export type DayTransactionListType = Array<TransactionRecordType>;
