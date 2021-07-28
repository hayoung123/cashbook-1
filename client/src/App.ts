import Component from 'src/lib/component';

import { pageState } from 'src/store/page';
import { getState } from 'src/lib/observer';

export default class App extends Component {
  constructor() {
    super();
    this.addClass('app');
    this.keys = [pageState];
    this.subscribe();
  }

  setTemplate() {
    return `
      <div id="page"></div>
    `;
  }

  setComponents() {
    const { Page } = getState(pageState);
    return {
      page: new Page(),
    };
  }
}

customElements.define('app-drawer', App);
