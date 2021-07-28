export type objType = {
  [key: string]: any;
};

export type Partial<T> = {
  [P in keyof T]?: T[P];
};
