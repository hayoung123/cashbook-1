import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import { dateState } from 'src/store/transaction';
import { calendarDataState } from 'src/store/calendar';

import { getMonthData, isToday } from 'src/utils/calendar';
import { getNumberWithComma } from 'src/utils/price';

interface TotalPriceType {
  income: number;
  expenditure: number;
  total: number;
}

export default class CalendarDate extends Component {
  constructor() {
    super();
    this.keys = [dateState, calendarDataState];
    this.subscribe();
  }
  setTemplate(): string {
    const date = getState(dateState);
    const monthArr = getMonthData(date);
    const { statistics: priceInfo } = getState(calendarDataState);

    const monthTemplate: string = monthArr.reduce((acc, weekArr) => {
      const weekTemplate = weekArr.reduce((acc, day) => {
        const tdClass = isToday({ year: date.year, month: date.month, date: day ?? 0 })
          ? 'today-date'
          : '';

        const priceTemplate = this.priceTemplate(priceInfo[day ? day : '']);

        return (
          acc +
          `<td class=${tdClass}>
            ${priceTemplate}
            <div class='calendar-date__date'>${day ? day : ''}</div>
           </td>`
        );
      }, '');

      return acc + `<tr>${weekTemplate}</tr>`;
    }, '');

    return `
      <table>
       <tbody>${monthTemplate}</tbody>
      </table>
    `;
  }

  priceTemplate(priceInfo: TotalPriceType): string {
    if (!priceInfo) return `<div class='calendar__price-info'></div>`;

    const { income, expenditure, total } = priceInfo;

    return `
      <div class='calendar__price-info'>
        ${income ? `<div class='calendar__price-income'>${getNumberWithComma(income)}</div>` : ''}
        ${
          expenditure
            ? `<div class='calendar__price-expenditure'>${getNumberWithComma(expenditure)}</div>`
            : ''
        }
        ${total ? `<div class='calendar__price-total'>${getNumberWithComma(total)}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('calendar-date', CalendarDate);
