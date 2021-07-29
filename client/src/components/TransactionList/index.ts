import Component from 'src/lib/component';

import DayTransaction from './DayTransaction';

import { objType } from 'src/type/type';
import { TransactionType } from 'src/type/transaction';

export default class TransationList extends Component {
  constructor() {
    super();
  }

  //TODO 진짜데이터 props로 받아와서 처리
  setTemplate(): string {
    const template = sampleData.reduce((acc, cur, idx) => {
      return acc + `<div id='transaction-${idx}'></div>`;
    }, '');
    return template;
  }

  //TODO 진짜데이터 props로 받아와서 처리
  setComponents(): { [key: string]: HTMLElement } {
    const components: objType = {};
    sampleData.forEach((data, idx) => {
      const key = `transaction-${idx}`;
      components[key] = new DayTransaction({ ...data });
    });
    return components;
  }
}

customElements.define('transaction-list', TransationList);

const sampleData: TransactionType = [
  {
    date: '2021.07.28',
    transaction: [
      {
        category: '문화/여가',
        title: '스트리밍서비스 정기 결제',
        method: '현대카드',
        price: -10900,
      },
      {
        category: '교통',
        title: '후불 교통비 결제',
        method: '현대카드',
        price: -45340,
      },
    ],
  },
  {
    date: '2021.07.27',
    transaction: [
      {
        category: '미분류',
        title: '온라인 세미나 신청',
        method: '현대카드',
        price: -10000,
      },
      {
        category: '월급',
        title: '7월 급여',
        method: '현금',
        price: 1000000,
      },
    ],
  },
];
