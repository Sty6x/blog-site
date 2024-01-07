type t_errorData = {
  statusCode: number;
};

export default class CustomError extends Error {
  errorData: t_errorData;
  constructor(message: string, errorData: t_errorData) {
    super(message);
    this.message = message;
    this.errorData = { ...errorData };
  }
}
