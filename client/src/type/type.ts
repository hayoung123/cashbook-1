export type objType = {
  [key: string]: any;
};

export interface responseType {
  success: boolean;
  response?: any;
  errorMessage?: string;
}
