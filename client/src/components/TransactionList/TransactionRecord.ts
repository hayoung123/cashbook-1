import Component, { ComponentType, objType } from 'src/lib/component';

import CategoryBadge from 'src/components/CategoryBadge';
import TransactionFrom from 'src/components/TransactionForm';

import _ from 'src/utils/dom';
import { getNumberWithComma } from 'src/utils/price';

import { RecordType } from 'src/type/transaction';

type StateType = {
  isEdit: boolean;
};

export default class TransactionRecord extends Component<StateType, RecordType> {
  constructor(props: RecordType) {
    super(props);
  }
  initState(): StateType {
    return { isEdit: false };
  }

  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }

  setTemplate(): string {
    if (!this.state) return '';

    const { title, payment, price } = this.props;
    const { isEdit } = this.state;
    return `
      <div class="transaction__record-container">
        <div class="transaction__record">
          <div class="transaction__record-main">
            <div id="category-badge"></div>
            <div class="transaction__record-title">${title}</div>
          </div>
          <div class="transaction__record-method">${payment}</div>
          <div class="transaction__record-price">${getNumberWithComma(price)}</div>
        </div>
        ${
          isEdit
            ? `
        <div class='divider'></div>
        <div id="transaction__edit-form"></div>`
            : ''
        }
      </div>
      `;
  }
  setComponents(): ComponentType | objType {
    if (!this.props) return {};

    const { category } = this.props;

    return {
      'category-badge': new CategoryBadge({ category }),
      'transaction__edit-form': new TransactionFrom({ isEdit: true, data: this.props }),
    };
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (_.isTarget(target, '.transaction__record')) {
      this.setState((state) => ({ isEdit: !state?.isEdit }));
    }
  }
}

customElements.define('transaction-record', TransactionRecord);
