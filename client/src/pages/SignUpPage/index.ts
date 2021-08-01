import Component from 'src/lib/component';

import { router } from '../../../index';
import { setState } from 'src/lib/observer';
import { isLoggedInState } from 'src/store/page';
import fetchWrapper from 'src/utils/fetchWrapper';
import getValidityMessage from 'src/utils/getValidityMessages';

import { SIGNUP_URL } from 'src/configs/urls';

import './style.scss';

interface FormType extends EventTarget {
  email?: HTMLInputElement;
  password?: HTMLInputElement;
  'password-check'?: HTMLInputElement;
}

export default class SignUpPage extends Component {
  constructor() {
    super();
    this.addClass('page');
  }

  setTemplate(): string {
    return `
      <main class="signin__main">
        <section class="container">
          <h3 class="logo">우아한 가계부</h3>
          <h1 class="title">회원가입</h1>
          <form>
            <input id="email" placeholder="이메일" type="email" required />
            <input id="password" placeholder="비밀번호" type="password" minlength="5" required />
            <input id="password-check" placeholder="비밀번호 확인" type="password" />
            <span class="error-message" id="error-message"></span>
            <button type="submit">회원가입</button>
          </form>
          <div class="sub-buttons">
            <button id="signin">로그인</button>
          </div>
          <div class="copyright">© Woowa Brothers Corp.</div>
        </section>
      </main>
    `;
  }

  addEvent(): void {
    this.addEventListener('click', this.handleButtonClick.bind(this));
    this.addEventListener('submit', this.handleSubmit.bind(this));
    this.querySelector('#email')?.addEventListener('invalid', this.handleInputError.bind(this));
    this.querySelector('#password')?.addEventListener('invalid', this.handleInputError.bind(this));
    this.querySelector('#password-check')?.addEventListener(
      'invalid',
      this.handleInputError.bind(this),
    );
  }

  handleButtonClick(e: Event): void {
    const target = e.target as HTMLElement;
    const button: HTMLButtonElement | null = target.closest('button');
    if (!button) return;

    if (button.id === 'signin') {
      router.push('/');
    }
  }

  displayError(message: string): void {
    const $errorMessage = this.querySelector(`#error-message`);
    if (!$errorMessage) {
      return;
    }

    $errorMessage.textContent = message;
  }

  handleInputError(e: Event): void {
    e.preventDefault();

    const $input: HTMLInputElement = e.target as HTMLInputElement;

    const type = $input.id === 'email' ? 'email' : 'password';
    const errorMessage = getValidityMessage(type, $input.validity);

    if (!errorMessage) {
      return;
    }
    this.displayError(errorMessage);
  }

  async handleSubmit(e: Event): Promise<void> {
    try {
      e.preventDefault();
      if (!e.target) {
        return;
      }

      const $form: FormType = e.target;

      const email = $form.email?.value;
      const password = $form.password?.value;
      const passwordCheck = $form['password-check']?.value;

      if (password !== passwordCheck) {
        this.displayError('비밀번호와 비밀번호 확인이 서로 다릅니다.');
        return;
      }

      const res = await fetchWrapper(SIGNUP_URL, 'POST', {
        email,
        password,
      });

      if (!res.success) {
        alert(res.errorMessage);
        return;
      }

      const { accessToken } = res;

      localStorage.setItem('_at', accessToken);

      setState(isLoggedInState)(true);
      router.replace('/');
    } catch (err) {
      console.log(err);
    }
  }
}

customElements.define('signup-page', SignUpPage);
