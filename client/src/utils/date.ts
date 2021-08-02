export type DateType = {
  year?: number;
  month: number;
  date: number;
  day: string;
};
export const getDate = (date: string): DateType => {
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const dateObj = new Date(date);
  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    date: dateObj.getDate(),
    day: DAYS[dateObj.getDay()],
  };
};

interface YearMonthType {
  year: number;
  month: number;
}

export const getNextMonth = ({ year, month }: YearMonthType): YearMonthType => {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
};
export const getPrevMonth = ({ year, month }: YearMonthType): YearMonthType => {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
};

export const getInsertedDotDate = (date: string): string => {
  date = date.replace(/-/g, '');
  if (date.length < 5) return date;
  if (date.length < 7) return date.slice(0, 4) + '-' + date.slice(4);
  return date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6);
};
