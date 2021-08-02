export interface getTransactionParamType {
  userId: string;
  year: string;
  month: string;
  isIncome: boolean;
  isExpenditure: boolean;
}

export interface TransactionRecordType {
  id: string;
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

export interface DayTransactionType {
  date: string;
  transaction: Array<TransactionRecordType>;
}

export interface TransactionDataType {
  totalIncome: number;
  totalExpenditure: number;
  transaction: Array<DayTransactionType>;
}

export interface CalendarStatisticsType {
  totalIncome: number;
  totalExpenditure: number;
  totalPrice: number;
  statistics: {
    [key: number]: {
      income: number;
      expenditure: number;
      total: number;
    };
  };
}
