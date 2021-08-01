type InputType = 'email' | 'password';

function checkInputValidity(type: InputType, input: string): boolean {
  let regex: RegExp;

  switch (type) {
    case 'email':
      regex = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i;
      break;
    case 'password':
      regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      break;
    default:
      regex = /.?/;
      break;
  }

  return regex.test(input);
}

export default checkInputValidity;
