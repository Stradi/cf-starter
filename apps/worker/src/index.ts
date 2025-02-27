import {
  corsMiddleware,
  customHeadersMiddleware,
  errorMiddleware,
  healthController,
  notFoundMiddleware,
} from '@cf-starter/worker-common';
import { Hono } from 'hono';
import { CF, HonoEnv } from './env';

const app = new Hono<HonoEnv>();

app.use(corsMiddleware());
app.use(customHeadersMiddleware());
app.onError(errorMiddleware());
app.notFound(notFoundMiddleware());

app.route('/api/v1/health', healthController);

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<CF>;
