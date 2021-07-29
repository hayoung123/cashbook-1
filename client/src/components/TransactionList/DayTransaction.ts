import Component from 'src/lib/component';
import { getDate } from 'src/utils/date';
import { getNumberWithComma } from 'src/utils/price';

import './style.scss';

type PaymentType = {
  category: string;
  title: string;
  method: string;
  price: number;
};

type DayTransactionType = {
  date: string;
  transaction: Array<PaymentType>;
};

type StateType = {
  isEdit: boolean;
};

export default class DayTransaction extends Component<StateType, DayTransactionType> {
  constructor(props: DayTransactionType) {
    super(props);
  }

  initState(): StateType {
    return { isEdit: false };
  }

  setTemplate(): string {
    if (!this.props) return '';
    const { date: transactionDate, transaction } = this.props;
    const { month, date, day } = getDate(transactionDate);
    const totalPrice = this.getTotalPrice(transaction);
    return `
      <div class="transaction-info">
        <div class="transaction-info-date">
          <span class='transaction-date'>${month}월 ${date}일</span>
          <span class='transaction-date-day'>${day}</span>
        </div>
        <div class="transaction-info-price"> 
          <span>${totalPrice > 0 ? '수입' : '지출'}</span>
          <span>${getNumberWithComma(totalPrice)}</span>
        </div>
      </div>
    `;
  }
  getTotalPrice(transaction: Array<PaymentType>): number {
    const totalPrice = transaction.reduce((acc, record) => (acc += record.price), 0);
    return totalPrice;
  }
}

customElements.define('day-transaction', DayTransaction);
