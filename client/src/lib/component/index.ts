type objType = {
  [key: string]: any;
};

type ComponentType = {
  props: any;
  state: any;
  keys: Array<string>;
  reRender: () => void;
  components: objType;
};

export default class Component {
  public props: any;
  public state: any;
  public keys: Array<string>;
  public reRender: () => void;
  public components: objType;

  constructor(props: any) {
    this.props = props;
    this.state;

    this.keys = [];
    this.components;
    this.init();
    this.reRender = this.subscribedRender.bind(this);
  }
  init() {
    this.render();
    this.addEvent();
  }
  render() {
    // this.components = this.setComponents();
    // this.innerHTML = setTemplate();
  }
  addEvent() {}

  //   setTemplate() {
  //     return `
  //       <div>1</div>
  //       <Component>
  //       <div>3</div>
  //     `;
  //   }

  //   appendChild () {
  //     const $button = query('#page__button')
  //     $button.append(new Button())
  //     $root.replaceChild(new Button(), $button)
  //   }

  setComponents() {}
  //구독한 상태 변경시 렌더링 되는 함수
  subscribedRender() {
    this.unsubscribe(); //하위 컴포넌트 구독 해제
    this.render(); //하위 컴포넌트 재생성
  }
  subscribe() {
    this.keys.forEach((key) => subscribe(key, this.render));
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
