import { initState } from 'src/lib/observer';
import MainPage from 'src/pages/MainPage';

export const pageState = initState({
  key: 'pageState',
  defaultValue: { Page: MainPage },
});
