type stateModel = {
  _state: any;
  _observers: Set<() => void>;
};

export type globalStateType = {
  [key: string]: stateModel;
};
