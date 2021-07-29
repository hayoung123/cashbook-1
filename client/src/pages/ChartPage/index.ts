import Component from 'src/lib/component';

import drawPieChart from './drawPieChart';
import drawCoordinatePlane from './drawCoordinatePlane';

import './style.scss';

export default class ChartPage extends Component {
  constructor() {
    super();
    this.addClass('page');
  }

  addEvent(): void {
    this.addEventListener('click', this.handleClick.bind(this));
    setTimeout(() => {
      drawPieChart('pie-chart');
    }, 0);
    setTimeout(() => {
      drawCoordinatePlane('line-chart');
    }, 0);
  }

  setTemplate(): string {
    return `
      <section class="container box row">
        <div class="pie-chart-container">
          <canvas id="pie-chart" width="254" height="254"></canvas>
        </div>
        <div class="statistic-container">
          <h3>이번 달 지출 금액 244,600원</h3>
          <table>
            <colgroup>
              <col>
              <col>
              <col width="50%">
            </colgruop>
            <tbody>
              <tr class="selected">
                <td class="category">생활</td>
                <td class="percentage">64%</td>
                <td class="money">534,600원</td>
              </tr>
              <tr>
                <td class="category">생활</td>
                <td class="percentage">64%</td>
                <td class="money">534,600원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="container box">
        <h3>생활 카테고리 소비 추이</h3>
        <canvas id="line-chart" width="750" height="310"></canvas>
      </section>
      <section class="container">
      </section>
    `;
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const button: HTMLTableRowElement | null = target.closest('tr');
    if (!button) return;
    console.log(button);
  }
}

customElements.define('chart-page', ChartPage);
