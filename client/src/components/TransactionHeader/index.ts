import Component from 'src/lib/component';

import activePicker from 'public/assets/icon/activePicker.svg';
import inActivePicker from 'public/assets/icon/inActivePicker.svg';

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
  setTemplate(): string {
    const {
      total,
      price: { income, expenditure },
    } = this.getTransactionInfo();
    return `
      <h2 class="transaction__total" >전체 내역 ${total}건</h2>
      <div class="transaciton__price-info" >
        <div>
          <img src=${activePicker} alt="수입 버튼" />
          <div>수입 ${getNumberWithComma(income)}</div>
        </div>
        <div>
          <img src=${inActivePicker} alt="수입 버튼" />
          <div>지출 ${getNumberWithComma(expenditure)}</div>
        </div>
      </div>  
    `;
  }

  getTransactionInfo(): TransactionInfoType {
    return sampleData;
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
