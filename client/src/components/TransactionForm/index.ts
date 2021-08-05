import './style.scss';

import Component from 'src/lib/component';
import { setState } from 'src/lib/observer';

import inActiveSubmitBtn from 'public/assets/icon/inActiveSubmitBtn.svg';
import activeSubmitBtn from 'public/assets/icon/activeSubmitBtn.svg';
import downArrow from 'public/assets/icon/downArrow.svg';
import trashIcon from 'public/assets/icon/trashIcon.svg';

import { CATEGORY__INFO } from 'src/constant/category';

import CategoryDropdown from 'src/components/dropdown/CategoryDropdown';
import PaymentDropdown from 'src/components/dropdown/PaymentDropdown';
import PaymentAddPupup from 'src/components/popup/PaymentAddPopup';

import { userPaymentState, PaymentType } from 'src/store/payment';

import _ from 'src/utils/dom';
import { isValidDate, getInsertedDotDate } from 'src/utils/date';
import { getCategoryKey } from 'src/utils/category';
import { setTransactionData } from 'src/utils/dataSetting';
import { createTransaction, deleteTransaction, editTransaction } from 'src/api/transaction';
import { getUserPayment } from 'src/api/payment';

import { RecordType } from 'src/type/transaction';
import { objType } from 'src/type/type';

interface PropsType {
  isEdit: boolean;
  data: RecordType;
}

interface StateType {
  [key: string]: string | boolean;
  isIncome: boolean;
  isAbleSubmit: boolean;
  isOpenPayment: boolean;
  isOpenCategory: boolean;
  isOpenPopup: boolean;
  errorState: string;
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
  bodyEvent: (arg: string) => void;
  constructor(props: PropsType = INIT_FORM) {
    super(props);
    this.date = this.props.data.date;
    this.title = this.props.data.title;
    this.price = Math.abs(this.props.data.price);
    this.bodyEvent = this.closeDropdown.bind(this);

    this.addClass('transaction__form-container');
    if (this.checkAbleSubmit()) this.setState({ isAbleSubmit: true });
  }
  initState(): StateType {
    return {
      isIncome: this.props.data.price >= 0 ? true : false,
      isAbleSubmit: false,
      isOpenPayment: false,
      isOpenCategory: false,
      isOpenPopup: false,
      errorState: '',
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
    const { isIncome, isAbleSubmit, isOpenPayment, isOpenCategory, isOpenPopup } = this.state;

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
        <input name='date' id='date' maxLength='10' value='${
          this.date || ''
        }' placeholder="예) 2020-08-01"/>
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
        <img src=${isAbleSubmit ? activeSubmitBtn : inActiveSubmitBtn} alt='제출 버튼' />
      </div>
    </div>
    <div class='transaction-form__error'>${this.state.errorState}</div>
    ${isOpenPopup ? `<div id="payment__add-popup"></div>` : ''}
    `;
  }

  setComponents(): objType {
    if (!this.state) return {};

    const { isOpenCategory, isOpenPayment, isOpenPopup } = this.state;
    return {
      ...(isOpenCategory && {
        'form__category-dropdown': new CategoryDropdown({
          setCategory: this.dropdownCallback.bind(this, 'category', 'isOpenCategory'),
        }),
      }),
      ...(isOpenPayment && {
        'form__payment-dropdown': new PaymentDropdown({
          setPayment: this.dropdownCallback.bind(this, 'payment', 'isOpenPayment'),
          controlPopup: this.controlPopup.bind(this),
          setError: this.setError.bind(this),
        }),
      }),
      ...(isOpenPopup && {
        'payment__add-popup': new PaymentAddPupup({
          setPayment: this.dropdownCallback.bind(this, 'payment', 'isOpenPayment'),
          controlPopup: this.controlPopup.bind(this),
        }),
      }),
    };
  }

  async handleClick(e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    //제출 버튼
    if (_.isTarget(target, '.transaction__form-submit-btn')) {
      this.submitForm();
      //성공시 set Data
      return;
    }

    //수입,지출 버튼
    if (_.isTarget(target, '.transaction__type-btn')) {
      const isIncome = target.textContent === '수입';
      this.setState({ isIncome });
    }

    //카테고리 드롭다운 버튼
    if (_.isTarget(target, '.category__dropdown-btn')) {
      this.toggleDropdown('isOpenCategory', 'transaction__category');
    }

    //결제수단 드롭다운 버튼
    if (_.isTarget(target, '.payment__dropdown-btn')) {
      await this.setUserPayment();
      this.toggleDropdown('isOpenPayment', 'transaction__method');
    }

    //결제수단 삭제 버튼
    if (_.isTarget(target, '.transaction__delete-btn')) {
      this.deleteRecord();
    }
  }

  //폼 제출
  async submitForm(): Promise<void> {
    const category: string = this.state?.category || '';
    const payment: string = this.state?.payment || '';
    const price = this.state?.isIncome ? +this.price : this.price * -1;

    if (!this.date || !category || !this.title || !payment || !price) return;

    if (!isValidDate(this.date)) {
      this.setError('올바른 날짜를 입력해주세요.');

      return;
    }

    if (this.price < 0) {
      this.setError('가격은 음수가 될 수 없습니다.');
      return;
    }

    const reqBody = {
      date: this.date,
      title: this.title,
      category: getCategoryKey(category),
      payment,
      price,
    };

    const response = this.props.isEdit
      ? await editTransaction({ id: this.props.data.id, ...reqBody })
      : await createTransaction(reqBody);

    if (response.success) {
      this.clearState();
      setTransactionData();
    } else {
      this.setError(response.errorMessage ?? '');
    }
  }

  async deleteRecord(): Promise<void> {
    const { success } = await deleteTransaction(this.props.data.id);
    if (success) setTransactionData();
  }

  //TODO 에러처리
  //유저 결제수단 setting
  async setUserPayment(): Promise<void> {
    const { success, response } = await getUserPayment();
    if (success) {
      const setUserPaymentState = setState<PaymentType>(userPaymentState);
      setUserPaymentState(response);
    }
  }

  // 드롭다운 토글
  toggleDropdown(stateKey: string, className: string): void {
    if (!this.state) return;
    const currentOpenState = !this.state[stateKey];

    if (currentOpenState) {
      const handleMousedown = (e: Event) => {
        const target = e.target as HTMLElement;

        if (_.isTarget(target, `.${className}`) || _.isTarget(target, 'payment-add-popup')) return;

        document.removeEventListener('mousedown', handleMousedown);
        this.setState({ [stateKey]: false });
      };

      this.setState({ [stateKey]: currentOpenState });
      document.addEventListener('mousedown', handleMousedown);
      return;
    }
    this.setState({ [stateKey]: currentOpenState });
  }

  closeDropdown(stateKey: string): void {
    this.setState({ [stateKey]: false });
  }

  // 드롭다운 아이템 클릭 콜백함수
  dropdownCallback(type: string, stateKey: string, value: string): void {
    this.setState({ [type]: value, [stateKey]: false });
    if (this.checkAbleSubmit()) this.setState({ isAbleSubmit: true });
  }

  controlPopup(isOpen: boolean): void {
    this.setState({ isOpenPopup: isOpen });
  }

  setError(msg: string): void {
    this.setState({ errorState: msg });
  }

  handleDateInput(e: Event): void {
    const target = e.target as HTMLInputElement;

    if (target.name === 'date') {
      const dashedDate = getInsertedDotDate(target.value);
      this.date = dashedDate;
      target.value = dashedDate;
    }

    if (target.name === 'title') this.title = target.value;
    if (target.name === 'price') this.price = Math.abs(+target.value);

    if (this.state?.isAbleSubmit !== this.checkAbleSubmit()) {
      this.setState({ isAbleSubmit: this.checkAbleSubmit() });
      const input = _.$(`input[name=${target.name}]`, this) as HTMLInputElement;
      _.focusInput(input);
    }
  }

  checkAbleSubmit(): boolean {
    return (
      !!this.date && !!this.title && !!this.price && !!this.state?.category && !!this.state?.payment
    );
  }

  clearState(): void {
    this.price = 0;
    this.title = '';
    this.date = '';
    this.setState({ isIncome: true, category: '', payment: '', errorState: '' });
  }
}

customElements.define('transaction-form', TransactionFrom);
