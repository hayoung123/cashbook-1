function errorGenerator({ message, code }) {
  const error = new Error(message);
  error.code = code;

  return error;
}

export default errorGenerator;
