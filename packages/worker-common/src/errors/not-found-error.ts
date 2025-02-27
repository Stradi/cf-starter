import BaseError from './base-error';

export default class NotFoundError extends BaseError {
  constructor() {
    super({
      statusCode: 404,
      message: 'Not Found',
      code: 'NOT_FOUND',
    });
  }
}
