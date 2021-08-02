import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import TransationList from 'src/components/TransactionList';

import {
  currentCategoryState,
  trendState,
  TrendType,
  currentCategoryType,
} from 'src/store/statistics';
import drawCoordinatePlane from './drawCoordinatePlane';
import drawLineChart from './drawLineChart';

export default class Trend extends Component<void, void> {
  constructor() {
    super();
    this.keys = [trendState, currentCategoryState];
    this.subscribe();
    this.addClass('category__statistics');
  }

  setTemplate(): string {
    const { currentCategory }: currentCategoryType = getState(currentCategoryState);

    return `
      <section class="container box">
        <h3>${currentCategory} 카테고리 소비 추이</h3>
        <canvas id="line-chart" width="750" height="310"></canvas>
      </section>
      <section class="container">
        <div id="chart__list"></div>
      </section>
    `;
  }

  setComponents(): { [key: string]: HTMLElement } {
    return {
      // chart__list: new TransationList(),
    };
  }

  componentDidMount(): void {
    const { yearlyTrend }: TrendType = getState(trendState);

    drawCoordinatePlane(this, 'line-chart');
    drawLineChart(this, 'line-chart', yearlyTrend);
  }
}

customElements.define('a-trend', Trend);
