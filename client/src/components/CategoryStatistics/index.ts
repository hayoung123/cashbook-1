import Component from 'src/lib/component';
import { setState, getState } from 'src/lib/observer';

import CategoryBadge from 'src/components/CategoryBadge';

import {
  statisticsState,
  StatisticsType,
  currentCategoryState,
  currentCategoryType,
  trendState,
  TrendType,
} from 'src/store/statistics';

import { getNumberWithComma } from 'src/utils/price';
import { getCategoryColor } from 'src/utils/category';
import { getTrend } from 'src/api/chart';
import drawPieChart from './drawPieChart';

import { objType } from 'src/type/type';
import { CategoryStatisticsType } from 'src/type/statistics';

export default class CategoryStatistics extends Component<void, void> {
  constructor() {
    super();
    this.keys = [statisticsState];
    this.subscribe();
    this.addClass('category__statistics');
  }

  setTemplate(): string {
    const { totalExpenditure, categoryList }: StatisticsType =
      getState<StatisticsType>(statisticsState);

    return `
      <section class="container box row">
      <div class="pie-chart-container">
        <canvas id="pie-chart" width="254" height="254"></canvas>
      </div>
      <div class="statistic-container">
        <h3>이번 달 지출 금액 ${getNumberWithComma(totalExpenditure)}원</h3>
        <table>
          <colgroup>
            <col>
            <col width="20%">
            <col>
          </colgruop>
          <tbody>
            ${categoryList
              .map(({ expenditure }, idx) => {
                const percentage = Math.round((expenditure / totalExpenditure) * 100);
                return `
                  <tr id=${idx}>
                    <td class="category"><div id="chart__badge-${idx}"></div></td>
                    <td class="percentage">${percentage}%</td>
                    <td class="money">${getNumberWithComma(expenditure)}원</td>
                  </tr>
                  `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
      </section>
    `;
  }

  addEvent(): void {
    this.addEventListener('click', this.handleClick.bind(this));
  }

  setComponents(): { [key: string]: HTMLElement } {
    const { categoryList }: { categoryList: CategoryStatisticsType[] } =
      getState<StatisticsType>(statisticsState);

    const components: objType = {};
    categoryList.forEach(({ category }, idx) => {
      const key = `chart__badge-${idx}`;
      components[key] = new CategoryBadge({ category });
    });

    return components;
  }

  componentDidMount(): void {
    const { totalExpenditure, categoryList }: StatisticsType =
      getState<StatisticsType>(statisticsState);

    const pieInfo = categoryList.map(({ category, expenditure }) => {
      return {
        color: getCategoryColor(category),
        pie: Math.round((expenditure / totalExpenditure) * 100),
      };
    });

    drawPieChart(this, 'pie-chart', pieInfo);
  }

  async handleClick(e: Event): Promise<void> {
    try {
      const target = e.target as HTMLElement;
      const button: HTMLTableRowElement | null = target.closest('tr');
      if (!button) return;

      button.parentElement?.querySelectorAll('tr').forEach((t) => {
        t.classList.remove('selected');
      });

      if (button.tagName === 'TR') {
        button.classList.add('selected');

        const { categoryList }: StatisticsType = getState<StatisticsType>(statisticsState);
        const currentCategory = categoryList[+button.id].category;

        setState<currentCategoryType>(currentCategoryState)({ currentCategory });
        const t = await getTrend(currentCategory);
        if (t.success) {
          const yearlyTrend = t.response.map((v: number) => Math.abs(v));
          setState<TrendType>(trendState)({ yearlyTrend });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

customElements.define('category-statistics', CategoryStatistics);
