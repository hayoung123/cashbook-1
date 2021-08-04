import './style.scss';

import Component from 'src/lib/component';

export default class PaymentAddPupup extends Component<any, void> {
  setTemplate(): string {
    return `
        <div class='popup'>
          <div class='popup__tiitle'>추가하실 결제수단을 적어주세요.</div>
          <input placeholder="입력하세요"></input>
          <div class='popup__error'>hello</div>
          <div class='popup__btns'>
            <div class='popup__cancle-btn'>취소</div>
            <div class='popup__submit-btn'>등록</div>
          </div>
        </div>
      `;
  }
}

customElements.define('payment-add-popup', PaymentAddPupup);
