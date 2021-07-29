import { initState } from 'src/lib/observer';

export const dateState = initState({
  key: 'dateState',
  defaultValue: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
});
