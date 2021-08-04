import './style.scss';

import { getState, setState } from 'src/lib/observer';
import Component from 'src/lib/component';

import calendarIcon from 'public/assets/icon/calendarIcon.svg';
import chartIcon from 'public/assets/icon/chartIcon.svg';
import historyIcon from 'public/assets/icon/historyIcon.svg';
import leftArrow from 'public/assets/icon/leftArrow.svg';
import rightArrow from 'public/assets/icon/rightArrow.svg';

import { dateState, DateType } from 'src/store/transaction';

import { router } from 'src/..';
import _ from 'src/utils/dom';
import { setTransactionData } from 'src/utils/dataSetting';
import { getNextMonth, getPrevMonth } from 'src/utils/date';

export default class Header extends Component {
  setDate: (newState: DateType) => void;
  constructor() {
    super();
    this.setDate = setState(dateState);
    this.keys = [dateState];
    this.subscribe();
    this.addClass('header');
  }

  addEvent(): void {
    _.onEvent(this, 'click', this.handleClick.bind(this));
  }

  setTemplate(): string {
    const { year, month } = getState(dateState);
    const path = location.pathname;
    const isHistory = path === '/';
    const isCalendar = path === '/calendar';
    const isChart = path === '/chart';

    return `
      <div class="header__content container row">
        <h2 class="title">우아한 가계부</h2>
        <div class="month-picker">
          <button id="left-arrow">
            <img src=${leftArrow} alt='다음달'/>
          </button>
          <div class="month-display" >
            <div class="month">${month}월</div>
            <div class="year">${year}</div>
          </div>
          <button id="right-arrow">
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
    const currentDate = getState(dateState);

    if (this.isLeftArrow(target)) {
      this.setDate(getPrevMonth(currentDate));
      setTransactionData();
    }
    if (this.isRightArrow(target)) {
      this.setDate(getNextMonth(currentDate));
      setTransactionData();
    }

    const button: HTMLButtonElement | null = target.closest('.navigator>button');
    if (!button) return;

    const path: string | void = button.dataset?.path;
    if (path) router.push(path);
  }

  isLeftArrow(target: HTMLElement): boolean {
    return !!target.closest('#left-arrow');
  }
  isRightArrow(target: HTMLElement): boolean {
    return !!target.closest('#right-arrow');
  }
}

customElements.define('woowa-header', Header, { extends: 'header' });
