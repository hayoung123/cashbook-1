import Component from 'src/lib/component';

import { CATEGORY__INFO } from 'src/constant/category';

import './style.scss';

export default class CategoryDropdown extends Component<void, void> {
  constructor() {
    super();
    this.addClass('dropdown');
  }
  setTemplate(): string {
    const categoryTemplate = Object.entries(CATEGORY__INFO).reduce((acc, [key, { name }]) => {
      return acc + `<div data-id='${key}'>${name}</div>`;
    }, '');

    return categoryTemplate;
  }
}

customElements.define('category-dropdown', CategoryDropdown);
