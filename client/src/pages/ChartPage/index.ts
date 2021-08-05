import './style.scss';

import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import CategoryStatistics from 'src/components/CategoryStatistics';
import Trend from 'src/components/Trend';

import { currentCategoryState, currentCategoryType } from 'src/store/statistics';

import { objType } from 'src/type/type';

interface StateType {
  current: string | null;
  trends: number[] | null;
}

export default class ChartPage extends Component<StateType, void> {
  constructor() {
    super();
    this.keys = [currentCategoryState];
    this.subscribe();
    this.addClass('page');
  }

  setTemplate(): string {
    return `
      <div id="chart__category-statistics"></div>
      <div id="chart__trend"></div>
    `;
  }

  setComponents(): objType {
    const { currentCategory } = getState<currentCategoryType>(currentCategoryState);

    return {
      'chart__category-statistics': new CategoryStatistics(),
      ...(currentCategory && {
        chart__trend: new Trend(),
      }),
    };
  }
}

customElements.define('chart-page', ChartPage);
