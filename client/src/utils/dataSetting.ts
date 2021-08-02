import { getState, setState } from 'src/lib/observer';

import { getTransaction } from 'src/api/transaction';
import { getCalendarStatistics } from 'src/api/calendar';

import { pageState } from 'src/store/page';
import { transactionState } from 'src/store/transaction';
import { calendarDataState } from 'src/store/calendar';

//util안에 있을 애는 아닌 것 같은데 위치를 못잡겠음

//TODO 함수 위치 변경
export async function setTransactionData(): Promise<any> {
  const { Page } = getState(pageState);
  const pageName = Page.name;

  if (pageName === 'MainPage') {
    const { success, response } = await getTransaction();
    //TODO에러처리
    if (success) setState(transactionState)(response.data);
  }
  if (pageName === 'CalendarPage') {
    const { success, response } = await getCalendarStatistics();
    if (success) setState(calendarDataState)(response.result);
  }
  if (pageName === 'ChartPage') {
  }
}
