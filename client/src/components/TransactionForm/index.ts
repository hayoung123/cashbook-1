import Component from 'src/lib/component';
import { setState } from 'src/lib/observer';

import inActiveSubmitBtn from 'public/assets/icon/inActiveSubmitBtn.svg';
import activeSubmitBtn from 'public/assets/icon/activeSubmitBtn.svg';
import downArrow from 'public/assets/icon/downArrow.svg';
import trashIcon from 'public/assets/icon/trashIcon.svg';
import CategoryDropdown from 'src/components/dropdown/CategoryDropdown';
import PaymentDropdown from 'src/components/dropdown/PaymentDropdown';

import _ from 'src/utils/dom';
import { CATEGORY__INFO } from 'src/constant/category';
import { getInsertedDotDate } from 'src/utils/date';
import { getCategoryKey } from 'src/utils/category';
import { setTransactionData } from 'src/utils/dataSetting';

import { createTransaction, editTransaction } from 'src/api/transaction';
import { getUserPayment } from 'src/api/payment';
import { userPaymentState } from 'src/store/payment';
import { RecordType } from 'src/store/transaction';
import { objType } from 'src/type/type';

import './style.scss';

interface PropsType {
  isEdit: boolean;
  data: RecordType;
}

interface StateType {
  isIncome: boolean;
  isAbleSubmit: boolean;
  isOpenPayment: boolean;
  isOpenCategory: boolean;
  category: string;
  payment: string;
}

const INIT_FORM = {
  isEdit: false,
  data: {
    id: '',
    date: '',
    category: '',
    title: '',
    payment: '',
    price: 0,
  },
};

export default class TransactionFrom extends Component<StateType, PropsType> {
  date: string;
  title: string;
  price: number;
  constructor(props: PropsType = INIT_FORM) {
    super(props);
    this.date = this.props.data.date;
    this.title = this.props.data.title;
    this.price = Math.abs(this.props.data.price);

    this.render();
    this.addClass('transaction__form-container');
  }
  initState(): StateType {
    return {
      isIncome: this.props.data.price >= 0 ? true : false,
      isAbleSubmit: false,
      isOpenPayment: false,
      isOpenCategory: false,
      category: CATEGORY__INFO[this.props.data.category]?.name,
      payment: this.props.data.payment,
    };
  }

  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
    _.onEvent(this, 'input', this.handleDateInput.bind(this));
  }
  setTemplate(): string {
    if (!this.state) return '';

    const { category, payment } = this.state;
    const { isIncome, isAbleSubmit, isOpenPayment, isOpenCategory } = this.state;

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
        <input name='date' id='date' value='${this.date || ''}' placeholder="예) 2020.08.01"/>
      </div>
      <div class="transaction__form-column transaction__category" >
        <div>분류</div>
        <div>
          <div class="${category ? '' : 'empty'}">${category ? category : '선택하세요'}</div>
          <img class="category__dropdown-btn" src=${downArrow} alt='펼쳐보기' />
        </div>
        ${isOpenCategory ? `<div id="form__category-dropdown"></div>` : ''}
      </div>
      <div class="transaction__form-column transaction__title" >
        <label for='title'>내용</label>
        <input name='title' value='${this.title}' placeholder="입력하세요"/>
      </div>
      <div class="transaction__form-column transaction__method" >
        <div>결제수단</div>
        <div>
          <div class="${payment ? '' : 'empty'}">${payment ? payment : '선택하세요'}</div>
          <img class="payment__dropdown-btn" src=${downArrow} alt='펼쳐보기' />
        </div>
        ${isOpenPayment ? `<div id="form__payment-dropdown"></div>` : ''}
      </div>
      <div class="transaction__form-column transaction__price" >
        <label for='price'>금액</label>
        <div>
          <input type='number' name='price' value='${this.price || ''}' placeholder="입력하세요">
          <span>원</span>
        </div>
      </div>
      <div class="transaction__form-submit-btn">
        <img src=${activeSubmitBtn} alt='제출 버튼' />
      </div>
    </div>
    `;
  }

  setComponents(): objType {
    return {
      'form__category-dropdown': new CategoryDropdown({ setCategory: this.setCategory.bind(this) }),
      'form__payment-dropdown': new PaymentDropdown({ setPayment: this.setPayment.bind(this) }),
    };
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    //제출 버튼
    if (this.isSubmitBtn(target)) {
      this.submitForm();
      //성공시 set Data
      return;
    }

    //수입,지출 버튼
    if (this.isTransactionTypeBtn(target)) {
      const isIncome = target.textContent === '수입';
      this.setState({ isIncome });
    }

    //카테고리 드롭다운 버튼
    if (this.isCategoryDropdownBtn(target)) {
      this.toggleCategoryDropdown();
    }

    //결제수단 드롭다운 버튼
    if (this.isPaymentDropdownBtn(target)) {
      this.setUserPayment();
      this.togglePaymentDropdown();
    }
  }

  //폼 제출
  async submitForm(): Promise<void> {
    const category: string = this.state?.category || '';
    const payment: string = this.state?.payment || '';
    const price = this.state?.isIncome ? this.price : this.price * -1;

    //TODO 경고창
    if (!this.date || !category || !this.title || !payment || !price) return;

    const reqBody = {
      date: this.date,
      title: this.title,
      category: getCategoryKey(category),
      payment,
      price,
    };

    const { success } = this.props.isEdit
      ? await editTransaction({ id: this.props.data.id, ...reqBody })
      : await createTransaction(reqBody);

    if (success) {
      this.clearState();
      setTransactionData();
    }
  }

  //TODO 에러처리
  //유저 결제수단 setting
  async setUserPayment(): Promise<void> {
    const { success, response } = await getUserPayment();
    if (success) setState(userPaymentState)(response.data);
  }

  //카테고리 드롭다운 토글
  toggleCategoryDropdown(): void {
    this.setState((state) => ({ isOpenCategory: !state?.isOpenCategory }));

    if (this.state?.isOpenCategory) {
      const handleMousedown = (e: Event) => {
        const documentTarget = e.target as HTMLElement;

        if (documentTarget.closest('.transaction__category')) {
          return;
        }

        document.removeEventListener('mousedown', handleMousedown);
        this.setState({ isOpenCategory: false });
      };

      document.addEventListener('mousedown', handleMousedown);
    }
  }
  //결재수단 드롭다운 토글
  togglePaymentDropdown(): void {
    this.setState((state) => ({ isOpenPayment: !state?.isOpenPayment }));
    if (this.state?.isOpenPayment) {
      const handleMousedown = (e: Event) => {
        const documentTarget = e.target as HTMLElement;

        if (documentTarget.closest('.transaction__method')) return;

        document.removeEventListener('mousedown', handleMousedown);
        this.setState({ isOpenPayment: false });
      };
      document.addEventListener('mousedown', handleMousedown);
    }
  }

  setCategory(category: string): void {
    this.setState({ category });
    this.setState({ isOpenCategory: false });
  }
  setPayment(payment: string): void {
    this.setState({ payment });
    this.setState({ isOpenPayment: false });
  }

  handleDateInput(e: Event): void {
    const target = e.target as HTMLElement;
    const dateInput = target.closest('.transaction__date input') as HTMLInputElement;
    const titleInput = target.closest('.transaction__title input') as HTMLInputElement;
    const priceInput = target.closest('.transaction__price input') as HTMLInputElement;

    if (dateInput) {
      const dashedDate = getInsertedDotDate(dateInput.value);
      this.date = dashedDate;
      dateInput.value = dashedDate;
    }

    if (titleInput) this.title = titleInput.value;
    if (priceInput) this.price = Math.abs(+priceInput.value);
  }

  clearState(): void {
    this.price = 0;
    this.title = '';
    this.date = '';
    this.setState({ isIncome: true, category: '', payment: '' });
  }

  isSubmitBtn(target: HTMLElement): boolean {
    return !!target.closest('.transaction__form-submit-btn');
  }
  isTransactionTypeBtn(target: HTMLElement): boolean {
    return !!target.closest('.transaction__type-btn');
  }

  isCategoryDropdownBtn(target: HTMLElement): boolean {
    return !!target.closest('.category__dropdown-btn');
  }
  isPaymentDropdownBtn(target: HTMLElement): boolean {
    return !!target.closest('.payment__dropdown-btn');
  }
}

customElements.define('transaction-form', TransactionFrom);
