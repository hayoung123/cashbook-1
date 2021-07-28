import Component from 'src/lib/component';

export default class ChartPage extends Component {
  constructor() {
    super();
    this.addClass('page');
  }

  setTemplate(): string {
    return `
      <div id='chart_page__list'>차트 페이지</div>
    `;
  }
}

customElements.define('chart-page', ChartPage);
