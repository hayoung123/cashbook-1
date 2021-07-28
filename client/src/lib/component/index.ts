import { subscribe, unsubscribe } from '../observer';
type objType = {
  [key: string]: any;
};

export default class Component extends HTMLElement {
  public props?: any;
  public state: any;
  public keys: Array<string>;
  public reRender: () => void;
  public components: objType;

  constructor(props?: any) {
    super();
    this.props = props;
    this.state = {};

    this.keys = [];
    this.components = {};

    this.init();
    this.reRender = this.subscribedRender.bind(this);
  }

  init() {
    this.state = this.initState();
    this.render();
    this.addEvent();
  }

  initState() {
    return {};
  }

  addEvent() {}

  render() {
    this.components = this.setComponents();
    this.innerHTML = this.setTemplate();
    this.setLayout();
  }

  //innerHTML
  setTemplate(): string {
    return '';
  }

  //컴포넌트를 각 위치에 맞게 replace
  setLayout() {
    for (const [key, Comp] of Object.entries(this.components)) {
      const $$ = this.querySelector(`#${key}`) as HTMLElement;
      this.replaceChild(Comp, $$);
    }
  }

  //사용하는 컴포넌트 init
  setComponents() {
    return {};
  }

  //클래스 추가 메소드
  addClass(...args: Array<string>) {
    this.className = args.join(' ');
  }

  //구독한 상태 변경시 렌더링 되는 함수
  subscribedRender() {
    this.unsubscribe(); //하위 컴포넌트 구독 해제
    this.render(); //하위 컴포넌트 재생성
  }

  //key에 속한 것들 render
  subscribe() {
    this.keys.forEach((key) => subscribe(key, this.reRender));
  }

  unsubscribe(isCurrentComp = true) {
    if (!isCurrentComp && this.keys.length) {
      this.keys.forEach((key) => unsubscribe(key, this.reRender));
    }

    //하위 컴포넌트들도 리렌더링되기 때문에 unsubscribe
    const components = Object.values(this.components);
    components.forEach((component) => {
      component.unsubscribe(false);
    });
  }

  //TODO: 하위 전부다 렌더링 되는 것 해결
  setState(newState: ((arg?: any) => objType) | objType) {
    if (typeof newState === 'function') {
      this.state = { ...this.state, ...newState(this.state) };
    } else {
      this.state = { ...this.state, ...newState };
    }
    this.render();
  }
}
