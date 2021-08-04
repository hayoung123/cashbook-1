import './style.scss';

import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import DayTransaction from './DayTransaction';

// TODO : 타입분리
import { transactionState, transactionType } from 'src/store/transaction';

import { objType } from 'src/type/type';

export default class TransationList extends Component {
  constructor() {
    super();
    this.keys = [transactionState];
    this.subscribe();
  }

  setTemplate(): string {
    const { transaction } = getState<transactionType>(transactionState);

    const template = transaction.reduce((acc, cur, idx) => {
      return acc + `<div id='transaction-${idx}'></div>`;
    }, '');
    return template;
  }

  setComponents(): { [key: string]: HTMLElement } {
    const { transaction } = getState<transactionType>(transactionState);

    const components: objType = {};
    transaction.forEach((data, idx) => {
      const key = `transaction-${idx}`;
      components[key] = new DayTransaction(data);
    });
    return components;
  }
}

customElements.define('transaction-list', TransationList);
