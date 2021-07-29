import Component from 'src/lib/component';

import { CATEGORY__INFO } from 'src/constant/category';

import './style.scss';

type CategoryType = {
  category: string;
};

export default class CategoryBadge extends Component<void, CategoryType> {
  constructor(props: CategoryType) {
    super(props);
    this.addClass('category__badge');
  }
  setTemplate(): string {
    const { category } = this.props;

    const categoryInfo: { name: string; color: string } = CATEGORY__INFO[category]
      ? { name: CATEGORY__INFO[category].name, color: CATEGORY__INFO[category].color }
      : { name: '123', color: '#000' };
    return `
      <div style="background-color:${categoryInfo.color};">${categoryInfo.name}</div>    
    `;
  }
}

customElements.define('category-badge', CategoryBadge);
