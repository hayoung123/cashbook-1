import Component from 'src/lib/component';

import './style.scss';

type FormType = {
  date: string;
  category: string;
  title: string;
  method: string;
  price: number;
};

const INIT_FORM = {
  date: '',
  category: '',
  title: '',
  method: '',
  price: 0,
};

export default class TransactionFrom extends Component<void, FormType> {
  constructor(props: FormType = INIT_FORM) {
    super(props);
    this.addClass('transaction__form');
  }
  setTemplate(): string {
    if (!this.props) return '';

    const { date, category, title, method, price } = this.props;

    return `
      <div class="transaction__form-column transaction__date" >
        <label for='date'>일자</label>
        <input name='date' id='date' value='${date}' placeholder="입력하세요"/>
      </div>
      <div class="transaction__form-column transaction__category" >
        <div>분류</div>
        <div class="${category ? '' : 'empty'}">${category ? category : '선택하세요'}</div>
      </div>
      <div class="transaction__form-column transaction__title" >
        <label for='title'>내용</label>
        <input name='title' value='${title}' placeholder="입력하세요"/>
      </div>
      <div class="transaction__form-column transaction__method" >
        <div>결제수단</div>
        <div class="${method ? '' : 'empty'}">${method ? method : '선택하세요'}</div>
      </div>
      <div class="transaction__form-column transaction__type" >
        <div>결제 분류</div>
        <div class="transaction__type-select" >
          <label class="payment-type">수입
            <input type="radio" name="transaction__type">
          </label>
          <label class="payment-type">지출
            <input type="radio" name="transaction__type">
          </label>
          </div>
      </div>
      <div class="transaction__form-column transaction__price" >
        <label for='price'>금액</label>
        <input name='price' value='${price ? price : ''}' placeholder="입력하세요">
      </div>
    `;
  }
}

customElements.define('transaction-form', TransactionFrom);
