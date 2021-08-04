import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import { calendarDataState, CalendarStatisticsType } from 'src/store/calendar';

import { getNumberWithComma } from 'src/utils/price';

export default class TotalPriceInfo extends Component {
  constructor() {
    super();
    this.keys = [calendarDataState];
    this.subscribe();
  }
  setTemplate(): string {
    const { totalIncome, totalExpenditure, totalPrice } =
      getState<CalendarStatisticsType>(calendarDataState);

    return `
      <div>
        <div>총 수입 ${getNumberWithComma(totalIncome)}</div>
        <div>총 지출 ${getNumberWithComma(totalExpenditure)}</div>
      </div>
      <div>총계 ${getNumberWithComma(totalPrice)}</div>
    `;
  }
}

customElements.define('total-price-info', TotalPriceInfo);
