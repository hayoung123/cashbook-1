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
import { transactionState, transactionType } from 'src/store/transaction';

import { getNumberWithComma } from 'src/utils/price';
import { getCategoryColor } from 'src/utils/category';
import { getTrend, getCategoryTransaction } from 'src/api/chart';
import drawPieChart from './drawPieChart';

import { objType } from 'src/type/type';
import { CategoryStatisticsType } from 'src/type/statistics';

interface StateType {
  currentSelected: string;
}

export default class CategoryStatistics extends Component<StateType, void> {
  constructor() {
    super();
    this.keys = [statisticsState];
    this.subscribe();
    this.addClass('category__statistics');
  }

  initState(): StateType {
    return {
      currentSelected: '',
    };
  }

  // TODO: 선택 시 배경 어둡게 하기
  setTemplate(): string {
    const currentSelected = getState<currentCategoryType>(currentCategoryState);

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
              .map(({ category, expenditure }, idx) => {
                const percentage = Math.round((expenditure / totalExpenditure) * 100);
                const isSelected = currentSelected === category;

                return `
                  <tr class="${isSelected ? 'selected' : ''}" id=${idx}>
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

      if (button.tagName === 'TR') {
        const { categoryList }: StatisticsType = getState<StatisticsType>(statisticsState);
        const selectedCategory = categoryList[+button.id].category;

        const currentCategory = getState<currentCategoryType>(currentCategoryState);
        const setCurrentCategoryState = setState<currentCategoryType>(currentCategoryState);

        if (currentCategory === selectedCategory) {
          return;
        }

        const res = await Promise.all([
          getCategoryTransaction(selectedCategory),
          getTrend(selectedCategory),
        ]);

        const transactionRes = res[0];
        const trendRes = res[1];

        if (transactionRes.success) {
          const setTransactionState = setState<transactionType>(transactionState);
          setTransactionState(transactionRes.response);
        }

        if (trendRes.success) {
          const yearlyTrend = trendRes.response.map((v: number) => Math.abs(v));
          const setTrendState = setState<TrendType>(trendState);

          setTrendState({ yearlyTrend });
          this.setState({ currentSelected: selectedCategory });
        }

        setCurrentCategoryState(selectedCategory);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

customElements.define('category-statistics', CategoryStatistics);
