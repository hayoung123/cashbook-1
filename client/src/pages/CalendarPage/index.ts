import Component from 'src/lib/component';

import Calendar from 'src/components/Calendar';

export default class CalendarPage extends Component {
  constructor() {
    super();
    this.addClass('page');
  }

  setTemplate(): string {
    return `
      <div class="container column">
        <div id='calendar'></div>
      </div>
    `;
  }
  setComponents(): { [key: string]: HTMLElement } {
    return {
      calendar: new Calendar(),
    };
  }
}

customElements.define('calendar-page', CalendarPage);
