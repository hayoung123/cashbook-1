import Component from 'src/lib/component';
import { ComponentType, objType } from 'src/lib/component/type';
import { PaymentType } from 'src/type/transaction';
import CategoryBadge from '../CategoryBadge';

type StateType = {
  isEdit: boolean;
};

export default class TransactionRecord extends Component<StateType, PaymentType> {
  constructor(props: PaymentType) {
    super(props);
  }
  initState(): StateType {
    return { isEdit: false };
  }

  setTemplate(): string {
    if (!this.props) return '';

    const { title, method, price } = this.props;
    return `
        <div class="transaction__record">
          <div class="transaction__record-main">
            <div id="category-badge"></div>
            <div class="transaction__record-title">${title}</div>
          </div>
          <div class="transaction__record-method">${method}</div>
          <div class="transaction__record-price">${price}</div>
        </div>
        `;
  }
  setComponents(): ComponentType | objType {
    if (!this.props) return {};

    const { category } = this.props;

    return {
      'category-badge': new CategoryBadge({ category }),
    };
  }
}

customElements.define('transaction-record', TransactionRecord);
