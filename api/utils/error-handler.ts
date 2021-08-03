interface ErrorType {
  statusCode: number;
  errorMessage: string;
}

function errorHandler(errCode: string): ErrorType {
  switch (errCode) {
    case 'req/invalid-body':
      return { statusCode: 400, errorMessage: '잘못된 요청입니다.' };
    case 'req/invalid-query':
      return { statusCode: 400, errorMessage: '잘못된 요청입니다.' };
    case 'req/no-token':
      return { statusCode: 401, errorMessage: '다시 로그인해주세요.' };
    case 'req/invalid-date':
      return { statusCode: 409, errorMessage: '올바른 날짜를 입력해주세요.' };
    case 'req/invalid-price':
      return { statusCode: 409, errorMessage: '가격에 올바른 숫자를 입력해주세요.' };
    case 'req/invalid-category':
      return { statusCode: 409, errorMessage: '올바른 카테고리를 선택해주세요.' };
    case 'auth/wrong-password':
      return { statusCode: 401, errorMessage: '비밀번호를 확인해주세요.' };
    case 'auth/account-not-found':
      return { statusCode: 404, errorMessage: '없는 계정입니다.' };
    case 'auth/token-expired':
      return { statusCode: 403, errorMessage: '다시 로그인해주세요.' };
    case 'auth/invalid-token':
      return { statusCode: 401, errorMessage: '다시 로그인해주세요.' };
    case 'auth/existing-email':
      return { statusCode: 409, errorMessage: '이미 가입된 이메일입니다.' };
    case 'auth/unauthorized-token':
      return { statusCode: 409, errorMessage: '다시 로그인해주세요.' };
    case 'auth/need-re-signin':
      return { statusCode: 409, errorMessage: '다시 로그인해주세요.' };
    case 'payment/nonexistent-payment':
      return { statusCode: 409, errorMessage: '존재하지 않은 결제수단입니다.' };
    case 'payment/unowned-payment':
      return { statusCode: 409, errorMessage: '등록되지 않은 결제수단입니다.' };
    case 'payment/owned-payment':
      return { statusCode: 409, errorMessage: '이미 등록된 결제수단입니다.' };
    case 'transaction/unowned-transaction':
      return { statusCode: 409, errorMessage: '본인의 결제내역이 아닙니다.' };

    default:
      return { statusCode: 500, errorMessage: '다시 시도해주세요.' };
  }
}

export default errorHandler;
