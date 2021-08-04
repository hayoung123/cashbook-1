import './index.scss';

import Router from 'src/lib/router';
import { subscribe, setState, getState } from 'src/lib/observer';

import { authorizedRoutes, unauthorizedRoutes } from 'src/configs/routes';
import { AUTH_URL } from 'src/configs/urls';

import App from 'src/App';

import { pageState, isLoggedInState } from 'src/store/page';

import fetchWrapper from 'src/utils/fetchWrapper';

const root: HTMLElement | null = document.querySelector('#root');

const defaultRoutes = unauthorizedRoutes;

// TODO: '/'외의 경로에서 로그인 상태가 바뀔 경우 새로고침 하면 흰 화면이 나타나는 현상 해결
export const router = new Router({ routes: defaultRoutes, pageState });

const setRoute = () => {
  const isAuthorized = getState(isLoggedInState);
  const routes = isAuthorized ? authorizedRoutes : unauthorizedRoutes;
  router.setRoutes(routes);
};

subscribe(isLoggedInState, setRoute);

async function init() {
  try {
    const res = await fetchWrapper(AUTH_URL, 'HEAD');
    if (res.success) {
      setState(isLoggedInState)(true);
      setRoute();
    } else {
      setState(isLoggedInState)(false);
      setRoute();
    }

    const app: HTMLElement = new App();
    root?.append(app);
  } catch (err) {
    console.log(err);
  }
}

init();
