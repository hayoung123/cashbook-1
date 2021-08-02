import { subscribe, unsubscribe } from 'src/lib/observer';
import { objType, Partial } from './type';

export default class Component<S = void, T = void> extends HTMLElement {
  public state: S | void;
  public props: T;
  public keys: Array<string>;
  public reRender: () => void;
  public components: objType;

  constructor(props: T) {
    super();
    this.props = props;
    this.state = this.initState();

    this.keys = [];
    this.components = {};

    this.init();
    this.reRender = this.subscribedRender.bind(this);
  }

  init(): void {
    this.render();
    this.addEvent();
  }

  initState(): S | void {
    return;
  }

  addEvent(): void {
    return;
  }

  render(): void {
    this.components = this.setComponents();
    this.innerHTML = this.setTemplate();
    this.setLayout();
    this.componentDidMount();
  }

  //innerHTML
  setTemplate(): string {
    return '';
  }

  //컴포넌트를 각 위치에 맞게 replace
  setLayout(): void {
    for (const [key, Comp] of Object.entries(this.components)) {
      const $$ = this.querySelector(`#${key}`);
      $$?.replaceWith(Comp);
    }
  }

  componentDidMount(): void {
    return;
  }

  //사용하는 컴포넌트 init
  setComponents(): objType {
    return {};
  }

  //클래스 추가 메소드
  addClass(...args: Array<string>): void {
    this.className = args.join(' ');
  }

  //구독한 상태 변경시 렌더링 되는 함수
  subscribedRender(): void {
    this.unsubscribe(); //하위 컴포넌트 구독 해제
    this.render(); //하위 컴포넌트 재생성
  }

  //key에 속한 것들 render
  subscribe(): void {
    this.keys.forEach((key) => subscribe(key, this.reRender));
  }

  unsubscribe(isCurrentComp = true): void {
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
  //TODO: throw Error를 에러처리를 따로 해놓지 않는다면 배포 당시에 삭제해야되나??
  setState(newState: ((arg?: S) => Partial<S> | void) | Partial<S>): void {
    if (!this.state) throw Error('변경할 상태가 없습니다!');

    if (typeof newState === 'function') {
      this.state = { ...this.state, ...newState(this.state) };
    } else {
      this.state = { ...this.state, ...newState };
    }
    this.reRender();
  }
}
