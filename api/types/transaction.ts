import { CategoryType } from './common';

export interface getTransactionParamType {
  userId: string;
  year: string;
  month: string;
  isIncome: boolean;
  isExpenditure: boolean;
  category: string;
}

export interface TransactionRecordType {
  id: string;
  date: string;
  category: CategoryType;
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

export interface DayTransactionType {
  date: string;
  transaction: Array<TransactionRecordType>;
}

export interface TransactionDataType {
  totalCount: number;
  totalIncome: number;
  totalExpenditure: number;
  transaction: Array<DayTransactionType>;
}
