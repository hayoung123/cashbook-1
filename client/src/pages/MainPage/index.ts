import TransactionList from 'src/components/TransactionList';
import Component from 'src/lib/component';
import { objType } from 'src/type/type';

export default class MainPage extends Component {
  constructor() {
    super();
    this.addClass('page', 'main-page');
  }

  setTemplate(): string {
    return `
      <div class=" container column">
        <div id='main_page__list'></div>
      </div>
    `;
  }
  setComponents(): objType {
    return {
      main_page__list: new TransactionList(),
    };
  }
}

customElements.define('main-page', MainPage);
