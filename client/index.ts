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

export const router = new Router({ routes: defaultRoutes, pageState });

const setRoute = () => {
  const isAuthorized = getState<boolean>(isLoggedInState);
  const routes = isAuthorized ? authorizedRoutes : unauthorizedRoutes;
  router.setRoutes(routes);
};

subscribe(isLoggedInState, setRoute);

async function init() {
  try {
    const res = await fetchWrapper(AUTH_URL, 'HEAD');
    // TODO: setState 분리
    if (res.success) {
      setState<boolean>(isLoggedInState)(true);
    } else {
      setState<boolean>(isLoggedInState)(false);
    }

    const app: HTMLElement = new App();
    root?.append(app);
  } catch (err) {
    console.log(err);
  }
}

init();
