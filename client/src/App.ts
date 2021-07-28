import Component from 'src/lib/component';

import Header from 'src/components/Header';
import { pageState } from 'src/store/page';
import { getState } from 'src/lib/observer';

type objType = {
  [key: string]: any;
};

type StateType = {};
type PropsType = {
  isLoggedIn: boolean;
};

export default class App extends Component<StateType, PropsType> {
  constructor(props: PropsType) {
    super(props);
    this.addClass('app');
    this.keys = [pageState];
    this.subscribe();
  }

  setTemplate(): string {
    return `
      ${this.props?.isLoggedIn ? `<div id="app_header"></div>` : ''}
      <div id="page"></div>
    `;
  }

  setComponents(): objType {
    const { Page } = getState(pageState);
    return {
      page: new Page(),
      app_header: new Header(),
    };
  }
}

customElements.define('app-drawer', App);
