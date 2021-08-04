import './style.scss';

import Component from 'src/lib/component';

import _ from 'src/utils/dom';
import { createUserPayment } from 'src/api/payment';

interface PropsType {
  controlPopup: (arg: boolean) => void;
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
          <input placeholder="입력하세요"></input>
          <div class='popup__error'>${this.state?.errorMsg || ''}</div>
          <div class='popup__btns'>
            <div class='popup__cancle-btn'>취소</div>
            <div class='popup__submit-btn'>등록</div>
          </div>
        </div>
      `;
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (_.isTarget(target, '.popup__cancle-btn')) {
      this.props.controlPopup(false);
    }
    if (_.isTarget(target, '.popup__submit-btn')) {
      this.addPayment();
    }
  }

  async addPayment(): Promise<void> {
    try {
      const input = _.$('input', this) as HTMLInputElement;
      const result = await createUserPayment(input.value);

      if (!result.success) {
        console.log(result);
        console.log(result.errorMessage);
        this.setState({ errorMsg: result.errorMessage });
        return;
      }

      this.props.controlPopup(false);
    } catch (err) {
      console.log(err);
    }
  }
}

customElements.define('payment-add-popup', PaymentAddPupup);
