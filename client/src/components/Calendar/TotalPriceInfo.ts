import Component from 'src/lib/component';
import { getNumberWithComma } from 'src/utils/price';

interface TotalPriceInfoType {
  totalIncome: number;
  totalExpenditure: number;
  totalPrice: number;
}

export default class TotalPriceInfo extends Component {
  setTemplate(): string {
    const { totalIncome, totalExpenditure, totalPrice } = this.getTotalPriceInfo();

    return `
      <div>
        <div>총 수입 ${getNumberWithComma(totalIncome)}</div>
        <div>총 지출 ${getNumberWithComma(totalExpenditure)}</div>
      </div>
      <div>총계 ${getNumberWithComma(totalPrice)}</div>
    `;
  }

  getTotalPriceInfo(): TotalPriceInfoType {
    //fetch
    return sample;
  }
}

customElements.define('total-price-info', TotalPriceInfo);

const sample: TotalPriceInfoType = {
  totalIncome: 1000000,
  totalExpenditure: -157400,
  totalPrice: 864200,
};
