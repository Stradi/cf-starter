import { MiddlewareHandler } from 'hono';

export default function customHeadersMiddleware(
  poweredBy = 'cf-starter'
): MiddlewareHandler {
  return async (ctx, next) => {
    await next();

    ctx.res.headers.set('X-Powered-By', poweredBy);
    ctx.res.headers.set('Please-Be-Nice', 'Thanks!');
  };
}
