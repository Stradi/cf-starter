import { NotFoundHandler } from 'hono';
import NotFoundError from '../errors/not-found-error';

export default function notFoundMiddleware(): NotFoundHandler {
  return () => {
    throw new NotFoundError();
  };
}
