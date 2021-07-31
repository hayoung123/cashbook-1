interface ParamType {
  message: string;
  code: string;
}

class CustomError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.code = code;
  }
}

function errorGenerator({ message, code }: ParamType): CustomError {
  return new CustomError(code, message);
}

export default errorGenerator;
