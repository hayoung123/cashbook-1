export interface calendarDateType {
  year: number;
  month: number;
}
interface DateType {
  year: number;
  month: number;
  date: number;
}

export const getMonthData = ({ year, month }: calendarDateType): (number | null)[][] => {
  const monthArr: (number | null)[][] = [];

  const firstDay: number = new Date(year, month - 1).getDay();
  const lastDate: number = new Date(year, month, 0).getDate();

  let weekArr: (number | null)[] = new Array(7).fill(null);

  for (let i = 1; i <= lastDate; i++) {
    const dayIndex: number = (firstDay + i - 1) % 7;

    //day인덱스가 0 && weekArr에 값이 하나라도 들어가있는 경우
    if (dayIndex === 0 && weekArr[weekArr.length - 1]) {
      monthArr.push(weekArr);
      weekArr = new Array(7).fill(0);
    }

    weekArr[dayIndex] = i;
  }
  monthArr.push(weekArr); //마지막 weekArr도 추가

  return monthArr;
};

export const isToday = ({ year, month, date }: DateType): boolean => {
  const dateObj = new Date();

  const todayYear = dateObj.getFullYear();
  const todayMonth = dateObj.getMonth() + 1;
  const todayDate = dateObj.getDate();

  if (todayYear === year && todayMonth === month && todayDate === date) return true;

  return false;
};
