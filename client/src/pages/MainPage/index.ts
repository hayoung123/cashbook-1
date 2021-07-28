import Component from 'src/lib/component';

export default class MainPage extends Component {
  constructor() {
    super();
    this.addClass('page', 'main-page');
  }

  setTemplate(): string {
    return `
      <div id='main_page__list'>메인페이지</div>
    `;
  }
}

customElements.define('main-page', MainPage);
