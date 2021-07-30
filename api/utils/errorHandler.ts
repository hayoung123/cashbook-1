interface ErrorType {
  statusCode: number;
  errorMessage: string;
}

function errorHandler(errCode: string): ErrorType {
  switch (errCode) {
    case 'auth/token-expired':
      return { statusCode: 403, errorMessage: '토큰이 만료됐습니다.' };
    case 'auth/invalid-token':
      return { statusCode: 401, errorMessage: '유효하지 않은 토큰입다.' };
    default:
      return { statusCode: 500, errorMessage: '서버 오류.' };
  }
}

export default errorHandler;
