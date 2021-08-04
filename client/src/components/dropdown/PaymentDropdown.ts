import './style.scss';

import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import xBtn from 'public/assets/icon/xBtn.svg';

import { userPaymentState, PaymentType } from 'src/store/payment';

import _ from 'src/utils/dom';

interface PropsType {
  setPayment: (payment: string) => void;
}

export default class PaymentDropdown extends Component<void, PropsType> {
  constructor(props: PropsType) {
    super(props);
    this.keys = [userPaymentState];
    this.subscribe();
    this.addClass('dropdown');
  }

  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }

  setTemplate(): string {
    const userPayment: Array<string> = getState<PaymentType>(userPaymentState);
    const paymentTemplate = userPayment.reduce((acc, cur) => {
      return (acc += `
            <div class='payment-item'>
              <div>${cur}</div>
              <button class='payment-dropdown__delete-btn'>
                <img src=${xBtn} alt=결제수단 삭제 />
              </button>
            </div>
      `);
    }, '');

    return `
      ${paymentTemplate}
      <div class='payment-add-btn'>추가하기</div>
    `;
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const paymentItem = target.closest('.payment-item');

    if (paymentItem) {
      const payment = paymentItem.firstElementChild?.textContent || '';
      this.props.setPayment(payment);
    }

    if (this.isAddBtn(target)) {
      //모달창
    }
  }

  isAddBtn(target: HTMLElement): boolean {
    return !!target.closest('.payment-add-bnt');
  }
}

customElements.define('payment-dropdown', PaymentDropdown);
