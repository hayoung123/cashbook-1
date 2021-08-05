import { AUTH_URL, SIGNOUT_URL } from 'src/configs/urls';

import fetchWrapper from 'src/utils/fetchWrapper';

import { responseType } from 'src/type/type';

export const userLogout = async (): Promise<responseType> => {
  const result = await fetchWrapper(SIGNOUT_URL, 'GET');
  return result;
};

export const getGithubLoginUrl = async (): Promise<responseType> => {
  const result = await fetchWrapper(AUTH_URL + '/github', 'GET');
  return result;
};

export const getGithubAuth = async (code: string): Promise<responseType> => {
  const result = await fetchWrapper(AUTH_URL + '/github', 'POST', { code });
  return result;
};
