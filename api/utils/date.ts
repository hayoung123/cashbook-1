import { DayTransactionType, TransactionRecordType } from './../types/transaction';

// 날짜 시작한날 끝날 구하기
export function getSideDate(year: number, month: number): { startDate: Date; endDate: Date } {
  const lastDate = new Date(year, month, 0).getDate();
  return {
    startDate: new Date(year, month - 1, 1),
    endDate: new Date(year, month - 1, lastDate),
  };
}

export const parseTransactionByDate = (
  transactions: Array<TransactionRecordType>,
): Array<DayTransactionType> => {
  const result: Array<DayTransactionType> = [];
  let dayRecord: DayTransactionType = { date: '', transaction: [] };

  transactions.forEach((record) => {
    if (dayRecord.date === record.date) {
      dayRecord.transaction?.push(record);
      return;
    }
    if (dayRecord.date) {
      result.push(dayRecord);
      dayRecord = { date: '', transaction: [] };
    }
    dayRecord.date = record.date;
    dayRecord.transaction = [record];
  });

  if (dayRecord.date) result.push(dayRecord);

  return result;
};
