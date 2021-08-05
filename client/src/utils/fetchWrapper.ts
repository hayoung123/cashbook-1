type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';

type ObjectType = {
  [key in string]: any;
};

async function fetchWrapper(url: string, method: MethodType, body?: ObjectType): Promise<any> {
  try {
    const token = window.localStorage.getItem('_at') || '';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 401) {
        window.localStorage.removeItem('_at');
      }

      const { errorMessage } = await res.json();
      return { success: false, errorMessage };
    }

    const response = await res.json();

    if (response.requestAgain) {
      const { newAccessToken } = response;
      if (newAccessToken) {
        window.localStorage.setItem('_at', newAccessToken);
      }

      const newResult = await fetchWrapper(url, method, body);
      return newResult;
    }

    return { success: true, response };
  } catch (err) {
    console.log(err);
  }
}

export default fetchWrapper;
