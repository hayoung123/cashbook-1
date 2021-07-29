import Component from 'src/lib/component';

import TransactionRecord from './TransactionRecord';

import { getDate } from 'src/utils/date';
import { getNumberWithComma } from 'src/utils/price';

import { objType } from 'src/type/type';
import { DayTransactionType, PaymentType } from 'src/type/transaction';

type StateType = void;

type ComponentType = { [key: string]: HTMLElement };

export default class DayTransaction extends Component<StateType, DayTransactionType> {
  constructor(props: DayTransactionType) {
    super(props);
  }

  setTemplate(): string {
    if (!this.props) return '';

    const { date: transactionDate, transaction } = this.props;
    const { month, date, day } = getDate(transactionDate);
    const totalPrice = this.getTotalPrice(transaction);

    const transactionTemplate = transaction.reduce((acc, cur, idx) => {
      return acc + `<div id='transaction-record-${idx}'></div>`;
    }, '');

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
      ${transactionTemplate}
    `;
  }

  setComponents(): ComponentType | objType {
    if (!this.props) return {};

    const { transaction } = this.props;

    const components: ComponentType = {};
    transaction.forEach((record, idx) => {
      const key = `transaction-record-${idx}`;
      components[key] = new TransactionRecord({ ...record });
    });

    return components;
  }

  getTotalPrice(transaction: Array<PaymentType>): number {
    const totalPrice = transaction.reduce((acc, record) => (acc += record.price), 0);
    return totalPrice;
  }
}

customElements.define('day-transaction', DayTransaction);
