export type objType = {
  [key: string]: any;
};

export type ComponentType = { [key: string]: HTMLElement };

export type Partial<T> = {
  [P in keyof T]?: T[P];
};
