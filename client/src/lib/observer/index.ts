import { globalStateType } from './type';

const globalState: globalStateType = {};

const subscribe = (key: string, observer: () => void) => {
  globalState[key]._observers.add(observer);
};

const unsubscribe = (key: string, observer: () => void) => {
  globalState[key]._observers.delete(observer);
};

const _notify = (key: string) => globalState[key]._observers.forEach((observer) => observer());

const initState = ({ key, defaultValue }: { key: string; defaultValue: any }): string => {
  if (key in globalState) throw Error('이미 존재하는 key값 입니다.');
  globalState[key] = {
    _state: defaultValue,
    _observers: new Set(),
  };
  return key;
};

const getState = (key: string): any => {
  if (!(key in globalState)) throw Error('존재하지 않는 key값 입니다.');
  return globalState[key]._state;
};

const setState = (key: string) => (newState: any) => {
  if (!(key in globalState)) throw Error('존재하지 않는 key값 입니다.');

  if (typeof newState === 'function') {
    const state = getState(key);
    globalState[key]._state = newState(state);
  } else {
    globalState[key]._state = newState;
  }

  _notify(key);
};

export { subscribe, unsubscribe, initState, getState, setState };
