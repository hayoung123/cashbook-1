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
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (method === 'HEAD') {
        return { success: false };
      }
      const { errorMessage } = await res.json();
      return { success: false, errorMessage };
    }

    if (method === 'HEAD') {
      return { success: true };
    }

    const response = await res.json();

    return { success: true, response };
  } catch (err) {
    console.log(err);
  }
}

export default fetchWrapper;
