import Component from 'src/lib/component';

import CalendarDate from './CalendarDate';
import CalendarDay from './CalendarDay';
import TotalPriceInfo from './TotalPriceInfo';

import './style.scss';

export default class Calendar extends Component {
  setTemplate(): string {
    return `
      <div id='calendar-day'></div>
      <div id='calendar-date'></div>
      <div id='total-price-info'></div>
    `;
  }
  setComponents(): { [key: string]: HTMLElement } {
    return {
      'calendar-day': new CalendarDay(),
      'calendar-date': new CalendarDate(),
      'total-price-info': new TotalPriceInfo(),
    };
  }
}

customElements.define('woowa-calendar', Calendar);
