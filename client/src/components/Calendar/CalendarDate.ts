import { dateState } from './../../store/transaction';
import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';
import { getMonthData } from 'src/utils/calendar';
import { getNumberWithComma } from 'src/utils/price';

interface TotalPriceType {
  income?: number;
  expenditure?: number;
  total: number;
}

interface calendarPriceInfoType {
  [key: string]: TotalPriceType;
}

interface DateType {
  year: number;
  month: number;
  date: number;
}

export default class CalendarDate extends Component {
  constructor() {
    super();
    this.keys = [dateState];
    this.subscribe();
  }
  setTemplate(): string {
    const date = getState(dateState);
    const monthArr = getMonthData(date);
    const priceInfo = this.getPriceInfo();

    const monthTemplate: string = monthArr.reduce((acc, weekArr) => {
      const weekTemplate = weekArr.reduce((acc, day) => {
        const tdClass = this.isToday({ year: date.year, month: date.month, date: day ?? 0 })
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

  priceTemplate(priceInfo: TotalPriceType | void): string {
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
  getPriceInfo(): calendarPriceInfoType {
    //fetch 작업
    return sample;
  }

  isToday({ year, month, date }: DateType): boolean {
    const dateObj = new Date();

    const todayYear = dateObj.getFullYear();
    const todayMonth = dateObj.getMonth() + 1;
    const todayDate = dateObj.getDate();

    if (todayYear === year && todayMonth === month && todayDate === date) return true;

    return false;
  }
}

customElements.define('calendar-date', CalendarDate);

const sample: calendarPriceInfoType = {
  2: {
    expenditure: -5400,
    total: -5400,
  },
  4: {
    expenditure: -132000,
    total: -132000,
  },
  9: {
    income: 1000000,
    expenditure: -10000,
    total: 990000,
  },
  18: {
    income: 50000,
    expenditure: -10000,
    total: 40000,
  },
};
