import Component from 'src/lib/component';

import DayTransaction from './DayTransaction';

import { objType } from 'src/type/type';

import './style.scss';
import { DayRecordsType, transactionState } from 'src/store/transaction';
import { getState } from 'src/lib/observer';

export default class TransationList extends Component {
  constructor() {
    super();
    this.keys = [transactionState];
    this.subscribe();
  }

  //TODO 진짜데이터 props로 받아와서 처리
  setTemplate(): string {
    const { transaction } = getState(transactionState);

    const template = transaction.reduce((acc: string, cur: DayRecordsType, idx: number) => {
      return acc + `<div id='transaction-${idx}'></div>`;
    }, '');
    return template;
  }

  //TODO 진짜데이터 props로 받아와서 처리
  setComponents(): { [key: string]: HTMLElement } {
    const { transaction } = getState(transactionState);

    const components: objType = {};
    transaction.forEach((data: DayRecordsType, idx: number) => {
      const key = `transaction-${idx}`;
      components[key] = new DayTransaction(data);
    });
    return components;
  }
}

customElements.define('transaction-list', TransationList);
