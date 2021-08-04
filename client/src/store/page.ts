import { initState } from 'src/lib/observer';
import { paramsType } from 'src/lib/router';

// TODO: class의 타입은 무엇일까 (typescript class type as parameter)
export interface PageStateType {
  Page: any;
  params?: { [key: string]: paramsType | void };
}

export const pageState = initState<PageStateType>({
  key: 'pageState',
  defaultValue: { Page: null },
});

export const isLoggedInState = initState<boolean>({
  key: '로그인 상태',
  defaultValue: false,
});
