type InputType = 'email' | 'password';

const validityMessage = {
  badInput: '잘못된 입력입니다',
  patternMismatch: '형식을 맞춰주세요',
  rangeOverflow: '최대범위를 큽니다',
  rangeUnderflow: '최소범위 보다 작습니다',
  stepMismatch: '',
  tooLong: '너무 깁니다',
  tooShort: '너무 짧습니다',
  typeMismatch: '올바른 형식을 맞춰주세요',
  valueMissing: '값을 입력해주세요',
};

const validityMessages = {
  email: {
    ...validityMessage,
    badInput: '잘못된 입력입니다',
    typeMismatch: '이메일 형식에 맞게 입력해주세요',
    valueMissing: '이메일을 입력해주세요',
  },
  password: {
    ...validityMessage,
    badInput: '잘못된 입력입니다',
    tooShort: '비밀번호는 8자 이상입니다',
    valueMissing: '비밀번호를 입력해주세요',
  },
};

function getValidityMessage(type: InputType, validity: ValidityState): string {
  const message = validityMessages[type];

  if (validity.badInput) {
    return message.badInput;
  }
  if (validity.patternMismatch) {
    return message.patternMismatch;
  }
  if (validity.rangeOverflow) {
    return message.rangeOverflow;
  }
  if (validity.rangeUnderflow) {
    return message.rangeUnderflow;
  }
  if (validity.stepMismatch) {
    return message.stepMismatch;
  }
  if (validity.tooLong) {
    return message.tooLong;
  }
  if (validity.tooShort) {
    return message.tooShort;
  }
  if (validity.typeMismatch) {
    return message.typeMismatch;
  }
  if (validity.valueMissing) {
    return message.valueMissing;
  }

  return '';
}

export default getValidityMessage;
