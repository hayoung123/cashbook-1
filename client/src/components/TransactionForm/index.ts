import Component from 'src/lib/component';

import inActiveSubmitBtn from 'public/assets/icon/inActiveSubmitBtn.svg';
import activeSubmitBtn from 'public/assets/icon/activeSubmitBtn.svg';
import downArrow from 'public/assets/icon/downArrow.svg';
import trashIcon from 'public/assets/icon/trashIcon.svg';

import './style.scss';
import _ from 'src/utils/dom';

interface FormType {
  date: string;
  category: string;
  title: string;
  method: string;
  price: number;
}

interface PropsType {
  isEdit: boolean;
  data: FormType;
}

interface StateType {
  isIncome: boolean;
  isAbleSubmit: boolean;
}

const INIT_FORM = {
  isEdit: false,
  data: {
    date: '',
    category: '',
    title: '',
    method: '',
    price: 0,
  },
};

export default class TransactionFrom extends Component<StateType, PropsType> {
  constructor(props: PropsType = INIT_FORM) {
    super(props);
    this.addClass('transaction__form-container');
  }
  initState(): StateType {
    return {
      isIncome: true,
      isAbleSubmit: false,
    };
  }

  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }
  setTemplate(): string {
    if (!this.state) return '';

    const { date, category, title, method, price } = this.props.data;
    const { isIncome, isAbleSubmit } = this.state;

    return `
    <div class="transaction__type">
      <div class='transaction__type-btns'>
        <button class='transaction__type-btn${isIncome ? ' selected' : ''}'>수입</button>
        <button class='transaction__type-btn${isIncome ? '' : ' selected'}'>지출</button>
      </div>
      ${
        this.props.isEdit
          ? `<button class='transaction__delete-btn'>
        <img src=${trashIcon} alt='삭제하기 버튼' />
      </button>`
          : ''
      }
    </div>
    <div class="transaction__form">
      <div class="transaction__form-column transaction__date" >
        <label for='date'>일자</label>
        <input name='date' id='date' value='${date}' placeholder="입력하세요"/>
      </div>
      <div class="transaction__form-column transaction__category" >
        <div>분류</div>
        <div>
          <div class="${category ? '' : 'empty'}">${category ? category : '선택하세요'}</div>
          <img class="form-dropdown-btn" src=${downArrow} alt='펼쳐보기' />
        </div>
      </div>
      <div class="transaction__form-column transaction__title" >
        <label for='title'>내용</label>
        <input name='title' value='${title}' placeholder="입력하세요"/>
      </div>
      <div class="transaction__form-column transaction__method" >
        <div>결제수단</div>
        <div>
          <div class="${method ? '' : 'empty'}">${method ? method : '선택하세요'}</div>
          <img class="form-dropdown-btn" src=${downArrow} alt='펼쳐보기' />
        </div>
      </div>
      <div class="transaction__form-column transaction__price" >
        <label for='price'>금액</label>
        <div>
          <input type='number' name='price' value='${price ? price : ''}' placeholder="입력하세요">
          <span>원</span>
        </div>
      </div>
      <div class="transaction__form-submit-btn">
        <img src=${isAbleSubmit ? activeSubmitBtn : inActiveSubmitBtn} alt='제출 버튼' />
      </div>
    </div>
    `;
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    //제출 버튼
    if (this.isSubmitBtn(target)) {
      //서버요청
      return;
    }

    //수입,지출 버튼
    if (this.isTransactionTypeBtn(target)) {
      const isIncome = target.textContent === '수입';
      this.setState({ isIncome });
    }

    //드롭다운 버튼
    if (this.isDropdownBtn(target)) {
      //category, method dropdown 관련 버튼
    }
  }

  isSubmitBtn(target: HTMLElement): boolean {
    return !!target.closest('.transaction__form-submit-btn');
  }
  isTransactionTypeBtn(target: HTMLElement): boolean {
    return !!target.closest('.transaction__type-btn');
  }
  isDropdownBtn(target: HTMLElement): boolean {
    return !!target.closest('.form-dropdown-btn');
  }
}

customElements.define('transaction-form', TransactionFrom);
