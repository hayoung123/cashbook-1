interface ErrorType extends Error {
  code: string;
}

interface ParamType {
  message: string;
  code: string;
}

function errorGenerator({ message, code }: ParamType): ErrorType {
  const error = {
    ...new Error(message),
    code,
  };

  return error;
}

export default errorGenerator;
