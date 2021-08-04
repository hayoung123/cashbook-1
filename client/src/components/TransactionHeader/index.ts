import './style.scss';

import Component from 'src/lib/component';
import { getState, setState } from 'src/lib/observer';

import activePicker from 'public/assets/icon/activePicker.svg';
import inActivePicker from 'public/assets/icon/inActivePicker.svg';

import {
  transactionPriceTypeState,
  transactionPriceType,
  transactionState,
  transactionType,
} from 'src/store/transaction';

import _ from 'src/utils/dom';
import { setTransactionData } from 'src/utils/dataSetting';
import { getNumberWithComma } from 'src/utils/price';

export default class TransactionHeader extends Component {
  constructor() {
    super();
    this.keys = [transactionPriceTypeState, transactionState];
    this.subscribe();
  }
  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }
  setTemplate(): string {
    const { isIncome, isExpenditure } = getState<transactionPriceType>(transactionPriceTypeState);
    const { totalCount, totalIncome, totalExpenditure } =
      getState<transactionType>(transactionState);

    return `
      <h2 class="transaction__total" >전체 내역 ${totalCount}건</h2>
      <div class="transaciton__price-info" >
        <div id="transaction__income-btn">
          <img src=${isIncome ? activePicker : inActivePicker} alt="수입 버튼" />
          <div>수입 ${getNumberWithComma(totalIncome)}</div>
        </div>
        <div id="transaction__expenditure-btn">
          <img src=${isExpenditure ? activePicker : inActivePicker} alt="수입 버튼" />
          <div>지출 ${getNumberWithComma(totalExpenditure)}</div>
        </div>
      </div>  
    `;
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const setTransactionType = setState<transactionPriceType>(transactionPriceTypeState);

    if (_.isTarget(target, '#transaction__income-btn')) {
      setTransactionType((type) => ({ ...type, isIncome: !type.isIncome }));
      setTransactionData();
    }

    if (_.isTarget(target, '#transaction__expenditure-btn')) {
      setTransactionType((type) => ({
        ...type,
        isExpenditure: !type.isExpenditure,
      }));
      setTransactionData();
    }
  }
}

customElements.define('transaction-header', TransactionHeader);
