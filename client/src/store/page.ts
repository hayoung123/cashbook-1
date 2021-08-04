import { initState } from 'src/lib/observer';

import MainPage from 'src/pages/MainPage';

export const pageState = initState({
  key: 'pageState',
  defaultValue: { Page: MainPage },
});

export const isLoggedInState = initState({
  key: '로그인 상태',
  defaultValue: false,
});
