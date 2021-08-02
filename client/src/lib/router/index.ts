import { pageState } from 'src/store/page';
import { routesType, paramsType } from './type';
import { setState } from 'src/lib/observer';

type PropsType = {
  routes: { [key: string]: Object };
  pageState: string;
};

export default class Router {
  routes: routesType;
  setPage: (arg: any) => void;
  currIndex: number;
  constructor({ routes, pageState }: PropsType) {
    this.routes = routes;
    this.setPage = setState(pageState);
    this.currIndex = 0;

    this.init();
  }

  init() {
    history.replaceState({ index: 0 }, '');
    window.addEventListener('popstate', this.handlePopstate.bind(this));
    this.handlePopstate();
  }

  setRoutes(routes: { [key: string]: Object }): void {
    this.routes = routes;
    this.handlePopstate();
  }

  // 브라우저 뒤로, 앞으로가기
  handlePopstate() {
    const path = location.pathname;

    //TODO: 클래스의 타입이 뭔지 알아보고 적용해봐야된다.
    let Page;
    let params: paramsType | void;

    for (const [routePath, component] of Object.entries(this.routes)) {
      if (this.match(routePath, path)) {
        Page = component;
        params = this.parseParams(routePath, path);
        break;
      }
    }

    this.setPage({ Page, params, direction: this.isBack(history.state.index) ? 'left' : 'right' });
    this.currIndex = history.state.index;
  }

  // 화면 앞으로가기
  push(pathname: string) {
    history.pushState({ index: this.currIndex + 1 }, '', pathname);
    this.handlePopstate();
  }

  replace(pathname: string) {
    history.replaceState({ index: this.currIndex }, '', pathname);
    this.handlePopstate();
  }

  // 화면 뒤로가기
  pop() {
    if (!this.currIndex) {
      history.pushState({ index: this.currIndex - 1 }, '', '/');
      this.handlePopstate();
      return;
    }
    history.back();
  }

  //
  match(routePath: string, path: string) {
    const routeChunks = routePath.split('/');
    const chunks = path.split('/');

    if (routeChunks.length !== chunks.length) {
      return false;
    }

    for (let i = 0; i < chunks.length; i++) {
      if (routeChunks[i][0] === ':' || routeChunks[i] === chunks[i]) {
        continue;
      }
      return false;
    }
    return true;
  }

  parseParams(routePath: string, path: string): paramsType {
    const params: paramsType = {};

    const routeChunks = routePath.split('/');
    const chunks = path.split('/');

    for (let i = 0; i < chunks.length; i++) {
      if (routeChunks[i][0] !== ':') {
        continue;
      }

      params[routeChunks[i].slice(1)] = chunks[i];
    }

    return params;
  }

  isBack(index: number) {
    return index < this.currIndex;
  }
}
