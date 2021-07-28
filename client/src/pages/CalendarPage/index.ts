import Component from 'src/lib/component';

export default class CalendarPage extends Component {
  constructor() {
    super();
    this.addClass('page');
  }

  setTemplate(): string {
    return `
      <div id='calendar_page__list'>달력페이지</div>
    `;
  }
}

customElements.define('calendar-page', CalendarPage);
