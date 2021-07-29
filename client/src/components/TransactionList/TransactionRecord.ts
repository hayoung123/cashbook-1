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
        <div>
            <div id="category-badge"></div>
            <div class="">${title}</div>
            <div class="">${method}</div>
            <div class="">${price}</div>
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
