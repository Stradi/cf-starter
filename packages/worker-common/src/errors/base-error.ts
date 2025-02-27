import { StatusCode } from 'hono/utils/http-status';

type ErrorFormat = {
  statusCode: StatusCode;
  message: string;
  code: string;
  details?: Record<string, any>;
  internal?: boolean;
};

export default class BaseError extends Error {
  constructor(private error: ErrorFormat) {
    super(error.message);
  }

  public get statusCode() {
    return this.error.statusCode;
  }

  public get message() {
    return this.error.message;
  }

  public get code() {
    return this.error.code;
  }

  public get details() {
    return this.error.details;
  }

  public get internal() {
    return this.error.internal ?? false;
  }
}
