import './style.scss';

import Component from 'src/lib/component';
import { setState } from 'src/lib/observer';
import { router } from 'src/..';

import { SIGNIN_URL } from 'src/configs/urls';

import { isLoggedInState } from 'src/store/page';

import { getGithubLoginUrl } from 'src/api/auth';
import fetchWrapper from 'src/utils/fetchWrapper';
import getValidityMessage from 'src/utils/getValidityMessages';

import githubIcon from 'public/assets/icon/github.svg';
import { responseType } from 'src/type/type';

interface FormType extends EventTarget {
  email?: HTMLInputElement;
  password?: HTMLInputElement;
  'password-check'?: HTMLInputElement;
}

const DEMO_EMAIL = 'test@woowahan.com';
const DEMO_PASSWORD = '13579';

export default class SignInPage extends Component {
  setLoggedInState: (arg: boolean) => void;
  constructor() {
    super();
    this.addClass('page');
    this.setLoggedInState = setState<boolean>(isLoggedInState);
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
          <button id="oauth-button github" class="oauth-button github">
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

      this.validateAuth(res);
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

      if (button.id === 'oauth-button github') {
        await this.signInGithub();
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

      this.validateAuth(res);
    } catch (err) {
      console.log(err);
    }
  }

  async signInGithub(): Promise<void> {
    const result = await getGithubLoginUrl();
    if (result.success) {
      window.location.href = result.response.url;
    }
  }

  validateAuth(loginResult: responseType): void {
    if (!loginResult.success) {
      this.displayError(loginResult.errorMessage as string);
      return;
    }

    const { accessToken } = loginResult.response;
    localStorage.setItem('_at', accessToken);

    this.setLoggedInState(true);
  }
}

customElements.define('signin-page', SignInPage);
