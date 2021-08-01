import Component from 'src/lib/component';
import { getState, setState } from 'src/lib/observer';

import { transactionPriceType, transactionPriceTypeState } from 'src/store/transaction';

import activePicker from 'public/assets/icon/activePicker.svg';
import inActivePicker from 'public/assets/icon/inActivePicker.svg';

import _ from 'src/utils/dom';
import { getNumberWithComma } from 'src/utils/price';

import './style.scss';

interface TransactionInfoType {
  total: number;
  price: {
    income: number;
    expenditure: number;
  };
}

export default class TransactionHeader extends Component {
  //TODO: 리팩토링 - setState타입을 설정해주기
  setType: (newState: any) => void;
  constructor() {
    super();
    this.keys = [transactionPriceTypeState];
    this.setType = setState(transactionPriceTypeState);
    this.subscribe();
  }
  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }
  setTemplate(): string {
    const { isIncome, isExpenditure } = getState(transactionPriceTypeState);

    const {
      total,
      price: { income, expenditure },
    } = this.getTransactionInfo();
    return `
      <h2 class="transaction__total" >전체 내역 ${total}건</h2>
      <div class="transaciton__price-info" >
        <div id="transaction__income-btn">
          <img src=${isIncome ? activePicker : inActivePicker} alt="수입 버튼" />
          <div>수입 ${getNumberWithComma(income)}</div>
        </div>
        <div id="transaction__expenditure-btn">
          <img src=${isExpenditure ? activePicker : inActivePicker} alt="수입 버튼" />
          <div>지출 ${getNumberWithComma(expenditure)}</div>
        </div>
      </div>  
    `;
  }

  handleClick(e: Event) {
    const target = e.target as HTMLElement;

    if (this.isIncomeBtn(target)) {
      this.setType((type: transactionPriceType) => ({ ...type, isIncome: !type.isIncome }));
    }

    if (this.isExpenditureBtn(target)) {
      this.setType((type: transactionPriceType) => ({
        ...type,
        isExpenditure: !type.isExpenditure,
      }));
    }
  }

  getTransactionInfo(): TransactionInfoType {
    return sampleData;
  }

  isIncomeBtn(target: HTMLElement): boolean {
    return !!target.closest('#transaction__income-btn');
  }
  isExpenditureBtn(target: HTMLElement): boolean {
    return !!target.closest('#transaction__expenditure-btn');
  }
}

customElements.define('transaction-header', TransactionHeader);

const sampleData: TransactionInfoType = {
  total: 13,
  price: {
    income: 1822480,
    expenditure: 700000,
  },
};
