import Component from 'src/lib/component';
import { ComponentType, objType } from 'src/lib/component/type';
import { PaymentType } from 'src/type/transaction';
import CategoryBadge from '../CategoryBadge';
import TransactionFrom from '../TransactionForm';

type StateType = {
  isEdit: boolean;
};

interface PropsType extends PaymentType {
  date: string;
}

export default class TransactionRecord extends Component<StateType, PropsType> {
  constructor(props: PropsType) {
    super(props);
  }
  initState(): StateType {
    return { isEdit: false };
  }

  setTemplate(): string {
    if (!this.state) return '';

    const { title, method, price } = this.props;
    const { isEdit } = this.state;
    return `
      <div class="transaction__record-container">
        <div class="transaction__record">
          <div class="transaction__record-main">
            <div id="category-badge"></div>
            <div class="transaction__record-title">${title}</div>
          </div>
          <div class="transaction__record-method">${method}</div>
          <div class="transaction__record-price">${price}</div>
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
}

customElements.define('transaction-record', TransactionRecord);
