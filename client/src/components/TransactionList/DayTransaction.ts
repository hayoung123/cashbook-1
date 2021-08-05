import Component, { ComponentType } from 'src/lib/component';

import TransactionRecord from './TransactionRecord';

import { getDate } from 'src/utils/date';
import { getNumberWithComma } from 'src/utils/price';

import { objType } from 'src/type/type';
import { DayRecordsType, RecordType } from 'src/type/transaction';

interface PropType {
  data: DayRecordsType;
  isEditable: boolean;
}

export default class DayTransaction extends Component<void, PropType> {
  constructor(props: PropType) {
    super(props);
  }

  setTemplate(): string {
    const { date: transactionDate, transaction } = this.props.data;
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

    const {
      isEditable,
      data: { transaction },
    } = this.props;

    const components: ComponentType = {};
    transaction.forEach((record, idx) => {
      const key = `transaction-record-${idx}`;
      components[key] = new TransactionRecord({ isEditable, ...record });
    });

    return components;
  }

  getTotalPrice(transaction: Array<RecordType>): number {
    const totalPrice = transaction.reduce((acc, record) => (acc += record.price), 0);
    return totalPrice;
  }
}

customElements.define('day-transaction', DayTransaction);
