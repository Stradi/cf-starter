import { MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';

export default function corsMiddleware(): MiddlewareHandler {
  return cors();
}
