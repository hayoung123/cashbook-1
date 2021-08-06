import './style.scss';

import Component, { objType } from 'src/lib/component';
import { getState } from 'src/lib/observer';

import xBtn from 'public/assets/icon/xBtn.svg';

import PaymentAddPupup from '../popup/PaymentAddPopup';
import PaymentDeletePupup from '../popup/PaymentDeletePopup';

import { userPaymentState, PaymentType } from 'src/store/payment';

import _ from 'src/utils/dom';

interface PropsType {
  setPayment: (payment: string) => void;
  setError: (msg: string) => void;
}

interface StateType {
  isOpenAddPopup: boolean;
  isOpenDeletePopup: boolean;
  selectPayment: string;
}

export default class PaymentDropdown extends Component<StateType, PropsType> {
  constructor(props: PropsType) {
    super(props);
    this.keys = [userPaymentState];
    this.subscribe();
    this.addClass('dropdown');
  }

  initState(): StateType {
    return {
      isOpenAddPopup: false,
      isOpenDeletePopup: false,
      selectPayment: '',
    };
  }

  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }

  setTemplate(): string {
    if (!this.state) return '';

    const { isOpenAddPopup, isOpenDeletePopup } = this.state;

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
      ${isOpenAddPopup ? `<div id=payment-add-popup></div>` : ''}
      ${isOpenDeletePopup ? `<div id=payment-delete-popup></div>` : ''}
    `;
  }

  setComponents(): objType {
    if (!this.state) return {};

    const { isOpenAddPopup, isOpenDeletePopup, selectPayment } = this.state;

    return {
      ...(isOpenAddPopup && {
        'payment-add-popup': new PaymentAddPupup({
          setPayment: this.props.setPayment,
          controlPopup: this.controlPopup.bind(this, 'add'),
        }),
      }),
      ...(isOpenDeletePopup && {
        'payment-delete-popup': new PaymentDeletePupup({
          payment: selectPayment,
          setPayment: this.props.setPayment,
          controlPopup: this.controlPopup.bind(this, 'delete'),
        }),
      }),
    };
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const paymentItem = target.closest('.payment-item');

    if (_.isTarget(target, '.payment-dropdown__delete-btn')) {
      const payment = paymentItem?.firstElementChild?.textContent || '';
      this.setState({ selectPayment: payment });
      this.controlPopup('delete', true);
      return;
    }

    if (paymentItem) {
      const payment = paymentItem.firstElementChild?.textContent || '';
      this.props.setPayment(payment);
    }

    if (_.isTarget(target, '.payment-add-btn')) {
      this.controlPopup('add', true);
    }
  }

  controlPopup(type: string, isOpen: boolean): void {
    if (type === 'add') this.setState({ isOpenAddPopup: isOpen });
    if (type === 'delete') this.setState({ isOpenDeletePopup: isOpen });
  }
}

customElements.define('payment-dropdown', PaymentDropdown);
