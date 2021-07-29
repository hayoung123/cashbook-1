import Component from 'src/lib/component';

export default class CalendarDay extends Component {
  setTemplate(): string {
    return `
      <div>일</div>
      <div>월</div>
      <div>화</div>
      <div>수</div>
      <div>목</div>
      <div>금</div>
      <div>토</div>
    `;
  }
}

customElements.define('calendar-day', CalendarDay);
