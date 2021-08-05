import './style.scss';

import Component from 'src/lib/component';

import _ from 'src/utils/dom';
import { deleteUserPayment } from 'src/api/payment';

interface PropsType {
  payment: string;
  setPayment: (payment: string) => void;
  controlPopup: (isOpen: boolean) => void;
}
interface StateType {
  errorMsg: string;
}

export default class PaymentDeletePupup extends Component<StateType, PropsType> {
  constructor(props: PropsType) {
    super(props);
  }
  initState(): StateType {
    return { errorMsg: '' };
  }
  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }
  setTemplate(): string {
    return `
        <div class='popup'>
          <div class='popup__tiitle'>해당 결제수단을 삭제하시겠습니까?</div>
          <div class='value-box'>${this.props.payment}</div>
          <div class='popup__error'>${this.state?.errorMsg || ''}</div>
          <div class='popup__btns'>
            <button class='popup__cancle-btn'>취소</button>
            <button class='popup__submit-btn'>삭제</button>
          </div>
        </div>
      `;
  }

  async handleClick(e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    if (_.isTarget(target, '.popup__cancle-btn')) {
      this.props.controlPopup(false);
      this.props.setPayment('');
    }
    if (_.isTarget(target, '.popup__submit-btn')) {
      await this.deletePayment();
      this.props.setPayment('');
    }
  }

  async deletePayment(): Promise<void> {
    try {
      const { payment } = this.props;
      const { success, errorMessage } = await deleteUserPayment(payment);
      if (!success) this.setState({ errorMsg: errorMessage });
    } catch (err) {
      console.log(err);
      this.setState({ errorMsg: err.message });
    }
  }
}

customElements.define('payment-delete-popup', PaymentDeletePupup);
