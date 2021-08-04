import './style.scss';

import Component from 'src/lib/component';

import { CATEGORY__INFO } from 'src/constant/category';

import _ from 'src/utils/dom';

interface PropsType {
  setCategory: (category: string) => void;
}

export default class CategoryDropdown extends Component<void, PropsType> {
  constructor(props: PropsType) {
    super(props);
    this.addClass('dropdown');
  }

  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }
  setTemplate(): string {
    const categoryTemplate = Object.entries(CATEGORY__INFO).reduce((acc, [key, { name }]) => {
      return acc + `<div class='category-item' data-id='${key}'>${name}</div>`;
    }, '');

    return categoryTemplate;
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const categoryItem = target.closest('.category-item');

    if (!categoryItem) return;

    this.props.setCategory(categoryItem.textContent || '');
  }
}

customElements.define('category-dropdown', CategoryDropdown);
