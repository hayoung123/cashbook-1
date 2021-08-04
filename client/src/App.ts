import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import Header from 'src/components/Header';

import { pageState, isLoggedInState, PageStateType } from 'src/store/page';

import { setTransactionData } from 'src/utils/dataSetting';

type objType = {
  [key: string]: any;
};

export default class App extends Component<void, void> {
  constructor() {
    super();
    this.addClass('app');
    this.keys = [pageState, isLoggedInState];
    this.subscribe();
  }

  setTemplate(): string {
    const isLoggedIn = getState<boolean>(isLoggedInState);

    return `
      ${isLoggedIn ? `<div id="app_header"></div>` : ''}
      <div id="page"></div>
    `;
  }

  setComponents(): objType {
    const { Page } = getState<PageStateType>(pageState);
    return {
      page: new Page(),
      app_header: new Header(),
    };
  }
  componentDidMount(): void {
    setTransactionData();
  }
}

customElements.define('app-drawer', App);
