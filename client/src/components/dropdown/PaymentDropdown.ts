import './style.scss';

import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import xBtn from 'public/assets/icon/xBtn.svg';

import { userPaymentState, PaymentType } from 'src/store/payment';

import _ from 'src/utils/dom';
import { deleteUserPayment } from 'src/api/payment';

interface PropsType {
  setPayment: (payment: string) => void;
  controlPopup: (isOpen: boolean) => void;
  setError: (msg: string) => void;
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

    if (_.isTarget(target, '.payment-dropdown__delete-btn')) {
      const payment = paymentItem?.firstElementChild?.textContent || '';
      deleteUserPayment(payment);
      this.props.setPayment('');
      return;
    }

    if (paymentItem) {
      const payment = paymentItem.firstElementChild?.textContent || '';
      this.props.setPayment(payment);
    }

    if (_.isTarget(target, '.payment-add-btn')) {
      this.props.controlPopup(true);
    }
  }

  async deletePayment(payment: string): Promise<void> {
    const result = await deleteUserPayment(payment);

    if (!result.success) this.props.setError(result.errorMessage ?? '');
  }
}

customElements.define('payment-dropdown', PaymentDropdown);
