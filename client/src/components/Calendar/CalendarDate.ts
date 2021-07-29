import { dateState } from './../../store/transaction';
import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';
import { getMonthData } from 'src/utils/calendar';

export default class CalendarDate extends Component {
  constructor() {
    super();
    this.keys = [dateState];
    this.subscribe();
  }
  setTemplate(): string {
    const date = getState(dateState);
    const monthArr = getMonthData(date);

    const monthTemplate: string = monthArr.reduce((acc, weekArr) => {
      const weekTemplate = weekArr.reduce((acc, day) => {
        return acc + `<td>${day ? day : ''}</td>`;
      }, '');

      return acc + `<tr>${weekTemplate}</tr>`;
    }, '');

    return `
      <table>
       <tbody>${monthTemplate}</tbody>
      </table>
    `;
  }
}

customElements.define('calendar-date', CalendarDate);
