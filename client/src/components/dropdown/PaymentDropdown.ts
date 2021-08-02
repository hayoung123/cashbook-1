import Component from 'src/lib/component';

import xBtn from 'public/assets/icon/xBtn.svg';

import './style.scss';
import { getState } from 'src/lib/observer';
import { userPaymentState } from 'src/store/payment';

export default class PaymentDropdown extends Component<void, void> {
  constructor() {
    super();
    this.keys = [userPaymentState];
    this.subscribe();
    this.addClass('dropdown');
  }

  setTemplate(): string {
    const userPayment: Array<string> = getState(userPaymentState);
    const paymentTemplate = userPayment.reduce((acc, cur) => {
      return (acc += `
            <div>
              <div>${cur}</div>
              <button class='payment-dropdown__delete-btn'>
                <img src=${xBtn} alt=결제수단 삭제 />
              </button>
            </div>
      `);
    }, '');

    return `
      ${paymentTemplate}
      <div>추가하기</div>
    `;
  }
}

customElements.define('payment-dropdown', PaymentDropdown);
