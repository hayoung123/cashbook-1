import Component from 'src/lib/component';

import calendarIcon from 'public/assets/icon/calendarIcon.svg';
import chartIcon from 'public/assets/icon/chartIcon.svg';
import historyIcon from 'public/assets/icon/historyIcon.svg';
import leftArrow from 'public/assets/icon/leftArrow.svg';
import rightArrow from 'public/assets/icon/rightArrow.svg';

import { router } from '../../../index';

import _ from 'src/utils/dom';

import './style.scss';

export default class Header extends Component {
  constructor() {
    super();
    this.addClass('header');
  }

  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }

  setTemplate(): string {
    const path = location.pathname;
    const isHistory = path === '/';
    const isCalendar = path === '/calendar';
    const isChart = path === '/chart';

    return `
      <div class="header__content container row">
        <h2 class="title">우아한 가계부</h2>
        <div class="month-picker">
          <button>
            <img src=${leftArrow} alt='다음달'/>
          </button>
          <div class="month-display" >
            <div class="month">7월</div>
            <div class="year">2021</div>
          </div>
          <button>
            <img src=${rightArrow} alt='이전달'/>
          </button>
        </div>
        <div class="navigator">
          <button class="nav-btn ${isHistory ? 'selected' : ''}" data-path="/">
            <img src=${historyIcon} alt='거래내역 보기'/>
          </button>
          <button class="nav-btn ${isCalendar ? 'selected' : ''}" data-path="/calendar" >
            <img src=${calendarIcon} alt='달력 보기'/>
          </button>
          <button class="nav-btn ${isChart ? 'selected' : ''}" data-path="/chart">
            <img src=${chartIcon} alt='통계 보기'/>
          </button>
        </div>
      </div>
    `;
  }

  //TODO: 해결되지 않는 타입 무한굴래... as를 안쓰고 어떤식으로 해결해야될까...??
  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const button: HTMLButtonElement | null = target.closest('.navigator>button');
    if (!button) return;

    const path: string | void = button.dataset?.path;
    if (path) router.push(path);
  }
}

customElements.define('woowa-header', Header, { extends: 'header' });
