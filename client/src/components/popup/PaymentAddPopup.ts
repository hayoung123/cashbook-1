import './style.scss';

import Component from 'src/lib/component';

import _ from 'src/utils/dom';
import { createUserPayment } from 'src/api/payment';

interface PropsType {
  setPayment: (payment: string) => void;
  controlPopup: (isOpen: boolean) => void;
}
interface StateType {
  errorMsg: string;
}

export default class PaymentAddPupup extends Component<StateType, PropsType> {
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
          <div class='popup__tiitle'>추가하실 결제수단을 적어주세요.</div>
          <input placeholder="입력하세요" required></input>
          <div class='popup__error'>${this.state?.errorMsg || ''}</div>
          <div class='popup__btns'>
            <button class='popup__cancle-btn'>취소</button>
            <button class='popup__submit-btn'>등록</button>
          </div>
        </div>
      `;
  }

  async handleClick(e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    if (_.isTarget(target, '.popup__cancle-btn')) {
      this.props.controlPopup(false);
    }
    if (_.isTarget(target, '.popup__submit-btn')) {
      await this.addPayment();
    }
  }

  async addPayment(): Promise<void> {
    try {
      const input = _.$('input', this) as HTMLInputElement;
      const value = input.value;

      if (!value) {
        this.setState({ errorMsg: '결제수단을 입력해주세요' });
        const newInput = _.$('input', this) as HTMLInputElement;
        _.focusInput(newInput);
        return;
      }

      const result = await createUserPayment(value);
      if (!result.success) {
        this.setState({ errorMsg: result.errorMessage });
        return;
      }

      this.props.controlPopup(false);
      this.props.setPayment(value);
    } catch (err) {
      console.log(err);
    }
  }
}

customElements.define('payment-add-popup', PaymentAddPupup);
