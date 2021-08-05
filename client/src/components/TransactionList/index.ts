import './style.scss';

import Component from 'src/lib/component';
import { getState } from 'src/lib/observer';

import DayTransaction from './DayTransaction';

import { transactionState, transactionType } from 'src/store/transaction';

import { objType } from 'src/type/type';

interface PropType {
  isEditable: boolean;
}

export default class TransationList extends Component<void, PropType> {
  constructor(props: PropType) {
    super(props);
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
    const { isEditable } = this.props;
    const { transaction } = getState<transactionType>(transactionState);

    const components: objType = {};
    transaction.forEach((data, idx) => {
      const key = `transaction-${idx}`;
      components[key] = new DayTransaction({ isEditable, data });
    });
    return components;
  }
}

customElements.define('transaction-list', TransationList);
