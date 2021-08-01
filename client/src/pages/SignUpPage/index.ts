import Component from 'src/lib/component';

import { router } from '../../../index';
import fetchWrapper from 'src/utils/fetchWrapper';
import checkInputValidity from 'src/utils/checkInputValidity';

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

      if (!email) {
        alert('이메일을 입력해주세요.');
        return;
      }

      const isEmailValid = checkInputValidity('email', email);
      if (!isEmailValid) {
        alert('이메일 형식을 확인해주세요');
        return;
      }

      if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
      }

      const isPasswordValid = checkInputValidity('password', password);
      if (!isPasswordValid) {
        alert('비밀번호 형식이 다릅니다.');
        return;
      }

      if (password !== passwordCheck) {
        alert('비밀번호와 비밀번호 확인이 서로 다릅니다.');
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

      // TODO: 라우터에서 isLoggedIn을 true로 만들어줘야 함
      router.replace('/');
    } catch (err) {
      console.log(err);
    }
  }
}

customElements.define('signup-page', SignUpPage);
