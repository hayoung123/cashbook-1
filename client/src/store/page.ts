import { initState } from 'src/lib/observer';

import MainPage from 'src/pages/MainPage';

// TODO: class의 타입은 무엇일까 (typescript class type as parameter)
export interface PageStateType {
  Page: any;
}

export const pageState = initState<PageStateType>({
  key: 'pageState',
  defaultValue: { Page: MainPage },
});

export const isLoggedInState = initState<boolean>({
  key: '로그인 상태',
  defaultValue: false,
});
