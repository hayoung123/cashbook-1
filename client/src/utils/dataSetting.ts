import { getState, setState } from 'src/lib/observer';

import MainPage from 'src/pages/MainPage';
import CalendarPage from 'src/pages/CalendarPage';
import ChartPage from 'src/pages/ChartPage';

import { pageState, PageStateType } from 'src/store/page';
import { transactionState, transactionType } from 'src/store/transaction';
import { calendarDataState, CalendarStatisticsType } from 'src/store/calendar';
import { statisticsState, StatisticsType } from 'src/store/statistics';

import { getTransaction } from 'src/api/transaction';
import { getCalendarStatistics } from 'src/api/calendar';
import { getChartStatistics } from 'src/api/chart';

import { CategoryStatisticsType } from 'src/type/statistics';

export async function setTransactionData(): Promise<any> {
  const { Page } = getState<PageStateType>(pageState);
  const pageName = Page?.name;

  if (pageName === MainPage.name) {
    const { success, response } = await getTransaction();
    if (success) {
      const setTransactionState = setState<transactionType>(transactionState);
      setTransactionState(response);
    }
  }
  if (pageName === CalendarPage.name) {
    const { success, response } = await getCalendarStatistics();
    if (success) {
      const setCalendarState = setState<CalendarStatisticsType>(calendarDataState);
      setCalendarState(response);
    }
  }
  if (pageName === ChartPage.name) {
    const { success, response } = await getChartStatistics();
    if (success) {
      const setStatisticsState = setState<StatisticsType>(statisticsState);
      const state = parseCategoryList(response);
      setStatisticsState(state);
    }
  }
}

function parseCategoryList(data: { [key: string]: number }): StatisticsType {
  const sortedCategoryStatisticsList = Object.entries(data).sort((a, b) => +a[1] - +b[1]);
  let totalExpenditure = 0;
  const categoryList: CategoryStatisticsType[] = [];

  sortedCategoryStatisticsList.forEach((categoryStatistics) => {
    const [category, expenditure] = categoryStatistics;
    totalExpenditure += Math.abs(expenditure);
    if (Math.abs(expenditure) > 0) {
      categoryList.push({
        category,
        expenditure: Math.abs(expenditure),
      });
    }
  });

  return { totalExpenditure, categoryList };
}
