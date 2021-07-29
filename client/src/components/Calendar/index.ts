import Component from 'src/lib/component';
import CalendarDate from './CalendarDate';
import CalendarDay from './CalendarDay';
import './style.scss';

export default class Calendar extends Component {
  setTemplate(): string {
    return `
      <div id='calendar-day'></div>
      <div id='calendar-date'></div>
    `;
  }
  setComponents(): { [key: string]: HTMLElement } {
    return {
      'calendar-day': new CalendarDay(),
      'calendar-date': new CalendarDate(),
    };
  }
}

customElements.define('woowa-calendar', Calendar);
