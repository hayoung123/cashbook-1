import './style.scss';

import Component from 'src/lib/component';
import { setState } from 'src/lib/observer';

import { getGithubAuth } from 'src/api/auth';
import { isLoggedInState } from 'src/store/page';
import { getUrlParams } from 'src/utils/window';

import { responseType } from 'src/type/type';

export default class LoginProcessPage extends Component<void, void> {
  setLoggedInState: (arg: boolean) => void;
  constructor() {
    super();
    this.setLoggedInState = setState<boolean>(isLoggedInState);
    this.setGithubAuth();
  }
  setTemplate(): string {
    return `
      <div>로그인 중 입니다...</div>
    `;
  }

  async setGithubAuth(): Promise<void> {
    const { code } = getUrlParams();
    if (!code) return;

    const result = await getGithubAuth(code);
    this.validateAuth(result);
  }

  validateAuth(loginResult: responseType): void {
    if (!loginResult.success) {
      return;
    }

    const { accessToken } = loginResult.response;
    localStorage.setItem('_at', accessToken);

    this.setLoggedInState(true);
  }
}

customElements.define('oauth-page', LoginProcessPage);
