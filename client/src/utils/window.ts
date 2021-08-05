export const getUrlParams = (): { [key: string]: string } => {
  const params: { [key: string]: string } = {};

  const query = window.location.search.slice(1);

  const queryArray = query.split('&');
  queryArray.forEach((v) => {
    const [key, value] = v.split('=');
    params[key] = value;
  });

  return params;
};
