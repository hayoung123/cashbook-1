import { setState } from 'src/lib/observer';
import { PageStateType } from 'src/store/page';

import { routesType, paramsType } from './type';

export * from './type';

type PropsType = {
  routes: { [key: string]: any };
  pageState: string;
};

export default class Router {
  routes: routesType;
  setPage: (arg: any) => void;
  currIndex: number;
  constructor({ routes, pageState }: PropsType) {
    this.routes = routes;
    this.setPage = setState<PageStateType>(pageState);
    this.currIndex = 0;

    this.init();
  }

  init(): void {
    history.replaceState({ index: 0 }, '');
    window.addEventListener('popstate', this.handlePopstate.bind(this));
  }

  setRoutes(routes: { [key: string]: any }): void {
    this.routes = routes;
    this.handlePopstate();
  }

  // 브라우저 뒤로, 앞으로가기
  handlePopstate(): void {
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

    if (!Page) {
      this.replace('/');
      return;
    }

    this.setPage({ Page, params });
    this.currIndex = history.state.index;
  }

  // 화면 앞으로가기
  push(pathname: string): void {
    history.pushState({ index: this.currIndex + 1 }, '', pathname);
    this.handlePopstate();
  }

  replace(pathname: string): void {
    history.replaceState({ index: this.currIndex }, '', pathname);
    this.handlePopstate();
  }

  // 화면 뒤로가기
  pop(): void {
    if (!this.currIndex) {
      history.pushState({ index: this.currIndex - 1 }, '', '/');
      this.handlePopstate();
      return;
    }
    history.back();
  }

  //
  match(routePath: string, path: string): boolean {
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

  isBack(index: number): boolean {
    return index < this.currIndex;
  }
}
