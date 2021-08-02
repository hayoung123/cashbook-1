import Component from 'src/lib/component';

import xBtn from 'public/assets/icon/xBtn.svg';

import './style.scss';

export default class PaymentDropdown extends Component<void, void> {
  constructor() {
    super();
    this.addClass('dropdown');
  }
  setTemplate(): string {
    return `
      <div>
        <div>현금</div>
        <button class='payment-dropdown__delete-btn'>
          <img src=${xBtn} alt=결제수단 삭제 />
        </button>
      </div>
      <div>
        <div>현대카드</div>
        <button class='payment-dropdown__delete-btn'>
          <img src=${xBtn} alt=결제수단 삭제 />
        </button>
      </div>
      <div>추가하기</div>
    `;
  }
}

customElements.define('payment-dropdown', PaymentDropdown);
