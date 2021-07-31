interface ErrorType {
  statusCode: number;
  errorMessage: string;
}

function errorHandler(errCode: string): ErrorType {
  switch (errCode) {
    case 'req/invalid-body':
      return { statusCode: 400, errorMessage: '잘못된 요청입니다.' };
    case 'auth/token-expired':
      return { statusCode: 403, errorMessage: '토큰이 만료됐습니다.' };
    case 'auth/invalid-token':
      return { statusCode: 401, errorMessage: '유효하지 않은 토큰입니다.' };
    case 'auth/existing-email':
      return { statusCode: 409, errorMessage: '이미 가입된 이메일입니다.' };
    default:
      return { statusCode: 500, errorMessage: '다시 시도해주세요.' };
  }
}

export default errorHandler;
