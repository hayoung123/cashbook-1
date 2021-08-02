import { getState, setState } from 'src/lib/observer';
import { getTransaction } from 'src/api/transaction';
import { transactionState } from 'src/store/transaction';
import { pageState } from 'src/store/page';

//util안에 있을 애는 아닌 것 같은데 위치를 못잡겠음

//TODO 함수 위치 변경
export async function setTransactionData(): Promise<any> {
  const { Page } = getState(pageState);
  const pageName = Page.name;

  if (pageName === 'MainPage') {
    const data = await getTransaction();
    //TODO에러처리
    if (data.success) setState(transactionState)(data.response.data);
  }
  if (pageName === 'CalendarPage') {
  }
  if (pageName === 'ChartPage') {
  }
}
