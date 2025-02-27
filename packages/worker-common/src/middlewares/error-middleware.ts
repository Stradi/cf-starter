import { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { fromError } from 'zod-validation-error';
import BaseError from '../errors/base-error';
import resp from '../utils/response';

export default function errorMiddleware(): ErrorHandler {
  return (error, ctx) => {
    if (error instanceof BaseError && !error.internal) {
      const obj = resp({
        status: 'error',
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });

      ctx.status(error.statusCode);
      return ctx.json(obj);
    } else if (error instanceof ZodError) {
      const validationError = fromError(error, {
        maxIssuesInMessage: 1,
        prefix: null,
        includePath: false,
      });

      const obj = resp({
        status: 'error',
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError.message,
          details: error.errors,
        },
      });

      ctx.status(422);
      return ctx.json(obj);
    }

    const obj = resp({
      status: 'error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });

    ctx.status(500);
    return ctx.json(obj);
  };
}
