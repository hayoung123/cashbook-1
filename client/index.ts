// index.ts
import './index.scss';

import Router from './src/lib/router';
import { pageState } from './src/store/page';
import App from './src/App';

import { unauthorizedRoutes } from './src/configs/routes';

const root: HTMLElement | null = document.querySelector('#root');

//TODO: 로그인 체크 후 값 넣어주기
const routes = unauthorizedRoutes;

export const router = new Router({ routes, pageState });

const app: HTMLElement = new App();
root?.append(app);
