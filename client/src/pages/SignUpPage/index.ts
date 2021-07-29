import Component from 'src/lib/component';

import { router } from '../../../index';

import './style.scss';

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
            <input id="email" placeholder="이메일" type="email" />
            <input id="password" placeholder="비밀번호" type="password" />
            <input id="password-check" placeholder="비밀번호 확인" type="password" />
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
  }

  handleButtonClick(e: Event): void {
    const target = e.target as HTMLElement;
    const button: HTMLButtonElement | null = target.closest('button');
    if (!button) return;
    console.log(button);
    if (button.id === 'signin') {
      router.push('/');
    }
  }

  handleSubmit(e: Event): void {
    e.preventDefault();
    console.log('submit!');
  }
}

customElements.define('signup-page', SignUpPage);
