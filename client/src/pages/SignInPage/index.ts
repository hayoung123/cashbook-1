import Component from 'src/lib/component';

import { router } from '../../../index';
import { setState } from 'src/lib/observer';
import { isLoggedInState } from 'src/store/page';
import githubIcon from 'public/assets/icon/github.svg';

import './style.scss';

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
            <input id="email" placeholder="이메일" type="email" />
            <input id="password" placeholder="비밀번호" type="password" />
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
  }

  handleButtonClick(e: Event): void {
    const target = e.target as HTMLElement;
    const button: HTMLButtonElement | null = target.closest('button');
    if (!button) return;

    if (button.id === 'signup') {
      router.push('/signup');
    }
    if (button.id === 'signin-demo') {
      setState(isLoggedInState)(true);
      router.push('/');
    }
  }

  handleSubmit(e: Event): void {
    e.preventDefault();
    console.log('submit!');
  }
}

customElements.define('signin-page', SignInPage);
