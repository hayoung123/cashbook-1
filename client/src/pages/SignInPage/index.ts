import Component from 'src/lib/component';

import { router } from '../../../index';
import { setState } from 'src/lib/observer';
import { isLoggedInState } from 'src/store/page';
import fetchWrapper from 'src/utils/fetchWrapper';
import getValidityMessage from 'src/utils/getValidityMessages';

import { SIGNIN_URL } from 'src/configs/urls';

import githubIcon from 'public/assets/icon/github.svg';
import './style.scss';

interface FormType extends EventTarget {
  email?: HTMLInputElement;
  password?: HTMLInputElement;
  'password-check'?: HTMLInputElement;
}

const DEMO_EMAIL = 'test@woowahan.com';
const DEMO_PASSWORD = '13579';

export default class SignInPage extends Component {
  constructor() {
    super();
    this.addClass('page');
  }

  setTemplate(): string {
    return `
      <main class="signin__main">
        <section class="container">
          <h3 class="logo">우아한 가계부</h3>
          <h1 class="title">로그인</h1>
          <form>
            <input
              id="email"
              placeholder="이메일"
              type="email"
              required
            />
            <input
              id="password"
              placeholder="비밀번호"
              type="password"
              minlength="5"
              required
            />
            <span class="error-message" id="error-message"></span>
            <button type="submit">로그인</button>
          </form>
          <div class="sub-buttons">
            <button id="signup">회원가입</button>
          </div>
          <button id="signin-demo" class="oauth-button demo">
          데모용 샘플 계정으로 로그인
          </button>
          <button class="oauth-button github">
            <img src="${githubIcon}" alt="github" />
            GitHub로 로그인
          </button>
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
  }

  async signInDemo(): Promise<void> {
    try {
      const res = await fetchWrapper(SIGNIN_URL, 'POST', {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (!res.success) {
        this.displayError(res.errorMessage);
        return;
      }

      const { accessToken } = res.response;
      localStorage.setItem('_at', accessToken);

      setState(isLoggedInState)(true);
    } catch (err) {
      console.log(err);
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

  async handleButtonClick(e: Event): Promise<void> {
    try {
      const target = e.target as HTMLElement;
      const button: HTMLButtonElement | null = target.closest('button');
      if (!button) return;

      button.disabled = true;

      if (button.id === 'signup') {
        router.push('/signup');
      }
      if (button.id === 'signin-demo') {
        await this.signInDemo();
      }

      button.disabled = false;
    } catch (err) {
      console.log(err);
    }
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

      const res = await fetchWrapper(SIGNIN_URL, 'POST', {
        email,
        password,
      });

      if (!res.success) {
        this.displayError(res.errorMessage);
        return;
      }

      const { accessToken } = res.response;
      localStorage.setItem('_at', accessToken);

      setState(isLoggedInState)(true);
    } catch (err) {
      console.log(err);
    }
  }
}

customElements.define('signin-page', SignInPage);
